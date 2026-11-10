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

            // Only deliberate input errors are safe to show; subclasses such as ArgumentNullException are server bugs,
            // and other messages may contain upstream URLs or personal data
            var isClientError = exception is BadRequestException || exception?.GetType() == typeof(ArgumentException);

            context.Response.StatusCode = isClientError
                ? StatusCodes.Status400BadRequest
                : StatusCodes.Status500InternalServerError;

            await context.Response.WriteAsJsonAsync(new
            {
                message = isClientError ? exception?.Message : "An unexpected error occurred. Please try again later."
            });
        }));
}
