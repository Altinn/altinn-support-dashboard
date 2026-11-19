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
        private const string IdempotencyId = "ff28bf0d-6ef9-4d50-b1fe-b84b207f5542";

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

        // Records the idempotencyId and sendersReference the controller passes to the service
        private List<(string IdempotencyId, string SendersReference)> CaptureServiceCalls()
        {
            var calls = new List<(string, string)>();
            _serviceMock
                .Setup(s => s.SendTestEmail(It.IsAny<NotificationSendRequest>(), It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>()))
                .Callback<NotificationSendRequest, string, string, string>((_, _, id, reference) => calls.Add((id, reference)))
                .ReturnsAsync(new NotificationSendResponse());
            return calls;
        }

        private void SetupServiceThrows(Exception exception)
        {
            _serviceMock
                .Setup(s => s.SendTestEmail(It.IsAny<NotificationSendRequest>(), It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>()))
                .ThrowsAsync(exception);
        }

        private static string? GetMessage(ObjectResult result) =>
            result.Value?.GetType().GetProperty("message")?.GetValue(result.Value) as string;

        [Fact]
        public async Task SendTestEmail_ReturnsOk_WithServiceResult()
        {
            var request = new NotificationSendRequest { EmailAddress = "test@example.com" };
            var response = new NotificationSendResponse { ResponseBody = "ok" };
            _serviceMock
                .Setup(s => s.SendTestEmail(request, EnvironmentName, It.IsAny<string>(), It.IsAny<string>()))
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
            CaptureServiceCalls();

            await _controller.SendTestEmail(environmentName, request);

            _serviceMock.Verify(s => s.SendTestEmail(request, environmentName, It.IsAny<string>(), It.IsAny<string>()), Times.Once);
        }

        [Fact]
        public async Task SendTestEmail_WithIdempotencyId_PassesItToService_AndUsesItInSendersReference()
        {
            var calls = CaptureServiceCalls();

            await _controller.SendTestEmail(EnvironmentName, new NotificationSendRequest
            {
                EmailAddress = "test@example.com",
                IdempotencyId = IdempotencyId
            });

            var call = Assert.Single(calls);
            Assert.Equal(IdempotencyId, call.IdempotencyId);
            Assert.Equal($"asd-test-{IdempotencyId}", call.SendersReference);
        }

        [Fact]
        public async Task SendTestEmail_RetryWithSameIdempotencyId_ReusesKeyAndSendersReference()
        {
            var calls = CaptureServiceCalls();
            var request = new NotificationSendRequest { EmailAddress = "test@example.com", IdempotencyId = IdempotencyId };

            await _controller.SendTestEmail(EnvironmentName, request);
            await _controller.SendTestEmail(EnvironmentName, request);

            Assert.Equal(2, calls.Count);
            Assert.Equal(calls[0], calls[1]);
        }

        [Theory]
        [InlineData(null)]
        [InlineData("")]
        [InlineData("   ")]
        public async Task SendTestEmail_WithoutIdempotencyId_GeneratesGuid_AndUsesItInSendersReference(string? idempotencyId)
        {
            var calls = CaptureServiceCalls();

            await _controller.SendTestEmail(EnvironmentName, new NotificationSendRequest
            {
                EmailAddress = "test@example.com",
                IdempotencyId = idempotencyId
            });

            var call = Assert.Single(calls);
            Assert.True(Guid.TryParse(call.IdempotencyId, out _));
            Assert.Equal($"asd-test-{call.IdempotencyId}", call.SendersReference);
        }

        [Fact]
        public async Task SendTestEmail_WithoutIdempotencyId_GeneratesNewKeyPerRequest()
        {
            var calls = CaptureServiceCalls();
            var request = new NotificationSendRequest { EmailAddress = "test@example.com" };

            await _controller.SendTestEmail(EnvironmentName, request);
            await _controller.SendTestEmail(EnvironmentName, request);

            Assert.Equal(2, calls.Count);
            Assert.NotEqual(calls[0].IdempotencyId, calls[1].IdempotencyId);
            Assert.NotEqual(calls[0].SendersReference, calls[1].SendersReference);
        }

        [Fact]
        public async Task SendTestEmail_WithInvalidIdempotencyId_ThrowsBadRequest_AndDoesNotSend()
        {
            CaptureServiceCalls();

            await Assert.ThrowsAsync<BadRequestException>(() =>
                _controller.SendTestEmail(EnvironmentName, new NotificationSendRequest
                {
                    EmailAddress = "test@example.com",
                    IdempotencyId = "not-a-guid"
                }));

            _serviceMock.Verify(s => s.SendTestEmail(It.IsAny<NotificationSendRequest>(), It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>()), Times.Never);
        }

        [Fact]
        public async Task SendTestEmail_PassesSameSendersReferenceToServiceAndTelemetry()
        {
            var calls = CaptureServiceCalls();

            await _controller.SendTestEmail(EnvironmentName, new NotificationSendRequest { EmailAddress = "test@example.com" });

            var reference = Assert.Single(calls).SendersReference;
            Assert.StartsWith("asd-test-", reference);
            _telemetryServiceMock.Verify(t => t.TrackSend(
                "notifications", "testEmail", UserId, EnvironmentName,
                It.Is<IDictionary<string, string>?>(d => d != null && d["sendersReference"] == reference)),
                Times.Once);
        }

        [Fact]
        public async Task SendTestEmail_OnSuccess_TracksSendWithUserEnvironmentAndIds_WithoutEmail()
        {
            var orderId = Guid.NewGuid();
            var shipmentId = Guid.NewGuid();
            var request = new NotificationSendRequest { EmailAddress = "  test@example.com  " };
            _serviceMock
                .Setup(s => s.SendTestEmail(It.IsAny<NotificationSendRequest>(), It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>()))
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
                .Setup(s => s.SendTestEmail(It.IsAny<NotificationSendRequest>(), It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>()))
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
            SetupServiceThrows(new BadRequestException("Not a valid email"));

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
        public async Task SendTestEmail_OnTimeout_Returns504WithRetryMessage_AndTracksOutcomeUnknown()
        {
            SetupServiceThrows(new TaskCanceledException("The request was canceled due to the configured HttpClient.Timeout"));

            var result = await _controller.SendTestEmail(EnvironmentName, new NotificationSendRequest
            {
                EmailAddress = "test@example.com",
                IdempotencyId = IdempotencyId
            });

            var objectResult = Assert.IsType<ObjectResult>(result);
            Assert.Equal(StatusCodes.Status504GatewayTimeout, objectResult.StatusCode);
            Assert.Contains("trygt å prøve igjen", GetMessage(objectResult));

            _telemetryServiceMock.Verify(t => t.TrackSend(
                "notifications",
                "testEmail",
                UserId,
                EnvironmentName,
                It.Is<IDictionary<string, string>?>(d =>
                    d != null &&
                    d["sendersReference"] == $"asd-test-{IdempotencyId}" &&
                    d["success"] == "False" &&
                    d["errorType"] == nameof(TaskCanceledException) &&
                    d["outcomeUnknown"] == "True" &&
                    !d.ContainsKey("reason"))),
                Times.Once);
        }

        [Fact]
        public async Task SendTestEmail_OnConnectionError_Returns504WithRetryMessage_AndTracksFailure()
        {
            SetupServiceThrows(new HttpRequestException("Connection refused to https://platform.tt02.altinn.no"));

            var result = await _controller.SendTestEmail(EnvironmentName, new NotificationSendRequest { EmailAddress = "test@example.com" });

            var objectResult = Assert.IsType<ObjectResult>(result);
            Assert.Equal(StatusCodes.Status504GatewayTimeout, objectResult.StatusCode);
            Assert.Contains("trygt å prøve igjen", GetMessage(objectResult));
            // The raw exception message (with the Altinn URL) is not returned to the user
            Assert.DoesNotContain("platform.tt02.altinn.no", GetMessage(objectResult));

            _telemetryServiceMock.Verify(t => t.TrackSend(
                "notifications",
                "testEmail",
                UserId,
                EnvironmentName,
                It.Is<IDictionary<string, string>?>(d =>
                    d != null &&
                    d["success"] == "False" &&
                    d["errorType"] == nameof(HttpRequestException) &&
                    !d.ContainsKey("reason"))),
                Times.Once);
        }

        [Fact]
        public async Task SendTestEmail_OnOtherException_Propagates_AndTracksFailure()
        {
            SetupServiceThrows(new InvalidOperationException("Something else"));

            await Assert.ThrowsAsync<InvalidOperationException>(() =>
                _controller.SendTestEmail(EnvironmentName, new NotificationSendRequest { EmailAddress = "test@example.com" }));

            _telemetryServiceMock.Verify(t => t.TrackSend(
                "notifications",
                "testEmail",
                UserId,
                EnvironmentName,
                It.Is<IDictionary<string, string>?>(d =>
                    d != null &&
                    d["success"] == "False" &&
                    d["errorType"] == nameof(InvalidOperationException) &&
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
