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

    [Fact]
    public async Task GetRolesFromPartyAsync_ReturnsRolesString_WhenUuidIsValid()
    {
        var validUuid = "11111111-1111-1111-1111-111111111111";
        var mockResponse = @"[""Role1"", ""Role2""]";

        _mockClient
        .Setup(x => x.GetPartyRoles(It.IsAny<string>()))
        .ReturnsAsync(mockResponse);

        var result = await _service.GetRolesFromPartyAsync(validUuid);

        Assert.NotNull(result);
        Assert.IsType<string>(result);
    }

    [Fact]
    public async Task GetRolesFromOrgAsync_ReturnsErRollerModel_WhenOrgNumberIsValid()
    {
        var validOrgNumber = "123456789";

        var mockPartyResponse = @"{
            ""partyUuid"": ""11111111-1111-1111-1111-111111111111"",
            ""OrgNumber"":""123456789"",
            ""Name"":""Test Org""
        }";

        var mockRolesResponse = @"{
            ""data"": [
                {
                    ""role"": {
                            ""identifier"": ""DAGL""
                    },
                    ""to"" : {
                        ""partyUuid"": ""22222222-2222-2222-2222-222222222222""}                 
                }
            ]
        }";

        var mockSubPartyResponse = @"{
            ""partyUuid"": ""22222222-2222-2222-2222-222222222222"",
            ""Ssn"":""12345678901"",
            ""Name"":""Test Person""
        }";

        _mockClient
        .Setup(x => x.GetParty(It.IsAny<string>(), true))
        .ReturnsAsync(mockPartyResponse);
        _mockClient
        .Setup(x => x.GetPartyRoles(It.IsAny<string>()))
        .ReturnsAsync(mockRolesResponse);
        _mockClient
        .Setup(x => x.GetPartyByUuid("22222222-2222-2222-2222-222222222222"))
        .ReturnsAsync(mockSubPartyResponse);

        var result = await _service.GetRolesFromOrgAsync(validOrgNumber);

        Assert.NotNull(result);
        Assert.IsType<ErRollerModel>(result);   
    }

    [Fact]
    public async Task GetRolesFromOrgAsync_ThrowsException_WhenOrgPartyIsNull()
    {
        var validOrgNumber = "123456789";
        var mockPartyResponse = "null";

        _mockClient
        .Setup(x => x.GetParty(It.IsAny<string>(), true))
        .ReturnsAsync(mockPartyResponse);

        await Assert.ThrowsAsync<Exception>(async () => await _service.GetRolesFromOrgAsync(validOrgNumber));
    }

    [Fact]
    public async Task GetRolesFromOrgAsync_SkipsPartiesWithoutPerson()
    {
        var validOrgNumber = "123456789";

        var mockPartyResponse = @"{
            ""partyUuid"": ""11111111-1111-1111-1111-111111111111"",
            ""OrgNumber"":""123456789"",
            ""Name"":""Test Org""
        }";

        var mockRolesResponse = @"{
            ""data"": [
                {
                    ""role"": {
                            ""identifier"": ""DAGL""
                    },
                    ""to"" : {
                        ""partyUuid"": ""22222222-2222-2222-2222-222222222222""}                 
                }
            ]
        }";

        var mockSubPartyResponse = @"{
            ""partyUuid"": ""22222222-2222-2222-2222-222222222222"",
            ""Name"":""Test Org Unit""
        }";

        _mockClient
        .Setup(x => x.GetParty(It.IsAny<string>(), true))
        .ReturnsAsync(mockPartyResponse);
        _mockClient
        .Setup(x => x.GetPartyRoles(It.IsAny<string>()))
        .ReturnsAsync(mockRolesResponse);
        _mockClient
        .Setup(x => x.GetPartyByUuid("22222222-2222-2222-2222-222222222222"))
        .ReturnsAsync(mockSubPartyResponse);

        var result = await _service.GetRolesFromOrgAsync(validOrgNumber);

        Assert.NotNull(result);
        Assert.IsType<ErRollerModel>(result);
        if (result.Rollegrupper != null)
        {
            Assert.Empty(result.Rollegrupper);
        }
    }

    [Fact]
    public async Task GetRolesFromOrgAsync_HandlesMutlipleRoles()
    {
        var validOrgNumber = "123456789";
        var mockPartyResponse = @"{
            ""partyUuid"": ""11111111-1111-1111-1111-111111111111"",
            ""OrgNumber"":""123456789"",
            ""Name"":""Test Org""
        }";

        var mockRolesResponse = @"{
            ""data"": [
                {
                    ""role"": {
                            ""identifier"": ""DAGL""
                    },
                    ""to"" : {
                        ""partyUuid"": ""22222222-2222-2222-2222-222222222222""}                 
                },
                {
                    ""role"": {
                            ""identifier"": ""ADMIN""
                    },
                    ""to"" : {
                        ""partyUuid"": ""33333333-3333-3333-3333-333333333333""}                 
                }
            ]
        }";

        var mockSubPartyResponse1 = @"{
            ""partyUuid"": ""22222222-2222-2222-2222-222222222222"",
            ""Ssn"":""12345678901"",
            ""Name"":""Test Person1"",
            ""person"": { 
                ""FirstName"": ""Test"",
                ""LastName"": ""Person1""
            }
        }";
        var mockSubPartyResponse2 = @"{
            ""partyUuid"": ""33333333-3333-3333-3333-333333333333"",
            ""Ssn"":""10987654321"",
            ""Name"":""Test Person2"",
            ""person"": { 
                ""FirstName"": ""Test"",
                ""LastName"": ""Person2""
            }
        }";

        _mockClient
        .Setup(x => x.GetParty(It.IsAny<string>(), true))
        .ReturnsAsync(mockPartyResponse);
        _mockClient
        .Setup(x => x.GetPartyRoles(It.IsAny<string>()))
        .ReturnsAsync(mockRolesResponse);
        _mockClient
        .Setup(x => x.GetPartyByUuid("22222222-2222-2222-2222-222222222222"))
        .ReturnsAsync(mockSubPartyResponse1);
        _mockClient
        .Setup(x => x.GetPartyByUuid("33333333-3333-3333-3333-333333333333"))
        .ReturnsAsync(mockSubPartyResponse2);

        var result = await _service.GetRolesFromOrgAsync(validOrgNumber);

        Assert.NotNull(result);
        Assert.IsType<ErRollerModel>(result);
        Assert.NotNull(result.Rollegrupper);
        Assert.Equal(2, result.Rollegrupper.Count);

        var firstGroup = result.Rollegrupper[0];
        var secondGroup = result.Rollegrupper[1];
        Assert.NotNull(firstGroup.Roller);
        Assert.NotNull(secondGroup.Roller);
    }

    [Fact]
    public async Task GetRolesFromOrgAsync_SkipsNullParties()
    {
        var validOrgNumber = "123456789";
        var mockPartyResponse = @"{
            ""partyUuid"": ""11111111-1111-1111-1111-111111111111"",
            ""OrgNumber"":""123456789"",
            ""Name"":""Test Org""
        }";

        var mockRolesResponse = @"{
            ""data"": [
                {
                    ""role"": {
                            ""identifier"": ""DAGL""
                    },
                    ""to"" : {
                        ""partyUuid"": ""22222222-2222-2222-2222-222222222222""}                 
                }
            ]
        }";

        _mockClient
        .Setup(x => x.GetParty(It.IsAny<string>(), true))
        .ReturnsAsync(mockPartyResponse);
        _mockClient
        .Setup(x => x.GetPartyRoles(It.IsAny<string>()))
        .ReturnsAsync(mockRolesResponse);
        _mockClient
        .Setup(x => x.GetPartyByUuid("22222222-2222-2222-2222-222222222222"))
        .ReturnsAsync("null");

        var result = await _service.GetRolesFromOrgAsync(validOrgNumber);

        Assert.NotNull(result);
        Assert.IsType<ErRollerModel>(result);
        if (result.Rollegrupper != null)
        {
            Assert.Empty(result.Rollegrupper);
        }
    }

    [Fact]
    public async Task GetRolesFromOrgAsync_HandlesEmptyDataArray()
    {
        var validOrgNumber = "123456789";
        var mockPartyResponse = @"{
            ""partyUuid"": ""11111111-1111-1111-1111-111111111111"",
            ""OrgNumber"":""123456789"",
            ""Name"":""Test Org""
        }";

        var mockRolesResponse = @"{
            ""data"": []
        }";

        _mockClient
        .Setup(x => x.GetParty(It.IsAny<string>(), true))
        .ReturnsAsync(mockPartyResponse);
        _mockClient
        .Setup(x => x.GetPartyRoles(It.IsAny<string>()))
        .ReturnsAsync(mockRolesResponse);

        var result = await _service.GetRolesFromOrgAsync(validOrgNumber);

        Assert.NotNull(result);
        Assert.IsType<ErRollerModel>(result);
        if (result.Rollegrupper != null)
        {
            Assert.Empty(result.Rollegrupper);
        }
    }

    [Fact]
    public async Task GetRolesFromOrgAsync_SkipsEmptyIdentifier()
    {
        var validOrgNumber = "123456789";
        var mockPartyResponse = @"{
            ""partyUuid"": ""11111111-1111-1111-1111-111111111111"",
            ""OrgNumber"":""123456789"",
            ""Name"":""Test Org""
        }";

        var mockRolesResponse = @"{
            ""data"": [
                {
                    ""role"": {
                            ""identifier"": """"
                    },
                    ""to"" : {
                        ""partyUuid"": ""22222222-2222-2222-2222-222222222222""}                 
                }
            ]
        }";

        var mockSubPartyResponse = @"{
            ""partyUuid"": ""22222222-2222-2222-2222-222222222222"",
            ""Ssn"":""12345678901"",
            ""Name"":""Test Person1"",
            ""person"": { 
                ""FirstName"": ""Test"",
                ""LastName"": ""Person1""
            }
        }";

        _mockClient
        .Setup(x => x.GetParty(It.IsAny<string>(), true))
        .ReturnsAsync(mockPartyResponse);
        _mockClient
        .Setup(x => x.GetPartyRoles(It.IsAny<string>()))
        .ReturnsAsync(mockRolesResponse);
        _mockClient
        .Setup(x => x.GetPartyByUuid("22222222-2222-2222-2222-222222222222"))
        .ReturnsAsync(mockSubPartyResponse);

        var result = await _service.GetRolesFromOrgAsync(validOrgNumber);

        Assert.NotNull(result);
        Assert.IsType<ErRollerModel>(result);
        if (result.Rollegrupper != null)
        {
            Assert.Empty(result.Rollegrupper);
        }
    }
}