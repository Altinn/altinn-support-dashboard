using Microsoft.OpenApi;

namespace altinn_support_dashboard.Server.Extensions;

public static class ApiDocumentationExtension
{
    public static IServiceCollection AddApiDocumentation(this IServiceCollection services) =>
        services.AddSwaggerGen(c => c.SwaggerDoc("v1", new OpenApiInfo
        {
            Title = "Altinn Support Dashboard API",
            Version = "v1",
            Description = "API for the Altinn Support Dashboard, providing endpoints for managing and monitoring Altinn services."
        }));
}