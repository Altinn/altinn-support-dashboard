import { SelectedOrg } from "../models/models";

export interface DashboardState {
  query: string;
  selectedOrg: SelectedOrg | null;
  setQuery: (q: string) => void;
  setSelectedOrg: (org: SelectedOrg | null) => void;
}
