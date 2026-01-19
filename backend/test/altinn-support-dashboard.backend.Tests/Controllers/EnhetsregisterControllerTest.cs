using altinn_support_dashboard.Server.Controllers;
using altinn_support_dashboard.Server.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace altinn_support_dashboard.backend.Tests.Controllers;

public class EnhetsregisterControllerTest
{
    private readonly EnhetsregisterController _controller;
    private readonly Mock<IDataBrregService> _dataBrregServiceMock;

    public EnhetsregisterControllerTest()
    {
        _dataBrregServiceMock = new Mock<IDataBrregService>();
        _controller = new EnhetsregisterController(_dataBrregServiceMock.Object);
    }

    [Fact]
    public async Task GetEnhetsDetaljer_ReturnsOk_WhenOrgNumberIsValid()
    {
        var orgnr = "123456789";
        var expectedResult = new { OrganizationNumber = orgnr };

        _dataBrregServiceMock
            .Setup(s => s.GetEnhetsdetaljer(orgnr, "Production"))
            .ReturnsAsync(expectedResult);

        var result = await _controller.GetEnhetsdetaljer("Production", orgnr);

        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(expectedResult, okResult.Value);
    }

    [Theory]
    [InlineData("")]
    [InlineData("999")]
    [InlineData("12345678")]
    [InlineData("1234567890")]
    [InlineData("abcdefghi")]
    [InlineData("abcdefghij")]
    [InlineData("1d2d3d4d5")]
    [InlineData("   ")]
    public async Task GetEnhetsDetaljer_ReturnsBadRequest_WhenOrgNumberIsInvalid(string orgNumber)
    {
        var result = await _controller.GetEnhetsdetaljer("Production", orgNumber);
        Assert.IsType<BadRequestObjectResult>(result);
    }

    [Theory]
    [InlineData("Production ")]
    [InlineData("pRoduction")]
    [InlineData("test")]
    [InlineData("dev")]
    [InlineData("TT01")]
    [InlineData("")]
    [InlineData("Tt02")]
    [InlineData("TT02 ")]
    public async Task GetEnhetsDetaljer_ReturnsBadRequest_WhenEnvironmentIsInvalid(string environment)
    {
        var orgNumber = "123456789";
        var result = await _controller.GetEnhetsdetaljer(environment, orgNumber);

        Assert.IsType<BadRequestObjectResult>(result);
    }

    [Theory]
    [InlineData("Production")]
    [InlineData("TT02")]
    public async Task GetEnhetsDetaljer_WorksForBothEnvironments(string environment)
    {
        var orgnr = "123456789";
        var expectedResult = new { OrganizationNumber = orgnr };

        _dataBrregServiceMock
            .Setup(s => s.GetEnhetsdetaljer(orgnr, environment))
            .ReturnsAsync(expectedResult);
        
        var result = await _controller.GetEnhetsdetaljer(environment, orgnr);
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(expectedResult, okResult.Value);
    }

    [Fact]
    public async Task GetEnhetsDetaljer_ReturnsNotFound_WhenResultIsNull()
    {
        var orgnumber = "123456789";

        _dataBrregServiceMock
            .Setup(s => s.GetEnhetsdetaljer(orgnumber, "TT02"))
            .ReturnsAsync(null!);

        var result = await _controller.GetEnhetsdetaljer("TT02", orgnumber);

        Assert.IsType<NotFoundObjectResult>(result);
    }

    [Fact]
    public async Task GetEnhetsDetaljer_ReturnsBadRequest_WhenArgumentExceptionIsThrown()
    {
        var orgnumber = "123456789";

        _dataBrregServiceMock
            .Setup(s => s.GetEnhetsdetaljer(orgnumber, "Production"))
            .ThrowsAsync(new ArgumentException("Test exception"));
        
        var result = await _controller.GetEnhetsdetaljer("Production", orgnumber);

        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal("Test exception", badRequestResult.Value);
    }

    [Fact]
    public async Task GetEnhetsDetaljer_RetursnNotFound_WhenHttpRequestExceptionWithNotFoundIsThrown()
    {
        var orgnumber = "123456789";

        _dataBrregServiceMock
            .Setup(s => s.GetEnhetsdetaljer(orgnumber, "TT02"))
            .ThrowsAsync(new HttpRequestException("NotFound"));
        
        var result = await _controller.GetEnhetsdetaljer("TT02", orgnumber);

        Assert.IsType<NotFoundObjectResult>(result);
    }

    [Fact]
    public async Task GetEnhetsDetaljer_ReturnsStatusCode503_WhenHttpRequestExceptionIsThrown()
    {
        var orgnumber = "123456789";

        _dataBrregServiceMock
            .Setup(s => s.GetEnhetsdetaljer(orgnumber, "Production"))
            .ThrowsAsync(new HttpRequestException("Service unavailable"));
        
        var result = await _controller.GetEnhetsdetaljer("Production", orgnumber);

        var statusCodeResult = Assert.IsType<ObjectResult>(result);
        Assert.Equal(503, statusCodeResult.StatusCode);
    }

    [Fact]
    public async Task GetEnhetsDetaljer_ReturnsStatusCode500_WhenExceptionIsThrown()
    {
        var orgnumber = "123456789";

        _dataBrregServiceMock
            .Setup(s => s.GetEnhetsdetaljer(orgnumber, "TT02"))
            .ThrowsAsync(new Exception("General error"));

        var result = await _controller.GetEnhetsdetaljer("TT02", orgnumber);

        var statusCodeResult = Assert.IsType<ObjectResult>(result);
        Assert.Equal(500, statusCodeResult.StatusCode);
    }
}