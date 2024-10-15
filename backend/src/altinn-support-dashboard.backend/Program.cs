using altinn_support_dashboard.Server.Models;
using altinn_support_dashboard.Server.Services;
using altinn_support_dashboard.Server.Services.Interfaces;
using Altinn.ApiClients.Maskinporten.Extensions;
using Altinn.ApiClients.Maskinporten.Services;

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

                    // Load standard appsettings.json
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
                    logging.ClearProviders();
                    logging.AddConsole();
                })
                .ConfigureServices((hostContext, services) =>
                {
                    // Bind to Configuration and add to DI
                    services.Configure<Configuration>(hostContext.Configuration.GetSection("Configuration"));

                    var config = hostContext.Configuration.GetSection("Configuration").Get<Configuration>();

                    services.AddMaskinportenHttpClient<SettingsJwkClientDefinition>(
                        nameof(config.Production),
                        config.Production.MaskinportenSettings);

                    services.AddMaskinportenHttpClient<SettingsJwkClientDefinition>(
                        nameof(config.TT02),
                        config.TT02.MaskinportenSettings);

                    services.AddScoped<DataBrregClient>();
                    services.AddScoped<IDataBrregService, DataBrregService>();
                    services.AddScoped<AltinnApiClient>();
                    services.AddScoped<IAltinnApiService, AltinnApiService>();
                });

    }
}
