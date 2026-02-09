import { authorizedFetch, getBaseUrl } from "./utils";
import { OfficialContact, Role, Subunit } from "../models/models";

//this file defines which which api endpoints we want to fetch data from

export const fetchOrganizations = async (
  environment: string,
  query: string,
) => {
  const trimmedQuery = query.replace(/\s/g, "");

  const res = await authorizedFetch(
    `${getBaseUrl(environment)}/serviceowner/organizations/altinn3/search?query=${encodeURIComponent(trimmedQuery)}`,
  );

  if (res.status === 404) {
    return [];
  }

  if (!res.ok)
    throw new Error((await res.text()) || "Error fetching organizations");

  const data = await res.json();
  return Array.isArray(data) ? data : [data];
};

export const fetchSubunits = async (environment: string, orgNumber: string) => {
  const res = await authorizedFetch(
    `${getBaseUrl(environment)}/brreg/${orgNumber}/underenheter`,
  );

  if (res.status === 404) {
    return [];
  }

  if (!res.ok) throw new Error((await res.text()) || "Error fetching Subunits");

  const data = await res.json();
  if (!data?._embedded?.underenheter) return [];
  return data._embedded.underenheter.map((sub: Subunit) => ({
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

  if (res.status === 404) {
    return [];
  }

  if (!res.ok)
    throw new Error((await res.text()) || "Error fetching PersonalContacts");

  const data = await res.json();

  return Array.isArray(data) ? data : [data];
};

export const fetchERoles = async (environment: string, orgNumber: string) => {
  const res = await authorizedFetch(
    `${getBaseUrl(environment)}/brreg/${orgNumber}`,
  );

  if (res.status === 404) {
    return [];
  }

  if (!res.ok) throw new Error((await res.text()) || "Error fetching ERoles");

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
  if (res.status === 404) {
    return [];
  }

  if (!res.ok)
    throw new Error((await res.text()) || "Error fetching Official contacts");

  const data = await res.json();
  return Array.isArray(data) ? data : [data];
};

export const fetchRolesForOrg = async (
  environment: string,
  ssnToken: string,
  rollegiver: string,
): Promise<Role[]> => {
  const res = await authorizedFetch(
    `${getBaseUrl(environment)}/serviceowner/${ssnToken}/roles/${rollegiver}`,
  );
  if (!res.ok) throw new Error((await res.text()) || "Error fetching roles");

  const data = await res.json();
  return Array.isArray(data) ? data : [];
};

export const fetchSsnFromToken = async (
  environment: string,
  ssnToken: string,
): Promise<string> => {
  const res = await authorizedFetch(
    `${getBaseUrl(environment)}/serviceowner/personalcontacts/${ssnToken}/ssn`,
  );

  if (!res.ok) throw new Error((await res.text()) || "Error fetching SSN from token");

  const data = await res.json();
  return data.socialSecurityNumber;
}
