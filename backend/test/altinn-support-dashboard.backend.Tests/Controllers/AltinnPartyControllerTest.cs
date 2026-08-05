using altinn_support_dashboard.Server.Controllers;
using altinn_support_dashboard.Server.Models;
using altinn_support_dashboard.Server.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Moq;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;

namespace altinn_support_dashboard.backend.Tests.Controllers;

public class AltinnPartyTT02ControllerTests
{
    private readonly Mock<IPartyApiService> _mockPartyApiService;
    private readonly AltinnPartyTT02Controller _controller;
    private readonly Mock<ITelemetryService> _mockTelemetryService;
    private const string Env = "TT02";

    public AltinnPartyTT02ControllerTests()
    {
        _mockPartyApiService = new Mock<IPartyApiService>();
        _mockTelemetryService = new Mock<ITelemetryService>();
        _controller = new AltinnPartyTT02Controller(_mockPartyApiService.Object, _mockTelemetryService.Object)
        {
            ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext
                {
                    User = new ClaimsPrincipal(new ClaimsIdentity(new[] { new Claim(ClaimTypes.Name, "test-user") }, "TestAuth"))
                }
            }
        };
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
            .Setup(x => x.GetPartyByUuidAsync(uuid, Env))
            .ReturnsAsync(new PartyModel { PartyUuid = uuid, PartyId = 3, Name = "Test Party" });

        var result = await _controller.GetPartyByUuid(uuid);

        Assert.IsType<OkObjectResult>(result);
    }

    [Fact]
    public async Task GetPartyUuid_CallsServiceWithTT02Environment()
    {
        var uuid = "11111111-1111-1111-1111-111111111111";
        _mockPartyApiService
            .Setup(x => x.GetPartyByUuidAsync(uuid, Env))
            .ReturnsAsync(new PartyModel { PartyUuid = uuid, PartyId = 3 });

        await _controller.GetPartyByUuid(uuid);

        _mockPartyApiService.Verify(x => x.GetPartyByUuidAsync(uuid, Env), Times.Once);
    }

        [Fact]
    public async Task GetPartyOrg_TracksSearch_WithOrgNumber()
    {
        var orgNumber = "123456789";
        _mockPartyApiService
            .Setup(x => x.GetPartyFromOrgAsync(orgNumber, Env))
            .ReturnsAsync(new PartyModel { PartyUuid = "uuid-org", PartyId = 1, OrgNumber = orgNumber });
        
        await _controller.GetPartyOrg(orgNumber);

        _mockTelemetryService.Verify(t => t.TrackSearch(
            "internalIdLookup",
            "orgNumber",
            It.IsAny<string>(),
            Env,
            It.Is<IDictionary<string, string>>(d => d["orgNumber"] == orgNumber)),
            Times.Once);
    }

    [Fact]
    public async Task GetPartyOrg_ReturnsNotFound_AndStillTracksSearch_WhenPartyDoesNotExist()
    {
        var orgNumber = "123456789";
        _mockPartyApiService
            .Setup(x => x.GetPartyFromOrgAsync(orgNumber, Env))
            .ReturnsAsync((PartyModel)null);

        var result = await _controller.GetPartyOrg(orgNumber);

        Assert.IsType<NotFoundResult>(result);

        _mockTelemetryService.Verify(t => t.TrackSearch(
            "internalIdLookup",
            "orgNumber",
            It.IsAny<string>(),
            Env,
            It.Is<IDictionary<string, string>>(d => d["orgNumber"] == orgNumber)),
            Times.Once);
    }

    [Fact]
    public async Task GetPartySsn_TracksSearch_WithHashedSsn()
    {
        var ssn = "12345678901";
        var ssnHash = Convert.ToHexString(System.Security.Cryptography.SHA256.HashData(System.Text.Encoding.UTF8.GetBytes(ssn)));
        _mockPartyApiService
            .Setup(x => x.GetPartyFromSsnAsync(ssn, Env))
            .ReturnsAsync(new PartyModel { PartyUuid = "uuid-ssn", PartyId = 2, Ssn = ssn });
        
        await _controller.GetPartySsn(ssn);

        _mockTelemetryService.Verify(t => t.TrackSearch(
            "internalIdLookup",
            "ssn",
            It.IsAny<string>(),
            Env,
            It.Is<IDictionary<string, string>>(d => d["ssnHash"] == ssnHash && !d.Values.Contains(ssn))),
            Times.Once);
    }

    [Fact]
    public async Task GetPartyByPartyId_ReturnsOk_WhenPartyIdIsValid()
    {
        var partyId = "12345678";
        _mockPartyApiService
            .Setup(x => x.GetPartyByIdAsync(partyId, Env))
            .ReturnsAsync(new PartyModel { PartyUuid = "uuid-id", PartyId = 4 });

        var result = await _controller.GetPartyByPartyId(partyId);

        Assert.IsType<OkObjectResult>(result);
    }

    [Fact]
    public async Task GetPartyByPartyId_CallsServiceWithTT02Environment()
    {
        var partyId = "12345678";
        _mockPartyApiService
            .Setup(x => x.GetPartyByIdAsync(partyId, Env))
            .ReturnsAsync(new PartyModel { PartyUuid = "uuid-id", PartyId = 4 });

        await _controller.GetPartyByPartyId(partyId);

        _mockPartyApiService.Verify(x => x.GetPartyByIdAsync(partyId, Env), Times.Once);
    }

    [Fact]
    public async Task GetPartyByPartyId_TracksSearch_WithPartyId()
    {
        var partyId = "12345678";
        _mockPartyApiService
            .Setup(x => x.GetPartyByIdAsync(partyId, Env))
            .ReturnsAsync(new PartyModel { PartyUuid = "uuid-id", PartyId = 4 });

        await _controller.GetPartyByPartyId(partyId);

        _mockTelemetryService.Verify(t => t.TrackSearch(
            "internalIdLookup",
            "partyId",
            It.IsAny<string>(),
            Env,
            It.Is<IDictionary<string, string>>(d => d["partyId"] == partyId)),
            Times.Once);
    }

    [Fact]
    public async Task GetPartyByPartyId_ReturnsNotFound_WhenPartyDoesNotExist()
    {
        var partyId = "12345678";
        _mockPartyApiService
            .Setup(x => x.GetPartyByIdAsync(partyId, Env))
            .ReturnsAsync((PartyModel?)null);

        var result = await _controller.GetPartyByPartyId(partyId);

        Assert.IsType<NotFoundResult>(result);
    }

    [Fact]
    public async Task GetPartyByValue_RoutesToUuidLookup_AndTracksSearch_WhenValueIsGuid()
    {
        var uuid = "11111111-1111-1111-1111-111111111111";
        _mockPartyApiService
            .Setup(x => x.GetPartyByUuidAsync(uuid, Env))
            .ReturnsAsync(new PartyModel { PartyUuid = uuid, PartyId = 3 });

        var result = await _controller.GetPartyByValue(uuid);

        Assert.IsType<OkObjectResult>(result);
        _mockPartyApiService.Verify(x => x.GetPartyByUuidAsync(uuid, Env), Times.Once);
        _mockTelemetryService.Verify(t => t.TrackSearch(
            "internalIdLookup", "uuid", It.IsAny<string>(), Env, It.IsAny<IDictionary<string, string>>()),
            Times.Once);
    }

    [Fact]
    public async Task GetPartyByValue_RoutesToSsnLookup_AndTracksHashedSsn_WhenValueIsSsn()
    {
        var ssn = "11111111111";
        _mockPartyApiService
            .Setup(x => x.GetPartyFromSsnAsync(ssn, Env))
            .ReturnsAsync(new PartyModel { PartyUuid = "uuid-ssn", PartyId = 2, Ssn = ssn });

        var result = await _controller.GetPartyByValue(ssn);

        Assert.IsType<OkObjectResult>(result);
        _mockPartyApiService.Verify(x => x.GetPartyFromSsnAsync(ssn, Env), Times.Once);
        _mockTelemetryService.Verify(t => t.TrackSearch(
            "internalIdLookup",
            "ssn",
            It.IsAny<string>(),
            Env,
            It.Is<IDictionary<string, string>>(d => d.ContainsKey("ssnHash") && !d.Values.Contains(ssn))),
            Times.Once);
    }

    [Fact]
    public async Task GetPartyByValue_RoutesToOrgLookup_AndTracksSearch_WhenValueIsOrgNumber()
    {
        var orgNumber = "815499557"; // passes the mod-11 checksum in IsValidOrgNumberV2
        _mockPartyApiService
            .Setup(x => x.GetPartyFromOrgAsync(orgNumber, Env))
            .ReturnsAsync(new PartyModel { PartyUuid = "uuid-org", PartyId = 1, OrgNumber = orgNumber });

        var result = await _controller.GetPartyByValue(orgNumber);

        Assert.IsType<OkObjectResult>(result);
        _mockPartyApiService.Verify(x => x.GetPartyFromOrgAsync(orgNumber, Env), Times.Once);
        _mockTelemetryService.Verify(t => t.TrackSearch(
            "internalIdLookup", "orgNumber", It.IsAny<string>(), Env, It.IsAny<IDictionary<string, string>>()),
            Times.Once);
    }

    [Fact]
    public async Task GetPartyByValue_RoutesToPartyIdLookup_AndTracksSearch_WhenValueIsPartyId()
    {
        var partyId = "12345678"; // exactly 8 digits per IsValidPartyId
        _mockPartyApiService
            .Setup(x => x.GetPartyByIdAsync(partyId, Env))
            .ReturnsAsync(new PartyModel { PartyUuid = "uuid-id", PartyId = 4 });

        var result = await _controller.GetPartyByValue(partyId);

        Assert.IsType<OkObjectResult>(result);
        _mockPartyApiService.Verify(x => x.GetPartyByIdAsync(partyId, Env), Times.Once);
        _mockTelemetryService.Verify(t => t.TrackSearch(
            "internalIdLookup", "partyId", It.IsAny<string>(), Env, It.IsAny<IDictionary<string, string>>()),
            Times.Once);
    }

    [Fact]
    public async Task GetPartyByValue_ReturnsBadRequest_AndDoesNotTrackSearch_WhenValueMatchesNoShape()
    {
        var result = await _controller.GetPartyByValue("not-a-valid-anything");

        Assert.IsType<BadRequestObjectResult>(result);
        _mockTelemetryService.Verify(t => t.TrackSearch(
            It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>(), It.IsAny<IDictionary<string, string>>()),
            Times.Never);
    }

    [Fact]
    public async Task GetPartyByUuid_TrackSearch_WithUuid()
    {
        var uuid = "11111111-1111-1111-1111-111111111111";
        _mockPartyApiService
            .Setup(x => x.GetPartyByUuidAsync(uuid, Env))
            .ReturnsAsync(new PartyModel { PartyUuid = uuid, PartyId = 3 });
        
        await _controller.GetPartyByUuid(uuid);

        _mockTelemetryService.Verify(t => t.TrackSearch(
            "internalIdLookup",
            "uuid",
            It.IsAny<string>(),
            Env,
            It.Is<IDictionary<string, string>>(d => d["uuid"] == uuid)),
            Times.Once);
    }

    [Fact]
    public async Task GetPartySsn_ReturnsNotFound_AndStillTracksSearch_WhenPartyDoesNotExist()
    {
        var ssn = "11111111111";
        _mockPartyApiService
            .Setup(x => x.GetPartyFromSsnAsync(ssn, Env))
            .ReturnsAsync((PartyModel)null);

        var result = await _controller.GetPartySsn(ssn);

        Assert.IsType<NotFoundResult>(result);

        _mockTelemetryService.Verify(t => t.TrackSearch(
            "internalIdLookup",
            "ssn",
            It.IsAny<string>(),
            Env,
            It.Is<IDictionary<string, string>>(d => d.ContainsKey("ssnHash") && !d.Values.Contains(ssn))),
            Times.Once);
    }
}

public class AltinnPartyProductionControllerTests
{
    private readonly Mock<IPartyApiService> _mockPartyApiService;
    private readonly AltinnPartyProductionController _controller;
    private readonly Mock<ITelemetryService> _mockTelemetryService;
    private const string Env = "Production";

    public AltinnPartyProductionControllerTests()
    {
        _mockPartyApiService = new Mock<IPartyApiService>();
        _mockTelemetryService = new Mock<ITelemetryService>();
        _controller = new AltinnPartyProductionController(_mockPartyApiService.Object, _mockTelemetryService.Object)
        {
            ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext
                {
                    User = new ClaimsPrincipal(new ClaimsIdentity(new[] { new Claim(ClaimTypes.Name, "test-user") }, "TestAuth"))
                }
            }
        };
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
            .Setup(x => x.GetPartyByUuidAsync(uuid, Env))
            .ReturnsAsync(new PartyModel { PartyUuid = uuid, PartyId = 3, Name = "Test Party" });

        var result = await _controller.GetPartyByUuid(uuid);

        Assert.IsType<OkObjectResult>(result);
    }

    [Fact]
    public async Task GetPartyUuid_CallsServiceWithProductionEnvironment()
    {
        var uuid = "11111111-1111-1111-1111-111111111111";
        _mockPartyApiService
            .Setup(x => x.GetPartyByUuidAsync(uuid, Env))
            .ReturnsAsync(new PartyModel { PartyUuid = uuid, PartyId = 3 });

        await _controller.GetPartyByUuid(uuid);

        _mockPartyApiService.Verify(x => x.GetPartyByUuidAsync(uuid, Env), Times.Once);
    }
}
