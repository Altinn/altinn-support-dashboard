using altinn_support_dashboard.Server.Models;
using altinn_support_dashboard.Server.Services;
using Moq;

namespace altinn_support_dashboard.backend.Tests.Services;

public class PartyApiServiceTests
{
    private readonly PartyApiService _service;
    private readonly Mock<IPartyApiClient> _mockClient;
    public PartyApiServiceTests()
    {
        _mockClient = new Mock<IPartyApiClient>();
        _service = new PartyApiService(_mockClient.Object);
    }

    [Fact]
    public async Task GetPartyFromOrgAsync_ReturnsPartyModel_WhenOrgNumberIsValid()
    {
        var validOrgNumber = "123456789";
        var mockResponse = @"{
            ""PartyUuid"": ""1"",
            ""OrgNumber"":""123456789"",
            ""Name"":""Test Org""
        }";

        _mockClient
        .Setup(x => x.GetParty(It.IsAny<string>(), true))
        .ReturnsAsync(mockResponse);

        var result = await _service.GetPartyFromOrgAsync(validOrgNumber);

        Assert.NotNull(result);
        Assert.IsType<PartyModel>(result);
    }

    [Fact]
    public async Task GetPartyFromOrgAsync_ThrowsException_WhenPartyIsNull()
    {
        var validOrgNumber = "123456789";
        var mockResponse = "null";

        _mockClient
        .Setup(x => x.GetParty(It.IsAny<string>(), true))
        .ReturnsAsync(mockResponse);

        await Assert.ThrowsAsync<Exception>(async () => await _service.GetPartyFromOrgAsync(validOrgNumber));
    }

    [Fact]
    public async Task GetPartyFromSsnAsync_ReturnsPartyModel_WhenSsnIsValid()
    {
        var validSsn = "12345678901";
        var mockResponse = @"{
            ""PartyUuid"": ""2"",
            ""Ssn"":""12345678901"",
            ""Name"":""Test Person""
        }";

        _mockClient
        .Setup(x => x.GetParty(It.IsAny<string>(), false))
        .ReturnsAsync(mockResponse);

        var result = await _service.GetPartyFromSsnAsync(validSsn);

        Assert.NotNull(result);
        Assert.IsType<PartyModel>(result);
    }

    [Fact]
    public async Task GetPartyFromSsnAsync_ThrowsException_WhenPartyIsNull()
    {
        var validSsn = "12345678901";
        var mockResponse = "null";

        _mockClient
        .Setup(x => x.GetParty(It.IsAny<string>(), false))
        .ReturnsAsync(mockResponse);

        await Assert.ThrowsAsync<Exception>(async () => await _service.GetPartyFromSsnAsync(validSsn));
    }

    [Fact]
    public async Task GetPartyFromUuidAsync_ReturnsPartyModel_WhenUuidIsValid()
    {
        var validUuid = "11111111-1111-1111-1111-111111111111";
        var mockResponse = @"{
            ""PartyUuid"": ""1"",
            ""OrgNumber"":""123456789"",
            ""Name"":""Test Org""
        }";

        _mockClient
        .Setup(x => x.GetPartyByUuid(It.IsAny<string>()))
        .ReturnsAsync(mockResponse);

        var result = await _service.GetPartyFromUuidAsync(validUuid);

        Assert.NotNull(result);
        Assert.IsType<PartyModel>(result);
    }

    [Fact]
    public async Task GetPartyFromUuidAsync_ThrowsException_WhenPartyIsNull()
    {
        var validUuid = "11111111-1111-1111-1111-111111111111";
        var mockResponse = "null";

        _mockClient
        .Setup(x => x.GetPartyByUuid(It.IsAny<string>()))
        .ReturnsAsync(mockResponse);

        await Assert.ThrowsAsync<Exception>(async () => await _service.GetPartyFromUuidAsync(validUuid));
    }

    
}