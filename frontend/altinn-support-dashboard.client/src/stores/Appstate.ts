export interface AppState {
  environment: string;
  isDarkMode: boolean;

  setEnvironment: (env: string) => void;
  setIsDarkMode: (darkmode: boolean) => void;
}
