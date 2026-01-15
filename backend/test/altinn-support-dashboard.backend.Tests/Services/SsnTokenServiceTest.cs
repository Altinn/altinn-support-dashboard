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
        // shortens down time 
        var inMemorySettings = new Dictionary<string, string?> {
            {"SsnTokenSettings:TokenExpiryMinutes", "0.02"},
            {"SsnTokenSettings:RemovalIntervalMinutes", "0.01"}
        };
        var config = new ConfigurationBuilder().AddInMemoryCollection(inMemorySettings).Build();
        var ssnTokenService = new SsnTokenService(config);
        var ssn = "12345678901";
        var token = ssnTokenService.GenerateSsnToken(ssn);

        await Task.Delay(TimeSpan.FromSeconds(2));

        var retrievedSsn = ssnTokenService.GetSsnFromToken(token);
        Assert.Equal(string.Empty, retrievedSsn);
    }
}
