using altinn_support_dashboard.Server.Models;
using altinn_support_dashboard.Server.Services;
using altinn_support_dashboard.Server.Services.Interfaces;
using Altinn.ApiClients.Maskinporten.Extensions;
using Altinn.ApiClients.Maskinporten.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

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

                    // Load user secrets in development mode
                    if (env.IsDevelopment())
                    {
                        config.AddUserSecrets<Program>();
                    }

                    // Add environment variables
                    config.AddEnvironmentVariables();
                })
                .ConfigureLogging(logging =>
                {
                    // Clear default logging providers
                    logging.ClearProviders();

                    // Add console logging
                    logging.AddConsole();
                })
                .ConfigureServices((hostContext, services) =>
                {
                    // Bind Configuration section to the Configuration class and add to DI
                    services.Configure<Configuration>(hostContext.Configuration.GetSection("Configuration"));

                    // Retrieve configuration values
                    var config = hostContext.Configuration.GetSection("Configuration").Get<Configuration>();

                    // Register Maskinporten clients with their respective settings
                    services.AddMaskinportenHttpClient<SettingsJwkClientDefinition>(
                        nameof(config.Production),
                        config.Production.MaskinportenSettings);

                    services.AddMaskinportenHttpClient<SettingsJwkClientDefinition>(
                        nameof(config.TT02),
                        config.TT02.MaskinportenSettings);

                    // Register application services
                    services.AddScoped<DataBrregClient>();
                    services.AddScoped<IDataBrregService, DataBrregService>();
                    services.AddScoped<AltinnApiClient>();
                    services.AddScoped<IAltinnApiService, AltinnApiService>();
                });
    }
}
