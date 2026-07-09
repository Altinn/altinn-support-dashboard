import { SelectedCard } from "../models/models";

export interface DashboardState {
  query: string;
  selectedCard: SelectedCard | null;
  setQuery: (q: string) => void;
  setSelectedCard: (card: SelectedCard | null) => void;
}
