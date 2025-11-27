import { ErRoleTableItem, PersonalContact } from "../../../models/models";
import { ERRolesSortField, SortDirection } from "../models/mainContentTypes";

export const filterContacts = (
  contacts: PersonalContact[],
  searchQuery: string,
): PersonalContact[] => {
  if (searchQuery.trim().length < 3) return contacts;
  return contacts.filter(
    (contact) =>
      contact.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.socialSecurityNumber?.includes(searchQuery) ||
      contact.mobileNumber?.includes(searchQuery) ||
      contact.eMailAddress?.toLowerCase().includes(searchQuery.toLowerCase()),
  );
};

export const sortContacts = (
  contacts: PersonalContact[],
  sortField: keyof PersonalContact | null,
  sortDirection: SortDirection,
): PersonalContact[] => {
  if (!sortField) return contacts;
  return [...contacts].sort((a, b) => {
    const aValue = a[sortField] || "";
    const bValue = b[sortField] || "";
    if (aValue < bValue) return sortDirection === "ascending" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "ascending" ? 1 : -1;
    return 0;
  });
};

export const sortERRoles = (
  roles: ErRoleTableItem[],
  sortField: ERRolesSortField,
  sortDirection: SortDirection,
): ErRoleTableItem[] => {
  if (!sortField) return roles;
  return [...roles].sort((a, b) => {
    if (sortField === "type") {
      const aType = a.type?.beskrivelse || "";
      const bType = b.type?.beskrivelse || "";
      return sortDirection === "ascending"
        ? aType.localeCompare(bType)
        : bType.localeCompare(aType);
    }
    if (sortField === "person") {
      const aName =
        `${a.person?.navn?.fornavn || ""} ${a.person?.navn?.etternavn || ""}`.trim();
      const bName =
        `${b.person?.navn?.fornavn || ""} ${b.person?.navn?.etternavn || ""}`.trim();
      return sortDirection === "ascending"
        ? aName.localeCompare(bName)
        : bName.localeCompare(aName);
    }
    if (sortField === "sistEndret") {
      const aDate = new Date(a.sistEndret || 0).getTime();
      const bDate = new Date(b.sistEndret || 0).getTime();
      return sortDirection === "ascending" ? aDate - bDate : bDate - aDate;
    }
    return 0;
  });
};
