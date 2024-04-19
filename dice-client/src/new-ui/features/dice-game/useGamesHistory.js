import { useQuery } from "@tanstack/react-query";
import { getGamesHistory as getGamesHistoryApi } from "../../../services/apiGame";

export default function useGamesHistory(reFetchHistory) {
  const { isLoading, data: games } = useQuery({
    queryKey: ["games", reFetchHistory],
    queryFn: getGamesHistoryApi,
    retry: false,
  });

  return { isLoading, games };
}
