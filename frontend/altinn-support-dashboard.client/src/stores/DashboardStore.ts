import { create } from "zustand";
import { DashboardState } from "./Dashboardstate";

export const useDashboardStore = create<DashboardState>((set) => ({
  query: "",
  selectedOrg: null,
  setQuery: (q) => set({ query: q }),
  setSelectedOrg: (org) => set({ selectedOrg: org }),
}));
