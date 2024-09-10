using altinn_support_dashboard.Server.Controllers;
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
        private readonly Altinn_Intern_APIController _controller;
        private readonly Mock<IAltinnApiService> _mockService;

        public AltinnApiControllerTests()
        {
            _mockService = new Mock<IAltinnApiService>();
            _controller = new Altinn_Intern_APIController(_mockService.Object);
        }

        [Theory]
        [InlineData(null)]
        [InlineData("")]
        [InlineData("123")]
        [InlineData("12345678")]
        [InlineData("123456789333")]
        [InlineData("abcdefghij")]
        public async Task GetRoles_ReturnsBadRequest_WhenOrgNumberLengthIsInvalid(string invalidOrgNumber)
        {
            // Act
            var result = await _controller.GetOrganizationInfo(invalidOrgNumber);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Organisasjonsnummeret er ugyldig. Det må være 9 sifre langt.", badRequestResult.Value);
        }

    }
}
