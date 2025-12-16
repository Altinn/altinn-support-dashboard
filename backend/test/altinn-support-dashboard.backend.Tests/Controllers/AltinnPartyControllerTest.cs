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
        var validOrgNumber = "123456789";
        var expectedParty = new PartyModel
        {
            PartyUuid = "uuid-org",
            OrgNumber = validOrgNumber,
            Name = "Test Organization"
        };

        _mockPartyApiService
        .Setup(service => service.GetPartyFromOrgAsync(validOrgNumber))
        .ReturnsAsync(expectedParty);

        var result = await _controller.GetPartyOrg(validOrgNumber);

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

    [Fact]
    public async Task GetPartySsn_ReturnsResult_WhenSsnIsValid()
    {
        var validSsn = "11111111111";
        var expectedParty = new PartyModel
        {
            PartyUuid = "uuid-ssn",
            Ssn = validSsn,
            Name = "Test Person"
        };

        _mockPartyApiService
        .Setup(service => service.GetPartyFromSsnAsync(validSsn))
        .ReturnsAsync(expectedParty);

        var result = await _controller.GetPartySsn(validSsn);

        Assert.IsType<OkObjectResult>(result);
    }

    [Fact]
    public async Task GetPartySsn_Returns500_WhenServiceThrowsException()
    {
        _mockPartyApiService
        .Setup(service => service.GetPartyFromSsnAsync(It.IsAny<string>()))
        .ThrowsAsync(new Exception("Service error"));

        var result = await _controller.GetPartySsn("");

        Assert.IsType<ObjectResult>(result);
        var objectResult = result as ObjectResult;
        Assert.Equal(500, objectResult?.StatusCode);
    }

    [Fact]
    public async Task GetPartyRoles_ReturnsResult_WhenUuidIsValid()
    {
        var validUuid = "11111111-1111-1111-1111-111111111111";
        var expectedRolesJson = "{\"roles\": [\"role1\", \"role2\"]}";

        _mockPartyApiService
        .Setup(service => service.GetRolesFromPartyAsync(validUuid))
        .ReturnsAsync(expectedRolesJson);

        var result = await _controller.GetPartyRoles(validUuid);

        Assert.IsType<OkObjectResult>(result);
    }

    [Fact]
    public async Task GetPartyRoles_Returns500_WhenServiceThrowsException()
    {
        _mockPartyApiService
        .Setup(service => service.GetRolesFromPartyAsync(It.IsAny<string>()))
        .ThrowsAsync(new Exception("Service error"));

        var result = await _controller.GetPartyRoles("invalid-uuid");

        Assert.IsType<ObjectResult>(result);
        var objectResult = result as ObjectResult;
        Assert.Equal(500, objectResult?.StatusCode);
    }

    [Fact]
    public async Task GetRolesFromOrg_ReturnsResult_WhenOrgNumberIsValid()
    {
        var validOrgNumber = "123456789";
        var expectedErRollerModel = new ErRollerModel
        {
            Rollegrupper = new List<Rollegrupper>(),
            Links = null,
            ApiRoller = new List<ApiRoller>()
        };

        _mockPartyApiService
        .Setup(service => service.GetRolesFromOrgAsync(validOrgNumber))
        .ReturnsAsync(expectedErRollerModel);

        var result = await _controller.GetRolesFromOrg(validOrgNumber);

        Assert.IsType<OkObjectResult>(result);
    }

    [Fact]
    public async Task GetRolesFromOrge_Returns500_WhenServiceThrowsException()
    {
        _mockPartyApiService
        .Setup(service => service.GetRolesFromOrgAsync(It.IsAny<string>()))
        .ThrowsAsync(new Exception("Service error"));

        var result = await _controller.GetRolesFromOrg("invalid-org");

        Assert.IsType<ObjectResult>(result);
        var objectResult = result as ObjectResult;
        Assert.Equal(500, objectResult?.StatusCode);
    }

}