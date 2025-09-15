import { create } from "zustand";
import { AppState } from "./Appstate";

//sets all global variables
export const useAppStore = create<AppState>((set) => ({
  environment: "Production",
  isDarkMode: false,

  setEnvironment: (env: string) => set({ environment: env }),
  setIsDarkMode: (darkMode: boolean) => set({ isDarkMode: darkMode }),
}));
