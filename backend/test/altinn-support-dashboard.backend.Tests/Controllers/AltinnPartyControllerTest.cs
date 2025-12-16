using altinn_support_dashboard.Server.Controllers;
using altinn_support_dashboard.Server.Models;
using altinn_support_dashboard.Server.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace altinn_support_dashboard.backend.Tests.Controllers;

public class AltinnPartyControllerTests
{
    private readonly Mock<IPartyApiService> _mockPartyApiService;
    private readonly Altinn_party_APIController _controller;

    public AltinnPartyControllerTests()
    {
        _mockPartyApiService = new Mock<IPartyApiService>();
        _controller = new Altinn_party_APIController(_mockPartyApiService.Object);
    }

    [Fact]
    public async Task GetPartyOrg_ReturnsResult_WhenOrgNumberIsValid()
    {
        var orgNumber = "123456789";
        var expectedParty = new PartyModel
        {
            PartyUuid = "uuid-org",
            OrgNumber = orgNumber,
            Name = "Test Organization"
        };

        _mockPartyApiService
        .Setup(service => service.GetPartyFromOrgAsync(orgNumber))
        .ReturnsAsync(expectedParty);

        var result = await _controller.GetPartyOrg(orgNumber);

        Assert.IsType<OkObjectResult>(result);
    }

    [Fact]
    public async Task GetPartyOrg_Returns500_WhenServiceThrowsException()
    {
        _mockPartyApiService
        .Setup(service => service.GetPartyFromOrgAsync(It.IsAny<string>()))
        .ThrowsAsync(new Exception("Service error"));

        var result = await _controller.GetPartyOrg("invalid-org");

        Assert.IsType<ObjectResult>(result);
        var objectResult = result as ObjectResult;
        Assert.Equal(500, objectResult?.StatusCode);
    }

}