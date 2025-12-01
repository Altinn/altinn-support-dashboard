
using altinn_support_dashboard.Server.Services;
using altinn_support_dashboard.Server.Services.Interfaces;
using altinn_support_dashboard.Server.Validation;
using Microsoft.Extensions.Logging;
using Models.altinn3Dtos;
using Moq;
using System.Text.Json;

namespace AltinnSupportDashboard.Tests.Services;

public class AltinnApiServiceTests
{
	private readonly Mock<AltinnApiClient> _altinn2Client;
	private readonly Mock<Altinn3ApiClient> _altinn3Client;
	private readonly AltinnApiService _service;

	public AltinnApiServiceTests()
	{
		_altinn2Client = new Mock<AltinnApiClient>();
		_altinn3Client = new Mock<Altinn3ApiClient>();

		_service = new AltinnApiService(_altinn2Client.Object, _altinn3Client.Object);
	}

	[Fact]
	public async Task GetOrganizationInfo_InvalidOrg_Throws()
	{
		await Assert.ThrowsAsync<ArgumentException>(() =>
		    _service.GetOrganizationInfo("abc", "tt02"));
	}

	[Fact]
	public async Task GetOrganizationInfo_ValidOrg_DeserializesCorrectly()
	{
		var org = new Organization { OrganizationNumber = "123456789", Name = "TestOrg" };
		string json = JsonSerializer.Serialize(org);

		_altinn2Client.Setup(s => s.GetOrganizationInfo("123456789", "tt02"))
		    .ReturnsAsync(json);

		var result = await _service.GetOrganizationInfo("123456789", "tt02");

		Assert.Equal("123456789", result.OrganizationNumber);
		Assert.Equal("TestOrg", result.Name);
	}

	[Fact]
	public async Task GetOrganizationInfo_NullDeserialization_Throws()
	{
		_altinn2Client.Setup(s => s.GetOrganizationInfo("123456789", "tt02"))
		    .ReturnsAsync("null");

		await Assert.ThrowsAsync<Exception>(() =>
		    _service.GetOrganizationInfo("123456789", "tt02"));
	}

	[Fact]
	public async Task GetOrganizationsByPhoneNumber_InvalidPhone_Throws()
	{
		await Assert.ThrowsAsync<ArgumentException>(() =>
		    _service.GetOrganizationsByPhoneNumber("invalid", "tt02"));
	}

	[Fact]
	public async Task GetOrganizationsByPhoneNumber_StripsCountryCode()
	{
		var orgs = new List<Organization>
	{
	    new Organization { OrganizationNumber = "1" }
	};

		_altinn2Client.Setup(s => s.GetOrganizationsByPhoneNumber("12345678", "tt02"))
		    .ReturnsAsync(JsonSerializer.Serialize(orgs));

		var result = await _service.GetOrganizationsByPhoneNumber("+4712345678", "tt02");

		Assert.Single(result);
	}

	[Fact]
	public async Task GetOrganizationsByPhoneNumber_RemovesDuplicates()
	{
		var orgs = new List<Organization>
	{
	    new Organization { OrganizationNumber = "1" },
	    new Organization { OrganizationNumber = "1" },
	    new Organization { OrganizationNumber = "2" }
	};

		_altinn2Client.Setup(s => s.GetOrganizationsByPhoneNumber("12345678", "tt02"))
		    .ReturnsAsync(JsonSerializer.Serialize(orgs));

		var result = await _service.GetOrganizationsByPhoneNumber("12345678", "tt02");

		Assert.Equal(2, result.Count);
	}

	[Fact]
	public async Task GetOrganizationsByPhoneNumber_NullDeserialization_Throws()
	{
		_altinn2Client.Setup(s => s.GetOrganizationsByPhoneNumber("12345678", "tt02"))
		    .ReturnsAsync("null");

		await Assert.ThrowsAsync<Exception>(() =>
		    _service.GetOrganizationsByPhoneNumber("12345678", "tt02"));
	}

	[Fact]
	public async Task GetOrganizationsByEmail_InvalidEmail_Throws()
	{
		await Assert.ThrowsAsync<ArgumentException>(() =>
		    _service.GetOrganizationsByEmail("invalid@", "tt02"));
	}

	[Fact]
	public async Task GetOrganizationsByEmail_ValidEmail_ReturnsList()
	{
		var orgs = new List<Organization> { new() { OrganizationNumber = "1" } };

		_altinn2Client.Setup(s => s.GetOrganizationsByEmail("test@test.no", "tt02"))
		    .ReturnsAsync(JsonSerializer.Serialize(orgs));

		var result = await _service.GetOrganizationsByEmail("test@test.no", "tt02");

		Assert.Single(result);
	}

	[Fact]
	public async Task GetOrganizationsByEmail_NullDeserialization_Throws()
	{
		_altinn2Client.Setup(s => s.GetOrganizationsByEmail("test@test.no", "tt02"))
		    .ReturnsAsync("null");

		await Assert.ThrowsAsync<Exception>(() =>
		    _service.GetOrganizationsByEmail("test@test.no", "tt02"));
	}


	[Fact]
	public async Task GetPersonalContacts_InvalidOrg_Throws()
	{
		await Assert.ThrowsAsync<ArgumentException>(() =>
		    _service.GetPersonalContacts("0", "tt02"));
	}

	[Fact]
	public async Task GetPersonalContacts_Valid_ReturnsList()
	{
		var contacts = new List<PersonalContact> { new() { Name = "Test" } };

		_altinn2Client.Setup(s => s.GetPersonalContacts("123456789", "tt02"))
		    .ReturnsAsync(JsonSerializer.Serialize(contacts));

		var result = await _service.GetPersonalContacts("123456789", "tt02");

		Assert.Single(result);
		Assert.Equal("Test", result[0].Name);
	}

	[Fact]
	public async Task GetPersonRoles_InvalidSubject_Throws()
	{
		await Assert.ThrowsAsync<ArgumentException>(() =>
		    _service.GetPersonRoles("invalid", "12345678901", "tt02"));
	}


	[Fact]
	public async Task GetOfficialContacts_InvalidOrg_Throws()
	{
		await Assert.ThrowsAsync<ArgumentException>(() =>
		    _service.GetOfficialContacts("bad", "tt02"));
	}


	[Fact]
	public async Task GetPersonalContactsAltinn3_InvalidOrg_Throws()
	{
		await Assert.ThrowsAsync<ArgumentException>(() =>
		    _service.GetPersonalContactsAltinn3("123", "tt02"));
	}

	[Fact]
	public async Task GetPersonalContactsAltinn3_MapsDtoCorrectly()
	{
		var dto = new List<PersonalContactDto>
	{
	    new() {
		Name = "Tester",
		Email = "a@b.no",
		Phone = "12345678",
		NationalIdentityNumber = "12345678901",
		LastChanged = DateTime.Now
	    }
	};

		_altinn3Client.Setup(s => s.GetPersonalContactsAltinn3("123456789", "tt02"))
		    .ReturnsAsync(JsonSerializer.Serialize(dto));

		var result = await _service.GetPersonalContactsAltinn3("123456789", "tt02");

		Assert.Single(result);
		Assert.Equal("Tester", result[0].Name);
		Assert.Equal("a@b.no", result[0].EMailAddress);
	}
}
