using altinn_support_dashboard.Server.Controllers;
using altinn_support_dashboard.Server.Services;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;
using System.Threading.Tasks;
using altinn_support_dashboard.Server.Models;

namespace altinn_support_dashboard.Tests
{
    public class DataBrregControllerTests
    {
        private readonly DataBrregController _controller;
        private readonly Mock<IDataBrregService> _mockService;

        public DataBrregControllerTests()
        {
            _mockService = new Mock<IDataBrregService>();
            _controller = new DataBrregController(_mockService.Object);
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
            Assert.Equal("ID must be exactly 9 digits.", badRequestResult.Value);
        }

        [Fact]
        public async Task GetRoles_ReturnsOk_WhenOrgNumberLengthIsValid()
        {
            // Arrange
            string validOrgNumber = "123456789";
            _mockService.Setup(service => service.GetRolesAsync(validOrgNumber))
                        .ReturnsAsync(new RollerMain());

            // Act
            var result = await _controller.GetRoles(validOrgNumber);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.IsType<RollerMain>(okResult.Value);
        }
    }
}
