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
using Security;
using Microsoft.Extensions.Options;
using System.Threading.RateLimiting;


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
                

            services.Configure<BrregConfiguration>(Configuration.GetSection("BrregConfiguration"));

            // Add controllers for the API
            services.AddControllers();

            // Register Swagger for API documentation
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo
                {
                    Title = "Altinn Support Dashboard API",
                    Version = "v1",
                    Description = "API for å administrere Altinn Support Dashboard"
                });
            });


            services.AddRedaction(redaction =>
            {
                redaction.SetRedactor<SsnRedactor>(CustomDataClassifications.SSN);
            });

            string[] baseUrl = Configuration.GetSection("RedirectConfiguration:AllowedUrls").Get<string[]>() ?? throw new Exception("Redirecrt url not set");
            services.AddCors(options =>
            {
                options.AddPolicy("AllowFrontend", builder =>
                {
                    builder.WithOrigins(baseUrl)
                           .WithMethods("GET", "POST")
                           .AllowAnyHeader()
                           .AllowCredentials();
                });
            });

            services.AddRateLimiter(options =>
            {
                options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;

                // One limit per user. Falls back to the IP address if there is no user name
                options.AddPolicy(RateLimitPolicies.NotificationSend, context => 
                    RateLimitPartition.GetFixedWindowLimiter(
                        partitionKey: context.User.Identity?.Name
                            ?? context.Connection.RemoteIpAddress?.ToString()
                            ?? "unknown",
                        factory: _ => new FixedWindowRateLimiterOptions
                        {
                            PermitLimit = 5,
                            Window = TimeSpan.FromMinutes(1),
                            QueueLimit = 0 // Reject right away, don't queue
                    }));

                // Same { message } shape as the exception handler, so the frontend shows it in the toast
                options.OnRejected = async (context, cancellationToken) =>
                {
                    var message = "Too many test emails sent. Try again later.";
                    if (context.Lease.TryGetMetadata(MetadataName.RetryAfter, out var retryAfter))
                    {
                        var seconds = (int)Math.Ceiling(retryAfter.TotalSeconds);
                        context.HttpContext.Response.Headers.RetryAfter = seconds.ToString();
                        message = $"Too many test emails sent. Try again in {seconds} seconds.";
                    }

                    await context.HttpContext.Response.WriteAsJsonAsync(new { message }, cancellationToken);
                };
            });
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, ILogger<Startup> logger)
        {


            // Set up error handling
            app.UseExceptionHandler(errorApp =>
            {
                errorApp.Run(async context =>
                {
                    var exception = context.Features
                        .Get<IExceptionHandlerFeature>()?.Error;

                    logger.LogError(exception, "Unhandled exception while processing {Method} {Path}", context.Request.Method, context.Request.Path);

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

            // Keeps the https scheme behind the proxy so the OIDC redirect URI is correct
            app.UseForwardedHeaders(new ForwardedHeadersOptions
            {
                ForwardedHeaders = ForwardedHeaders.XForwardedProto
            });

            // Enable Authentication and Authorization middleware
            app.UseAuthentication();  // Ensure authentication is used
            app.UseAuthorization();   // Ensure authorization is used

            app.UseRateLimiter();


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

            logger.LogInformation("Backend is now running!");
        }
    }
}
