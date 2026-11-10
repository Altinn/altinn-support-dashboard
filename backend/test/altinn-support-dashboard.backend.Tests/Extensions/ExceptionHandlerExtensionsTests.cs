using altinn_support_dashboard.Server.Extensions;
using Microsoft.AspNetCore.Http;

namespace altinn_support_dashboard.backend.Tests.Extensions;

public class ExceptionHandlerExtensionsTests
{
    private const string Generic500 = "An unexpected error occurred. Please try again later.";

    [Fact]
    public void BadRequestException_Returns400WithMessage()
    {
        var (status, message) = ExceptionHandlerExtensions.MapException(new BadRequestException("Invalid org number"), isDevelopment: false);

        Assert.Equal(StatusCodes.Status400BadRequest, status);
        Assert.Equal("Invalid org number", message);
    }

    [Fact]
    public void NotFoundException_Returns404WithMessage()
    {
        var (status, message) = ExceptionHandlerExtensions.MapException(new NotFoundException("Organization not found"), isDevelopment: false);

        Assert.Equal(StatusCodes.Status404NotFound, status);
        Assert.Equal("Organization not found", message);
    }

    [Fact]
    public void HttpRequestException_Returns502WithoutUpstreamDetails()
    {
        var exception = new HttpRequestException("API request failed with status code InternalServerError: {\"ssn\":\"12345678901\"}");

        var (status, message) = ExceptionHandlerExtensions.MapException(exception, isDevelopment: false);

        Assert.Equal(StatusCodes.Status502BadGateway, status);
        Assert.DoesNotContain("12345678901", message);
    }

    public static TheoryData<Exception> ServerErrors => new()
    {
        new ArgumentException("An item with the same key has already been added. Key: 12345678901"),
        new ArgumentNullException("settings"),
        new InvalidOperationException("Something broke"),
    };

    [Theory]
    [MemberData(nameof(ServerErrors))]
    public void OtherExceptions_Return500WithGenericMessage(Exception exception)
    {
        var (status, message) = ExceptionHandlerExtensions.MapException(exception, isDevelopment: false);

        Assert.Equal(StatusCodes.Status500InternalServerError, status);
        Assert.Equal(Generic500, message);
    }

    [Fact]
    public void NullException_Returns500WithGenericMessage()
    {
        var (status, message) = ExceptionHandlerExtensions.MapException(null, isDevelopment: false);

        Assert.Equal(StatusCodes.Status500InternalServerError, status);
        Assert.Equal(Generic500, message);
    }

    [Fact]
    public void Development_ShowsRealMessage()
    {
        var (status, message) = ExceptionHandlerExtensions.MapException(new InvalidOperationException("Something broke"), isDevelopment: true);

        Assert.Equal(StatusCodes.Status500InternalServerError, status);
        Assert.Equal("Something broke", message);
    }
}
