import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getMyTickets } from "../../services/apiTicket";
import { PAGE_SIZE } from "../../utils/constant";

export default function useGetMyTickets() {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));
  const round = !searchParams.get("round")
    ? 1
    : Number(searchParams.get("round"));
  const limit = PAGE_SIZE;

  const { isLoading, data: { tickets, count } = {} } = useQuery({
    queryKey: ["tickets", page, limit, round],
    queryFn: () => getMyTickets(page, limit, round),
  });

  // Pre-fetching
  const pageCount = Math.ceil(count / PAGE_SIZE);
  if (page < pageCount) {
    queryClient.prefetchQuery({
      queryKey: ["tickets", page + 1, limit, round],
      queryFn: () => getMyTickets(page + 1, limit, round),
    });
  }

  if (page > 1) {
    queryClient.prefetchQuery({
      queryKey: ["tickets", page - 1, limit, round],
      queryFn: () => getMyTickets(page - 1, limit, round),
    });
  }

  return { isLoading, tickets, count };
}
