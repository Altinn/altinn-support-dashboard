using altinn_support_dashboard.Server.Controllers;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;
using System.Threading.Tasks;
using altinn_support_dashboard.Server.Models;
using altinn_support_dashboard.Server.Services.Interfaces;

namespace altinn_support_dashboard.backend.Tests.Controllers
{
    public class DataBrregControllerTests
    {
        private readonly ER_Roller_APIController _controller;
        private readonly Mock<IDataBrregService> _mockService;

        public DataBrregControllerTests()
        {
            _mockService = new Mock<IDataBrregService>();
            _controller = new ER_Roller_APIController(_mockService.Object);
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
            var result = await _controller.GetRoles(invalidOrgNumber);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Organisasjonsnummeret er ugyldig. Det må være 9 sifre langt.", badRequestResult.Value);
        }

        [Fact]
        public async Task GetRoles_ReturnsOk_WhenOrgNumberLengthIsValid()
        {
            // Arrange
            string validOrgNumber = "123456789";
            _mockService.Setup(service => service.GetRolesAsync(validOrgNumber))
                        .ReturnsAsync(new ErRollerModel());


            // Act
            var result = await _controller.GetRoles(validOrgNumber);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);

            Assert.IsType<ErRollerModel>(okResult.Value);

        }

        [Theory]
        [InlineData(null)]
        [InlineData("")]
        [InlineData("123")]
        [InlineData("12345678")]
        [InlineData("123456789333")]
        [InlineData("abcdefghij")]
        public async Task GetUnderenheter_ReturnsBadRequest_WhenOrgNumberLengthIsInvalid(string invalidOrgNumber)
        {
            // Act
            var result = await _controller.GetUnderenheter(invalidOrgNumber);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Organisasjonsnummeret er ugyldig. Det må være 9 sifre langt.", badRequestResult.Value);
        }

        [Fact]
        public async Task GetUnderenheter_ReturnsOk_WhenOrgNumberLengthIsValid()
        {
            // Arrange
            string validOrgNumber = "123456789";
            _mockService.Setup(service => service.GetUnderenheter(validOrgNumber))
                        .ReturnsAsync(new UnderenhetRootObject());


            // Act
            var result = await _controller.GetUnderenheter(validOrgNumber);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);

            Assert.IsType<UnderenhetRootObject>(okResult.Value);

        }
    }
}
