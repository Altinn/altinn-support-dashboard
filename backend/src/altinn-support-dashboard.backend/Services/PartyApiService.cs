
using System.Text.Json;
using System.Text.Json.Serialization;
using altinn_support_dashboard.Server.Models;
using altinn_support_dashboard.Server.Services.Interfaces;

namespace altinn_support_dashboard.Server.Services;

public class PartyApiService : IPartyApiService
{
    private PartyApiClient _client;
    private JsonSerializerOptions jsonOptions;
    public PartyApiService(PartyApiClient client)
    {

        jsonOptions = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            PropertyNameCaseInsensitive = true
        };
        _client = client;
    }

    public async Task<PartyModel> GetPartyFromOrgAsync(string orgNumber)
    {
        var result = await _client.GetParty(orgNumber, true);

        var party = JsonSerializer.Deserialize<PartyModel>(result, jsonOptions);
        return party;
    }

    public async Task<PartyModel> GetPartyFromSsnAsync(string ssn)
    {

        var result = await _client.GetParty(ssn, false);

        var party = JsonSerializer.Deserialize<PartyModel>(result, jsonOptions);
        return party;
    }

    public async Task<PartyModel> GetPartyFromUuidAsync(string uuid)
    {
        var result = await _client.GetPartyByUuid(uuid);

        var party = JsonSerializer.Deserialize<PartyModel>(result, jsonOptions);

        return party;
    }

    public async Task<string> GetRolesFromPartyAsync(string uuid)
    {
        var result = await _client.GetPartyRoles(uuid);

        return result;
    }

    public async Task<ErRollerModel> GetRolesFromOrgAsync(string orgNumber)
    {
        var resultOrgParty = await _client.GetParty(orgNumber, true);
        var orgParty = JsonSerializer.Deserialize<PartyModel>(resultOrgParty, jsonOptions);

        var resultPartyRoles = await _client.GetPartyRoles(orgParty.PartyUuid);



        using JsonDocument doc = JsonDocument.Parse(resultPartyRoles);
        JsonElement root = doc.RootElement;

        //iterate and add the the party with the roles identifier
        List<(PartyModel party, string identifier)> partyRoles = new();
        foreach (var item in root.GetProperty("data").EnumerateArray())
        {
            string identifier = item.GetProperty("role").GetProperty("identifier").GetString();
            string toUuid = item.GetProperty("to").GetProperty("partyUuid").GetString();
            var partyResult = await _client.GetPartyByUuid(toUuid);
            var party = JsonSerializer.Deserialize<PartyModel>(partyResult, jsonOptions);

            partyRoles.Add((party, identifier));
        }



        //construct and map the data found to the erRollermodel
        var erRollerModel = new ErRollerModel
        {
            Rollegrupper = new List<Rollegrupper>()
        };

        foreach (var item in partyRoles)
        {
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
