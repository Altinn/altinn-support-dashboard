import { Organization } from "../models/models";

export interface DashboardState {
  query: string;
  selectedOrg: Organization | null;
  setQuery: (q: string) => void;
  setSelectedOrg: (org: Organization | null) => void;
}
