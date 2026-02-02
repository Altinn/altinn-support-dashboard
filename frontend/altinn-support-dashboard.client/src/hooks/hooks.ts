import { useState, useEffect } from "react";
import {
  Role,
  OfficialContact,
  ERRoles,
  NotificationAdresses,
  PersonalContactAltinn3,
} from "../models/models";
import { getFormattedDateTime, fetchUserDetails } from "../utils/utils";
import { useMutation, useQuery, UseQueryResult } from "@tanstack/react-query";
import {
  fetchERoles,
  fetchNotificationAddresses,
  fetchOfficialContacts,
  fetchOrganizations,
  fetchPersonalContacts,
  fetchRolesForOrg,
  fetchSsnFromToken,
  fetchSubunits,
} from "../utils/api";
import {
  CorrespondenceResponse,
  CorrespondenceUploadRequest,
} from "../models/correspondenceModels";
import { sendCorrespondence } from "../utils/correspondenceApi";
import { toast } from "react-toastify";
import { RolesAndRights, RolesAndRightsRequest } from "../models/rolesModels";

export function useUserDetails() {
  const [userName, setUserName] = useState("Du er ikke innlogget");
  const [userEmail, setUserEmail] = useState("");
  useEffect(() => {
    fetchUserDetails().then(({ name, email }) => {
      setUserName(name);
      setUserEmail(email);
    });
  }, []);
  return { userName, userEmail };
}

export function useCurrentDateTime() {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  const { formattedTime, formattedDate } =
    getFormattedDateTime(currentDateTime);
  return { currentDateTime, formattedTime, formattedDate };
}

export function useOrgSearch(environment: string, query: string) {
  const orgQuery = useQuery({
    queryKey: ["organizations", environment, query],
    queryFn: () => fetchOrganizations(environment, query),
    enabled: !!query, // only run when query is non-empty
  });

  const subunitQuery = useQuery({
    queryKey: ["subunits", environment, query],
    queryFn: async () => {
      if (!orgQuery.data) return [];
      const mainUnits = orgQuery.data.filter(
        (org) => org.type !== "BEDR" && org.type !== "AAFY",
      );
      const all = await Promise.all(
        mainUnits.map((org) =>
          fetchSubunits(environment, org.organizationNumber),
        ),
      );
      return all.flat();
    },
    enabled: !!orgQuery.data, // wait until organizations are fetched
  });

  return {
    orgQuery,
    subunitQuery,
  };
}

export function useOrgDetails(environment: string, orgNumber?: string) {
  const contactsQuery: UseQueryResult<PersonalContactAltinn3[], Error> = useQuery({
    queryKey: ["contacts", environment, orgNumber],
    queryFn: () => fetchPersonalContacts(environment, orgNumber!),
    enabled: !!orgNumber,
  });

  const ERolesQuery: UseQueryResult<ERRoles[], Error> = useQuery({
    queryKey: ["erroles", environment, orgNumber],
    queryFn: () => fetchERoles(environment, orgNumber!),
    enabled: !!orgNumber,
  });
  const officialContactsQuery: UseQueryResult<OfficialContact[], Error> =
    useQuery({
      queryKey: ["officialContacts", environment, orgNumber],
      queryFn: () => fetchOfficialContacts(environment, orgNumber!),
      enabled: !!orgNumber,
    });

    const notificationAdressesQuery: UseQueryResult<NotificationAdresses[], Error> =
    useQuery({
      queryKey: ["notificationAdresses", environment, orgNumber],
      queryFn: () => fetchNotificationAddresses(environment, orgNumber!),
      enabled: !!orgNumber,
    });

  return { contactsQuery, ERolesQuery, officialContactsQuery, notificationAdressesQuery };
}

export const useRoles = (
  environment: string,
  request: RolesAndRightsRequest,
) => {
  const rolesQuery: UseQueryResult<RolesAndRights[], Error> = useQuery({
    queryKey: ["roles", environment, request],
    queryFn: () => fetchRolesForOrg(environment, request),
    enabled:
      !!request.partyFilter &&
      !!request.value &&
      !!(request.partyFilter.length >= 1), // only run if both exist
  });

  return rolesQuery;
};

export const useSsnFromToken = (environment: string, ssnToken?: string) => {
  return useQuery({
    queryKey: ["ssn", environment, ssnToken],
    queryFn: () => fetchSsnFromToken(environment, ssnToken!),
    enabled: false && !!ssnToken, // only run if ssnToken exists and manuallyenabled
    staleTime: 0, // always refetch to ensure ssn is fresh
  });
};

export const useCorrespondencePost = () => {
  return useMutation<
    CorrespondenceResponse,
    Error,
    CorrespondenceUploadRequest
  >({
    mutationFn: sendCorrespondence,
    onSuccess: () => {
      toast.info("Melding sendt");
    },
    onError: (err) => {
      toast.error(`Feil under sending av melding ${err.message}`);
    },
  });
};
