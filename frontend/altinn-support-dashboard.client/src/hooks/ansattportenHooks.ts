import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { authDetails } from "../models/ansattportenModels";
import { fetchAuthDetails } from "../utils/ansattportenApi";

export const useAuthDetails = () => {
  const authDetailsQuery: UseQueryResult<authDetails> = useQuery({
    queryKey: ["authDetails"],
    queryFn: () => fetchAuthDetails(),
  });

  return authDetailsQuery;
};
