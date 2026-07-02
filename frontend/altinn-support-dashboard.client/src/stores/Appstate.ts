import { AuthorizedPartiesQueryParams } from "../models/models";

export interface AppState {
  environment: string;
  isDarkMode: boolean;

  systemUserUuid: string;
  systemUserParams: AuthorizedPartiesQueryParams;
  systemUserSelectedPartyUuid: string | null;

  setEnvironment: (env: string) => void;
  setIsDarkMode: (darkmode: boolean) => void;
  setSystemUserUuid: (uuid: string) => void;
  setSystemUserParams: (params: AuthorizedPartiesQueryParams) => void;
  setSystemUserSelectedPartyUuid: (uuid: string | null) => void;
}
