
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;
using System.Threading.Tasks;
using altinn_support_dashboard.Server.Models;
using altinn_support_dashboard.Server.Services.Interfaces;
using AltinnSupportDashboard.Controllers;

namespace altinn_support_dashboard.backend.Tests.Controllers
{
    public class DataBrregControllerTests
    {
        private readonly ER_Roller_APIController _controller;
        private readonly Mock<IDataBrregService> _mockService;
        private readonly string _environmentName = "Production"; // You can set this to "TT02" for testing TT02 environment

        public DataBrregControllerTests()
        {
            _mockService = new Mock<IDataBrregService>();
            _controller = new ER_Roller_APIController(_mockService.Object);
        }

        [Fact]
        public async Task GetRoles_ReturnsRoles_WhenOrgNumberIsValid()
        {
            var validOrgNumber = "123456789";
            var expectedRoles = new ErRollerModel
            {
                Rollegrupper = new List<Rollegrupper>
                {
                    new Rollegrupper { SistEndret = "2023-01-01"}
                },
                ApiRoller = new List<ApiRoller>
                {
                    new ApiRoller { Beskrivelse = "Role1" }
                }
            };

            _mockService
            .Setup(service => service.GetRolesAsync(validOrgNumber, _environmentName))
            .ReturnsAsync(expectedRoles);

            var result = await _controller.GetRoles(_environmentName, validOrgNumber);

            Assert.IsType<OkObjectResult>(result);
            Assert.NotNull(result);
        }

        [Theory]
        [InlineData("Production ")]
        [InlineData("pRoduction")]
        [InlineData("test")]
        [InlineData("dev")]
        [InlineData("TT01")]
        [InlineData("")]
        [InlineData("Tt02")]
        [InlineData("TT02 ")] 

        public async Task GetRoles_ReturnsBadRequest_WhenEnvironmentIsInvalid(string invalidEnvironment)
        {
            string validOrgNumber = "123456789";

            var result = await _controller.GetRoles(invalidEnvironment, validOrgNumber);

            Assert.IsType<BadRequestObjectResult>(result);
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
        public async Task GetRoles_ReturnsBadRequest_WhenOrgNumberLengthIsInvalid(string invalidOrgNumber)
        {
            var result = await _controller.GetRoles(_environmentName, invalidOrgNumber);

            Assert.IsType<BadRequestObjectResult>(result);
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
        public async Task GetUnderenheter_ReturnsBadRequest_WhenOrgNumberLengthIsInvalid(string invalidOrgNumber)
        {
            var result = await _controller.GetUnderenheter(_environmentName, invalidOrgNumber);

            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public async Task GetUnderenheter_ReturnsOk_WhenOrgNumberLengthIsValid()
        {
            string validOrgNumber = "123456789";
            _mockService.
            Setup(service => service.GetUnderenheter(validOrgNumber, _environmentName))
            .ReturnsAsync(new UnderenhetRootObject());

            var result = await _controller.GetUnderenheter(_environmentName, validOrgNumber);

            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.IsType<UnderenhetRootObject>(okResult.Value);
        }
    }
}
