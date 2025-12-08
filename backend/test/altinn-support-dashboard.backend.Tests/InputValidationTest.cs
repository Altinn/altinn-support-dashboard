
namespace altinn_support_dashboard.backend.Tests;

public class InputValidationTest
{
    
    [Theory]
    [InlineData("+4712345678", true)]
    [InlineData("12345678", true)]
    [InlineData("123-4567", false)]
    [InlineData("phone123", false)]
    [InlineData("12345678A", false)]
    [InlineData("+47-123-45678", false)]
    [InlineData("+47 123 45678", false)]
    [InlineData("(123) 4567890", false)]
    [InlineData("+ ", false)]
    [InlineData("", false)]
    public void IsValidPhoneNumber_ShouldReturnExpectedResult(string phoneNumber, bool expectedResult)
    {
        bool result = altinn_support_dashboard.Server.Validation.ValidationService.IsValidPhoneNumber(phoneNumber);
        Assert.Equal(expectedResult, result);
    }

    [Theory]
    [InlineData("123456789", true)]
    [InlineData("12345678", false)]
    [InlineData("1234567890", false)]
    [InlineData("12345678A", false)]
    [InlineData("123 456 789", false)]
    [InlineData("", false)]
    public void IsValidOrganizationNumber_ShouldReturnExpectedResult(string orgNumber, bool expectedResult)
    {
        bool result = altinn_support_dashboard.Server.Validation.ValidationService.IsValidOrgNumber(orgNumber);
        Assert.Equal(expectedResult, result);
    }

    [Theory]
    [InlineData("test@test.no", true)]
    [InlineData("invalid-email", false)]
    [InlineData("test@.com", false)]
    [InlineData("test@test", false)]
    [InlineData("test@@test", false)]
    [InlineData("@", false)]
    [InlineData("", false)]
    public void IsValidEmail_ShouldReturnExpectedResult(string email, bool expectedResult)
    {
        bool result = altinn_support_dashboard.Server.Validation.ValidationService.IsValidEmail(email);
        Assert.Equal(expectedResult, result);
    }

    [Theory]
    [InlineData("123456789", true)]
    [InlineData("12345678901", true)]
    [InlineData("12345678", false)]
    [InlineData("1234567890", false)]
    [InlineData("", false)]
    [InlineData("invalid", false)]
    [InlineData("12345678A", false)]
    [InlineData("1234567890A", false)]
    [InlineData("123 456 789", false)]
    [InlineData("123 456 78901", false)]
    public void IsValidSubjectOrReportee_ShouldReturnExpectedResult(string value, bool expectedResult)
    {
        bool result = altinn_support_dashboard.Server.Validation.ValidationService.IsValidSubjectOrReportee(value);
        Assert.Equal(expectedResult, result);
    }

    [Theory]
    [InlineData("/valid-path", "/valid-path")]
    [InlineData("invalid-path", "/")]
    [InlineData("//malicious", "/")]
    [InlineData("/another/valid-path", "/another/valid-path")]
    [InlineData("", "/")]
    public void SanitizeRedirectUrl_ShouldReturnExpectedResult(string url, string expectedResult)
    {
        string result = altinn_support_dashboard.Server.Validation.ValidationService.SanitizeRedirectUrl(url);
        Assert.Equal(expectedResult, result);
    }
}