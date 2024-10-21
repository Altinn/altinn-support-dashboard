namespace AltinnSupportDashboard
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // Add controllers for the API
            services.AddControllers();

            // Register Swagger for API documentation
            services.AddSwaggerGen();

            // Enable CORS (allow requests from any origin for the API)
            services.AddCors(options =>
            {
                options.AddDefaultPolicy(builder =>
                {
                    builder.AllowAnyOrigin()
                           .AllowAnyMethod()
                           .AllowAnyHeader();
                });
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
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
                c.RoutePrefix = "swagger"; // Swagger UI available at /swagger
            });

            // Enable routing
            app.UseRouting();

            // Enable CORS
            app.UseCors();

            // Enable Authorization (this can be extended for authentication if required)
            app.UseAuthorization();

            // Configure endpoints for API controllers
            app.UseEndpoints(endpoints =>
            {
                // Map API routes (e.g., /api/*)
                endpoints.MapControllers();
            });

            // Serve the frontend for any non-API routes
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapFallbackToFile("index.html");  // Ensures all other routes serve the frontend
            });
        }
    }
}
