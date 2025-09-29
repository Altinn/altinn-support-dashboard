import { useQueries } from "@tanstack/react-query";
import { PersonalContact } from "../models/mainContentTypes";
import { fetchRoles } from "../../../utils/api";


//If they have one role, the person is shown, if they have no roles the person is filtered out

export function useContactsWithRoles(
  contacts: PersonalContact[],
  environment: string,
  orgNumber: string
) {
  const results = useQueries({
    queries: contacts.map(contact => ({
      queryKey: ["roles", environment, contact.socialSecurityNumber, orgNumber],
      queryFn: () => fetchRoles(environment, contact.socialSecurityNumber, orgNumber),
      enabled: !!contact.socialSecurityNumber && !!orgNumber,
    })),
  });

  const queriesAreFinished = results.every(r => r.isSuccess || r.isError);

  const onlyContactsWithRoles = queriesAreFinished
    ? contacts.filter((contact, index) => {
        const roles = results[index]?.data;
        return Array.isArray(roles) && roles.length > 0;
      })
    : [];

  return onlyContactsWithRoles;
}