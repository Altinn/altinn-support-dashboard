using Xunit;
using Moq;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authentication;
using System.Security.Claims;
using System.Threading.Tasks;
using AltinnSupportDashboard.Controllers;
using altinn_support_dashboard.Server.Models.ansattporten;
using Microsoft.Extensions.DependencyInjection;
using Security;
using altinn_support_dashboard.Server.Services.Interfaces;
using Microsoft.Extensions.Logging;

namespace AltinnSupportDashboard.Tests.Controllers
{
    public class AnsattportenControllerTests
    {
        private readonly Mock<IConfiguration> _mockConfig;
        private readonly Mock<IAnsattportenService> _mockAnsattportenService;
        private readonly AnsattportenController _controller;
        private readonly DefaultHttpContext _httpContext;
        private readonly Mock<IConfigurationSection> featureSection;
        private readonly Mock<ILogger<AnsattportenController>> _mockLogger;


        public AnsattportenControllerTests()
        {
            _mockConfig = new Mock<IConfiguration>();
            _mockAnsattportenService = new Mock<IAnsattportenService>();
            _mockLogger = new Mock<ILogger<AnsattportenController>>();

            // Mock IConfigurationSection for the feature flag
            featureSection = new Mock<IConfigurationSection>();
            featureSection.Setup(s => s.Value).Returns("true");

            // Mock IConfigurationSection for the redirect URL
            var redirectSection = new Mock<IConfigurationSection>();
            redirectSection.Setup(s => s.Value).Returns("https://base.url");

            _mockConfig.Setup(c => c.GetSection("FeatureManagement:Ansattporten")).Returns(featureSection.Object);
            _mockConfig.Setup(c => c.GetSection("RedirectConfiguration:RedirectUrl")).Returns(redirectSection.Object);

            _controller = new AnsattportenController(_mockConfig.Object, _mockAnsattportenService.Object, _mockLogger.Object);
            _httpContext = new DefaultHttpContext();
            _controller.ControllerContext = new ControllerContext
            {
                HttpContext = _httpContext
            };
        }

        [Fact]
        public async Task Login_WhenFeatureFlagIsFalse_ShouldRedirectToSafeUrl()
        {
            // Arrange
            featureSection.Setup(s => s.Value).Returns("false");

            _mockConfig.Setup(c => c.GetSection("FeatureManagement:Ansattporten")).Returns(featureSection.Object);
            var controller = new AnsattportenController(_mockConfig.Object, _mockAnsattportenService.Object, _mockLogger.Object);

            // Act
            var result = await controller.Login("/dashboard");

            // Assert
            var redirect = Assert.IsType<RedirectResult>(result);
            Assert.Equal("https://base.url/dashboard", redirect.Url);
        }

        [Fact]
        public async Task Login_WhenFeatureFlagIsTrue_ShouldReturnChallengeResult()
        {
            // Act
            var result = await _controller.Login("/home");

            // Assert
            var challenge = Assert.IsType<ChallengeResult>(result);

            Assert.Contains(AnsattportenConstants.AnsattportenAuthenticationScheme, challenge.AuthenticationSchemes);
            if (challenge.Properties != null)
            {
                Assert.Equal("https://base.url/home", challenge.Properties.RedirectUri);
            }
            ;
        }

        [Fact]
        public async Task AuthStatus_WhenFeatureFlagIsFalse_ShouldReturnLoggedInTrue()
        {
            // Arrange
            featureSection.Setup(s => s.Value).Returns("false");

            _mockConfig.Setup(c => c.GetSection("FeatureManagement:Ansattporten")).Returns(featureSection.Object);

            var controller = new AnsattportenController(_mockConfig.Object, _mockAnsattportenService.Object, _mockLogger.Object);

            // Act
            var result = await controller.AuthStatus();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var authDetails = Assert.IsType<AuthDetails>(okResult.Value);
            Assert.True(authDetails.IsLoggedIn);
            Assert.Null(authDetails.Name);
        }

        [Fact]
        public async Task AuthStatus_WhenAuthenticated_ShouldReturnLoggedInTrueAndName()
        {
            // Arrange
            var mockAuthService = new Mock<IAuthenticationService>();
            _httpContext.RequestServices = new ServiceCollection()
                .AddSingleton(mockAuthService.Object)
                .BuildServiceProvider();

            var principal = new ClaimsPrincipal(
                new ClaimsIdentity(new[] { new Claim(ClaimTypes.Name, "Alice") }, "mock"));
            var ticket = new AuthenticationTicket(principal, "mock");

            _httpContext.User = principal;

            mockAuthService
                .Setup(a => a.AuthenticateAsync(_httpContext, AnsattportenConstants.AnsattportenCookiesAuthenticationScheme))
                .ReturnsAsync(AuthenticateResult.Success(ticket));

            // Act
            var result = await _controller.AuthStatus();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var authDetails = Assert.IsType<AuthDetails>(okResult.Value);
            Assert.True(authDetails.IsLoggedIn);
            Assert.Equal("Alice", authDetails.Name);
        }

        [Fact]
        public async Task Logout_WhenFeatureFlagIsFalse_ShouldRedirectWithoutSignOut()
        {
            // Arrange
            featureSection.Setup(s => s.Value).Returns("false");

            _mockConfig.Setup(c => c.GetSection("FeatureManagement:Ansattporten")).Returns(featureSection.Object);

            var controller = new AnsattportenController(_mockConfig.Object, _mockAnsattportenService.Object, _mockLogger.Object);

            // Act
            var result = await controller.Logout("/done");

            // Assert
            var redirect = Assert.IsType<RedirectResult>(result);
            Assert.Equal("https://base.url/done", redirect.Url);
        }

        [Fact]
        public async Task Logout_WhenFeatureFlagIsTrue_ShouldSignOutAndRedirect()
        {
            // Arrange
            var mockAuthService = new Mock<IAuthenticationService>();
            _httpContext.RequestServices = new ServiceCollection()
                .AddSingleton(mockAuthService.Object)
                .BuildServiceProvider();

            // Act
            var result = await _controller.Logout("/bye");

            // Assert
            mockAuthService.Verify(a => a.SignOutAsync(
                _httpContext,
                AnsattportenConstants.AnsattportenCookiesAuthenticationScheme,
                null), Times.Once);

            mockAuthService.Verify(a => a.SignOutAsync(
                _httpContext,
                AnsattportenConstants.AnsattportenAuthenticationScheme,
                It.Is<AuthenticationProperties>(p => p.RedirectUri == "https://base.url/bye")), Times.Once);

            var redirect = Assert.IsType<RedirectResult>(result);
            Assert.Equal("https://base.url/bye", redirect.Url);
        }
    }
}
