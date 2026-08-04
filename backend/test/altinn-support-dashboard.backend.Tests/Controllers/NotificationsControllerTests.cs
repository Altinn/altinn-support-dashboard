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
    public class NotificationsControllerTests
    {
        private const string ValidOrderId = "dec90ca7-4f8d-410f-96ed-666fe019c946";
        private const string OtherValidOrderId = "11111111-2222-3333-4444-555555555555";
        private const string EnvironmentName = "TT02";

        private readonly NotificationsController _controller;
        private readonly Mock<INotificationsService> _serviceMock;
        private readonly Mock<IAltinn3Service> _altinn3ServiceMock;
        private readonly Mock<ITelemetryService> _telemetryServiceMock;

        public NotificationsControllerTests()
        {
            _serviceMock = new Mock<INotificationsService>();
            _altinn3ServiceMock = new Mock<IAltinn3Service>();
            _telemetryServiceMock = new Mock<ITelemetryService>();
            _controller = new NotificationsController(_serviceMock.Object, _altinn3ServiceMock.Object, _telemetryServiceMock.Object)
            {
                ControllerContext = new ControllerContext
                {
                    HttpContext = new DefaultHttpContext
                    {
                        User = new System.Security.Claims.ClaimsPrincipal(new ClaimsIdentity(new[]
                        {
                            new Claim(ClaimTypes.Name, "test-user")
                        }, "TestAuth"))
                    }
                }
            };
        }

        [Fact]
        public async Task GetEmailNotificationsByOrderId_ReturnsOk_WithServiceResult()
        {
            var response = new NotificationOrderResponseDto
            {
                OrderId = ValidOrderId, SendersReference = "ref", Generated = 1, Succeeded = 1, Notifications = []
            };
            _serviceMock.Setup(s => s.GetEmailNotificationsByOrderId(ValidOrderId, EnvironmentName)).ReturnsAsync(response);

            var result = await _controller.GetEmailNotificationsByOrderId(EnvironmentName, ValidOrderId);

            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(response, okResult.Value);
        }

        [Fact]
        public async Task GetEmailNotificationsByOrderId_CallsService_WithCorrectOrderId()
        {
            _serviceMock.Setup(s => s.GetEmailNotificationsByOrderId(ValidOrderId, EnvironmentName))
                .ReturnsAsync(new NotificationOrderResponseDto
                {
                    OrderId = ValidOrderId, SendersReference = "ref", Generated = 1, Succeeded = 1, Notifications = []
                });

            await _controller.GetEmailNotificationsByOrderId(EnvironmentName, ValidOrderId);

            _serviceMock.Verify(s => s.GetEmailNotificationsByOrderId(ValidOrderId, EnvironmentName), Times.Once);
        }

        [Fact]
        public async Task GetEmailNotificationsByOrderId_PropagatesException_WhenServiceThrows()
        {
            _serviceMock.Setup(s => s.GetEmailNotificationsByOrderId(It.IsAny<string>(), It.IsAny<string>()))
                .ThrowsAsync(new Exception("Service failure"));

            await Assert.ThrowsAsync<Exception>(() => _controller.GetEmailNotificationsByOrderId(EnvironmentName, ValidOrderId));
        }

        [Fact]
        public async Task GetSmsNotificationsByOrderId_ReturnsOk_WithServiceResult()
        {
            var response = new NotificationOrderResponseDto
            {
                OrderId = OtherValidOrderId, SendersReference = "ref", Generated = 1, Succeeded = 1, Notifications = []
            };
            _serviceMock.Setup(s => s.GetSmsNotificationsByOrderId(OtherValidOrderId, EnvironmentName)).ReturnsAsync(response);

            var result = await _controller.GetSmsNotificationsByOrderId(EnvironmentName, OtherValidOrderId);

            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(response, okResult.Value);
        }

        [Fact]
        public async Task GetSmsNotificationsByOrderId_CallsService_WithCorrectOrderId()
        {
            _serviceMock.Setup(s => s.GetSmsNotificationsByOrderId(OtherValidOrderId, EnvironmentName))
                .ReturnsAsync(new NotificationOrderResponseDto
                {
                    OrderId = OtherValidOrderId, SendersReference = "ref", Generated = 1, Succeeded = 1, Notifications = []
                });

            await _controller.GetSmsNotificationsByOrderId(EnvironmentName, OtherValidOrderId);

            _serviceMock.Verify(s => s.GetSmsNotificationsByOrderId(OtherValidOrderId, EnvironmentName), Times.Once);
        }

        [Fact]
        public async Task GetSmsNotificationsByOrderId_PropagatesException_WhenServiceThrows()
        {
            _serviceMock.Setup(s => s.GetSmsNotificationsByOrderId(It.IsAny<string>(), It.IsAny<string>()))
                .ThrowsAsync(new Exception("Service failure"));

            await Assert.ThrowsAsync<Exception>(() => _controller.GetSmsNotificationsByOrderId(EnvironmentName, OtherValidOrderId));
        }

        [Theory]
        [InlineData("order-123")]
        [InlineData("not-a-guid")]
        [InlineData("dec90ca74f8d410f96ed666fe019c946")]
        [InlineData("{dec90ca7-4f8d-410f-96ed-666fe019c946}")]
        [InlineData("")]
        [InlineData("   ")]
        public async Task GetEmailNotificationsByOrderId_ReturnsBadRequest_WhenOrderIdIsNotGuid(string orderId)
        {
            var result = await _controller.GetEmailNotificationsByOrderId(EnvironmentName, orderId);

            Assert.IsType<BadRequestObjectResult>(result);
            _serviceMock.Verify(s => s.GetEmailNotificationsByOrderId(It.IsAny<string>(), It.IsAny<string>()), Times.Never);
        }

        [Theory]
        [InlineData("order-123")]
        [InlineData("not-a-guid")]
        [InlineData("")]
        public async Task GetSmsNotificationsByOrderId_ReturnsBadRequest_WhenOrderIdIsNotGuid(string orderId)
        {
            var result = await _controller.GetSmsNotificationsByOrderId(EnvironmentName, orderId);

            Assert.IsType<BadRequestObjectResult>(result);
            _serviceMock.Verify(s => s.GetSmsNotificationsByOrderId(It.IsAny<string>(), It.IsAny<string>()), Times.Never);
        }

        [Theory]
        [InlineData("order-123")]
        [InlineData("not-a-guid")]
        [InlineData("")]
        public async Task GetAllNotificationsByOrderId_ReturnsBadRequest_WhenOrderIdIsNotGuid(string orderId)
        {
            var result = await _controller.GetAllNotificationsByOrderId(EnvironmentName, orderId);

            Assert.IsType<BadRequestObjectResult>(result);
            _serviceMock.Verify(s => s.GetAllNotificationsByOrderId(It.IsAny<string>(), It.IsAny<string>()), Times.Never);
        }

        // --- GetFutureNotificationsByNin ---

        [Fact]
        public async Task GetFutureNotificationsByNin_ReturnsOk_WithServiceResult()
        {
            var response = new List<FutureNotificationDto>
            {
                new() { CreatorName = "test-creator", RequestedSendTime = DateTime.UtcNow }
            };
            _serviceMock.Setup(s => s.GetFutureNotificationsByNin("12345678901", null, null, EnvironmentName)).ReturnsAsync(response);

            var result = await _controller.GetFutureNotificationsByNin(EnvironmentName, "12345678901", null, null);

            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(response, okResult.Value);
        }

        [Fact]
        public async Task GetFutureNotificationsByNin_CallsService_WithCorrectParameters()
        {
            var from = new DateTime(2024, 1, 1);
            var to = new DateTime(2024, 2, 1);
            _serviceMock.Setup(s => s.GetFutureNotificationsByNin("12345678901", from, to, EnvironmentName))
                .ReturnsAsync([]);

            await _controller.GetFutureNotificationsByNin(EnvironmentName, "12345678901", from, to);

            _serviceMock.Verify(s => s.GetFutureNotificationsByNin("12345678901", from, to, EnvironmentName), Times.Once);
        }

        [Fact]
        public async Task GetFutureNotificationsByNin_PropagatesException_WhenServiceThrows()
        {
            _serviceMock.Setup(s => s.GetFutureNotificationsByNin(It.IsAny<string>(), It.IsAny<DateTime?>(), It.IsAny<DateTime?>(), It.IsAny<string>()))
                .ThrowsAsync(new Exception("Service failure"));

            await Assert.ThrowsAsync<Exception>(() => _controller.GetFutureNotificationsByNin(EnvironmentName, "12345678901", null, null));
        }

        [Fact]
        public async Task GetAllNotificationsByOrderId_TracksSearch_WithOrderId()
        {
            _serviceMock.Setup(s => s.GetAllNotificationsByOrderId(ValidOrderId, EnvironmentName))
                .ReturnsAsync(new List<NotificationOrderResponseDto>
                {
                    new() { OrderId = ValidOrderId, SendersReference = "ref", Generated = 1, Succeeded = 1, Notifications = [] }
                });

            await _controller.GetAllNotificationsByOrderId(EnvironmentName, ValidOrderId);

            _telemetryServiceMock.Verify(t => t.TrackSearch(
                "notifications",
                "orderId",
                It.IsAny<string>(),
                EnvironmentName,
                It.Is<IDictionary<string, string>>(d => d["orderId"] == ValidOrderId)),
                Times.Once);
            }

        [Fact]
        public async Task GetFutureNotificationsByNin_TracksSearch_WithHashedNin_NotRawNin()
        {
            const string nin = "12345678901";
            _serviceMock.Setup(S => S.GetFutureNotificationsByNin(nin, null, null, EnvironmentName))
                .ReturnsAsync(new List<FutureNotificationDto>());
            
            await _controller.GetFutureNotificationsByNin(EnvironmentName, nin, null, null);

            _telemetryServiceMock.Verify(t => t.TrackSearch(
                "notifications",
                "nin",
                It.IsAny<String>(),
                EnvironmentName,
                It.Is<IDictionary<string, string>>(d => d.ContainsKey("ninHash") && !d.Values.Contains(nin))),
                Times.Once);
        }
    }
}
