import { create } from "zustand";
import { AppState } from "./Appstate";

//sets all global variables
export const useAppStore = create<AppState>((set) => ({
  environment: "Production",

  setEnvironment: (env) => set({ environment: env }),
}));
