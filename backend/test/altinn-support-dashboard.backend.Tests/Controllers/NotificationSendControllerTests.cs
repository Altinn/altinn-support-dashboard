using System.Net;
using System.Security.Claims;
using altinn_support_dashboard.Server.Services.Interfaces;
using AltinnSupportDashboard.Controllers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Models.notifications;
using Moq;
using Security;
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
            _serviceMock
                .Setup(s => s.SendTestEmail(request, EnvironmentName, It.IsAny<string>()))
                .ReturnsAsync(response);

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
                .Setup(s => s.SendTestEmail(It.IsAny<NotificationSendRequest>(), It.IsAny<string>(), It.IsAny<string>()))
                .ReturnsAsync(new NotificationSendResponse());

            await _controller.SendTestEmail(environmentName, request);

            _serviceMock.Verify(s => s.SendTestEmail(request, environmentName, It.IsAny<string>()), Times.Once);
        }

        [Fact]
        public async Task SendTestEmail_PassesSameSendersReferenceToServiceAndTelemetry()
        {
            string? passedReference = null;
            _serviceMock
                .Setup(s => s.SendTestEmail(It.IsAny<NotificationSendRequest>(), It.IsAny<string>(), It.IsAny<string>()))
                .Callback<NotificationSendRequest, string, string>((_, _, r) => passedReference = r)
                .ReturnsAsync(new NotificationSendResponse());

            await _controller.SendTestEmail(EnvironmentName, new NotificationSendRequest { EmailAddress = "test@example.com" });

            Assert.NotNull(passedReference);
            Assert.StartsWith("asd-test-", passedReference);
            _telemetryServiceMock.Verify(t => t.TrackSend(
                "notifications", "testEmail", UserId, EnvironmentName,
                It.Is<IDictionary<string, string>?>(d => d != null && d["sendersReference"] == passedReference)),
                Times.Once);
        }

        [Fact]
        public async Task SendTestEmail_GeneratesNewSendersReferencePerRequest()
        {
            var references = new List<string>();
            _serviceMock
                .Setup(s => s.SendTestEmail(It.IsAny<NotificationSendRequest>(), It.IsAny<string>(), It.IsAny<string>()))
                .Callback<NotificationSendRequest, string, string>((_, _, r) => references.Add(r))
                .ReturnsAsync(new NotificationSendResponse());

            var request = new NotificationSendRequest { EmailAddress = "test@example.com" };
            await _controller.SendTestEmail(EnvironmentName, request);
            await _controller.SendTestEmail(EnvironmentName, request);

            Assert.Equal(2, references.Count);
            Assert.NotEqual(references[0], references[1]);
        }

        [Fact]
        public async Task SendTestEmail_OnSuccess_TracksSendWithUserEnvironmentAndIds_WithoutEmail()
        {
            var orderId = Guid.NewGuid();
            var shipmentId = Guid.NewGuid();
            var request = new NotificationSendRequest { EmailAddress = "  test@example.com  " };
            _serviceMock
                .Setup(s => s.SendTestEmail(It.IsAny<NotificationSendRequest>(), It.IsAny<string>(), It.IsAny<string>()))
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
                    d.ContainsKey("sendersReference") &&
                    !d.ContainsKey("email") &&
                    !d.Values.Any(v => v.Contains("test@example.com")) &&
                    d["statusCode"] == "201" &&
                    d["success"] == "True" &&
                    d["notificationOrderId"] == orderId.ToString() &&
                    d["shipmentId"] == shipmentId.ToString() &&
                    !d.ContainsKey("subject") &&
                    !d.ContainsKey("body") &&
                    !d.ContainsKey("outcomeUnknown"))),
                Times.Once);
        }

        [Fact]
        public async Task SendTestEmail_OnFailedOrder_TracksSendAsUnsuccessful()
        {
            var request = new NotificationSendRequest { EmailAddress = "test@example.com" };
            _serviceMock
                .Setup(s => s.SendTestEmail(It.IsAny<NotificationSendRequest>(), It.IsAny<string>(), It.IsAny<string>()))
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
                    d.ContainsKey("sendersReference") &&
                    d["statusCode"] == "400" &&
                    d["success"] == "False" &&
                    !d.ContainsKey("notificationOrderId"))),
                Times.Once);
        }

        [Fact]
        public async Task SendTestEmail_WhenServiceThrowsBadRequest_Propagates_AndTracksFailureWithReason()
        {
            _serviceMock
                .Setup(s => s.SendTestEmail(It.IsAny<NotificationSendRequest>(), It.IsAny<string>(), It.IsAny<string>()))
                .ThrowsAsync(new BadRequestException("Not a valid email"));

            await Assert.ThrowsAsync<BadRequestException>(() =>
                _controller.SendTestEmail(EnvironmentName, new NotificationSendRequest { EmailAddress = "bad@" }));

            _telemetryServiceMock.Verify(t => t.TrackSend(
                "notifications",
                "testEmail",
                UserId,
                EnvironmentName,
                It.Is<IDictionary<string, string>?>(d =>
                    d != null &&
                    d.ContainsKey("sendersReference") &&
                    d["success"] == "False" &&
                    d["errorType"] == nameof(BadRequestException) &&
                    d["reason"] == "Not a valid email" &&
                    !d.ContainsKey("outcomeUnknown") &&
                    !d.Values.Any(v => v.Contains("bad@")))),
                Times.Once);
        }

        [Fact]
        public async Task SendTestEmail_OnTimeout_Propagates_AndTracksOutcomeUnknown()
        {
            _serviceMock
                .Setup(s => s.SendTestEmail(It.IsAny<NotificationSendRequest>(), It.IsAny<string>(), It.IsAny<string>()))
                .ThrowsAsync(new TaskCanceledException("The request was canceled due to the configured HttpClient.Timeout"));

            await Assert.ThrowsAsync<TaskCanceledException>(() =>
                _controller.SendTestEmail(EnvironmentName, new NotificationSendRequest { EmailAddress = "test@example.com" }));

            _telemetryServiceMock.Verify(t => t.TrackSend(
                "notifications",
                "testEmail",
                UserId,
                EnvironmentName,
                It.Is<IDictionary<string, string>?>(d =>
                    d != null &&
                    d.ContainsKey("sendersReference") &&
                    d["success"] == "False" &&
                    d["errorType"] == nameof(TaskCanceledException) &&
                    d["outcomeUnknown"] == "True" &&
                    !d.ContainsKey("reason"))),
                Times.Once);
        }

        [Fact]
        public async Task SendTestEmail_OnOtherException_TracksFailureWithoutReasonOrOutcomeUnknown()
        {
            _serviceMock
                .Setup(s => s.SendTestEmail(It.IsAny<NotificationSendRequest>(), It.IsAny<string>(), It.IsAny<string>()))
                .ThrowsAsync(new HttpRequestException("Connection refused to https://platform.tt02.altinn.no"));

            await Assert.ThrowsAsync<HttpRequestException>(() =>
                _controller.SendTestEmail(EnvironmentName, new NotificationSendRequest { EmailAddress = "test@example.com" }));

            _telemetryServiceMock.Verify(t => t.TrackSend(
                "notifications",
                "testEmail",
                UserId,
                EnvironmentName,
                It.Is<IDictionary<string, string>?>(d =>
                    d != null &&
                    d["success"] == "False" &&
                    d["errorType"] == nameof(HttpRequestException) &&
                    !d.ContainsKey("reason") &&
                    !d.ContainsKey("outcomeUnknown"))),
                Times.Once);
        }

        [Fact]
        public void SendTestEmail_HasNotificationSendRateLimitPolicy()
        {
            var attribute = typeof(NotificationSendController)
                .GetMethod(nameof(NotificationSendController.SendTestEmail))!
                .GetCustomAttributes(typeof(EnableRateLimitingAttribute), false)
                .Cast<EnableRateLimitingAttribute>()
                .Single();

            Assert.Equal(RateLimitPolicies.NotificationSend, attribute.PolicyName);
        }
    }
}
