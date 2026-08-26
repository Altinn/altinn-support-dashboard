using System.Security.Claims;
using altinn_support_dashboard.Server.Services.Interfaces;
using AltinnSupportDashboard.Controllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Models.dialogporten;
using Moq;
using Security;
using Xunit;

namespace altinn_support_dashboard.backend.Tests.Controllers;

public class DialogportenControllerTests
{
    private const string EnvironmentName = "TT02";
    private const string ValidDialogUrn = "urn:altinn:dialog-id:11111111-1111-1111-1111-111111111111";
    private const string ValidCorrespondenceUrn = "urn:altinn:correspondence-id:11111111-1111-1111-1111-111111111111";
    private const string ValidInstanceUrn = "urn:altinn:instance-id:12345678/11111111-1111-1111-1111-111111111111";

    private readonly DialogportenController _controller;
    private readonly Mock<IDialogportenService> _serviceMock;
    private readonly Mock<ITelemetryService> _telemetryServiceMock;
    private readonly Mock<IAuthorizationService> _authorizationServiceMock;

    public DialogportenControllerTests()
    {
        _serviceMock = new Mock<IDialogportenService>();
        _telemetryServiceMock = new Mock<ITelemetryService>();
        _authorizationServiceMock = new Mock<IAuthorizationService>();
        var logger = Mock.Of<ILogger<DialogportenController>>();

        _controller = new DialogportenController(_serviceMock.Object, _telemetryServiceMock.Object, logger, _authorizationServiceMock.Object)
        {
            ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext
                {
                    User = new ClaimsPrincipal(new ClaimsIdentity(new[]
                    {
                        new Claim(ClaimTypes.Name, "test-user")
                    }, "TestAuth"))
                }
            }
        };
    }

    private void SetupAuthorization(bool succeeded)
    {
        _authorizationServiceMock
            .Setup(a => a.AuthorizeAsync(It.IsAny<ClaimsPrincipal>(), It.IsAny<object>(), AzureRoles.DialogportenAdmin))
            .ReturnsAsync(succeeded ? AuthorizationResult.Success() : AuthorizationResult.Failed());
    }

    private static DialogDto CreateDialog(List<ResourceNameDto>? title = null) => new()
    {
        DialogId = "d1",
        InstanceRef = ValidDialogUrn,
        Party = "urn:altinn:organization:identifier-no:123456789",
        ServiceResource = new ServiceResourceDto
        {
            Id = "res-1",
            IsDelegable = true,
            MinimumAuthenticationLevel = 3,
            Name = [new ResourceNameDto { Value = "Test resource", LanguageCode = "nb" }]
        },
        ServiceOwner = new ServiceOwnerDto
        {
            OrgNumber = "123456789",
            Code = "ttd",
            Name = [new ResourceNameDto { Value = "Test owner", LanguageCode = "nb" }]
        },
        Title = title
    };

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    [InlineData("not-a-urn")]
    [InlineData("urn:altinn:dialog-id:not-a-guid")]
    [InlineData("urn:altinn:correspondence-id:not-a-guid")]
    [InlineData("urn:altinn:instance-id:abc/11111111-1111-1111-1111-111111111111")]
    [InlineData("urn:altinn:instance-id:0/11111111-1111-1111-1111-111111111111")]
    [InlineData("urn:altinn:instance-id:12345678")]
    public async Task GetDialogByUrn_ReturnsBadRequest_WhenUrnIsInvalid(string urn)
    {
        var result = await _controller.GetDialogByUrn(EnvironmentName, urn);

        Assert.IsType<BadRequestObjectResult>(result);
        _serviceMock.Verify(s => s.GetDialogByUrn(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<bool>()), Times.Never);
        _authorizationServiceMock.Verify(a => a.AuthorizeAsync(It.IsAny<ClaimsPrincipal>(), It.IsAny<object>(), It.IsAny<string>()), Times.Never);
    }

    [Theory]
    [InlineData(ValidDialogUrn)]
    [InlineData(ValidCorrespondenceUrn)]
    [InlineData(ValidInstanceUrn)]
    public async Task GetDialogByUrn_ReturnsOk_WhenUrnIsValid(string urn)
    {
        SetupAuthorization(true);
        var dialog = CreateDialog();
        _serviceMock.Setup(s => s.GetDialogByUrn(urn, EnvironmentName, true)).ReturnsAsync(dialog);

        var result = await _controller.GetDialogByUrn(EnvironmentName, urn);

        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(dialog, okResult.Value);
    }

    [Fact]
    public async Task GetDialogByUrn_ReturnsNotFound_WhenServiceReturnsNull()
    {
        SetupAuthorization(true);
        _serviceMock.Setup(s => s.GetDialogByUrn(ValidDialogUrn, EnvironmentName, true)).ReturnsAsync((DialogDto?)null);

        var result = await _controller.GetDialogByUrn(EnvironmentName, ValidDialogUrn);

        Assert.IsType<NotFoundResult>(result);
    }

    [Fact]
    public async Task GetDialogByUrn_PassesIncludeTitleTrue_WhenAuthorized()
    {
        SetupAuthorization(true);
        _serviceMock.Setup(s => s.GetDialogByUrn(ValidDialogUrn, EnvironmentName, true)).ReturnsAsync(CreateDialog());

        await _controller.GetDialogByUrn(EnvironmentName, ValidDialogUrn);

        _serviceMock.Verify(s => s.GetDialogByUrn(ValidDialogUrn, EnvironmentName, true), Times.Once);
    }

    [Fact]
    public async Task GetDialogByUrn_PassesIncludeTitleFalse_WhenNotAuthorized()
    {
        SetupAuthorization(false);
        _serviceMock.Setup(s => s.GetDialogByUrn(ValidDialogUrn, EnvironmentName, false)).ReturnsAsync(CreateDialog());

        await _controller.GetDialogByUrn(EnvironmentName, ValidDialogUrn);

        _serviceMock.Verify(s => s.GetDialogByUrn(ValidDialogUrn, EnvironmentName, false), Times.Once);
    }

    [Fact]
    public async Task GetDialogByUrn_ChecksAuthorization_WithDialogportenAdminPolicy()
    {
        SetupAuthorization(true);
        _serviceMock.Setup(s => s.GetDialogByUrn(ValidDialogUrn, EnvironmentName, true)).ReturnsAsync(CreateDialog());

        await _controller.GetDialogByUrn(EnvironmentName, ValidDialogUrn);

        _authorizationServiceMock.Verify(a => a.AuthorizeAsync(It.IsAny<ClaimsPrincipal>(), It.IsAny<object>(), AzureRoles.DialogportenAdmin), Times.Once);
    }

    [Fact]
    public async Task GetDialogByUrn_PropagatesException_WhenServiceThrows()
    {
        SetupAuthorization(true);
        _serviceMock.Setup(s => s.GetDialogByUrn(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<bool>()))
            .ThrowsAsync(new Exception("Service failure"));

        await Assert.ThrowsAsync<Exception>(() => _controller.GetDialogByUrn(EnvironmentName, ValidDialogUrn));
    }
}
