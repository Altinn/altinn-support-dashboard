using Altinn.ApiClients.Maskinporten.Extensions;
using Altinn.ApiClients.Maskinporten.Services;
using Altinn.Studio.Designer.Infrastructure.AnsattPorten;
using altinn_support_dashboard.Server.Models;
using altinn_support_dashboard.Server.Services;
using altinn_support_dashboard.Server.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;

namespace AltinnSupportDashboard
{
    public class Program
    {
        public static void Main(string[] args)
        {
            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();

                })
                .ConfigureAppConfiguration((hostingContext, config) =>
                {
                    var env = hostingContext.HostingEnvironment;

                    // Load the standard appsettings.json
                    config.AddJsonFile("appsettings.json", optional: true, reloadOnChange: true);


                    // Load environment-specific appsettings.{env}.json
                    config.AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true, reloadOnChange: true);

                    // Load user secrets in development mode (useful for local development)
                    if (env.IsDevelopment())
                    {
                        config.AddUserSecrets<Program>();
                    }

                    // Add environment variables
                    config.AddEnvironmentVariables();

                    // (Future) Uncomment this if you switch to using Azure Key Vault
                    // config.AddAzureKeyVault(new Uri("https://<your-keyvault-name>.vault.azure.net/"), new DefaultAzureCredential());
                })
                .ConfigureLogging(logging =>
                {
                    // Add console logging
                    logging.AddConsole();
                })
                .ConfigureServices((hostContext, services) =>
                {
                    if (!hostContext.HostingEnvironment.IsDevelopment())
                    {
                        services.AddApplicationInsightsTelemetry();
                    }

                    // Bind Configuration section to the Configuration class and add to DI
                    services.Configure<Configuration>(hostContext.Configuration.GetSection("Configuration"));
                    services.Configure<BrregApiConfiguration>(hostContext.Configuration.GetSection("Brreg"));
                    // Retrieve configuration values from environment variables or appsettings.json
                    var config = hostContext.Configuration.GetSection("Configuration").Get<Configuration>();

                    // Register Maskinporten clients with their respective settings (adjust as needed)
                    services.AddMaskinportenHttpClient<SettingsJwkClientDefinition>(
                        nameof(config.Production),
                        config?.Production.MaskinportenSettings, configureClientDefinition =>
                        {
                            configureClientDefinition.ClientSettings.ExhangeToAltinnToken = true;
                        });

                    services.AddMaskinportenHttpClient<SettingsJwkClientDefinition>(
                        nameof(config.TT02),
                        config?.TT02.MaskinportenSettings, configureClientDefinition =>
                        {
                            configureClientDefinition.ClientSettings.ExhangeToAltinnToken = true;
                        });

                    services.AddMemoryCache();

                    //Ansattporten
                    services.AddAnsattPortenAuthenticationAndAuthorization(hostContext.Configuration);
                    services.AddSingleton<IAuthorizationHandler, AltinnResourceHandler>();
                    services.AddScoped<IAnsattportenService, AnsattportenService>();

                    // Register application services
                    services.AddScoped<DataBrregClient>();
                    services.AddScoped<IDataBrregService, DataBrregService>();
                    services.AddScoped<AltinnApiClient>();
                    services.AddScoped<Altinn3ApiClient>();
                    services.AddScoped<IAltinnApiService, AltinnApiService>();
                    services.AddScoped<IAltinn3Service, Altinn3Service>();
                    services.AddScoped<PartyApiClient>();
                    services.AddScoped<IPartyApiService, PartyApiService>();
                    services.AddScoped<ICorrespondenceClient, CorrespondenceClient>();
                    services.AddScoped<ICorrespondenceService, CorrespondenceService>();
                    services.AddScoped<ISsnTokenService, SsnTokenService>();
                });
    }
}
