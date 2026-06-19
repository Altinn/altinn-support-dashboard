import { useState, useEffect } from "react";
import {
  ERRoles,
  NotificationAdresses,
  PersonalContactAltinn3,
} from "../models/models";
import { getFormattedDateTime, fetchUserDetails } from "../utils/utils";
import { useMutation, useQuery, UseQueryResult } from "@tanstack/react-query";
import {
  fetchERoles,
  fetchInternalIds,
  fetchNotificationAddresses,
  fetchNotificationByOrderId,
  fetchOrganizations,
  fetchPersonalContacts,
  fetchResourceByIdentifier,
  fetchResourcePolicyRules,
  fetchResources,
  fetchRoleDefinitions,
  fetchRolesForOrg,
  fetchSsnFromToken,
} from "../utils/api";
import {
  CorrespondenceResponse,
  CorrespondenceUploadRequest,
} from "../models/correspondenceModels";
import { sendCorrespondence } from "../utils/correspondenceApi";
import { toast } from "react-toastify";
import { RolesAndRights, RolesAndRightsRequest } from "../models/rolesModels";
import { Altinn2Role, PolicyRule, Resource } from "../models/resourceModels";

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
    retry: false,
    staleTime: 2 * 60 * 1000, // fresh for 2 minutes
    refetchOnWindowFocus: false,
    enabled: !!query, // only run when query is non-empty
  });

  return {
    orgQuery,
  };
}

export function useOrgDetails(environment: string, orgNumber?: string) {
  const contactsQuery: UseQueryResult<PersonalContactAltinn3[], Error> =
    useQuery({
      queryKey: ["contacts", environment, orgNumber],
      queryFn: () => fetchPersonalContacts(environment, orgNumber!),
      enabled: !!orgNumber,
      retry: false,
      staleTime: 2 * 60 * 1000, // fresh for 2 minutes
      refetchOnWindowFocus: false,
    });

  const ERolesQuery: UseQueryResult<ERRoles[], Error> = useQuery({
    queryKey: ["erroles", environment, orgNumber],
    queryFn: () => fetchERoles(environment, orgNumber!),
    enabled: !!orgNumber,
    staleTime: 2 * 60 * 1000, // fresh for 2 minutes
    refetchOnWindowFocus: false,
    retry: false,
  });
  const notificationAdressesQuery: UseQueryResult<
    NotificationAdresses[],
    Error
  > = useQuery({
    queryKey: ["notificationAdresses", environment, orgNumber],
    queryFn: () => fetchNotificationAddresses(environment, orgNumber!),
    enabled: !!orgNumber,
    staleTime: 2 * 60 * 1000, // fresh for 2 minutes
    refetchOnWindowFocus: false,
    retry: false,
  });

  return {
    contactsQuery,
    ERolesQuery,
    notificationAdressesQuery,
  };
}

export const useRoles = (
  environment: string,
  request: RolesAndRightsRequest
) => {
  const rolesQuery: UseQueryResult<RolesAndRights, Error> = useQuery({
    queryKey: ["roles", environment, request],
    queryFn: () => fetchRolesForOrg(environment, request),
    enabled:
      !!request.partyFilter &&
      !!request.value &&
      !!(request.partyFilter.length >= 1), // only run if both exist
    retry: false,
    staleTime: 2 * 60 * 1000, // fresh for 2 minutes
    refetchOnWindowFocus: false,
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

export function useInternalIdLookup(query: string, environment: string) {
  return useQuery({
    queryKey: ["internalIdLookup", environment, query],
    queryFn: () => fetchInternalIds(query, environment),
    enabled: !!query && !!environment,
    retry: false,
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

export function useNotifications(orderId: string) {
  const notificationQuery = useQuery({
    queryKey: ["notifications", orderId],
    queryFn: () => fetchNotificationByOrderId(orderId),
    enabled: !!orderId,
    retry: false,
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
  return notificationQuery;
}

export function useResourceSearch(environment: string, query: string) {
  const resourceQuery = useQuery({
    queryKey: ["resources", environment, query],
    queryFn: () => fetchResources(environment, query),
    retry: false,
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: !!query,
  });
  return { resourceQuery };
}

export function useResourceWithPolicies(environment: string, identifier?: string) {
  const resourceQuery = useQuery<Resource | null, Error>({
    queryKey: ["resource", environment, identifier],
    queryFn: () => fetchResourceByIdentifier(environment, identifier!),
    enabled: !!identifier,
    retry: false,
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

    const policyRulesQuery = useQuery<PolicyRule[], Error>({
    queryKey: ["policyRules", environment, identifier],
    queryFn: () => fetchResourcePolicyRules(environment, identifier!),
    enabled: !!identifier,
    retry: false,
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  return { resourceQuery, policyRulesQuery };
}

export function useRoleDefinitions(environment: string) {
  return useQuery<Altinn2Role[], Error>({
    queryKey: ["roleDefinitions", environment],
    queryFn: () => fetchRoleDefinitions(environment),
    staleTime: 24 * 60 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
