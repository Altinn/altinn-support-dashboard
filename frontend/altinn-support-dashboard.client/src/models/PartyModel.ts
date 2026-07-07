export interface PartyModel {
  partyId: number;
  partyUuid: string;
  userId?: string;
  orgNumber?: string;
  ssn?: string;
  name?: string;
  person?: PartyPerson;
}
export interface PartyPerson {
  firstName?: string;
  middleName?: string;
  lastName?: string;
}
