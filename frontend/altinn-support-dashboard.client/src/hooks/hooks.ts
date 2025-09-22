import { useState, useEffect, useCallback } from "react";
import {
  Organization,
  PersonalContact,
  Subunit,
  ERRole,
  Role,
} from "../models/models";
import {
  getBaseUrl,
  authorizedFetch,
  getFormattedDateTime,
  fetchUserDetails,
} from "../utils/utils";
import { useAppStore } from "./Appstore";
import { useQuery } from "@tanstack/react-query";
import {
  fetchOfficialContacts,
  fetchOrganizations,
  fetchPersonalContacts,
  fetchRoles,
  fetchSubunits,
} from "../utils/api";

export function useDarkMode() {
  const isDarkMode = useAppStore((state) => state.isDarkMode);
  const setIsDarkMode = useAppStore((state) => state.setIsDarkMode);

  return { isDarkMode, setIsDarkMode };
}

export function useEnvironment() {
  const [environment, setEnvironment] = useState("PROD");
  const [isEnvDropdownOpen, setIsEnvDropdownOpen] = useState(false);
  const toggleEnvDropdown = () => setIsEnvDropdownOpen((prev) => !prev);
  const handleEnvChange = (env: string) => {
    setIsEnvDropdownOpen(false);
    useAppStore((state) => state.setEnvironment(env));
  };
  return { environment, isEnvDropdownOpen, toggleEnvDropdown, handleEnvChange };
}

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
  console.log(orgNumber);
  const contactsQuery = useQuery({
    queryKey: ["contacts", environment, orgNumber],
    queryFn: () => fetchPersonalContacts(environment, orgNumber!),
    enabled: !!orgNumber,
  });

  const rolesQuery = useQuery({
    queryKey: ["roles", environment, orgNumber],
    queryFn: () => fetchRoles(environment, orgNumber!),
    enabled: !!orgNumber,
  });
  const officialContactsQuery = useQuery({
    queryKey: ["officialContacts", environment, orgNumber],
    queryFn: () => fetchOfficialContacts(environment, orgNumber!),
    enabled: !!orgNumber,
  });

  return { contactsQuery, rolesQuery, officialContactsQuery };
}

export const UseManualRoleSearch = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const environment = useAppStore((state) => state.environment);
  const baseUrl = getBaseUrl(environment);

  const fetchRoles = async (
    rollehaver: string,
    rollegiver: string,
  ): Promise<void> => {
    setError(null);
    setRoles([]);
    setIsLoading(true);
    try {
      const res = await authorizedFetch(
        `${baseUrl}/serviceowner/${rollehaver}/roles/${rollegiver}`,
      );
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Ukjent feil oppstod.");
      }
      const data = await res.json();
      let rolesArray: Role[] = [];
      if (Array.isArray(data)) {
        rolesArray = data;
      } else if (data && data._embedded) {
        const embeddedKeys = Object.keys(data._embedded);
        if (embeddedKeys.length > 0) {
          const firstKey = embeddedKeys[0];
          rolesArray = data._embedded[firstKey];
        }
      }
      if (rolesArray.length > 0) {
        setRoles(rolesArray);
      } else {
        setRoles([]);
      }
    } catch (error: any) {
      setError(error.message || "Noe gikk galt ved henting av roller.");
      setRoles([]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearRoles = () => {
    setRoles([]);
    setError(null);
  };

  return { fetchRoles, roles, isLoading, error, clearRoles };
};
