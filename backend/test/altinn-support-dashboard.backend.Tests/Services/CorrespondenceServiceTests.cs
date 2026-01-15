using System.Collections.Generic;
using System.Threading.Tasks;
using altinn_support_dashboard.Server.Models.correspondence;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

public class CorrespondenceServiceTests
{
    private readonly Mock<ICorrespondenceClient> _clientMock;
    private readonly Mock<ILogger<ICorrespondenceService>> _loggerMock;
    private readonly CorrespondenceService _service;

    public CorrespondenceServiceTests()
    {
        _clientMock = new Mock<ICorrespondenceClient>();
        _loggerMock = new Mock<ILogger<ICorrespondenceService>>();

        _service = new CorrespondenceService(
            _clientMock.Object,
            _loggerMock.Object
        );
    }

    [Fact]
    public async Task UploadCorrespondence_ThrowsException_WhenNoRecipients()
    {
        var request = new CorrespondenceUploadRequest
        {

            Correspondence = new Correspondence { ResourceId = "testId", Content = new CorrespondenceContent(), Notification = new CorrespondenceNotification() },
            Recipients = new List<string>() // empty
        };

        var exception = await Assert.ThrowsAsync<Exception>(
            () => _service.UploadCorrespondence(request)
        );

        Assert.Equal(
            "Need at least one Recipient, this can be either a org or person",
            exception.Message
        );

        _clientMock.Verify(
            c => c.UploadCorrespondence(It.IsAny<CorrespondenceUploadRequest>()),
            Times.Never
        );
    }

    [Fact]
    public async Task UploadCorrespondence_CallsClient_WhenRecipientsExist()
    {
        var request = new CorrespondenceUploadRequest
        {
            Correspondence = new Correspondence { ResourceId = "testId", Content = new CorrespondenceContent(), Notification = new CorrespondenceNotification() },
            Recipients = new List<string> { "12345789" }
        };

        var expectedResult = "correspondence-id-123";

        _clientMock
            .Setup(c => c.UploadCorrespondence(request))
            .ReturnsAsync(expectedResult);

        var result = await _service.UploadCorrespondence(request);

        Assert.Equal(expectedResult, result);

        _clientMock.Verify(
            c => c.UploadCorrespondence(request),
            Times.Once
        );
    }
}
