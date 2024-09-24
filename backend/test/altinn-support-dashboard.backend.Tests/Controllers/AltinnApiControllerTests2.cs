using altinn_support_dashboard.Server.Services.Interfaces;
using AltinnSupportDashboard.Controllers;
using Microsoft.AspNetCore.Mvc;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace altinn_support_dashboard.backend.Tests.Controllers
{
    public class AltinnApiControllerTests2
    {
        private readonly Altinn_Intern_APIController _controller;
        private readonly Mock<IAltinnApiService> _mockService;

        public AltinnApiControllerTests2()
        {
            _mockService = new Mock<IAltinnApiService>();
            _controller = new Altinn_Intern_APIController(_mockService.Object);
        }

        [Fact]
        public void TestGetOrganizationInfo()
        {
            // Arrange
            string orgNumber = "123456789";
            Organization organization = new Organization
            {
                Name = "Test Organization",
                OrganizationNumber = orgNumber,
                Type = "ORGL",
                LastChanged = DateTime.Now,
                LastConfirmed = DateTime.Now,
                Links = new List<OrganizationLink>
                {
                    new OrganizationLink
                    {
                        Rel = "Test Rel",
                        Href = "Test Href",
                        Title = "Test Title",
                        FileNameWithExtension = "Test FileNameWithExtension",
                        MimeType = "Test MimeType",
                        IsTemplated = true,
                        Encrypted = true,
                        SigningLocked = true,
                        SignedByDefault = true,
                        FileSize = 123
                    }
                }
            };
            _mockService.Setup(service => service.GetOrganizationInfo(orgNumber)).ReturnsAsync(organization);

            // Act
            var result = _controller.GetOrganizationInfo(orgNumber).Result as OkObjectResult;

            // Assert
            Assert.Equal(organization, result.Value);
        }

        }
    
}
