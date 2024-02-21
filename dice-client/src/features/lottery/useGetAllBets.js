import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getAllBets } from "../../services/apiTicket";
import { PAGE_SIZE } from "../../utils/constant";

export default function useGetAllBets(type) {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));
  const round = !searchParams.get("round")
    ? 1
    : Number(searchParams.get("round"));
  const limit = PAGE_SIZE;

  const { isLoading, data: { allBets, count } = {} } = useQuery({
    queryKey: ["all-bets", page, limit, round, type],
    queryFn: () => getAllBets(page, limit, round, type),
  });

  // Pre-fetching
  const pageCount = Math.ceil(count / PAGE_SIZE);
  if (page < pageCount) {
    queryClient.prefetchQuery({
      queryKey: ["all-bets", page + 1, limit, round, type],
      queryFn: () => getAllBets(page + 1, limit, round, type),
    });
  }

  if (page > 1) {
    queryClient.prefetchQuery({
      queryKey: ["all-bets", page - 1, limit, round, type],
      queryFn: () => getAllBets(page - 1, limit, round, type),
    });
  }

  return { isLoading, allBets, count };
}
