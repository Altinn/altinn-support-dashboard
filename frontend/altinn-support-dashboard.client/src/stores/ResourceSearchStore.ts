import { create } from "zustand";
import { ResourceSearchState } from "./ResourceSearchState";

export const useResourceSearchStore = create<ResourceSearchState>((set) => ({
    query: "",
    textFieldValue: "",
    selectedResource: null,
    onlyDelegable: false,
    onlyVisible: false,
    onlyAltinnApp: false,
    setQuery: (q) => set({ query: q}),
    setTextFieldValue: (v) => set({ textFieldValue: v}),
    setSelectedResource: (r) => set({ selectedResource: r}),
    setOnlyDelegable: (v) => set({ onlyDelegable: v}),
    setOnlyVisible: (v) => set({ onlyVisible: v}),
    setAltinnApp: (v) => set({ onlyAltinnApp: v})
}));