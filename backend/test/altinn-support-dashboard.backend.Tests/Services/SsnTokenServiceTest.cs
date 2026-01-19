using altinn_support_dashboard.Server.Services.Interfaces;
using Microsoft.Extensions.Configuration;

namespace altinn_support_dashboard.backend.Tests.Services;

public class SsnTokenServiceTest
{
    private readonly SsnTokenService _ssnTokenService;
    private readonly IConfiguration _configuration;

    public SsnTokenServiceTest()
    {
        _configuration = new ConfigurationBuilder()
             .AddJsonFile("appsettings.Development.json")
             .Build();

        _ssnTokenService = new SsnTokenService(_configuration);
    }

    [Fact]
    public void GenerateSsnToken_ShouldReturnToken_WhenSsnIsValid()
    {
        var ssn = "12345678901";
        var token = _ssnTokenService.GenerateSsnToken(ssn);
        Assert.False(string.IsNullOrEmpty(token));
    }

    [Theory]
    [InlineData("")]
    [InlineData("123")]
    [InlineData("1234567890")]
    [InlineData("abcdefghijk")]
    public void GenerateSsnToken_ShouldThrowArgumentException_WhenSsnIsInvalid(string invalidSsn)
    {
        Assert.Throws<ArgumentException>(() => _ssnTokenService.GenerateSsnToken(invalidSsn));
    }

    [Fact]
    public void GetSsnFromToken_ShouldReturnSsn_WhenTokenIsValid()
    {
        var ssn = "12345678901";
        var token = _ssnTokenService.GenerateSsnToken(ssn);
        var retrievedSsn = _ssnTokenService.GetSsnFromToken(token);
        Assert.Equal(ssn, retrievedSsn);
    }

    [Fact]
    public void GetSsnFromToken_ShouldReturnEmptyString_WhenTokenIsInvalid()
    {
        var invalidToken = "invalid-token";
        var retrievedSsn = _ssnTokenService.GetSsnFromToken(invalidToken);
        Assert.Equal(string.Empty, retrievedSsn);
    }

    [Fact]
    public async Task RemoveExpiredTokens_ShouldRemoveExpiredTokens()
    {
        var inMemorySettings = new Dictionary<string, string?> {
            {"SsnTokenSettings:TokenExpiryMinutes", "0"}, //Immediate expiry
            {"SsnTokenSettings:RemovalIntervalMinutes", "1"}
        };

        var configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(inMemorySettings)
            .Build();
        var service = new SsnTokenService(configuration);

        var ssn = "12345678901";
        var token = service.GenerateSsnToken(ssn);

        await Task.Delay(TimeSpan.FromMinutes(1.1));

        var retrievedSsn = service.GetSsnFromToken(token);
        Assert.Equal(string.Empty, retrievedSsn);
    }

    [Fact]
    public void GenerateSsnToken_ShouldGenerateUniqueTokens_WhenCalledMultipleTimes()
    {
        var ssn = "12345678901";
        var token1 = _ssnTokenService.GenerateSsnToken(ssn);
        var token2 = _ssnTokenService.GenerateSsnToken(ssn);

        Assert.NotEqual(token1, token2);
    }

    [Fact]
    public void GenerateSsnToken_ShouldHandleMultipleSsn()
    {
        var ssn1 = "12345678901";
        var ssn2 = "98765432109";

        var token1 = _ssnTokenService.GenerateSsnToken(ssn1);
        var token2 = _ssnTokenService.GenerateSsnToken(ssn2);

        Assert.NotEqual(token1, token2);
        Assert.Equal(ssn1, _ssnTokenService.GetSsnFromToken(token1));
        Assert.Equal(ssn2, _ssnTokenService.GetSsnFromToken(token2));
    }

    [Fact]
    public void GetSsnFromToken_ShouldReturnEmptyString_WhenTokenHasExpired()
    {
        var inMemorySettings = new Dictionary<string, string?> {
            {"SsnTokenSettings:TokenExpiryMinutes", "0"}, //Immediate expiry
            {"SsnTokenSettings:RemovalIntervalMinutes", "1"}
        };

        var configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(inMemorySettings)
            .Build();
        var service = new SsnTokenService(configuration);

        var ssn = "12345678901";
        var token = service.GenerateSsnToken(ssn);

        var retrievedSsn = service.GetSsnFromToken(token);
        Assert.Equal(string.Empty, retrievedSsn);
    }

    [Fact]
    public void GenerateTokenFromSsn_ShoulReturnValidGuidFormat()
    {
        var ssn = "12345678901";
        var token = _ssnTokenService.GenerateSsnToken(ssn);

        Assert.True(Guid.TryParse(token, out _));
    }
}
