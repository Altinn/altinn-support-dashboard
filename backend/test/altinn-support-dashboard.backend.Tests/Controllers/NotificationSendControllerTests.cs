using AltinnSupportDashboard.Controllers;
using Microsoft.AspNetCore.Mvc;
using Models.notifications;
using Moq;
using Xunit;

namespace altinn_support_dashboard.backend.Tests.Controllers
{
    public class NotificationSendControllerTests
    {
        private const string EnvironmentName = "TT02";

        private readonly Mock<INotificationSendService> _serviceMock;
        private readonly NotificationSendController _controller;

        public NotificationSendControllerTests()
        {
            _serviceMock = new Mock<INotificationSendService>();
            _controller = new NotificationSendController(_serviceMock.Object);
        }

        [Fact]
        public async Task SendTestEmail_ReturnsOk_WithServiceResult()
        {
            var request = new NotificationSendRequest { EmailAddress = "test@example.com" };
            var response = new NotificationSendResponse { ResponseBody = "ok" };
            _serviceMock.Setup(s => s.SendTestEmail(request, EnvironmentName)).ReturnsAsync(response);

            var result = await _controller.SendTestEmail(EnvironmentName, request);

            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Same(response, okResult.Value);
        }

        [Theory]
        [InlineData("TT02")]
        [InlineData("Production")]
        public async Task SendTestEmail_PassesEnvironmentToService(string environmentName)
        {
            var request = new NotificationSendRequest { EmailAddress = "test@example.com" };
            _serviceMock
                .Setup(s => s.SendTestEmail(It.IsAny<NotificationSendRequest>(), It.IsAny<string>()))
                .ReturnsAsync(new NotificationSendResponse());

            await _controller.SendTestEmail(environmentName, request);

            _serviceMock.Verify(s => s.SendTestEmail(request, environmentName), Times.Once);
        }

        [Fact]
        public async Task SendTestEmail_WhenServiceThrowsBadRequest_Propagates()
        {
            var request = new NotificationSendRequest { EmailAddress = "invalid" };
            _serviceMock
                .Setup(s => s.SendTestEmail(It.IsAny<NotificationSendRequest>(), It.IsAny<string>()))
                .ThrowsAsync(new BadRequestException("Not a valid email"));

            await Assert.ThrowsAsync<BadRequestException>(() => _controller.SendTestEmail(EnvironmentName, request));
        }
    }
}
