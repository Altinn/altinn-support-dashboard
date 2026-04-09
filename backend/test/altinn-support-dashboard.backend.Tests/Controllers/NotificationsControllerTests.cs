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
                OrderId = "order-123", SendersReference = "ref", Generated = 1, Succeeded = 1, Notifications = []
            };
            _serviceMock.Setup(s => s.GetEmailNotificationsByOrderId("order-123")).ReturnsAsync(response);

            var result = await _controller.GetEmailNotificationsByOrderId("order-123");

            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(response, okResult.Value);
        }

        [Fact]
        public async Task GetEmailNotificationsByOrderId_CallsService_WithCorrectOrderId()
        {
            _serviceMock.Setup(s => s.GetEmailNotificationsByOrderId("order-123"))
                .ReturnsAsync(new NotificationOrderResponseDto
                {
                    OrderId = "order-123", SendersReference = "ref", Generated = 1, Succeeded = 1, Notifications = []
                });

            await _controller.GetEmailNotificationsByOrderId("order-123");

            _serviceMock.Verify(s => s.GetEmailNotificationsByOrderId("order-123"), Times.Once);
        }

        [Fact]
        public async Task GetEmailNotificationsByOrderId_PropagatesException_WhenServiceThrows()
        {
            _serviceMock.Setup(s => s.GetEmailNotificationsByOrderId(It.IsAny<string>()))
                .ThrowsAsync(new Exception("Service failure"));

            await Assert.ThrowsAsync<Exception>(() => _controller.GetEmailNotificationsByOrderId("order-123"));
        }

        [Fact]
        public async Task GetSmsNotificationsByOrderId_ReturnsOk_WithServiceResult()
        {
            var response = new NotificationOrderResponseDto
            {
                OrderId = "order-456", SendersReference = "ref", Generated = 1, Succeeded = 1, Notifications = []
            };
            _serviceMock.Setup(s => s.GetSmsNotificationsByOrderId("order-456")).ReturnsAsync(response);

            var result = await _controller.GetSmsNotificationsByOrderId("order-456");

            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(response, okResult.Value);
        }

        [Fact]
        public async Task GetSmsNotificationsByOrderId_CallsService_WithCorrectOrderId()
        {
            _serviceMock.Setup(s => s.GetSmsNotificationsByOrderId("order-456"))
                .ReturnsAsync(new NotificationOrderResponseDto
                {
                    OrderId = "order-456", SendersReference = "ref", Generated = 1, Succeeded = 1, Notifications = []
                });

            await _controller.GetSmsNotificationsByOrderId("order-456");

            _serviceMock.Verify(s => s.GetSmsNotificationsByOrderId("order-456"), Times.Once);
        }

        [Fact]
        public async Task GetSmsNotificationsByOrderId_PropagatesException_WhenServiceThrows()
        {
            _serviceMock.Setup(s => s.GetSmsNotificationsByOrderId(It.IsAny<string>()))
                .ThrowsAsync(new Exception("Service failure"));

            await Assert.ThrowsAsync<Exception>(() => _controller.GetSmsNotificationsByOrderId("order-456"));
        }
    }
}
