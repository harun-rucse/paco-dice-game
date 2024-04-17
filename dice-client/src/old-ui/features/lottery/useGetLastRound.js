import { useQuery } from "@tanstack/react-query";
import { getLastRound } from "../../../services/apiTicket";

export default function useGetLastRound() {
  const { isLoading, data: round } = useQuery({
    queryKey: ["todays-round"],
    queryFn: getLastRound,
  });

  return { isLoading, round };
}
