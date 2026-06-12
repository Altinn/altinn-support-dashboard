import { authorizedFetch, authorizedPost, getBaseUrl } from "./utils";
import {
  NotificationAdresses,
  OfficialContact,
  PersonalContactAltinn3,
} from "../models/models";
import { RolesAndRights, RolesAndRightsRequest } from "../models/rolesModels";
import { NotificationOrderResponse } from "../models/notificationModels";
import { PolicyRight, PolicyRule, Resource, ResourceSearchResult } from "../models/resourceModels";
import { PartyModel } from "../models/PartyModel";

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

export const fetchRolesForOrg = async (
  environment: string,
  request: RolesAndRightsRequest,
): Promise<RolesAndRights> => {
  const res = await authorizedPost(
    `${getBaseUrl(environment)}/serviceowner/organizations/altinn3/roles`,
    request,
  );
  if (!res.ok) throw new Error((await res.text()) || "Error fetching roles");

  const data = await res.json();
  return data;
};

export const fetchPersonalContacts = async (
  environment: string,
  orgNumber: string,
): Promise<PersonalContactAltinn3[]> => {
  const res = await authorizedFetch(
    `${getBaseUrl(environment)}/serviceowner/organizations/altinn3/personalcontacts/org/${orgNumber}`,
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

export const fetchSsnFromToken = async (
  environment: string,
  ssnToken: string,
): Promise<string> => {
  const res = await authorizedFetch(
    `${getBaseUrl(environment)}/serviceowner/personalcontacts/${ssnToken}/ssn`,
  );

  if (!res.ok)
    throw new Error((await res.text()) || "Error fetching SSN from token");

  const data = await res.json();
  return data.socialSecurityNumber;
};

export const fetchNotificationAddresses = async (
  environment: string,
  orgNumber: string,
): Promise<NotificationAdresses[]> => {
  const res = await authorizedFetch(
    `${getBaseUrl(environment)}/serviceowner/organizations/${orgNumber}/altinn3/notificationaddresses`,
  );

  if (res.status === 404) {
    return [];
  }

  if (!res.ok)
    throw new Error(
      (await res.text()) || "Error fetching Notification addresses",
    );

  const data = await res.json();
  return Array.isArray(data) ? data : [data];
};

export const fetchNotificationByOrderId = async (
  orderId: string,
): Promise<NotificationOrderResponse[] | null> => {
  const res = await authorizedFetch(
    `/api/notifications/orderid/${encodeURIComponent(orderId)}`,
  );

  if (res.status === 404) return null;
  if (!res.ok)
    throw new Error(
      (await res.text()) || "Error fetching notification by orderId",
    );

  return await res.json();
};

export const fetchResources = async (
  environment: string,
  query: string
): Promise<ResourceSearchResult[]> => {
  const res = await authorizedFetch(
    `${getBaseUrl(environment)}/resource/search?resourceTitle=${encodeURIComponent(query)}`,
  );

  if (res.status === 404) return [];
  if (!res.ok) throw new Error((await res.text()) || "Error fetching resources");

  const data = await res.json();
  return Array.isArray(data) ? data : [data];
}

export const fetchResourceByIdentifier = async (
  environment: string,
  identifier: string,
): Promise<Resource | null> => {
  const res = await authorizedFetch(
    `${getBaseUrl(environment)}/resource/${encodeURIComponent(identifier)}`,
  );

  if (res.status === 404) return null;
  if (!res.ok) throw new Error((await res.text()) || "Error fetching resource by identifier");
  return await res.json();
}

export const fetchResourcePolicyRules = async (
  environment: string,
  identifier: string
): Promise<PolicyRule[]> => {
  const res = await authorizedFetch(
    `${getBaseUrl(environment)}/resource/${encodeURIComponent(identifier)}/policy/rules`
  );
  if (res.status === 404) return [];
  if (!res.ok) throw new Error((await res.text()) || "Error fetching policy rules");
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

export const fetchResourcePolicyRights = async (
  environment: string,
  identifier: string
): Promise<PolicyRight[]> => {
  const res = await authorizedFetch(
    `${getBaseUrl(environment)}/resource/${encodeURIComponent(identifier)}/policy/rights`,
  );

  if (res.status === 404) return [];
  if (!res.ok) throw new Error((await res.text()) || "Error fetching policy rights");
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}
export const fetchInternalIds = async (
  query: string,
  environment: string,
): Promise<PartyModel> => {
  const digits = query.replace(/\s/g, "");
  if (digits.length === 11) return fetchInternalIdsFromSsn(digits, environment);
  if (digits.length === 9) return fetchInternalIdsFromOrg(digits, environment);
  throw new Error("Identifikatoren må være 9 siffer (org.nr.) eller 11 siffer (fødselsnummer)");
};

export const fetchInternalIdsFromOrg = async (
  orgNumber: string,
  environment: string,
): Promise<PartyModel> => {
  const res = await authorizedFetch(
    `/api/${environment}/parties/lookup/org/${orgNumber}`,
  );
  if (res.status === 400) throw new Error("Ugyldig organisasjonsnummer");
  if (!res.ok) throw new Error("Feil ved henting av intern ID");

  return await res.json();
};

export const fetchInternalIdsFromSsn = async (
  ssn: string,
  environment: string,
): Promise<PartyModel> => {
  const res = await authorizedFetch(
    `/api/${environment}/parties/lookup/ssn/${ssn}`,
  );
  if (res.status === 400) throw new Error("Ugyldig fødselsnummer");
  if (!res.ok) throw new Error("Feil ved henting av intern ID");

  return await res.json();
};
