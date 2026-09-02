
using System;
using System.Collections.Generic;
using System.Net;
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

    private static CorrespondenceUploadRequest CreateValidRequest(string recipientUrn)
    {
        return new CorrespondenceUploadRequest
        {
            Recipients = new List<string> { recipientUrn },
            AttachmentData = new List<CorrespondenceAttachmentData>
            {
                new()
                {
                    FileName = "testfile.txt",
                    Content = [1, 2, 3]
                }
            }
        };
    }

    [Fact]
    public async Task UploadCorrespondence_WithValidPersonUrn_PassesThroughRecipient()
    {
        var request = CreateValidRequest("urn:altinn:person:identifier-no:01010112345");

        _clientMock
            .Setup(c => c.UploadCorrespondence(It.IsAny<CorrespondenceUploadRequest>()))
            .ReturnsAsync(new CorrespondenceResponse());

        var result = await _service.UploadCorrespondence(request);

        _clientMock.Verify(c =>
            c.UploadCorrespondence(It.Is<CorrespondenceUploadRequest>(r =>
                r.Recipients.Count == 1 &&
                r.Recipients[0] == "urn:altinn:person:identifier-no:01010112345"
            )),
            Times.Once
        );

        Assert.IsType<CorrespondenceResponse>(result);
    }

    [Fact]
    public async Task UploadCorrespondence_WithValidOrganizationUrn_PassesThroughRecipient()
    {
        var request = CreateValidRequest("urn:altinn:organization:identifier-no:123456789");

        _clientMock
            .Setup(c => c.UploadCorrespondence(It.IsAny<CorrespondenceUploadRequest>()))
            .ReturnsAsync(new CorrespondenceResponse());

        await _service.UploadCorrespondence(request);

        _clientMock.Verify(c =>
            c.UploadCorrespondence(It.Is<CorrespondenceUploadRequest>(r =>
                r.Recipients[0] == "urn:altinn:organization:identifier-no:123456789"
            )),
            Times.Once
        );
    }

    [Fact]
    public async Task UploadCorrespondence_WithMultipleRecipients_ThrowsException()
    {
        var request = CreateValidRequest("urn:altinn:person:identifier-no:01010112345");
        request.Recipients.Add("urn:altinn:organization:identifier-no:123456789");

        var ex = await Assert.ThrowsAsync<BadRequestException>(() =>
            _service.UploadCorrespondence(request)
        );

        Assert.Contains("Exactly one recipient", ex.Message);
        _clientMock.Verify(c => c.UploadCorrespondence(It.IsAny<CorrespondenceUploadRequest>()), Times.Never);
    }

    [Fact]
    public async Task UploadCorrespondence_WithInvalidRecipient_ThrowsException()
    {
        var request = CreateValidRequest("invalid-recipient");

        var ex = await Assert.ThrowsAsync<BadRequestException>(() =>
            _service.UploadCorrespondence(request)
        );

        Assert.Contains("not a valid person or organization URN", ex.Message);
        _clientMock.Verify(c => c.UploadCorrespondence(It.IsAny<CorrespondenceUploadRequest>()), Times.Never);
    }

    [Fact]
    public async Task UploadCorrespondence_WithNoRecipients_ThrowsException()
    {
        var request = CreateValidRequest("urn:altinn:person:identifier-no:01010112345");
        request.Recipients = new List<string>();

        var ex = await Assert.ThrowsAsync<BadRequestException>(() =>
            _service.UploadCorrespondence(request)
        );

        Assert.Contains("Exactly one recipient", ex.Message);
        _clientMock.Verify(c => c.UploadCorrespondence(It.IsAny<CorrespondenceUploadRequest>()), Times.Never);
    }

    [Fact]
    public async Task UploadCorrespondence_WithNoAttachments_ThrowsException()
    {
        var request = CreateValidRequest("urn:altinn:person:identifier-no:01010112345");
        request.AttachmentData = null;

        var ex = await Assert.ThrowsAsync<BadRequestException>(() =>
            _service.UploadCorrespondence(request)
        );

        Assert.Contains("At least 1 attachment", ex.Message);
        _clientMock.Verify(c => c.UploadCorrespondence(It.IsAny<CorrespondenceUploadRequest>()), Times.Never);
    }

    [Fact]
    public async Task UploadCorrespondence_WithInvalidAttachmentType_ThrowsException()
    {
        var request = CreateValidRequest("urn:altinn:person:identifier-no:01010112345");
        request.AttachmentData![0].FileName = "testfile.exe";

        var ex = await Assert.ThrowsAsync<BadRequestException>(() =>
            _service.UploadCorrespondence(request)
        );

        Assert.Contains("not allowed", ex.Message);
        _clientMock.Verify(c => c.UploadCorrespondence(It.IsAny<CorrespondenceUploadRequest>()), Times.Never);
    }
}
