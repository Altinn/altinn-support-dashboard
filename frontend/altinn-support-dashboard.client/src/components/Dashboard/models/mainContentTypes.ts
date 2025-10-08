export interface fficialContact {
  mobileNumber: string;
  mobileNumberChanged: string;
  eMailAddress: string;
  eMailAddressChanged: string;
  fratraadt?: boolean;
  erDoed?: boolean;
}

export type SortDirection = "ascending" | "descending" | "none" | undefined;

export type ERRolesSortField = "type" | "person" | "sistEndret" | null;
