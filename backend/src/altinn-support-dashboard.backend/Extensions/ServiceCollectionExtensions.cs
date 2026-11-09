using Altinn.ApiClients.Maskinporten.Config;
using Altinn.ApiClients.Maskinporten.Extensions;
using Altinn.ApiClients.Maskinporten.Services;
using altinn_support_dashboard.Server.Clients;
using altinn_support_dashboard.Server.Models;
using altinn_support_dashboard.Server.Services;
using altinn_support_dashboard.Server.Services.Interfaces;


namespace altinn_support_dashboard.Server.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddTelemetry(this IServiceCollection services, IHostEnvironment env)
    {
        // In development, inject null so TelemetryService skips all tracking calls
        if (env.IsDevelopment())
        {
            return services.AddSingleton<ITelemetryService>(_ => new TelemetryService(null));
        }

        services.AddApplicationInsightsTelemetry();
        return services.AddSingleton<ITelemetryService, TelemetryService>();
    }

    public static IServiceCollection AddAppConfiguration(this IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<Configuration>(configuration.GetSection("Configuration"));
        services.Configure<BrregApiConfiguration>(configuration.GetSection("Brreg"));
        services.Configure<BrregConfiguration>(configuration.GetSection("BrregConfiguration"));
        services.Configure<GiteaConfiguration>(configuration.GetSection("Gitea"));
        return services;
    }

    public static IServiceCollection AddMaskinportenClients(this IServiceCollection services, IConfiguration configuration)
    {
        var config = configuration.GetSection("Configuration").Get<Configuration>()
            ?? throw new InvalidOperationException("Configuration section is missing");
        
        AddMaskinportenClient(services, nameof(config.Production), config.Production.MaskinportenSettings);
        AddMaskinportenClient(services, nameof(config.TT02), config.TT02.MaskinportenSettings);
        return services;
    }

    private static void AddMaskinportenClient(IServiceCollection services, string name, MaskinportenSettings settings) => 
        services.AddMaskinportenHttpClient<SettingsJwkClientDefinition>(name, settings, 
            client => client.ClientSettings.ExhangeToAltinnToken = true);
    
    public static IServiceCollection AddAltinnClients(this IServiceCollection services, IConfiguration configuration)
    {
        var useMocks = configuration.GetValue<bool>("FeatureFlags:UseClientMocks");

        services.AddClient<IAltinn3ApiClient, Altinn3ApiClient>(useMocks, real => new MockAltinn3ApiClient(real));
        services.AddClient<INotificationsClient, NotificationsClient>(useMocks, real => new MockNotificationsClient(real));
        services.AddClient<IDataBrregClient, DataBrregClient>(useMocks, real => new MockDataBrregClient(real));
        services.AddClient<IResourceRegistryClient, ResourceRegistryClient>(useMocks, real => new MockResourceRegistryClient(real));

        services.AddSingleton<GiteaApiClient>();
        services.AddScoped<IPartyApiClient, PartyApiClient>();
        services.AddScoped<IDialogportenClient, DialogportenClient>();
        services.AddScoped<ICorrespondenceClient, CorrespondenceClient>();
        return services;
    }

    private static void AddClient<TInterface, TImpl>(this IServiceCollection services, bool useMock, Func<TImpl, TInterface> createMock)
        where TInterface : class
        where TImpl : class, TInterface
    {
        if (!useMock)
        {
            services.AddScoped<TInterface, TImpl>();
            return;
        }

        services.AddScoped<TImpl>();
        services.AddScoped(sp => createMock(sp.GetRequiredService<TImpl>()));
    }

    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        services.AddScoped<IGiteaService, GiteaService>();
        services.AddScoped<IDataBrregService, DataBrregService>();
        services.AddScoped<IAltinn3Service, Altinn3Service>();
        services.AddScoped<IPartyApiService, PartyApiService>();
        services.AddScoped<INotificationsService, NotificationsService>();
        services.AddScoped<IDialogportenService, DialogportenService>();
        services.AddScoped<ICorrespondenceService, CorrespondenceService>();
        services.AddScoped<ISsnTokenService, SsnTokenService>();
        services.AddScoped<IResourceRegistryService, ResourceRegistryService>();
        return services;
    }
}