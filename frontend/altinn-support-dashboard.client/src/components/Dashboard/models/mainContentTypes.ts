import type {
  Organization,
  Subunit,
  PersonalContact,
  ERRole,
} from "../../../models/models";
export type { PersonalContact };

export interface MainContentProps {
  isLoading: boolean;
  organizations: Organization[];
  subUnits: Subunit[];
  selectedOrg: { Name: string; OrganizationNumber: string } | null;
  moreInfo: PersonalContact[];
  rolesInfo: ERRole[];
  expandedOrg: string | null;
  handleSelectOrg: (organizationNumber: string, name: string) => void;
  handleExpandToggle: (orgNumber: string) => void;
  error: { message: string; response?: string | null };
  erRolesError: string | null;
  query: string;
  hasSearched: boolean;
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
