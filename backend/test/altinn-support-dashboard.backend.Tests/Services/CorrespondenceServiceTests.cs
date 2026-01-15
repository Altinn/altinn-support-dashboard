
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using altinn_support_dashboard.Server.Models.correspondence;
using altinn_support_dashboard.Server.Services;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

public class CorrespondenceServiceTests
{
    private readonly Mock<ICorrespondenceClient> _clientMock;
    private readonly CorrespondenceService _service;

    public CorrespondenceServiceTests()
    {
        _clientMock = new Mock<ICorrespondenceClient>();
        var logger = Mock.Of<ILogger<ICorrespondenceService>>();

        _service = new CorrespondenceService(_clientMock.Object, logger);
    }

    [Fact]
    public async Task UploadCorrespondence_WithValidOrgNumber_TransformsRecipient()
    {
        // Arrange
        var request = new CorrespondenceUploadRequest
        {
            Recipients = new List<string> { "123456789" }
        };

        _clientMock
            .Setup(c => c.UploadCorrespondence(It.IsAny<CorrespondenceUploadRequest>()))
            .ReturnsAsync("ok");

        // Act
        var result = await _service.UploadCorrespondence(request);

        // Assert
        _clientMock.Verify(c =>
            c.UploadCorrespondence(It.Is<CorrespondenceUploadRequest>(r =>
                r.Recipients.Count == 1 &&
                r.Recipients[0] == "urn:altinn:organization:identifier-no:123456789"
            )),
            Times.Once
        );

        Assert.Equal("ok", result);
    }

    [Fact]
    public async Task UploadCorrespondence_WithValidSsn_TransformsRecipient()
    {
        // Arrange
        var request = new CorrespondenceUploadRequest
        {
            Recipients = new List<string> { "01010112345" }
        };

        _clientMock
            .Setup(c => c.UploadCorrespondence(It.IsAny<CorrespondenceUploadRequest>()))
            .ReturnsAsync("ok");

        // Act
        var result = await _service.UploadCorrespondence(request);

        // Assert
        _clientMock.Verify(c =>
            c.UploadCorrespondence(It.Is<CorrespondenceUploadRequest>(r =>
                r.Recipients[0] == "urn:altinn:person:identifier-no:01010112345"
            )),
            Times.Once
        );

        Assert.Equal("ok", result);
    }

    [Fact]
    public async Task UploadCorrespondence_WithMultipleRecipients_TransformsAll()
    {
        // Arrange
        var request = new CorrespondenceUploadRequest
        {
            Recipients = new List<string>
            {
                "123456789",
                "01010112345"
            }
        };

        _clientMock
            .Setup(c => c.UploadCorrespondence(It.IsAny<CorrespondenceUploadRequest>()))
            .ReturnsAsync("ok");

        // Act
        await _service.UploadCorrespondence(request);

        // Assert
        _clientMock.Verify(c =>
            c.UploadCorrespondence(It.Is<CorrespondenceUploadRequest>(r =>
                r.Recipients.Contains("urn:altinn:organization:identifier-no:123456789") &&
                r.Recipients.Contains("urn:altinn:person:identifier-no:01010112345")
            )),
            Times.Once
        );
    }

    [Fact]
    public async Task UploadCorrespondence_WithInvalidRecipient_ThrowsException()
    {
        // Arrange
        var request = new CorrespondenceUploadRequest
        {
            Recipients = new List<string> { "invalid-recipient" }
        };

        // Act & Assert
        var ex = await Assert.ThrowsAsync<Exception>(() =>
            _service.UploadCorrespondence(request)
        );

        Assert.Contains("not a valid org or ssn", ex.Message);
        _clientMock.Verify(c => c.UploadCorrespondence(It.IsAny<CorrespondenceUploadRequest>()), Times.Never);
    }

    [Fact]
    public async Task UploadCorrespondence_WithNoRecipients_ThrowsException()
    {
        // Arrange
        var request = new CorrespondenceUploadRequest
        {
            Recipients = new List<string>()
        };

        // Act & Assert
        var ex = await Assert.ThrowsAsync<Exception>(() =>
            _service.UploadCorrespondence(request)
        );

        Assert.Contains("Need at least one Recipient", ex.Message);
        _clientMock.Verify(c => c.UploadCorrespondence(It.IsAny<CorrespondenceUploadRequest>()), Times.Never);
    }
}
