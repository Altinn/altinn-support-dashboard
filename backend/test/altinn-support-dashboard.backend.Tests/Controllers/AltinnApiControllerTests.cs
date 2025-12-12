using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;
using System.Threading.Tasks;
using altinn_support_dashboard.Server.Models;
using altinn_support_dashboard.Server.Services.Interfaces;
using AltinnSupportDashboard.Controllers;
using Microsoft.VisualBasic;
using Models.altinn3Dtos;

namespace altinn_support_dashboard.backend.Tests.Controllers
{
    public class AltinnApiControllerTests
    {
        private readonly AltinnTT02Controller _controller;
        private readonly Mock<IAltinnApiService> _mockService;

        public AltinnApiControllerTests()
        {
            _mockService = new Mock<IAltinnApiService>();
            _controller = new AltinnTT02Controller(_mockService.Object);
        }

        [Fact]
        public async Task GetOrganizationInfo_ReturnsInfo_WhenOrgNumberIsValid()
        {
           var validOrgNumber = "123456789";
           var expectedResult = new Organization
           {
               OrganizationNumber = validOrgNumber,
               Name = "Test Organization"
           };   
           _mockService
           .Setup(x => x.GetOrganizationInfo(validOrgNumber, "TT02"))
           .ReturnsAsync(expectedResult);

           var result = await _controller.GetOrganizationInfo(validOrgNumber);

           Assert.NotNull(result);
           var okResult = Assert.IsType<OkObjectResult>(result);
           Assert.Equal(expectedResult, okResult.Value);
        }

        [Fact]
        public async Task GetOrganizationInfo_Returns500_WhenServiceFails()
        {
            var validOrgNumber = "123456789";
            _mockService
            .Setup(x => x.GetOrganizationInfo(validOrgNumber, "TT02"))
            .ThrowsAsync(new System.Exception("Service failure"));

            var result = await _controller.GetOrganizationInfo(validOrgNumber);

            var objectResult = Assert.IsType<ObjectResult>(result);
            Assert.Equal(500, objectResult.StatusCode);
        }

        [Theory]
        [InlineData("")]
        [InlineData("999")]
        [InlineData("12345678")]
        [InlineData("1234567890")]
        [InlineData("abcdefghi")]
        [InlineData("abcdefghij")]
        [InlineData("1d2d3d4d5")]
        [InlineData("   ")]
        public async Task GetOrganizationInfo_ReturnsBadRequest_WhenOrgNumberIsInvalid(string invalidOrgNumber)
        {
            // Act
            var result = await _controller.GetOrganizationInfo(invalidOrgNumber);
            
            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Organisasjonsnummeret er ugyldig. Det må være 9 sifre langt.", badRequestResult.Value);
        }

        [Fact]
        public async Task GetOrganizationsByPhoneNumber_ReturnsOrganizations_WhenPhoneNumberIsValid()
        {
            var validPhoneNumber = "+4712345678";
            var expectedOrganizations = new List<Organization>
            {
                new Organization { OrganizationNumber = "123456789", Name = "Org1" },
                new Organization { OrganizationNumber = "987654321", Name = "Org2" }
            };

            _mockService
            .Setup(x => x.GetOrganizationsByPhoneNumber(validPhoneNumber, "TT02"))
            .ReturnsAsync(expectedOrganizations);

            var result = await _controller.GetOrganizationsByPhoneNumber(validPhoneNumber);

            Assert.NotNull(result);
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(expectedOrganizations, okResult.Value);
        }

        [Fact]
        public async Task GetOrganizationsByPhoneNumber_Returns500_WhenServiceFails()
        {
            var validPhoneNumber = "+4712345678";

            _mockService
            .Setup(x => x.GetOrganizationsByPhoneNumber(validPhoneNumber, "TT02"))
            .ThrowsAsync(new System.Exception("Service failure"));

            var result = await _controller.GetOrganizationsByPhoneNumber(validPhoneNumber);

            var objectResult = Assert.IsType<ObjectResult>(result);
            Assert.Equal(500, objectResult.StatusCode);
        }

        [Theory]
        [InlineData("")]
        [InlineData("123-4567")]
        [InlineData("phone123")]
        [InlineData("12345678A")]
        [InlineData("+47-123-45678")]
        [InlineData("+47 123 45678")]
        [InlineData("(123) 4567890")]
        [InlineData("++4712345678")]
        [InlineData("+ ")]
        [InlineData("   ")]
        public async Task GetOrganizationsByPhoneNumber_ReturnsBadRequest_WhenPhoneNumberIsInvalid(string invalidPhonenumber)
        {

            // Act
            var result = await _controller.GetOrganizationsByPhoneNumber(invalidPhonenumber);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Telefonnummeret er ugyldig. Det kan ikke være tomt.", badRequestResult.Value);
        }

        [Fact]
        public async Task GetOrganizationsByEmail_ReturnsOrganizations_WhenEmailIsValid()
        {
            var validEmail = "test@test.no";
            var expectedOrganizations = new List<Organization>
            {
                new Organization { OrganizationNumber = "123456789", Name = "Org1" },
                new Organization { OrganizationNumber = "987654321", Name = "Org2" }
            };

            _mockService
            .Setup(x => x.GetOrganizationsByEmail(validEmail, "TT02"))
            .ReturnsAsync(expectedOrganizations);

            var result = await _controller.GetOrganizationsByEmail(validEmail);

            Assert.NotNull(result);
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(expectedOrganizations, okResult.Value);
        }

        [Fact]
        public async Task GetOrganizationsByEmail_Returns500_WhenServiceFails()
        {
            var validEmail = "test@test.no";
            _mockService
            .Setup(x => x.GetOrganizationsByEmail(validEmail, "TT02"))
            .ThrowsAsync(new System.Exception("Service failure"));

            var result = await _controller.GetOrganizationsByEmail(validEmail);

            var objectResult = Assert.IsType<ObjectResult>(result);
            Assert.Equal(500, objectResult.StatusCode);
        }

        [Theory]
        [InlineData("invalid-email")]
        [InlineData("test@.com")]
        [InlineData("test@test")]
        [InlineData("test@@test")]
        [InlineData("@")]
        [InlineData("")]
        [InlineData("   ")]
        public async Task GetOrganizationsByEmail_ReturnsBadRequest_WhenEmailIsInvalid(string invalidEmail)
        {
            // Act
            var result = await _controller.GetOrganizationsByEmail(invalidEmail);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("E-postadressen er ugyldig.", badRequestResult.Value);
        }

        [Fact]
        public async Task GetPersonalContacts_ReturnsContacts_WhenOrgNumberIsValid()
        {
            var validOrgNumber = "123456789";
            var expectedContacts = new List<PersonalContact>
            {
                new PersonalContact { Name = "Contact1", EMailAddress = "contact1@test.no" },
                new PersonalContact { Name = "Contact2", EMailAddress = "contact2@test.no" }
            };

            _mockService
            .Setup(x => x.GetPersonalContacts(validOrgNumber, "TT02"))
            .ReturnsAsync(expectedContacts);

            var result = await _controller.GetPersonalContacts(validOrgNumber);

            Assert.NotNull(result);
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(expectedContacts, okResult.Value);
        }

        [Fact]
        public async Task GetPersonalContacts_Returns500_WhenServiceFails()
        {
            var validOrgNumber = "123456789";

            _mockService
            .Setup(x => x.GetPersonalContacts(validOrgNumber, "TT02"))
            .ThrowsAsync(new System.Exception("Service failure"));

            var result = await _controller.GetPersonalContacts(validOrgNumber);

            var objectResult = Assert.IsType<ObjectResult>(result);
            Assert.Equal(500, objectResult.StatusCode);
        }

        [Theory]
        [InlineData("")]
        [InlineData("999")]
        [InlineData("12345678")]
        [InlineData("1234567890")]
        [InlineData("abcdefghi")]
        [InlineData("abcdefghij")]
        [InlineData("1d2d3d4d5")]
        [InlineData("   ")]
        public async Task GetPersonalContacts_ReturnsBadRequest_WhenOrgNumberIsInvalid(string invalidOrgNumber)
        {
            // Act
            var result = await _controller.GetPersonalContacts(invalidOrgNumber);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Organisasjonsnummeret er ugyldig. Det må være 9 sifre langt.", badRequestResult.Value);
        }

        [Fact]
        public async Task Search_ReturnsBadRequest_WhenQueryIsEmpty()
        {
            var result = await _controller.Search("");

            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Søketerm kan ikke være tom.", badRequestResult.Value);
        }

        [Theory]
        [InlineData("123456789")]
        [InlineData("+4712345678")]
        [InlineData("test@test.no")]
        public async Task Search_CallsService_WhenQueryIsValid(string validQuery)
        {
            _mockService
            .Setup(x => x.GetOrganizationInfo(It.IsAny<string>(), "TT02"))
            .ReturnsAsync(new Organization());

            _mockService
            .Setup(x => x.GetOrganizationsByPhoneNumber(It.IsAny<string>(), "TT02"))
            .ReturnsAsync(new List<Organization>());

            _mockService
            .Setup(x => x.GetOrganizationsByEmail(It.IsAny<string>(), "TT02"))
            .ReturnsAsync(new List<Organization>());

            var result = await _controller.Search(validQuery);

            Assert.NotNull(result);
            Assert.IsType<OkObjectResult>(result);
        }

        [Theory]
        [InlineData("test.no")]
        [InlineData("123-4567")]
        [InlineData("phone123")]
        [InlineData("12345678A")]
        [InlineData("+47-123-45678")]
        [InlineData("+47 123 45678")]
        [InlineData("(123) 4567890")]
        [InlineData("++4712345678")]
        [InlineData("+ ")]
        [InlineData("   ")]
        [InlineData("invalid-email")]
        [InlineData("test@.com")]
        [InlineData("test@test")]
        [InlineData("test@@test")]
        [InlineData("@")]
        [InlineData("abcdefghi")]
        [InlineData("abcdefghij")]
        [InlineData("1d2d3d4d5")]
        public async Task Search_ReturnsBadRequest_WhenQueryIsInvalid(string invalidQuery)
        {
            var result = await _controller.Search(invalidQuery);

            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Ugyldig søketerm. Angi et gyldig organisasjonsnummer, telefonnummer eller e-postadresse.", badRequestResult.Value);
        }

        [Fact]
        public async Task GetPersonRoles_ReturnsRoles_WhenSubjectAndReporteeIsValid()
        {
            var validSubjectId = "123456789";
            var validReporteeId = "987654321";
            var expectedRoles = new List<Role>
            {
                new Role { RoleName = "Role1" },
                new Role { RoleName = "Role2" }
            };

            _mockService
            .Setup(x => x.GetPersonRoles(validSubjectId, validReporteeId, "TT02"))
            .ReturnsAsync(expectedRoles);

            var result = await _controller.GetPersonRoles(validSubjectId, validReporteeId);

            Assert.NotNull(result);
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(expectedRoles, okResult.Value);
        }

        [Fact]
        public async Task GetPersonRoles_Returns500_WhenServiceFails()
        {
            var validSubjectId = "123456789";
            var validReporteeId = "987654321";

            _mockService
            .Setup(x => x.GetPersonRoles(validSubjectId, validReporteeId, "TT02"))
            .ThrowsAsync(new System.Exception("Service failure"));

            var result = await _controller.GetPersonRoles(validSubjectId, validReporteeId);

            var objectResult = Assert.IsType<ObjectResult>(result);
            Assert.Equal(500, objectResult.StatusCode);
        }

        [Theory]
        [InlineData("", "12345678901")]
        [InlineData("123456789", "")]
        [InlineData("abcde", "12345678901")]
        [InlineData("1234569", "1234567")]
        [InlineData("abcdefghi", "reportee!@#")]
        public async Task GetPersonRoles_ReturnsBadRequest_WhenSubjectOrReporteeIsInvalid(string invalidSubject, string invalidReportee)
        {
            var result = await _controller.GetPersonRoles(invalidSubject, invalidReportee);

            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Subject eller reportee er ugyldig.", badRequestResult.Value);
        }

        [Fact]
        public async Task GetOfficialContacts_ReturnsContacts_WhenOrgNumberIsValid()
        {
            var validOrgNumber = "123456789";
            var expectedContacts = new List<OfficialContact>
            {
                new OfficialContact { EMailAddress = "official1@example.com" },
                new OfficialContact { EMailAddress = "official2@example.com" }
            };

            _mockService
            .Setup(x => x.GetOfficialContacts(validOrgNumber, "TT02"))
            .ReturnsAsync(expectedContacts);

            var result = await _controller.GetOfficialContacts(validOrgNumber);

            Assert.NotNull(result);
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(expectedContacts, okResult.Value);
        }

        [Fact]
        public async Task GetOfficialContacts_Returns500_WhenServiceFails()
        {
            var validOrgNumber = "123456789";

            _mockService
            .Setup(x => x.GetOfficialContacts(validOrgNumber, "TT02"))
            .ThrowsAsync(new System.Exception("Service failure"));

            var result = await _controller.GetOfficialContacts(validOrgNumber);

            var objectResult = Assert.IsType<ObjectResult>(result);
            Assert.Equal(500, objectResult.StatusCode);
        }

        [Theory]
        [InlineData("")]
        [InlineData("999")]
        [InlineData("12345678")]
        [InlineData("1234567890")]
        [InlineData("abcdefghi")]
        [InlineData("abcdefghij")]
        [InlineData("1d2d3d4d5")]
        [InlineData("   ")]
        public async Task GetOfficialContacts_ReturnsBadRequest_WhenOrgNumberIsInvalid(string invalidOrgNumber)
        {
            var result = await _controller.GetOfficialContacts(invalidOrgNumber);

            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Organisasjonsnummeret er ugyldig. Det må være 9 sifre langt.", badRequestResult.Value);
        }

        [Fact]
        public async Task GetPersonalContactsAltinn3_ReturnsRoles_WhenOrgNumberIsValid()
        {
            var validOrgNumber = "123456789";
            var expectedContacts = new List<PersonalContact>
            {
                new PersonalContact { Name = "Contact1", EMailAddress = "contact1@test.no" },
                new PersonalContact { Name = "Contact2", EMailAddress = "contact2@test.no" }
            };

            _mockService
            .Setup(x => x.GetPersonalContactsAltinn3(validOrgNumber, "TT02"))
            .ReturnsAsync(expectedContacts);

            var result = await _controller.GetPersonalContactsAltinn3(validOrgNumber);

            Assert.NotNull(result);
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(expectedContacts, okResult.Value);
        }

        [Fact]
        public async Task GetPersonalContactsAltinn3_Returns500_WhenServiceFails()
        {
            var validOrgNumber = "123456789";

            _mockService
            .Setup(x => x.GetPersonalContactsAltinn3(validOrgNumber, "TT02"))
            .ThrowsAsync(new System.Exception("Service failure"));

            var result = await _controller.GetPersonalContactsAltinn3(validOrgNumber);

            var objectResult = Assert.IsType<ObjectResult>(result);
            Assert.Equal(500, objectResult.StatusCode);
        }

        [Theory]
        [InlineData("")]
        [InlineData("999")]
        [InlineData("12345678")]
        [InlineData("1234567890")]
        [InlineData("abcdefghi")]
        [InlineData("abcdefghij")]
        [InlineData("1d2d3d4d5")]
        [InlineData("   ")]
        public async Task GetPersonalContactsAltinn3_ReturnsBadRequest_WhenOrgNumberIsInvalid(string invalidOrgNumber)
        {
            var result = await _controller.GetPersonalContactsAltinn3(invalidOrgNumber);

            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Organisasjonsnummeret er ugyldig. Det må være 9 sifre langt.", badRequestResult.Value);
        }

        [Fact]
        public async Task GetNotificationAddresses_ReturnsAddresses_WhenOrgNumberIsValid()
        {
            var validOrgNumber = "123456789";
            var expectedAddresses = new List<NotificationAddressDto>
            {
                new NotificationAddressDto { 
                    NotificationAddressId = 1,
                    CountryCode = "NO",
                    Email = "address1@test.no" ,
                    Phone = "12345678",
                    SourceOrgNumber = "123456789",
                    RequestedOrgNumber = "123456789"
                }
            };

            _mockService
            .Setup(x => x.GetNotificationAddressesAltinn3(validOrgNumber, "TT02"))
            .ReturnsAsync(expectedAddresses);

            var result = await _controller.GetNotificationAddresses(validOrgNumber);

            Assert.NotNull(result);
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(expectedAddresses, okResult.Value);
        }

        [Fact]
        public async Task GetNotificationAddresses_Returns500_WhenServiceFails()
        {
            var validOrgNumber = "123456789";

            _mockService
            .Setup(x => x.GetNotificationAddressesAltinn3(validOrgNumber, "TT02"))
            .ThrowsAsync(new System.Exception("Service failure"));

            var result = await _controller.GetNotificationAddresses(validOrgNumber);

            var objectResult = Assert.IsType<ObjectResult>(result);
            Assert.Equal(500, objectResult.StatusCode);
        }

        [Theory]
        [InlineData("")]
        [InlineData("999")]
        [InlineData("12345678")]
        [InlineData("1234567890")]
        [InlineData("abcdefghi")]
        [InlineData("abcdefghij")]
        [InlineData("1d2d3d4d5")]
        [InlineData("   ")]
        public async Task GetNotificationAddresses_ReturnsBadRequest_WhenOrgNumberIsInvalid(string invalidOrgNumber)
        {
            var result = await _controller.GetNotificationAddresses(invalidOrgNumber);

            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Organisasjonsnummeret er ugyldig. Det må være 9 sifre langt.", badRequestResult.Value);
        }
    }
}
