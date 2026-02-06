using altinn_support_dashboard.Server.Clients;
using altinn_support_dashboard.Server.Models;
using altinn_support_dashboard.Server.Utils;
using altinn_support_dashboard.Server.Services;
using altinn_support_dashboard.Server.Services.Interfaces;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.Extensions.Compliance.Redaction;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;


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
            // Configure HttpClient
            services.AddHttpClient();

            // Configure Gitea settings
            services.Configure<GiteaConfiguration>(Configuration.GetSection("Gitea"));
            services.Configure<BrregApiConfiguration>(Configuration.GetSection("Brreg"));
            services.Configure<BrregConfiguration>(Configuration.GetSection("BrregConfiguration"));

            // Register clients and services
            services.AddSingleton<GiteaApiClient>();
            services.AddScoped<IGiteaService, GiteaService>();
            services.AddScoped<IDataBrregService, DataBrregService>();
            services.AddScoped<IAltinnApiService, AltinnApiService>();
            services.AddScoped<IPartyApiClient, PartyApiClient>();
            services.AddScoped<IPartyApiService, PartyApiService>();
            services.AddScoped<IAltinnApiClient, AltinnApiClient>();
            services.AddScoped<IAltinn3ApiClient, Altinn3ApiClient>();
            services.AddScoped<IDataBrregClient, DataBrregClient>();

            // Add controllers for the API
            services.AddControllers();

            // Register Swagger for API documentation
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo
                {
                    Title = "Altinn Support Dashboard API",
                    Version = "v1",
                    Description = "API for å administrere Altinn Support Dashboard og opprette organisasjoner i Altinn Studio"
                });
            });


            // Enable wide-open CORS policy
            services.AddCors(options =>
            {
                options.AddPolicy("AllowAll", builder =>
                {
                    builder.AllowAnyOrigin()   // Allow all origins
                           .AllowAnyMethod()   // Allow all methods (GET, POST, PUT, DELETE, etc.)
                           .AllowAnyHeader();   // Allow all headers (Authorization, Content-Type, etc.)

                });
            });

            services.AddRedaction(redaction =>
            {
                redaction.SetRedactor<SsnRedactor>(CustomDataClassifications.SSN);
            });


            //enables only from frontend
            string[] baseUrl = Configuration.GetSection("RedirectConfiguration:AllowedUrls").Get<string[]>() ?? throw new Exception("Redirecrt url not set");
            if (baseUrl != null && baseUrl.Length != 0)
            {
                services.AddCors(options =>
                {

                    options.AddPolicy("AllowFrontend", builder =>
                    {
                        builder.WithOrigins(baseUrl)   // Allow only frontend origin
                               .AllowAnyMethod()
                               .AllowAnyHeader()
                               .AllowCredentials();

                    });

                });

            }
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {


            // Set up error handling
            app.UseExceptionHandler(errorApp =>
            {
                errorApp.Run(async context =>
                {
                    var exception = context.Features
                        .Get<IExceptionHandlerFeature>()?.Error;

                    context.Response.ContentType = "application/json";

                    context.Response.StatusCode = exception switch
                    {
                        BadRequestException => StatusCodes.Status400BadRequest,
                        _ => StatusCodes.Status500InternalServerError
                    };

                    await context.Response.WriteAsJsonAsync(new
                    {
                        message = exception?.Message
                    });
                });
            });

            if (!env.IsDevelopment())
            {


                app.UseHsts();
            }

            // Enable CORS immediately
            app.UseCors("AllowFrontend");  // Globally apply the "AllowAll" CORS policy

            // Use HTTPS redirection
            app.UseHttpsRedirection();

            // Enable serving static files (Vite build output will go into wwwroot)
            app.UseStaticFiles();

            // Enable Swagger
            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "Altinn Support Dashboard API V1");
                c.RoutePrefix = "swagger";
            });

            // Enable routing
            app.UseRouting();

            //to fix 403 forbidden by ansattporten
            app.UseForwardedHeaders(new ForwardedHeadersOptions
            {
                ForwardedHeaders = ForwardedHeaders.XForwardedProto
            });

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

              // This will print to the console when the app is ready
        Console.ForegroundColor = ConsoleColor.Green;
        Console.WriteLine("Backend is now running!");
        Console.ResetColor();
        }
    }
}
