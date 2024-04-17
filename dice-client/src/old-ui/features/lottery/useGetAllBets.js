import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getAllBets } from "../../../services/apiTicket";

export default function useGetAllBets() {
  const [searchParams] = useSearchParams();
  const round = !searchParams.get("round")
    ? 1
    : Number(searchParams.get("round"));

  const { isLoading, data: { allBets } = {} } = useQuery({
    queryKey: ["all-bets", round],
    queryFn: () => getAllBets(round),
  });

  return { isLoading, allBets };
}
