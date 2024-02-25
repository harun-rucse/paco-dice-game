import { useQuery } from "@tanstack/react-query";
import { getMyTicketsCount } from "../../services/apiTicket";

export default function useGetMyTicketCount() {
  const { isLoading, data: ticketCount } = useQuery({
    queryKey: ["my-ticket-count"],
    queryFn: getMyTicketsCount,
  });

  return { isLoading, ticketCount };
}
