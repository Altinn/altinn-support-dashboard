using System.Net;
using System.Security.Claims;
using altinn_support_dashboard.Server.Services.Interfaces;
using AltinnSupportDashboard.Controllers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Models.notifications;
using Moq;
using Xunit;

namespace altinn_support_dashboard.backend.Tests.Controllers
{
    public class NotificationSendControllerTests
    {
        private const string EnvironmentName = "TT02";
        private const string UserId = "test-user";

        private readonly Mock<INotificationSendService> _serviceMock;
        private readonly Mock<ITelemetryService> _telemetryServiceMock;
        private readonly NotificationSendController _controller;

        public NotificationSendControllerTests()
        {
            _serviceMock = new Mock<INotificationSendService>();
            _telemetryServiceMock = new Mock<ITelemetryService>();
            _controller = new NotificationSendController(_serviceMock.Object, _telemetryServiceMock.Object)
            {
                ControllerContext = new ControllerContext
                {
                    HttpContext = new DefaultHttpContext
                    {
                        User = new ClaimsPrincipal(new ClaimsIdentity(new[]
                        {
                            new Claim(ClaimTypes.Name, UserId)
                        }, "TestAuth"))
                    }
                }
            };
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
        public async Task SendTestEmail_WhenServiceThrowsBadRequest_Propagates_AndDoesNotTrack()
        {
            var request = new NotificationSendRequest { EmailAddress = "invalid" };
            _serviceMock
                .Setup(s => s.SendTestEmail(It.IsAny<NotificationSendRequest>(), It.IsAny<string>()))
                .ThrowsAsync(new BadRequestException("Not a valid email"));

            await Assert.ThrowsAsync<BadRequestException>(() => _controller.SendTestEmail(EnvironmentName, request));

            _telemetryServiceMock.Verify(t => t.TrackSend(
                It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>(),
                It.IsAny<IDictionary<string, string>?>()), Times.Never);
        }

        [Fact]
        public async Task SendTestEmail_OnSuccess_TracksSendWithUserEnvironmentEmailAndIds()
        {
            var orderId = Guid.NewGuid();
            var shipmentId = Guid.NewGuid();
            var request = new NotificationSendRequest { EmailAddress = "  test@example.com  " };
            _serviceMock
                .Setup(s => s.SendTestEmail(It.IsAny<NotificationSendRequest>(), It.IsAny<string>()))
                .ReturnsAsync(new NotificationSendResponse
                {
                    StatusCode = HttpStatusCode.Created,
                    Result = new InstantEmailOrderResult
                    {
                        NotificationOrderId = orderId,
                        Notification = new InstantNotificationShipment { ShipmentId = shipmentId }
                    }
                });

            await _controller.SendTestEmail(EnvironmentName, request);

            _telemetryServiceMock.Verify(t => t.TrackSend(
                "notifications",
                "testEmail",
                UserId,
                EnvironmentName,
                It.Is<IDictionary<string, string>?>(d =>
                    d != null &&
                    d["email"] == "test@example.com" &&
                    d["statusCode"] == "201" &&
                    d["success"] == "True" &&
                    d["notificationOrderId"] == orderId.ToString() &&
                    d["shipmentId"] == shipmentId.ToString() &&
                    !d.ContainsKey("subject") &&
                    !d.ContainsKey("body"))),
                Times.Once);
        }

        [Fact]
        public async Task SendTestEmail_OnFailedOrder_TracksSendAsUnsuccessful()
        {
            var request = new NotificationSendRequest { EmailAddress = "test@example.com" };
            _serviceMock
                .Setup(s => s.SendTestEmail(It.IsAny<NotificationSendRequest>(), It.IsAny<string>()))
                .ReturnsAsync(new NotificationSendResponse
                {
                    StatusCode = HttpStatusCode.BadRequest,
                    Problem = new NotificationProblem { Title = "Validation failed" }
                });

            await _controller.SendTestEmail(EnvironmentName, request);

            _telemetryServiceMock.Verify(t => t.TrackSend(
                "notifications",
                "testEmail",
                UserId,
                EnvironmentName,
                It.Is<IDictionary<string, string>?>(d =>
                    d != null &&
                    d["statusCode"] == "400" &&
                    d["success"] == "False" &&
                    !d.ContainsKey("notificationOrderId"))),
                Times.Once);
        }
    }
}
