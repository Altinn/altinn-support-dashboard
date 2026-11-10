using altinn_support_dashboard.Server.Extensions;
using altinn_support_dashboard.Server.Utils;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.Extensions.Compliance.Redaction;
using Security;

namespace AltinnSupportDashboard
{
    public class Startup
    {
        public Startup(IConfiguration configuration, IWebHostEnvironment environment)
        {
            Configuration = configuration;
            Environment = environment;
        }

        public IConfiguration Configuration { get; }
        public IWebHostEnvironment Environment { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            services
                .AddTelemetry(Environment, Configuration)
                .AddAppConfiguration(Configuration)
                .AddMaskinportenClients(Configuration)
                .AddAltinnClients(Configuration)
                .AddApplicationServices()
                .AddApiDocumentation()
                .AddFrontendCors(Configuration)
                .AddAzureEntraAuthenticationAndAuthorization(Configuration);
            
            services.AddHttpClient();
            services.AddMemoryCache();
            services.AddControllers();
            services.AddRedaction(r => r.SetRedactor<SsnRedactor>(CustomDataClassifications.SSN));
        }

        public void Configure(IApplicationBuilder app)
        {
            app.UseForwardedHeaders(new ForwardedHeadersOptions
            {
                // Trusts X-Forwarded-Proto from loopback proxies only (the defaults); App Service handles this in front of the app
                ForwardedHeaders = ForwardedHeaders.XForwardedProto
            });
            app.UseGlobalExceptionHandler();

            if (!Environment.IsDevelopment())
            {
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();

            if (Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "Altinn Support Dashboard API v1"));
            }

            app.UseRouting();
            app.UseCors(CorsExtensions.FrontendPolicy);
            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapFallbackToFile("index.html");
            });
        }
    }
}
