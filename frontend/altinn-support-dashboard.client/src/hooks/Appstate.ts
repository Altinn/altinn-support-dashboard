import create from "zustand";

export interface AppState {
  environment: string;

  setEnvironment: (env: string) => void;
}
