using Altinn.ApiClients.Maskinporten.Config;
using Altinn.ApiClients.Maskinporten.Extensions;
using Altinn.ApiClients.Maskinporten.Services;
using altinn_support_dashboard.Server.Clients;
using altinn_support_dashboard.Server.Models;
using altinn_support_dashboard.Server.Services;
using altinn_support_dashboard.Server.Services.Interfaces;
using OpenTelemetry;
using OpenTelemetry.Metrics;
using OpenTelemetry.Trace;


namespace altinn_support_dashboard.Server.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddTelemetry(this IServiceCollection services, IHostEnvironment env, IConfiguration configuration)
    {
        if (!env.IsDevelopment())
        {
            services.AddApplicationInsightsTelemetry();
            return services.AddSingleton<ITelemetryService, TelemetryService>();
        }

        // In development, inject null so TelemetryService skips all tracking calls
        services.AddSingleton<ITelemetryService>(_ => new TelemetryService(null));

        // Set by the Aspire app host in tools/aspire.
        if (!string.IsNullOrEmpty(configuration["OTEL_EXPORTER_OTLP_ENDPOINT"]))
        {
            services.AddOpenTelemetry()
                .WithTracing(tracing => tracing.AddAspNetCoreInstrumentation().AddHttpClientInstrumentation())
                .WithMetrics(metrics => metrics.AddAspNetCoreInstrumentation().AddHttpClientInstrumentation())
                .WithLogging()
                .UseOtlpExporter();
        }

        return services;
    }

    public static IServiceCollection AddAppConfiguration(this IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<Configuration>(configuration.GetSection("Configuration"));
        services.Configure<BrregApiConfiguration>(configuration.GetSection("Brreg"));
        services.Configure<BrregConfiguration>(configuration.GetSection("BrregConfiguration"));
        return services;
    }

    public static IServiceCollection AddMaskinportenClients(this IServiceCollection services, IConfiguration configuration)
    {
        // Missing settings are allowed so mock/test setups can start; the clients fail on first use instead.
        var config = configuration.GetSection("Configuration").Get<Configuration>();

        AddMaskinportenClient(services, nameof(Configuration.Production), config?.Production?.MaskinportenSettings);
        AddMaskinportenClient(services, nameof(Configuration.TT02), config?.TT02?.MaskinportenSettings);
        return services;
    }

    private static void AddMaskinportenClient(IServiceCollection services, string name, MaskinportenSettings? settings) => 
        services.AddMaskinportenHttpClient<SettingsJwkClientDefinition>(name, settings!, 
            client => client.ClientSettings.ExhangeToAltinnToken = true);
    
    public static IServiceCollection AddAltinnClients(this IServiceCollection services, IConfiguration configuration)
    {
        var useMocks = configuration.GetValue<bool>("FeatureFlags:UseClientMocks");

        services.AddClient<IAltinn3ApiClient, Altinn3ApiClient>(useMocks, real => new MockAltinn3ApiClient(real));
        services.AddClient<INotificationsClient, NotificationsClient>(useMocks, real => new MockNotificationsClient(real));
        services.AddClient<IDataBrregClient, DataBrregClient>(useMocks, real => new MockDataBrregClient(real));
        services.AddClient<IResourceRegistryClient, ResourceRegistryClient>(useMocks, real => new MockResourceRegistryClient(real));

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