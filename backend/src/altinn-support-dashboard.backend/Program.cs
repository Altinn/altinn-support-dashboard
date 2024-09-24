using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using altinn_support_dashboard.Server.Services;
using altinn_support_dashboard.Server.Services.Interfaces;

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
                    // Load additional configuration files if needed
                    var env = hostingContext.HostingEnvironment;

                    // Load the environmentConfigurations.xml file
                    config.AddXmlFile("environmentConfigurations.xml", optional: false, reloadOnChange: true);

                    // Load other configurations if necessary
                })
                .ConfigureLogging(logging =>
                {
                    logging.ClearProviders();
                    logging.AddConsole();
                })
                .ConfigureServices((hostContext, services) =>
                {
                    services.AddScoped<DataBrregClient>();
                    services.AddScoped<IDataBrregService, DataBrregService>();
                    services.AddScoped<AltinnApiClient>();
                    services.AddScoped<IAltinnApiService, AltinnApiService>();
                });

    }
}
