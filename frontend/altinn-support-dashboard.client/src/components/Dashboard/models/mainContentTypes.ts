import type { PersonalContact, ERRole } from "../../../models/models";
export type { PersonalContact };

export interface MainContentProps {
  selectedOrg: { Name: string; OrganizationNumber: string } | null;
  moreInfo: PersonalContact[];
  rolesInfo: ERRole[];
}

export interface OfficialContact {
  MobileNumber: string;
  MobileNumberChanged: string;
  EMailAddress: string;
  EMailAddressChanged: string;
  fratraadt?: boolean;
  erDoed?: boolean;
}

export type SortDirection = "asc" | "desc" | undefined;

export type ERRolesSortField = "type" | "person" | "sistEndret" | null;
