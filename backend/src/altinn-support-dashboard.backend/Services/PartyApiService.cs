
using System.Text.Json;
using System.Text.Json.Serialization;
using altinn_support_dashboard.Server.Models;
using altinn_support_dashboard.Server.Services.Interfaces;

namespace altinn_support_dashboard.Server.Services;

public class PartyApiService : IPartyApiService
{
    private IPartyApiClient _client;
    private JsonSerializerOptions jsonOptions;
    public PartyApiService(IPartyApiClient client)
    {

        jsonOptions = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            PropertyNameCaseInsensitive = true
        };
        _client = client;
    }

    public async Task<PartyModel> GetPartyFromOrgAsync(string orgNumber, string environmentName)
    {
        var result = await _client.GetParty(orgNumber, true, environmentName);

        var party = JsonSerializer.Deserialize<PartyModel>(result, jsonOptions);
        if (party == null)
        {
            throw new Exception("Party not valid");
        }
        return party;
    }

    public async Task<PartyModel> GetPartyFromSsnAsync(string ssn, string environmentName)
    {

        var partyResult = await _client.GetParty(ssn, false, environmentName);
        var party = JsonSerializer.Deserialize<PartyModel>(partyResult, jsonOptions);
        if (party == null)
        {
            throw new Exception("Party not valid");
        }

        var userInformationResult = await _client.GetPartyWithUserInformationByUuid(party.PartyUuid, environmentName);
        var userInformation = JsonSerializer.Deserialize<PartyUserInformationDto>(userInformationResult, jsonOptions);

        party.UserId = userInformation?.User?.UserId;

        return party;
    }

    public async Task<PartyModel> GetPartyByUuidAsync(string uuid, string environmentName)
    {
        var result = await _client.GetPartyByUuid(uuid, environmentName);

        var party = JsonSerializer.Deserialize<PartyModel>(result, jsonOptions);

        if (party == null)
        {
            throw new Exception("Party not valid");
        }

        var userInformationResult = await _client.GetPartyWithUserInformationByUuid(party.PartyUuid, environmentName);
        var userInformation = JsonSerializer.Deserialize<PartyUserInformationDto>(userInformationResult, jsonOptions);

        party.UserId = userInformation?.User?.UserId;

        return party;
    }

    public async Task<PartyModel> GetPartyByIdAsync(string partyId, string environmentName)
    {
        var result = await _client.GetPartyByid(partyId, environmentName);

        var party = JsonSerializer.Deserialize<PartyModel>(result, jsonOptions);

        if (party == null)
        {
            throw new Exception("Party not valid");
        }

        var userInformationResult = await _client.GetPartyWithUserInformationByUuid(party.PartyUuid, environmentName);
        var userInformation = JsonSerializer.Deserialize<PartyUserInformationDto>(userInformationResult, jsonOptions);

        party.UserId = userInformation?.User?.UserId;

        return party;
    }

    public async Task<string> GetRolesFromPartyAsync(string uuid, string environmentName)
    {
        var result = await _client.GetPartyRoles(uuid, environmentName);

        return result;
    }

    public async Task<ErRollerModel> GetRolesFromOrgAsync(string orgNumber, string environmentName)
    {
        var resultOrgParty = await _client.GetParty(orgNumber, true, environmentName);
        var orgParty = JsonSerializer.Deserialize<PartyModel>(resultOrgParty, jsonOptions);

        if (orgParty == null)
        {
            throw new Exception("OrgParty not valid");
        }

        var resultPartyRoles = await _client.GetPartyRoles(orgParty.PartyUuid, environmentName);



        using JsonDocument doc = JsonDocument.Parse(resultPartyRoles);
        JsonElement root = doc.RootElement;

        //iterate and add the the party with the roles identifier
        List<(PartyModel party, string identifier)> partyRoles = new();
        foreach (var item in root.GetProperty("data").EnumerateArray())
        {
            string identifier = item.GetProperty("role").GetProperty("identifier").GetString() ?? "";
            string toUuid = item.GetProperty("to").GetProperty("partyUuid").GetString() ?? "";
            var partyResult = await _client.GetPartyByUuid(toUuid, environmentName);
            var party = JsonSerializer.Deserialize<PartyModel>(partyResult, jsonOptions);

            if (party == null || String.IsNullOrEmpty(identifier))
            {
                continue;
            }

            partyRoles.Add((party, identifier));
        }



        //construct and map the data found to the erRollermodel
        var erRollerModel = new ErRollerModel
        {
            Rollegrupper = new List<Rollegrupper>()
        };

        foreach (var item in partyRoles)
        {
            if (item.party.Person == null)
            {
                continue;
            }

            var rolle = new Roller
            {
                Type = new Models.Type
                {
                    Beskrivelse = item.identifier
                },
                Enhet = new Enhet
                {
                    Organisasjonsnummer = orgNumber
                },
                Person = new Person
                {
                    Fodselsdato = item.party.Ssn,
                    ErDoed = false,
                    Navn = new Navn
                    {
                        Fornavn = item.party.Person.FirstName,
                        Mellomnavn = item.party.Person.MiddleName,
                        Etternavn = item.party.Person.LastName,
                    }

                }
            };

            erRollerModel.Rollegrupper.Add(new Rollegrupper
            {
                Roller = new List<Roller> { rolle }
            });
        }


        return erRollerModel;
    }

}
