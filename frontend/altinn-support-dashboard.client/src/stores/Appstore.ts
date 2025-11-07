import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AppState } from "./Appstate";

//sets all global variables
export const useAppStore = create<AppState>()(
  //handles persistence
  persist(
    (set) => ({
      environment: "PROD",
      isDarkMode: false,

      setEnvironment: (env: string) => set({ environment: env }),
      setIsDarkMode: (darkMode: boolean) => set({ isDarkMode: darkMode }),
    }),
    {
      //local storage key for global data
      name: "app-storage",
    },
  ),
);
