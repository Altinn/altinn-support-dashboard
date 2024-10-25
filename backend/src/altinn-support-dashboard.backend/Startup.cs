using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;

namespace AltinnSupportDashboard
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            // Add authentication using the custom BasicAuthenticationHandler
            services.AddAuthentication("BasicAuthentication")
                .AddScheme<AuthenticationSchemeOptions, BasicAuthenticationHandler>("BasicAuthentication", null);

            // Add authorization services
            services.AddAuthorization();

            // Add controllers for the API
            services.AddControllers();

            // Register Swagger for API documentation
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "Altinn Support Dashboard API", Version = "v1" });
            });

            // Enable CORS for any origin, method, and header (wide open)
            services.AddCors(options =>
            {
                options.AddDefaultPolicy(builder =>
                {
                    builder.AllowAnyOrigin()   // Allow all origins
                           .AllowAnyMethod()   // Allow all methods (GET, POST, PUT, DELETE, etc.)
                           .AllowAnyHeader();  // Allow all headers (Authorization, Content-Type, etc.)
                });
            });
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                app.UseHsts();
            }

            // Use HTTPS redirection
            app.UseHttpsRedirection();

            // Enable serving static files (Vite build output will go into wwwroot)
            app.UseStaticFiles();

            // Enable Swagger for API documentation
            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "Altinn Support Dashboard API V1");
                c.RoutePrefix = "swagger";
            });

            // Enable routing
            app.UseRouting();

            // Enable CORS (ensure it's applied globally to all routes)
            app.UseCors();  // Globally apply the default CORS policy

            // Enable Authentication and Authorization middleware
            app.UseAuthentication();  // Ensure authentication is used
            app.UseAuthorization();   // Ensure authorization is used

            // Configure endpoints for API controllers
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });

            // Serve the frontend for any non-API routes (Vite build)
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapFallbackToFile("index.html");
            });
        }
    }
}
