import { create } from "zustand";
import { DashboardState } from "./Dashboardstate";

export const useDashboardStore = create<DashboardState>((set) => ({
  query: "",
  selectedCard: null,
  setQuery: (q) => set({ query: q }),
  setSelectedCard: (card) => set({ selectedCard: card }),
}));
