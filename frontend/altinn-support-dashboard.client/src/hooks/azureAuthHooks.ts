import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { authDetails } from "../models/azureAuthModels";
import { fetchAuthDetails } from "../utils/azureAuthApi";

export const useAuthDetails = () => {
  const authDetailsQuery: UseQueryResult<authDetails> = useQuery({
    queryKey: ["authDetails"],
    queryFn: () => fetchAuthDetails(),
  });

  return authDetailsQuery;
};
