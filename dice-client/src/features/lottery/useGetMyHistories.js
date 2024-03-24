import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getMyHistories } from "../../services/apiTicket";

export default function useGetMyHistories(type) {
  const [searchParams] = useSearchParams();
  const round = !searchParams.get("round")
    ? 1
    : Number(searchParams.get("round"));

  const { isLoading, data: { histories, myTotalWinnings } = {} } = useQuery({
    queryKey: ["my-histories", round, type],
    queryFn: () => getMyHistories(round, type),
  });

  return { isLoading, histories, myTotalWinnings };
}
