using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;
using System.Threading.Tasks;
using altinn_support_dashboard.Server.Models;
using altinn_support_dashboard.Server.Services.Interfaces;
using AltinnSupportDashboard.Controllers;
using Microsoft.VisualBasic;

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

        [Fact]
        public async Task GetOrganizationInfo_ReturnsInfo_WhenOrgNumberIsValid()
        {
           var validOrgNumber = "123456789";
           var expectedResult = new Organization
           {
               OrganizationNumber = validOrgNumber,
               Name = "Test Organization"
           };   
           _mockService
           .Setup(x => x.GetOrganizationInfo(validOrgNumber, "TT02"))
           .ReturnsAsync(expectedResult);

           var result = await _controller.GetOrganizationInfo(validOrgNumber);

           Assert.NotNull(result);
           var okResult = Assert.IsType<OkObjectResult>(result);
           Assert.Equal(expectedResult, okResult.Value);
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
        public async Task GetOrganizationInfo_ReturnsBadRequest_WhenOrgNumberIsInvalid(string invalidOrgNumber)
        {
            // Act
            var result = await _controller.GetOrganizationInfo(invalidOrgNumber);
            
            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Organisasjonsnummeret er ugyldig. Det må være 9 sifre langt.", badRequestResult.Value);
        }

        [Fact]
        public async Task GetOrganizationsByPhoneNumber_ReturnsOrganizations_WhenPhoneNumberIsValid()
        {
            var validPhoneNumber = "+4712345678";
            var expectedOrganizations = new List<Organization>
            {
                new Organization { OrganizationNumber = "123456789", Name = "Org1" },
                new Organization { OrganizationNumber = "987654321", Name = "Org2" }
            };

            _mockService
                .Setup(x => x.GetOrganizationsByPhoneNumber(validPhoneNumber, "TT02"))
                .ReturnsAsync(expectedOrganizations);

            var result = await _controller.GetOrganizationsByPhoneNumber(validPhoneNumber);

            Assert.NotNull(result);
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(expectedOrganizations, okResult.Value);
        }

        [Theory]
        [InlineData("")]
        [InlineData("123-4567")]
        [InlineData("phone123")]
        [InlineData("12345678A")]
        [InlineData("+47-123-45678")]
        [InlineData("+47 123 45678")]
        [InlineData("(123) 4567890")]
        [InlineData("++4712345678")]
        [InlineData("+ ")]
        [InlineData("   ")]
        public async Task GetOrganizationsByPhoneNumber_ReturnsBadRequest_WhenPhoneNumberIsInvalid(string invalidPhonenumber)
        {

            // Act
            var result = await _controller.GetOrganizationsByPhoneNumber(invalidPhonenumber);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Telefonnummeret er ugyldig. Det kan ikke være tomt.", badRequestResult.Value);
        }
        [Theory]
        [InlineData("invalid-email")]
        [InlineData("test@.com")]
        [InlineData("test@test")]
        [InlineData("test@@test")]
        [InlineData("@")]
        [InlineData("")]
        [InlineData("   ")]
        public async Task GetOrganizationsByEmail_ReturnsBadRequest_WhenEmailIsInvalid(string invalidEmail)
        {
            // Act
            var result = await _controller.GetOrganizationsByEmail(invalidEmail);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("E-postadressen er ugyldig.", badRequestResult.Value);
        }
        [Theory]
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
