import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getMyTickets } from "../../services/apiTicket";
import { PAGE_SIZE } from "../../utils/constant";

export default function useGetMyTickets() {
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

  return { isLoading, tickets, count };
}
