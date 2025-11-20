using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;
using System.Threading.Tasks;
using altinn_support_dashboard.Server.Models;
using altinn_support_dashboard.Server.Services.Interfaces;
using AltinnSupportDashboard.Controllers;

namespace altinn_support_dashboard.backend.Tests.Controllers
{
    public class AltinnApiControllerTests
    {
        private readonly AltinnTT02Controller _controller;
        private readonly Mock<IAltinnApiService> _mockService;

        public AltinnApiControllerTests()
        {
            _mockService = new Mock<IAltinnApiService>();
            _controller = new AltinnTT02Controller(_mockService.Object);
        }

        [Theory]
        [InlineData(null)]
        [InlineData("")]
        [InlineData("123")]
        [InlineData("12345678")]
        [InlineData("123456789333")]
        [InlineData("abcdefghij")]
        public async Task GetOrganizationInfo_ReturnsBadRequest_WhenOrgNumberLengthIsInvalid(string invalidOrgNumber)
        {
            // Act
            var result = await _controller.GetOrganizationInfo(invalidOrgNumber);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Organisasjonsnummeret er ugyldig. Det må være 9 sifre langt.", badRequestResult.Value);
        }

        [Theory]
        [InlineData(null)]
        [InlineData("")]
        public async Task GetOrganizationsByPhoneNumber_ReturnsBadRequest_WhenPhoneNumberLengthIsInvalid(string invalidPhonenumber)
        {

            // Act
            var result = await _controller.GetOrganizationsByPhoneNumber(invalidPhonenumber);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Telefonnummeret er ugyldig. Det kan ikke være tomt.", badRequestResult.Value);
        }
        [Theory]
        [InlineData("123")]
        [InlineData("12345678")]
        [InlineData("123456789333")]
        [InlineData("abcdefghij")]
        public async Task GetOrganizationsByEmail_ReturnsBadRequest_WhenEmailIsInvalid(string invalidEmail)
        {
            // Act
            var result = await _controller.GetOrganizationsByEmail(invalidEmail);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("E-postadressen er ugyldig.", badRequestResult.Value);
        }
        [Theory]
        [InlineData(null)]
        [InlineData("")]
        [InlineData("123")]
        [InlineData("12345678")]
        [InlineData("123456789333")]
        [InlineData("abcdefghij")]
        public async Task GetPersonalContacts_ReturnsBadRequest_WhenOrgNumberLengthIsInvalid(string invalidOrgNumber)
        {
            // Act
            var result = await _controller.GetPersonalContacts(invalidOrgNumber);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Organisasjonsnummeret er ugyldig. Det må være 9 sifre langt.", badRequestResult.Value);
        }

    }
}
