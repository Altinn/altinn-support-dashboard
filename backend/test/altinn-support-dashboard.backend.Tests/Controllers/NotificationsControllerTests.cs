using altinn_support_dashboard.Server.Services.Interfaces;
using AltinnSupportDashboard.Controllers;
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

        private readonly NotificationsController _controller;
        private readonly Mock<INotificationsService> _serviceMock;

        public NotificationsControllerTests()
        {
            _serviceMock = new Mock<INotificationsService>();
            _controller = new NotificationsController(_serviceMock.Object);
        }

        [Fact]
        public async Task GetEmailNotificationsByOrderId_ReturnsOk_WithServiceResult()
        {
            var response = new NotificationOrderResponseDto
            {
                OrderId = ValidOrderId, SendersReference = "ref", Generated = 1, Succeeded = 1, Notifications = []
            };
            _serviceMock.Setup(s => s.GetEmailNotificationsByOrderId(ValidOrderId)).ReturnsAsync(response);

            var result = await _controller.GetEmailNotificationsByOrderId(ValidOrderId);

            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(response, okResult.Value);
        }

        [Fact]
        public async Task GetEmailNotificationsByOrderId_CallsService_WithCorrectOrderId()
        {
            _serviceMock.Setup(s => s.GetEmailNotificationsByOrderId(ValidOrderId))
                .ReturnsAsync(new NotificationOrderResponseDto
                {
                    OrderId = ValidOrderId, SendersReference = "ref", Generated = 1, Succeeded = 1, Notifications = []
                });

            await _controller.GetEmailNotificationsByOrderId(ValidOrderId);

            _serviceMock.Verify(s => s.GetEmailNotificationsByOrderId(ValidOrderId), Times.Once);
        }

        [Fact]
        public async Task GetEmailNotificationsByOrderId_PropagatesException_WhenServiceThrows()
        {
            _serviceMock.Setup(s => s.GetEmailNotificationsByOrderId(It.IsAny<string>()))
                .ThrowsAsync(new Exception("Service failure"));

            await Assert.ThrowsAsync<Exception>(() => _controller.GetEmailNotificationsByOrderId(ValidOrderId));
        }

        [Fact]
        public async Task GetSmsNotificationsByOrderId_ReturnsOk_WithServiceResult()
        {
            var response = new NotificationOrderResponseDto
            {
                OrderId = OtherValidOrderId, SendersReference = "ref", Generated = 1, Succeeded = 1, Notifications = []
            };
            _serviceMock.Setup(s => s.GetSmsNotificationsByOrderId(OtherValidOrderId)).ReturnsAsync(response);

            var result = await _controller.GetSmsNotificationsByOrderId(OtherValidOrderId);

            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(response, okResult.Value);
        }

        [Fact]
        public async Task GetSmsNotificationsByOrderId_CallsService_WithCorrectOrderId()
        {
            _serviceMock.Setup(s => s.GetSmsNotificationsByOrderId(OtherValidOrderId))
                .ReturnsAsync(new NotificationOrderResponseDto
                {
                    OrderId = OtherValidOrderId, SendersReference = "ref", Generated = 1, Succeeded = 1, Notifications = []
                });

            await _controller.GetSmsNotificationsByOrderId(OtherValidOrderId);

            _serviceMock.Verify(s => s.GetSmsNotificationsByOrderId(OtherValidOrderId), Times.Once);
        }

        [Fact]
        public async Task GetSmsNotificationsByOrderId_PropagatesException_WhenServiceThrows()
        {
            _serviceMock.Setup(s => s.GetSmsNotificationsByOrderId(It.IsAny<string>()))
                .ThrowsAsync(new Exception("Service failure"));

            await Assert.ThrowsAsync<Exception>(() => _controller.GetSmsNotificationsByOrderId(OtherValidOrderId));
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
            var result = await _controller.GetEmailNotificationsByOrderId(orderId);

            Assert.IsType<BadRequestObjectResult>(result);
            _serviceMock.Verify(s => s.GetEmailNotificationsByOrderId(It.IsAny<string>()), Times.Never);
        }

        [Theory]
        [InlineData("order-123")]
        [InlineData("not-a-guid")]
        [InlineData("")]
        public async Task GetSmsNotificationsByOrderId_ReturnsBadRequest_WhenOrderIdIsNotGuid(string orderId)
        {
            var result = await _controller.GetSmsNotificationsByOrderId(orderId);

            Assert.IsType<BadRequestObjectResult>(result);
            _serviceMock.Verify(s => s.GetSmsNotificationsByOrderId(It.IsAny<string>()), Times.Never);
        }

        [Theory]
        [InlineData("order-123")]
        [InlineData("not-a-guid")]
        [InlineData("")]
        public async Task GetAllNotificationsByOrderId_ReturnsBadRequest_WhenOrderIdIsNotGuid(string orderId)
        {
            var result = await _controller.GetAllNotificationsByOrderId(orderId);

            Assert.IsType<BadRequestObjectResult>(result);
            _serviceMock.Verify(s => s.GetAllNotificationsByOrderId(It.IsAny<string>()), Times.Never);
        }

        // --- GetFutureNotificationsByNin ---

        [Fact]
        public async Task GetFutureNotificationsByNin_ReturnsOk_WithServiceResult()
        {
            var response = new List<FutureNotificationDto>
            {
                new() { CreatorName = "test-creator", RequestedSendTime = DateTime.UtcNow }
            };
            _serviceMock.Setup(s => s.GetFutureNotificationsByNin("12345678901", null, null)).ReturnsAsync(response);

            var result = await _controller.GetFutureNotificationsByNin("12345678901", null, null);

            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(response, okResult.Value);
        }

        [Fact]
        public async Task GetFutureNotificationsByNin_CallsService_WithCorrectParameters()
        {
            var from = new DateTime(2024, 1, 1);
            var to = new DateTime(2024, 2, 1);
            _serviceMock.Setup(s => s.GetFutureNotificationsByNin("12345678901", from, to))
                .ReturnsAsync([]);

            await _controller.GetFutureNotificationsByNin("12345678901", from, to);

            _serviceMock.Verify(s => s.GetFutureNotificationsByNin("12345678901", from, to), Times.Once);
        }

        [Fact]
        public async Task GetFutureNotificationsByNin_PropagatesException_WhenServiceThrows()
        {
            _serviceMock.Setup(s => s.GetFutureNotificationsByNin(It.IsAny<string>(), It.IsAny<DateTime?>(), It.IsAny<DateTime?>()))
                .ThrowsAsync(new Exception("Service failure"));

            await Assert.ThrowsAsync<Exception>(() => _controller.GetFutureNotificationsByNin("12345678901", null, null));
        }
    }
}
