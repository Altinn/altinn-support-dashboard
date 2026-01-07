

using altinn_support_dashboard.Server.Services.Interfaces;

namespace altinn_support_dashboard.backend.Tests.Services;

public class SsnTokenServiceTest
{
    private readonly SsnTokenService _ssnTokenService;

    public SsnTokenServiceTest()
    {
        _ssnTokenService = new SsnTokenService();
    }

    [Fact]
    public void GenerateSsnToken_ShouldReturnToken_WhenSsnIsValid()
    {
        var ssn = "12345678901";
        var token =  _ssnTokenService.GenerateSsnToken(ssn);
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
}