using Microsoft.AspNetCore.Diagnostics;

namespace altinn_support_dashboard.Server.Extensions;

public static class ExceptionHandlerExtensions
{
    public static IApplicationBuilder UseGlobalExceptionHandler(this IApplicationBuilder app) =>
        app.UseExceptionHandler(errorApp => errorApp.Run(async context =>
        {
            var exception = context.Features.Get<IExceptionHandlerFeature>()?.Error;
            var logger = context.RequestServices.GetRequiredService<ILoggerFactory>()
                .CreateLogger("GlobalExceptionHandler");
            logger.LogError(exception, "Unhandled exception while processing {Method} {Path}",
                context.Request.Method, context.Request.Path);

            var isDevelopment = context.RequestServices.GetRequiredService<IHostEnvironment>().IsDevelopment();
            var (statusCode, message) = MapException(exception, isDevelopment);

            context.Response.StatusCode = statusCode;
            await context.Response.WriteAsJsonAsync(new { message });
        }));

    // Only exceptions we throw on purpose show their message; anything else may contain upstream data or personal data.
    public static (int StatusCode, string Message) MapException(Exception? exception, bool isDevelopment)
    {
        var (statusCode, message) = exception switch
        {
            BadRequestException => (StatusCodes.Status400BadRequest, exception.Message),
            NotFoundException => (StatusCodes.Status404NotFound, exception.Message),
            HttpRequestException => (StatusCodes.Status502BadGateway, "An external service (Altinn or Brreg) failed. Please try again later."),
            _ => (StatusCodes.Status500InternalServerError, "An unexpected error occurred. Please try again later.")
        };

        return (statusCode, isDevelopment && exception is not null ? exception.Message : message);
    }
}
