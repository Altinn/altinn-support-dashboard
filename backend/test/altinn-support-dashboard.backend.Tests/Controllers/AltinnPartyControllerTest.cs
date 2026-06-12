using altinn_support_dashboard.Server.Controllers;
using altinn_support_dashboard.Server.Models;
using altinn_support_dashboard.Server.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace altinn_support_dashboard.backend.Tests.Controllers;

public class AltinnPartyTT02ControllerTests
{
    private readonly Mock<IPartyApiService> _mockPartyApiService;
    private readonly AltinnPartyTT02Controller _controller;
    private const string Env = "TT02";

    public AltinnPartyTT02ControllerTests()
    {
        _mockPartyApiService = new Mock<IPartyApiService>();
        _controller = new AltinnPartyTT02Controller(_mockPartyApiService.Object);
    }

    [Fact]
    public async Task GetPartyOrg_ReturnsOk_WhenOrgNumberIsValid()
    {
        var orgNumber = "123456789";
        _mockPartyApiService
            .Setup(x => x.GetPartyFromOrgAsync(orgNumber, Env))
            .ReturnsAsync(new PartyModel { PartyUuid = "uuid-org", PartyId = 1, OrgNumber = orgNumber, Name = "Test Organization" });

        var result = await _controller.GetPartyOrg(orgNumber);

        Assert.IsType<OkObjectResult>(result);
    }

    [Fact]
    public async Task GetPartyOrg_CallsServiceWithTT02Environment()
    {
        var orgNumber = "123456789";
        _mockPartyApiService
            .Setup(x => x.GetPartyFromOrgAsync(orgNumber, Env))
            .ReturnsAsync(new PartyModel { PartyUuid = "uuid-org", PartyId = 1, OrgNumber = orgNumber });

        await _controller.GetPartyOrg(orgNumber);

        _mockPartyApiService.Verify(x => x.GetPartyFromOrgAsync(orgNumber, Env), Times.Once);
    }

    [Fact]
    public async Task GetPartySsn_ReturnsOk_WhenSsnIsValid()
    {
        var ssn = "11111111111";
        _mockPartyApiService
            .Setup(x => x.GetPartyFromSsnAsync(ssn, Env))
            .ReturnsAsync(new PartyModel { PartyUuid = "uuid-ssn", PartyId = 2, Ssn = ssn, Name = "Test Person" });

        var result = await _controller.GetPartySsn(ssn);

        Assert.IsType<OkObjectResult>(result);
    }

    [Fact]
    public async Task GetPartySsn_CallsServiceWithTT02Environment()
    {
        var ssn = "11111111111";
        _mockPartyApiService
            .Setup(x => x.GetPartyFromSsnAsync(ssn, Env))
            .ReturnsAsync(new PartyModel { PartyUuid = "uuid-ssn", PartyId = 2, Ssn = ssn });

        await _controller.GetPartySsn(ssn);

        _mockPartyApiService.Verify(x => x.GetPartyFromSsnAsync(ssn, Env), Times.Once);
    }

    [Fact]
    public async Task GetPartyRoles_ReturnsOk_WhenUuidIsValid()
    {
        var uuid = "11111111-1111-1111-1111-111111111111";
        _mockPartyApiService
            .Setup(x => x.GetRolesFromPartyAsync(uuid, Env))
            .ReturnsAsync("{\"roles\": [\"role1\", \"role2\"]}");

        var result = await _controller.GetPartyRoles(uuid);

        Assert.IsType<OkObjectResult>(result);
    }

    [Fact]
    public async Task GetPartyRoles_CallsServiceWithTT02Environment()
    {
        var uuid = "11111111-1111-1111-1111-111111111111";
        _mockPartyApiService
            .Setup(x => x.GetRolesFromPartyAsync(uuid, Env))
            .ReturnsAsync("{}");

        await _controller.GetPartyRoles(uuid);

        _mockPartyApiService.Verify(x => x.GetRolesFromPartyAsync(uuid, Env), Times.Once);
    }

    [Fact]
    public async Task GetRolesFromOrg_ReturnsOk_WhenOrgNumberIsValid()
    {
        var orgNumber = "123456789";
        _mockPartyApiService
            .Setup(x => x.GetRolesFromOrgAsync(orgNumber, Env))
            .ReturnsAsync(new ErRollerModel { Rollegrupper = new List<Rollegrupper>(), ApiRoller = new List<ApiRoller>() });

        var result = await _controller.GetRolesFromOrg(orgNumber);

        Assert.IsType<OkObjectResult>(result);
    }

    [Fact]
    public async Task GetRolesFromOrg_ReturnsEmptyLists_WhenNoRoles()
    {
        var orgNumber = "123456789";
        _mockPartyApiService
            .Setup(x => x.GetRolesFromOrgAsync(orgNumber, Env))
            .ReturnsAsync(new ErRollerModel { Rollegrupper = new List<Rollegrupper>(), ApiRoller = new List<ApiRoller>() });

        var result = await _controller.GetRolesFromOrg(orgNumber);

        var okResult = Assert.IsType<OkObjectResult>(result);
        var roles = Assert.IsType<ErRollerModel>(okResult.Value);
        if (roles.Rollegrupper != null && roles.ApiRoller != null)
        {
            Assert.Empty(roles.Rollegrupper);
            Assert.Empty(roles.ApiRoller);
        }
    }

    [Fact]
    public async Task GetRolesFromOrg_CallsServiceWithTT02Environment()
    {
        var orgNumber = "123456789";
        _mockPartyApiService
            .Setup(x => x.GetRolesFromOrgAsync(orgNumber, Env))
            .ReturnsAsync(new ErRollerModel());

        await _controller.GetRolesFromOrg(orgNumber);

        _mockPartyApiService.Verify(x => x.GetRolesFromOrgAsync(orgNumber, Env), Times.Once);
    }

    [Fact]
    public async Task GetPartyUuid_ReturnsOk_WhenUuidIsValid()
    {
        var uuid = "11111111-1111-1111-1111-111111111111";
        _mockPartyApiService
            .Setup(x => x.GetPartyFromUuidAsync(uuid, Env))
            .ReturnsAsync(new PartyModel { PartyUuid = uuid, PartyId = 3, Name = "Test Party" });

        var result = await _controller.GetPartyUuid(uuid);

        Assert.IsType<OkObjectResult>(result);
    }

    [Fact]
    public async Task GetPartyUuid_CallsServiceWithTT02Environment()
    {
        var uuid = "11111111-1111-1111-1111-111111111111";
        _mockPartyApiService
            .Setup(x => x.GetPartyFromUuidAsync(uuid, Env))
            .ReturnsAsync(new PartyModel { PartyUuid = uuid, PartyId = 3 });

        await _controller.GetPartyUuid(uuid);

        _mockPartyApiService.Verify(x => x.GetPartyFromUuidAsync(uuid, Env), Times.Once);
    }
}

public class AltinnPartyProductionControllerTests
{
    private readonly Mock<IPartyApiService> _mockPartyApiService;
    private readonly AltinnPartyProductionController _controller;
    private const string Env = "Production";

    public AltinnPartyProductionControllerTests()
    {
        _mockPartyApiService = new Mock<IPartyApiService>();
        _controller = new AltinnPartyProductionController(_mockPartyApiService.Object);
    }

    [Fact]
    public async Task GetPartyOrg_ReturnsOk_WhenOrgNumberIsValid()
    {
        var orgNumber = "123456789";
        _mockPartyApiService
            .Setup(x => x.GetPartyFromOrgAsync(orgNumber, Env))
            .ReturnsAsync(new PartyModel { PartyUuid = "uuid-org", PartyId = 1, OrgNumber = orgNumber, Name = "Test Organization" });

        var result = await _controller.GetPartyOrg(orgNumber);

        Assert.IsType<OkObjectResult>(result);
    }

    [Fact]
    public async Task GetPartyOrg_CallsServiceWithProductionEnvironment()
    {
        var orgNumber = "123456789";
        _mockPartyApiService
            .Setup(x => x.GetPartyFromOrgAsync(orgNumber, Env))
            .ReturnsAsync(new PartyModel { PartyUuid = "uuid-org", PartyId = 1, OrgNumber = orgNumber });

        await _controller.GetPartyOrg(orgNumber);

        _mockPartyApiService.Verify(x => x.GetPartyFromOrgAsync(orgNumber, Env), Times.Once);
    }

    [Fact]
    public async Task GetPartySsn_ReturnsOk_WhenSsnIsValid()
    {
        var ssn = "11111111111";
        _mockPartyApiService
            .Setup(x => x.GetPartyFromSsnAsync(ssn, Env))
            .ReturnsAsync(new PartyModel { PartyUuid = "uuid-ssn", PartyId = 2, Ssn = ssn, Name = "Test Person" });

        var result = await _controller.GetPartySsn(ssn);

        Assert.IsType<OkObjectResult>(result);
    }

    [Fact]
    public async Task GetPartySsn_CallsServiceWithProductionEnvironment()
    {
        var ssn = "11111111111";
        _mockPartyApiService
            .Setup(x => x.GetPartyFromSsnAsync(ssn, Env))
            .ReturnsAsync(new PartyModel { PartyUuid = "uuid-ssn", PartyId = 2, Ssn = ssn });

        await _controller.GetPartySsn(ssn);

        _mockPartyApiService.Verify(x => x.GetPartyFromSsnAsync(ssn, Env), Times.Once);
    }

    [Fact]
    public async Task GetPartyRoles_ReturnsOk_WhenUuidIsValid()
    {
        var uuid = "11111111-1111-1111-1111-111111111111";
        _mockPartyApiService
            .Setup(x => x.GetRolesFromPartyAsync(uuid, Env))
            .ReturnsAsync("{\"roles\": [\"role1\", \"role2\"]}");

        var result = await _controller.GetPartyRoles(uuid);

        Assert.IsType<OkObjectResult>(result);
    }

    [Fact]
    public async Task GetPartyRoles_CallsServiceWithProductionEnvironment()
    {
        var uuid = "11111111-1111-1111-1111-111111111111";
        _mockPartyApiService
            .Setup(x => x.GetRolesFromPartyAsync(uuid, Env))
            .ReturnsAsync("{}");

        await _controller.GetPartyRoles(uuid);

        _mockPartyApiService.Verify(x => x.GetRolesFromPartyAsync(uuid, Env), Times.Once);
    }

    [Fact]
    public async Task GetRolesFromOrg_ReturnsOk_WhenOrgNumberIsValid()
    {
        var orgNumber = "123456789";
        _mockPartyApiService
            .Setup(x => x.GetRolesFromOrgAsync(orgNumber, Env))
            .ReturnsAsync(new ErRollerModel { Rollegrupper = new List<Rollegrupper>(), ApiRoller = new List<ApiRoller>() });

        var result = await _controller.GetRolesFromOrg(orgNumber);

        Assert.IsType<OkObjectResult>(result);
    }

    [Fact]
    public async Task GetRolesFromOrg_ReturnsEmptyLists_WhenNoRoles()
    {
        var orgNumber = "123456789";
        _mockPartyApiService
            .Setup(x => x.GetRolesFromOrgAsync(orgNumber, Env))
            .ReturnsAsync(new ErRollerModel { Rollegrupper = new List<Rollegrupper>(), ApiRoller = new List<ApiRoller>() });

        var result = await _controller.GetRolesFromOrg(orgNumber);

        var okResult = Assert.IsType<OkObjectResult>(result);
        var roles = Assert.IsType<ErRollerModel>(okResult.Value);
        if (roles.Rollegrupper != null && roles.ApiRoller != null)
        {
            Assert.Empty(roles.Rollegrupper);
            Assert.Empty(roles.ApiRoller);
        }
    }

    [Fact]
    public async Task GetRolesFromOrg_CallsServiceWithProductionEnvironment()
    {
        var orgNumber = "123456789";
        _mockPartyApiService
            .Setup(x => x.GetRolesFromOrgAsync(orgNumber, Env))
            .ReturnsAsync(new ErRollerModel());

        await _controller.GetRolesFromOrg(orgNumber);

        _mockPartyApiService.Verify(x => x.GetRolesFromOrgAsync(orgNumber, Env), Times.Once);
    }

    [Fact]
    public async Task GetPartyUuid_ReturnsOk_WhenUuidIsValid()
    {
        var uuid = "11111111-1111-1111-1111-111111111111";
        _mockPartyApiService
            .Setup(x => x.GetPartyFromUuidAsync(uuid, Env))
            .ReturnsAsync(new PartyModel { PartyUuid = uuid, PartyId = 3, Name = "Test Party" });

        var result = await _controller.GetPartyUuid(uuid);

        Assert.IsType<OkObjectResult>(result);
    }

    [Fact]
    public async Task GetPartyUuid_CallsServiceWithProductionEnvironment()
    {
        var uuid = "11111111-1111-1111-1111-111111111111";
        _mockPartyApiService
            .Setup(x => x.GetPartyFromUuidAsync(uuid, Env))
            .ReturnsAsync(new PartyModel { PartyUuid = uuid, PartyId = 3 });

        await _controller.GetPartyUuid(uuid);

        _mockPartyApiService.Verify(x => x.GetPartyFromUuidAsync(uuid, Env), Times.Once);
    }
}
