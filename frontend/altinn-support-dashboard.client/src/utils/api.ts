import { authorizedFetch, getBaseUrl } from "./utils";
import { OfficialContact, Role } from "../models/models";

//this file defines which which api endpoints we want to fetch data from

export const fetchOrganizations = async (
  environment: string,
  query: string,
) => {
  var trimmedQuery = query.replace(/\s/g, "");

  const res = await authorizedFetch(
    `${getBaseUrl(environment)}/serviceowner/organizations/search?query=${encodeURIComponent(trimmedQuery)}`,
  );
  const data = await res.json();
  return Array.isArray(data) ? data : [data];
};

export const fetchSubunits = async (environment: string, orgNumber: string) => {
  const res = await authorizedFetch(
    `${getBaseUrl(environment)}/brreg/${orgNumber}/underenheter`,
  );
  const data = await res.json();
  if (!data?._embedded?.underenheter) return [];
  return data._embedded.underenheter.map((sub: any) => ({
    navn: sub.navn,
    organisasjonsnummer: sub.organisasjonsnummer,
    overordnetEnhet: sub.overordnetEnhet,
    type: sub.organisasjonsform?.kode,
  }));
};

export const fetchPersonalContacts = async (
  environment: string,
  orgNumber: string,
) => {
  const res = await authorizedFetch(
    `${getBaseUrl(environment)}/serviceowner/organizations/${orgNumber}/personalcontacts`,
  );
  const data = await res.json();

  return Array.isArray(data) ? data : [data];
};

export const fetchERoles = async (environment: string, orgNumber: string) => {
  const res = await authorizedFetch(
    `${getBaseUrl(environment)}/brreg/${orgNumber}`,
  );
  const data = await res.json();
  return data.rollegrupper;
};

export const fetchOfficialContacts = async (
  environment: string,
  orgNumber: string,
): Promise<OfficialContact[]> => {
  const res = await authorizedFetch(
    `${getBaseUrl(environment)}/serviceowner/organizations/${orgNumber}/officialcontacts`,
  );
  const data = await res.json();
  return Array.isArray(data) ? data : [data];
};

export const fetchRolesForOrg = async (
  environment: string,
  rollehaver: string,
  rollegiver: string,
): Promise<Role[]> => {
  const res = await authorizedFetch(
    `${getBaseUrl(environment)}/serviceowner/${rollehaver}/roles/${rollegiver}`,
  );

  if (!res.ok) throw new Error((await res.text()) || "Error fetching roles");

  const data = await res.json();
  return Array.isArray(data) ? data : [];
};
