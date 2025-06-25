using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Moq;
using System;
using System.Threading.Tasks;
using Xunit;
using altinn_support_dashboard.Server.Models.Gitea;
using altinn_support_dashboard.Server.Services.Interfaces;
using AltinnSupportDashboard.Controllers;

namespace altinn_support_dashboard.backend.Tests.Controllers
{
    public class GiteaControllerTests
    {
        private readonly GiteaController _controller;
        private readonly Mock<IGiteaService> _mockService;
        private readonly Mock<ILogger<GiteaController>> _mockLogger;

        public GiteaControllerTests()
        {
            _mockService = new Mock<IGiteaService>();
            _mockLogger = new Mock<ILogger<GiteaController>>();
            _controller = new GiteaController(_mockService.Object, _mockLogger.Object);
        }

        #region ValidateToken Tests

        [Fact]
        public async Task ValidateToken_ReturnsOk_WhenTokenIsValid()
        {
            // Arrange
            var tokenRequest = new TokenRequest { Token = "valid-token" };
            var validationResult = new PatValidationResult
            {
                IsValid = true,
                Message = "Token er gyldig"
            };

            _mockService.Setup(s => s.ValidateTokenAsync("development", "valid-token"))
                .ReturnsAsync(validationResult);

            // Act
            var result = await _controller.ValidateToken("development", tokenRequest);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnValue = Assert.IsType<PatValidationResult>(okResult.Value);
            Assert.True(returnValue.IsValid);
            Assert.Equal("Token er gyldig", returnValue.Message);
            _mockService.Verify(s => s.SetToken("development", "valid-token"), Times.Once);
        }

        [Fact]
        public async Task ValidateToken_ReturnsBadRequest_WhenTokenIsEmpty()
        {
            // Arrange
            var tokenRequest = new TokenRequest { Token = "" };

            // Act
            var result = await _controller.ValidateToken("development", tokenRequest);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result.Result);
            var returnValue = Assert.IsType<PatValidationResult>(badRequestResult.Value);
            Assert.False(returnValue.IsValid);
            Assert.Contains("kan ikke være tom", returnValue.Message);
            _mockService.Verify(s => s.ValidateTokenAsync(It.IsAny<string>(), It.IsAny<string>()), Times.Never);
        }

        [Fact]
        public async Task ValidateToken_ReturnsBadRequest_WhenEnvironmentIsInvalid()
        {
            // Arrange
            var tokenRequest = new TokenRequest { Token = "valid-token" };

            // Act
            var result = await _controller.ValidateToken("invalid-environment", tokenRequest);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result.Result);
            var returnValue = Assert.IsType<PatValidationResult>(badRequestResult.Value);
            Assert.False(returnValue.IsValid);
            Assert.Contains("Miljø må være enten", returnValue.Message);
            _mockService.Verify(s => s.ValidateTokenAsync(It.IsAny<string>(), It.IsAny<string>()), Times.Never);
        }

        [Fact]
        public async Task ValidateToken_Returns500Error_WhenExceptionOccurs()
        {
            // Arrange
            var tokenRequest = new TokenRequest { Token = "test-token" };
            _mockService.Setup(s => s.ValidateTokenAsync("development", "test-token"))
                .ThrowsAsync(new Exception("Test exception"));

            // Act
            var result = await _controller.ValidateToken("development", tokenRequest);

            // Assert
            var statusCodeResult = Assert.IsType<ObjectResult>(result.Result);
            Assert.Equal(StatusCodes.Status500InternalServerError, statusCodeResult.StatusCode);
            var returnValue = Assert.IsType<PatValidationResult>(statusCodeResult.Value);
            Assert.False(returnValue.IsValid);
            Assert.Contains("Serverfeil", returnValue.Message);
        }

        #endregion

        #region OrganizationExists Tests

        [Fact]
        public async Task OrganizationExists_ReturnsTrue_WhenOrganizationExists()
        {
            // Arrange
            var orgName = "testorg";

            // Sett opp HttpContext og Headers for Authorization
            var httpContext = new DefaultHttpContext();
            httpContext.Request.Headers["Authorization"] = "Bearer test-token";
            _controller.ControllerContext = new ControllerContext()
            {
                HttpContext = httpContext
            };

            _mockService.Setup(s => s.OrganizationExistsAsync("development", orgName))
                .ReturnsAsync(true);

            // Act
            var result = await _controller.OrganizationExists("development", orgName);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.True((bool)okResult.Value);
            _mockService.Verify(s => s.SetToken("development", "test-token"), Times.Once);
        }

        [Fact]
        public async Task OrganizationExists_ReturnsFalse_WhenOrganizationDoesNotExist()
        {
            // Arrange
            var orgName = "nonexistingorg";

            // Sett opp HttpContext og Headers for Authorization
            var httpContext = new DefaultHttpContext();
            httpContext.Request.Headers["Authorization"] = "Bearer test-token";
            _controller.ControllerContext = new ControllerContext()
            {
                HttpContext = httpContext
            };

            _mockService.Setup(s => s.OrganizationExistsAsync("development", orgName))
                .ReturnsAsync(false);

            // Act
            var result = await _controller.OrganizationExists("development", orgName);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.False((bool)okResult.Value);
        }

        [Theory]
        [InlineData("")]
        [InlineData(null)]
        public async Task OrganizationExists_ReturnsBadRequest_WhenOrgNameIsInvalid(string orgName)
        {
            // Arrange
            var httpContext = new DefaultHttpContext();
            httpContext.Request.Headers["Authorization"] = "Bearer test-token";
            _controller.ControllerContext = new ControllerContext()
            {
                HttpContext = httpContext
            };

            // Act
            var result = await _controller.OrganizationExists("development", orgName);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result.Result);
            Assert.Contains("kan ikke være tom", badRequestResult.Value.ToString());
        }

        [Fact]
        public async Task OrganizationExists_ReturnsBadRequest_WhenEnvironmentIsInvalid()
        {
            // Arrange
            var orgName = "testorg";
            var httpContext = new DefaultHttpContext();
            httpContext.Request.Headers["Authorization"] = "Bearer test-token";
            _controller.ControllerContext = new ControllerContext()
            {
                HttpContext = httpContext
            };

            // Act
            var result = await _controller.OrganizationExists("invalid-environment", orgName);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result.Result);
            Assert.Contains("Miljø må være enten", badRequestResult.Value.ToString());
        }

        [Fact]
        public async Task OrganizationExists_ReturnsUnauthorized_WhenAuthHeaderIsMissing()
        {
            // Arrange
            var orgName = "testorg";
            var httpContext = new DefaultHttpContext();
            // Ingen Authorization header
            _controller.ControllerContext = new ControllerContext()
            {
                HttpContext = httpContext
            };

            // Act
            var result = await _controller.OrganizationExists("development", orgName);

            // Assert
            Assert.IsType<UnauthorizedObjectResult>(result.Result);
        }

        #endregion

        #region CreateOrganization Tests

        [Fact]
        public async Task CreateOrganization_ReturnsCreated_WhenOrganizationIsCreated()
        {
            // Arrange
            var request = new OrganizationCreationRequest
            {
                ShortName = "test",
                FullName = "Test Organization",
                WebsiteUrl = "https://test.no"
            };

            var httpContext = new DefaultHttpContext();
            httpContext.Request.Headers["Authorization"] = "Bearer test-token";
            _controller.ControllerContext = new ControllerContext()
            {
                HttpContext = httpContext
            };

            var creationResult = new OrganizationCreationResult
            {
                Success = true,
                Message = "Organisasjonen ble opprettet"
            };

            _mockService.Setup(s => s.CreateOrganizationAsync("development", request))
                .ReturnsAsync(creationResult);

            // Act
            var result = await _controller.CreateOrganization("development", request);

            // Assert
            var createdResult = Assert.IsType<CreatedResult>(result.Result);
            var returnValue = Assert.IsType<OrganizationCreationResult>(createdResult.Value);
            Assert.True(returnValue.Success);
            Assert.Equal(201, createdResult.StatusCode);
            _mockService.Verify(s => s.SetToken("development", "test-token"), Times.Once);
        }

        [Fact]
        public async Task CreateOrganization_ReturnsBadRequest_WhenOrganizationCreationFails()
        {
            // Arrange
            var request = new OrganizationCreationRequest
            {
                ShortName = "test",
                FullName = "Test Organization",
                WebsiteUrl = "https://test.no"
            };

            var httpContext = new DefaultHttpContext();
            httpContext.Request.Headers["Authorization"] = "Bearer test-token";
            _controller.ControllerContext = new ControllerContext()
            {
                HttpContext = httpContext
            };

            var creationResult = new OrganizationCreationResult
            {
                Success = false,
                Message = "En organisasjon med dette navnet finnes allerede"
            };

            _mockService.Setup(s => s.CreateOrganizationAsync("development", request))
                .ReturnsAsync(creationResult);

            // Act
            var result = await _controller.CreateOrganization("development", request);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result.Result);
            var returnValue = Assert.IsType<OrganizationCreationResult>(badRequestResult.Value);
            Assert.False(returnValue.Success);
        }

        [Fact]
        public async Task CreateOrganization_ReturnsBadRequest_WhenRequestIsNull()
        {
            // Arrange
            OrganizationCreationRequest request = null;

            // Act
            var result = await _controller.CreateOrganization("development", request);

            // Assert
            Assert.IsType<BadRequestObjectResult>(result.Result);
        }

        [Fact]
        public async Task CreateOrganization_ReturnsBadRequest_WhenEnvironmentIsInvalid()
        {
            // Arrange
            var request = new OrganizationCreationRequest
            {
                ShortName = "test",
                FullName = "Test Organization"
            };

            // Act
            var result = await _controller.CreateOrganization("invalid-environment", request);

            // Assert
            Assert.IsType<BadRequestObjectResult>(result.Result);
        }

        [Fact]
        public async Task CreateOrganization_ReturnsUnauthorized_WhenAuthHeaderIsMissing()
        {
            // Arrange
            var request = new OrganizationCreationRequest
            {
                ShortName = "test",
                FullName = "Test Organization"
            };

            var httpContext = new DefaultHttpContext();
            // Ingen Authorization header
            _controller.ControllerContext = new ControllerContext()
            {
                HttpContext = httpContext
            };

            // Act
            var result = await _controller.CreateOrganization("development", request);

            // Assert
            var unauthorizedResult = Assert.IsType<UnauthorizedObjectResult>(result.Result);
            var returnValue = Assert.IsType<OrganizationCreationResult>(unauthorizedResult.Value);
            Assert.False(returnValue.Success);
        }

        [Fact]
        public async Task CreateOrganization_Returns500Error_WhenExceptionOccurs()
        {
            // Arrange
            var request = new OrganizationCreationRequest
            {
                ShortName = "test",
                FullName = "Test Organization"
            };

            var httpContext = new DefaultHttpContext();
            httpContext.Request.Headers["Authorization"] = "Bearer test-token";
            _controller.ControllerContext = new ControllerContext()
            {
                HttpContext = httpContext
            };

            _mockService.Setup(s => s.CreateOrganizationAsync("development", request))
                .ThrowsAsync(new Exception("Test exception"));

            // Act
            var result = await _controller.CreateOrganization("development", request);

            // Assert
            var statusCodeResult = Assert.IsType<ObjectResult>(result.Result);
            Assert.Equal(StatusCodes.Status500InternalServerError, statusCodeResult.StatusCode);
            var returnValue = Assert.IsType<OrganizationCreationResult>(statusCodeResult.Value);
            Assert.False(returnValue.Success);
            Assert.Contains("Serverfeil", returnValue.Message);
        }

        #endregion
    }
}
