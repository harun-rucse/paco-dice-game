import { useQuery } from "@tanstack/react-query";
import { getFaucetTournament } from "../../../services/apiFaucet";

export default function useGetFaucetTournament() {
  const { isLoading, data } = useQuery({
    queryKey: ["faucet-tournament"],
    queryFn: () => getFaucetTournament(),
  });

  return { isLoading, data };
}
