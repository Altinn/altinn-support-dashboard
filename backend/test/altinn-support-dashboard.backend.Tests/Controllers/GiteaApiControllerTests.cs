using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;
using System.Threading.Tasks;
using AltinnSupportDashboard.Controllers;
using AltinnSupportDashboard.Interfaces;
using AltinnSupportDashboard.Models.Gitea;

namespace altinn_support_dashboard.backend.Tests.Controllers
{
    public class GiteaApiControllerTests
    {
        private readonly GiteaController _controller;
        private readonly Mock<IGiteaService> _mockGiteaService;

        public GiteaApiControllerTests()
        {
            _mockGiteaService = new Mock<IGiteaService>();
            _controller = new GiteaController(_mockGiteaService.Object);
        }

        #region CreateTeam Tests

        [Fact]
        public async Task CreateTeam_ReturnsOk_WhenAllParametersAreValid()
        {
            // Arrange
            var environmentName = "production";
            var orgName = "testorg";
            var request = new TeamRequestModel
            {
                PatToken = "validpattoken1234567890123456789012345678901234567890",
                TeamOption = new CreateTeamOptionModel
                {
                    Name = "TestTeam",
                    Description = "Test team description",
                    Permission = Permission.Write,
                    CanCreateOrgRepo = true
                }
            };

            _mockGiteaService.Setup(s => s.CreateTeamAsync(
                It.IsAny<string>(),
                It.IsAny<string>(),
                It.IsAny<string>(),
                It.IsAny<CreateTeamOptionModel>()))
                .ReturnsAsync((true, "Team created successfully", new { id = 123 }));

            // Act
            var result = await _controller.CreateTeam(environmentName, orgName, request);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.NotNull(okResult.Value);
        }

        [Theory]
        [InlineData(null)]
        [InlineData("")]
        [InlineData("   ")]
        public async Task CreateTeam_ReturnsBadRequest_WhenOrgNameIsEmpty(string orgName)
        {
            // Arrange
            var environmentName = "production";
            var request = new TeamRequestModel
            {
                PatToken = "validpattoken1234567890123456789012345678901234567890",
                TeamOption = new CreateTeamOptionModel { Name = "TestTeam" }
            };

            // Act
            var result = await _controller.CreateTeam(environmentName, orgName, request);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Organization name is required.", badRequestResult.Value);
        }

        [Theory]
        [InlineData(null)]
        [InlineData("")]
        [InlineData("   ")]
        public async Task CreateTeam_ReturnsBadRequest_WhenPatTokenIsEmpty(string patToken)
        {
            // Arrange
            var environmentName = "production";
            var orgName = "testorg";
            var request = new TeamRequestModel
            {
                PatToken = patToken,
                TeamOption = new CreateTeamOptionModel { Name = "TestTeam" }
            };

            // Act
            var result = await _controller.CreateTeam(environmentName, orgName, request);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("PAT token is required.", badRequestResult.Value);
        }

        [Theory]
        [InlineData(null)]
        [InlineData("")]
        [InlineData("   ")]
        public async Task CreateTeam_ReturnsBadRequest_WhenTeamNameIsEmpty(string teamName)
        {
            // Arrange
            var environmentName = "production";
            var orgName = "testorg";
            var request = new TeamRequestModel
            {
                PatToken = "validpattoken1234567890123456789012345678901234567890",
                TeamOption = new CreateTeamOptionModel { Name = teamName }
            };

            // Act
            var result = await _controller.CreateTeam(environmentName, orgName, request);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Team name is required.", badRequestResult.Value);
        }

        [Fact]
        public async Task CreateTeam_ReturnsBadRequest_WhenTeamOptionIsNull()
        {
            // Arrange
            var environmentName = "production";
            var orgName = "testorg";
            var request = new TeamRequestModel
            {
                PatToken = "validpattoken1234567890123456789012345678901234567890",
                TeamOption = null
            };

            // Act
            var result = await _controller.CreateTeam(environmentName, orgName, request);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Team name is required.", badRequestResult.Value);
        }

        [Theory]
        [InlineData("dev")]
        [InlineData("test")]
        [InlineData("unknown")]
        [InlineData("")]
        [InlineData(null)]
        public async Task CreateTeam_ReturnsBadRequest_WhenEnvironmentNameIsInvalid(string environmentName)
        {
            // Arrange
            var orgName = "testorg";
            var request = new TeamRequestModel
            {
                PatToken = "validpattoken1234567890123456789012345678901234567890",
                TeamOption = new CreateTeamOptionModel { Name = "TestTeam" }
            };

            // Act
            var result = await _controller.CreateTeam(environmentName, orgName, request);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Invalid environment name. Must be one of: development, staging, production, local.", badRequestResult.Value);
        }

        [Fact]
        public async Task CreateTeam_ReturnsUnauthorized_WhenTokenIsInvalid()
        {
            // Arrange
            var environmentName = "production";
            var orgName = "testorg";
            var request = new TeamRequestModel
            {
                PatToken = "invalidtoken",
                TeamOption = new CreateTeamOptionModel { Name = "TestTeam" }
            };

            _mockGiteaService.Setup(s => s.CreateTeamAsync(
                It.IsAny<string>(),
                It.IsAny<string>(),
                It.IsAny<string>(),
                It.IsAny<CreateTeamOptionModel>()))
                .ThrowsAsync(new System.UnauthorizedAccessException());

            // Act
            var result = await _controller.CreateTeam(environmentName, orgName, request);

            // Assert
            var unauthorizedResult = Assert.IsType<UnauthorizedObjectResult>(result);
            Assert.Equal("Could not authenticate with the provided token.", unauthorizedResult.Value);
        }

        [Fact]
        public async Task CreateTeam_ReturnsBadRequest_WhenGiteaServiceReturnsFalse()
        {
            // Arrange
            var environmentName = "production";
            var orgName = "testorg";
            var request = new TeamRequestModel
            {
                PatToken = "validpattoken1234567890123456789012345678901234567890",
                TeamOption = new CreateTeamOptionModel { Name = "TestTeam" }
            };

            _mockGiteaService.Setup(s => s.CreateTeamAsync(
                It.IsAny<string>(),
                It.IsAny<string>(),
                It.IsAny<string>(),
                It.IsAny<CreateTeamOptionModel>()))
                .ReturnsAsync((false, "Team could not be created", new { error = "Team already exists" }));

            // Act
            var result = await _controller.CreateTeam(environmentName, orgName, request);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.NotNull(badRequestResult.Value);
        }

        [Fact]
        public async Task CreateTeam_ReturnsServerError_WhenExceptionOccurs()
        {
            // Arrange
            var environmentName = "production";
            var orgName = "testorg";
            var request = new TeamRequestModel
            {
                PatToken = "validpattoken1234567890123456789012345678901234567890",
                TeamOption = new CreateTeamOptionModel { Name = "TestTeam" }
            };

            _mockGiteaService.Setup(s => s.CreateTeamAsync(
                It.IsAny<string>(),
                It.IsAny<string>(),
                It.IsAny<string>(),
                It.IsAny<CreateTeamOptionModel>()))
                .ThrowsAsync(new System.Exception("Test exception"));

            // Act
            var result = await _controller.CreateTeam(environmentName, orgName, request);

            // Assert
            var statusCodeResult = Assert.IsType<ObjectResult>(result);
            Assert.Equal(500, statusCodeResult.StatusCode);
        }

        #endregion
    }
}