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

      systemUserUuid: "",
      systemUserParams: {
        includeAltinn2: false,
        includeAltinn3: true,
        includeRoles: true,
        includeAccessPackages: true,
        includeResources: true,
        includeInstances: false,
      },
      systemUserSelectedPartyUuid: null,

      setEnvironment: (env: string) => set({ environment: env }),
      setIsDarkMode: (darkMode: boolean) => set({ isDarkMode: darkMode }),
      setSystemUserUuid: (uuid: string) => set({ systemUserUuid: uuid }),
      setSystemUserParams: (params) => set({ systemUserParams: params }),
      setSystemUserSelectedPartyUuid: (uuid) => set({ systemUserSelectedPartyUuid: uuid }),
    }),
    {
      //local storage key for global data
      name: "app-storage",
    }
  )
);
