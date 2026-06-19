using Microsoft.AspNetCore.Mvc;
using Moq;
using altinn_support_dashboard.Server.Models;
using altinn_support_dashboard.Server.Services.Interfaces;
using AltinnSupportDashboard.Controllers;
using Models.altinn3Dtos;
using Microsoft.Extensions.Compliance.Redaction;
using Microsoft.IdentityModel.Abstractions;
using Microsoft.Extensions.Configuration;

namespace altinn_support_dashboard.backend.Tests.Controllers
{
    public class AltinnApiControllerTests
    {
        private readonly AltinnTT02Controller _controller;
        private readonly Mock<IAltinn3Service> _mockServiceAltinn3;
        private readonly Mock<ISsnTokenService> _mockSsnTokenService;
        private readonly Mock<ITelemetryService> _mockTelemetryService;
        private readonly Mock<IConfiguration> _mockConfiguration;

        public AltinnApiControllerTests()
        {
            _mockServiceAltinn3 = new Mock<IAltinn3Service>();
            _mockSsnTokenService = new Mock<ISsnTokenService>();
            _mockTelemetryService = new Mock<ITelemetryService>();
            _mockConfiguration = new Mock<IConfiguration>();
            var mockSection = new Mock<IConfigurationSection>();
            mockSection.Setup(s => s.GetChildren()).Returns(new List<IConfigurationSection>());
            _mockConfiguration.Setup(c => c.GetSection("LoggingConfiguration:TrackedEnvironments")).Returns(mockSection.Object);
            _controller = new AltinnTT02Controller(_mockServiceAltinn3.Object, _mockSsnTokenService.Object, _mockTelemetryService.Object, _mockConfiguration.Object);
        }

        [Fact]
        public async Task GetPersonalContactsAltinn3_ReturnsRoles_WhenOrgNumberIsValid()
        {
            var validOrgNumber = "123456789";
            var expectedContacts = new List<PersonalContactAltinn3>
            {
                new PersonalContactAltinn3 { Name = "Contact1", Email = "contact1@test.no", Phone = "", NationalIdentityNumber = "" },
                new PersonalContactAltinn3 { Name = "Contact2", Email = "contact2@test.no", Phone = "", NationalIdentityNumber = "" }
            };

            _mockServiceAltinn3
            .Setup(x => x.GetPersonalContactsByOrgAltinn3(validOrgNumber, "TT02"))
            .ReturnsAsync(expectedContacts);

            var result = await _controller.GetPersonalContactsAltinn3(validOrgNumber);

            Assert.NotNull(result);
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(expectedContacts, okResult.Value);
        }

        [Theory]
        [InlineData("")]
        [InlineData("999")]
        [InlineData("12345678")]
        [InlineData("1234567890")]
        [InlineData("abcdefghi")]
        [InlineData("abcdefghij")]
        [InlineData("1d2d3d4d5")]
        [InlineData("   ")]
        public async Task GetPersonalContactsAltinn3_ReturnsBadRequest_WhenOrgNumberIsInvalid(string invalidOrgNumber)
        {
            var result = await _controller.GetPersonalContactsAltinn3(invalidOrgNumber);

            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Organisasjonsnummeret er ugyldig. Det må være 9 sifre langt.", badRequestResult.Value);
        }

        [Fact]
        public async Task GetNotificationAddresses_ReturnsAddresses_WhenOrgNumberIsValid()
        {
            var validOrgNumber = "123456789";
            var expectedAddresses = new List<NotificationAddressDto>
            {
                new NotificationAddressDto {
                    NotificationAddressId = 1,
                    CountryCode = "NO",
                    Email = "address1@test.no" ,
                    Phone = "12345678",
                    SourceOrgNumber = "123456789",
                    RequestedOrgNumber = "123456789"
                }
            };

            _mockServiceAltinn3
            .Setup(x => x.GetNotificationAddressesByOrgAltinn3(validOrgNumber, "TT02"))
            .ReturnsAsync(expectedAddresses);

            var result = await _controller.GetNotificationAddressesByOrg(validOrgNumber);

            Assert.NotNull(result);
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(expectedAddresses, okResult.Value);
        }


        [Theory]
        [InlineData("")]
        [InlineData("999")]
        [InlineData("12345678")]
        [InlineData("1234567890")]
        [InlineData("abcdefghi")]
        [InlineData("abcdefghij")]
        [InlineData("1d2d3d4d5")]
        [InlineData("   ")]
        public async Task GetNotificationAddresses_ReturnsBadRequest_WhenOrgNumberIsInvalid(string invalidOrgNumber)
        {
            var result = await _controller.GetNotificationAddressesByOrg(invalidOrgNumber);

            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Organisasjonsnummeret er ugyldig. Det må være 9 sifre langt.", badRequestResult.Value);
        }

        [Fact]
        public async Task GetSsnFromToken_ReturnsSsn_WhenTokenIsValid()
        {
            var validToken = "valid-token";
            var expectedSsn = "12345678901";

            _mockSsnTokenService
            .Setup(x => x.GetSsnFromToken(validToken))
            .Returns(expectedSsn);

            var result = _controller.GetSsnFromToken(validToken);

            var okResult = Assert.IsType<OkObjectResult>(result);
            var response = okResult.Value;
            var ssn = response?.GetType().GetProperty("socialSecurityNumber");
            Assert.Equal(expectedSsn, ssn?.GetValue(response));

        }

        [Theory]
        [InlineData("")]
        [InlineData("invalid-token")]
        public void GetSsnFromToken_ReturnsBadRequest_WhenTokenIsInvalid(string invalidToken)
        {
            _mockSsnTokenService
            .Setup(x => x.GetSsnFromToken(invalidToken))
            .Returns(string.Empty);

            var exception = Assert.Throws<Exception>(() => _controller.GetSsnFromToken(invalidToken));

            Assert.Equal("Invalid or expired SSN token.", exception.Message);
        }
    }
}
