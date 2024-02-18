import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getMyHistories } from "../../services/apiTicket";
import { PAGE_SIZE } from "../../utils/constant";

export default function useGetMyHistories() {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));
  const round = !searchParams.get("round")
    ? 1
    : Number(searchParams.get("round"));
  const limit = PAGE_SIZE;

  const { isLoading, data: { histories, count } = {} } = useQuery({
    queryKey: ["my-histories", page, limit, round],
    queryFn: () => getMyHistories(page, limit, round),
  });

  // Pre-fetching
  const pageCount = Math.ceil(count / PAGE_SIZE);
  if (page < pageCount) {
    queryClient.prefetchQuery({
      queryKey: ["my-histories", page + 1, limit, round],
      queryFn: () => getMyHistories(page + 1, limit, round),
    });
  }

  if (page > 1) {
    queryClient.prefetchQuery({
      queryKey: ["my-histories", page - 1, limit, round],
      queryFn: () => getMyHistories(page - 1, limit, round),
    });
  }

  return { isLoading, histories, count };
}
