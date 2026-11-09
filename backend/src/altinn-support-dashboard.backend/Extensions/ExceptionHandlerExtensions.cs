using AltinnSupportDashboard;
using Microsoft.AspNetCore.Diagnostics;

namespace altinn_support_dashboard.Server.Extensions;

public static class ExceptionHandlerExtensions
{
    public static IApplicationBuilder UseGlobalExceptionHandler(this IApplicationBuilder app) =>
        app.UseExceptionHandler(errorApp => errorApp.Run(async context =>
        {
            var exception = context.Features.Get<IExceptionHandlerFeature>()?.Error;
            var logger = context.RequestServices.GetRequiredService<ILogger<Startup>>();
            logger.LogError(exception, "Unhandled exception while processing {Method} {Path}",
                context.Request.Method, context.Request.Path);

            context.Response.StatusCode = exception is BadRequestException
                ? StatusCodes.Status400BadRequest
                : StatusCodes.Status500InternalServerError;

            await context.Response.WriteAsJsonAsync(new { message = exception?.Message });
        }));
}