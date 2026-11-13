#:sdk Aspire.AppHost.Sdk@13.6.4
#:property AspireUseCliBundle=true

using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

const string Root = "../..";
const string Backend = $"{Root}/backend/src/altinn-support-dashboard.backend";
const string Frontend = $"{Root}/frontend/altinn-support-dashboard.client";

var builder = DistributedApplication.CreateBuilder(args);

// Fixed, unproxied ports because CORS, the login redirect and the Vite proxy hardcode https://localhost:5173 and :5237.
var backend = builder.AddProject("backend", $"{Backend}/backend.csproj", launchProfileName: null)
    .WithHttpsEndpoint(port: 5237, targetPort: 5237, isProxied: false)
    .WithUrl("https://localhost:5237/swagger", "Swagger")
    .WithEnvironment("ASPNETCORE_ENVIRONMENT", "Development");

var frontend = builder.AddExecutable("frontend", "npm", Frontend, "run", "dev")
    .WithHttpsEndpoint(port: 5173, targetPort: 5173, isProxied: false)
    .WaitFor(backend);

AddTests("backend-tests", backend, "dotnet", ".", "test", $"{Root}/backend/test/altinn-support-dashboard.backend.Tests");
AddTests("frontend-tests", frontend, "npx", Frontend, "vitest", "run");

var app = builder.Build();

HashSet<string> pendingRestarts = [];
using var watcher = WatchSource(app.Services, Backend, backend);

app.Run();

void AddTests<T>(string name, IResourceBuilder<T> service, string command, string workingDirectory, params string[] testArgs)
    where T : IResource
{
    var tests = builder.AddExecutable(name, command, workingDirectory, testArgs)
        .WithExplicitStart()
        .WithParentRelationship(service.Resource);

    builder.Eventing.Subscribe<BeforeStartEvent>(async (e, ct) =>
    {
        var notifications = e.Services.GetRequiredService<ResourceNotificationService>();
        await notifications.PublishUpdateAsync(tests.Resource, s => s with { IsHidden = true });

        var stopping = e.Services.GetRequiredService<IHostApplicationLifetime>().ApplicationStopping;
        _ = ShowTestResultAsync(notifications, tests.Resource, stopping);
    });

    service.WithCommand(
        "run-tests",
        "Run tests",
        async context =>
        {
            await context.Services.GetRequiredService<ResourceNotificationService>().PublishUpdateAsync(tests.Resource, s => s with { IsHidden = false });
            return await context.Services.GetRequiredService<ResourceCommandService>().ExecuteCommandAsync(tests.Resource, KnownResourceCommands.StartCommand, context.CancellationToken);
        },
        new CommandOptions { IconName = "Beaker", IsHighlighted = false });
}

// wwwroot is left out because it holds the built frontend.
FileSystemWatcher WatchSource(IServiceProvider services, string folder, IResourceBuilder<ProjectResource> service)
{
    string[] extensions = [".cs", ".csproj", ".json"];
    string[] ignoredFolders = ["bin", "obj", "wwwroot"];
    var watcher = new FileSystemWatcher(Path.Combine(builder.AppHostDirectory, folder)) { IncludeSubdirectories = true };

    FileSystemEventHandler onChange = (_, e) =>
    {
        string separator = Path.DirectorySeparatorChar.ToString();
        if (!extensions.Contains(Path.GetExtension(e.FullPath)) || ignoredFolders.Any(ignored => e.FullPath.Contains($"{separator}{ignored}{separator}")))
        {
            return;
        }

        _ = NotifyChangedAsync(services, service.Resource);
    };

    watcher.Changed += onChange;
    watcher.Created += onChange;
    watcher.Deleted += onChange;
    watcher.Renamed += (sender, e) => onChange(sender, e);
    watcher.EnableRaisingEvents = true;
    return watcher;
}

async Task NotifyChangedAsync(IServiceProvider services, ProjectResource service)
{
    lock (pendingRestarts)
    {
        if (!pendingRestarts.Add(service.Name))
        {
            return;
        }
    }

    await Task.Delay(TimeSpan.FromSeconds(2));

    var result = await services.GetRequiredService<IInteractionService>().PromptNotificationAsync(
        $"{service.Name} has changed",
        "Restart it to pick up the changes.",
        new NotificationInteractionOptions { Intent = MessageIntent.Warning, PrimaryButtonText = "Restart" });

    lock (pendingRestarts)
    {
        pendingRestarts.Remove(service.Name);
    }

    if (!result.Canceled && result.Data)
    {
        await services.GetRequiredService<ResourceCommandService>().ExecuteCommandAsync(service, KnownResourceCommands.RestartCommand);
    }
}

async Task ShowTestResultAsync(ResourceNotificationService notifications, IResource tests, CancellationToken cancellationToken)
{
    await foreach (var update in notifications.WatchAsync(cancellationToken))
    {
        string? state = update.Snapshot.State?.Text;
        if (update.Resource != tests || update.Snapshot.ExitCode is not int exitCode || (state != KnownResourceStates.Finished && state != KnownResourceStates.Exited))
        {
            continue;
        }

        var result = exitCode == 0
            ? new ResourceStateSnapshot("Passed", KnownResourceStateStyles.Success)
            : new ResourceStateSnapshot("Failed", KnownResourceStateStyles.Error);

        await notifications.PublishUpdateAsync(tests, s => s with { State = result });
    }
}
