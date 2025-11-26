import { useState, useEffect } from "react";
import {
  PersonalContact,
  ERRole,
  Role,
  OfficialContact,
} from "../models/models";
import { getFormattedDateTime, fetchUserDetails } from "../utils/utils";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import {
  fetchERoles,
  fetchOfficialContacts,
  fetchOrganizations,
  fetchPersonalContacts,
  fetchRolesForOrg,
  fetchSubunits,
} from "../utils/api";

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
  const contactsQuery: UseQueryResult<PersonalContact[], Error> = useQuery({
    queryKey: ["contacts", environment, orgNumber],
    queryFn: () => fetchPersonalContacts(environment, orgNumber!),
    enabled: !!orgNumber,
  });

  const ERolesQuery: UseQueryResult<ERRole[], Error> = useQuery({
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

  return { contactsQuery, ERolesQuery, officialContactsQuery };
}

export const useRoles = (
  environment: string,
  subject?: string,
  reportee?: string,
) => {
  const rolesQuery: UseQueryResult<Role[], Error> = useQuery({
    queryKey: ["roles", environment, subject, reportee],
    queryFn: () => fetchRolesForOrg(environment, subject!, reportee!),
    enabled: !!subject && !!reportee, // only run if both exist
  });

  return rolesQuery;
};

export function UseManualRoleSearch(
  rollehaver: string,
  rollegiver: string,
  environment: string,
) {
  return useQuery({
    queryKey: ["manualroles", environment, rollehaver, rollegiver],
    queryFn: async () => fetchRolesForOrg(environment, rollehaver, rollegiver),
    enabled: !!rollehaver && !!rollegiver,
  });
}
