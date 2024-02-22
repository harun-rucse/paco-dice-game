import { useQuery } from "@tanstack/react-query";
import { getTicketStatistics } from "../../services/apiTicket";

export default function useGetTicketStatistics() {
  const { isLoading, data: ticketStatistics } = useQuery({
    queryKey: ["ticket-statistics"],
    queryFn: getTicketStatistics,
  });

  return { isLoading, ticketStatistics };
}
