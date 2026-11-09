namespace altinn_support_dashboard.Server.Extensions;

public static class CorsExtensions
{
    public const string FrontendPolicy = "AllowFrontend";

    public static IServiceCollection AddFrontendCors(this IServiceCollection services, IConfiguration configuration)
    {
        var allowedUrls = configuration.GetSection("RedirectConfiguration:AllowedUrls").Get<string[]>()
            ?? throw new InvalidOperationException("RedirectConfiguration:AllowedUrls is not set");

        return services.AddCors(options => options.AddPolicy(FrontendPolicy, policy => policy
            .WithOrigins(allowedUrls)
            .WithMethods("GET", "POST")
            .AllowAnyHeader()
            .AllowCredentials()));
    }
}