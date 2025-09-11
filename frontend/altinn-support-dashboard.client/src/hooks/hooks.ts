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

export function useDarkMode() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  useEffect(() => {
    const storedDarkMode = localStorage.getItem("isDarkMode");
    if (storedDarkMode !== null) {
      setIsDarkMode(storedDarkMode === "true");
    } else {
      const prefersDarkMode =
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;
      setIsDarkMode(prefersDarkMode);
    }
  }, []);
  return { isDarkMode, setIsDarkMode };
}

export function useEnvironment() {
  const [environment, setEnvironment] = useState("PROD");
  const [isEnvDropdownOpen, setIsEnvDropdownOpen] = useState(false);
  const toggleEnvDropdown = () => setIsEnvDropdownOpen((prev) => !prev);
  const handleEnvChange = (env: string) => {
    setEnvironment(env);
    setIsEnvDropdownOpen(false);
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

export function useOrganizationSearch(environment: string) {
  const [query, setQuery] = useState("");
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [subUnits, setSubUnits] = useState<Subunit[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<{
    Name: string;
    OrganizationNumber: string;
  } | null>(null);
  const [moreInfo, setMoreInfo] = useState<PersonalContact[]>([]);
  const [rolesInfo, setRolesInfo] = useState<ERRole[]>([]);
  const [expandedOrg, setExpandedOrg] = useState<string | null>(null);
  const [error, setError] = useState<{
    message: string;
    response?: string | null;
  }>({ message: "", response: null });
  const [erRolesError, setErRolesError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = useCallback(async () => {
    const trimmedQuery = query.replace(/\s/g, "");
    setIsLoading(true);
    setError({ message: "", response: null });
    setErRolesError(null);
    setHasSearched(true);
    try {
      console.log(environment);
      console.log(
        `${getBaseUrl(environment)}/${environment}/serviceowner/organizations/search?query=${encodeURIComponent(trimmedQuery)}`,
      );
      const res = await authorizedFetch(
        `${getBaseUrl(environment)}/serviceowner/organizations/search?query=${encodeURIComponent(trimmedQuery)}`,
      );
      const data = await res.json();
      console.log(2);
      const orgData: Organization[] = Array.isArray(data) ? data : [data];
      const mainUnits = orgData.filter(
        (org) => org.type !== "BEDR" && org.type !== "AAFY",
      );
      const matchedSubUnits = orgData.filter(
        (org) => org.type === "BEDR" || org.type === "AAFY",
      );
      const allSubUnits: Subunit[] = [];
      for (const org of mainUnits) {
        try {
          const subunitRes = await authorizedFetch(
            `${getBaseUrl(environment)}/brreg/${org.organizationNumber}/underenheter`,
          );
          const subunitData = await subunitRes.json();
          if (subunitData?._embedded?.underenheter) {
            const subunits = subunitData._embedded.underenheter.map(
              (sub: any) => ({
                navn: sub.navn,
                organisasjonsnummer: sub.organisasjonsnummer,
                overordnetEnhet: sub.overordnetEnhet,
                type: sub.organisasjonsform?.kode,
              }),
            );
            allSubUnits.push(...subunits);
          }
        } catch {}
      }
      setOrganizations([...mainUnits, ...matchedSubUnits]);
      setSubUnits(allSubUnits);
      setSelectedOrg(null);
    } catch (e: any) {
      setError({ message: e.message, response: null });
      setOrganizations([]);
      setSubUnits([]);
    } finally {
      setIsLoading(false);
    }
  }, [environment, query]);

  const handleSelectOrg = useCallback(
    async (organizationNumber: string, name: string) => {
      setSelectedOrg({ Name: name, OrganizationNumber: organizationNumber });
      setMoreInfo([]);
      setRolesInfo([]);
      setError({ message: "", response: null });
      setErRolesError(null);
      try {
        const resPersonalContacts = await authorizedFetch(
          `${getBaseUrl(environment)}/serviceowner/organizations/${organizationNumber}/personalcontacts`,
        );
        const personalContacts: PersonalContact[] =
          await resPersonalContacts.json();
        setMoreInfo(personalContacts);
        try {
          const subunit = subUnits.find(
            (sub) => sub.organisasjonsnummer === organizationNumber,
          );
          const orgNumberForRoles = subunit
            ? subunit.overordnetEnhet
            : organizationNumber;
          const resRoles = await authorizedFetch(
            `${getBaseUrl(environment)}/brreg/${orgNumberForRoles}`,
          );
          const roles: { rollegrupper: ERRole[] } = await resRoles.json();
          setRolesInfo(roles.rollegrupper);
        } catch {
          setErRolesError("ER roller kunne ikke hentes.");
        }
      } catch (error: any) {
        setError((prevError) => ({
          message: prevError.message + " Feil ved henting av data.",
          response: error.response || null,
        }));
      }
    },
    [environment, subUnits],
  );

  const handleExpandToggle = (orgNumber: string) => {
    setExpandedOrg((prev) => (prev === orgNumber ? null : orgNumber));
  };

  return {
    query,
    setQuery,
    organizations,
    subUnits,
    selectedOrg,
    moreInfo,
    rolesInfo,
    expandedOrg,
    error,
    erRolesError,
    isLoading,
    hasSearched,
    handleSearch,
    handleSelectOrg,
    handleExpandToggle,
  };
}

export const UseManualRoleSearch = (baseUrl: string) => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
