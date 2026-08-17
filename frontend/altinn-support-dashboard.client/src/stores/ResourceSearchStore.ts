import { create } from "zustand";
import { ResourceSearchState } from "./ResourceSearchState";
import { useAppStore } from "./Appstore";

export const useResourceSearchStore = create<ResourceSearchState>((set) => ({
    query: "",
    selectedResource: null,
    onlyDelegable: false,
    onlyVisible: false,
    onlyAltinnApp: false,
    setQuery: (q) => set({ query: q}),
    setSelectedResource: (r) => set({ selectedResource: r}),
    setOnlyDelegable: (v) => set({ onlyDelegable: v}),
    setOnlyVisible: (v) => set({ onlyVisible: v}),
    setOnlyAltinnApp: (v) => set({ onlyAltinnApp: v})
}));

useAppStore.subscribe((state, prevState) => {
    if (state.environment !== prevState.environment) {
        useResourceSearchStore.getState().setSelectedResource(null);
    }
})