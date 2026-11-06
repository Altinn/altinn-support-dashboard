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
                .AddTelemetry(Environment)
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
        
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseForwardedHeaders(new ForwardedHeadersOptions
            {
                // Behind the proxy the app sees http; this keeps the Entra ID redirect_uri on https
                ForwardedHeaders = ForwardedHeaders.XForwardedProto
            });
            app.UseGlobalExceptionHandler();

            if (!env.IsDevelopment())
            {
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseSwagger();
            app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "Altinn Support Dashboard API v1"));

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
