import { useQuery } from "@tanstack/react-query";
import { getMyTickets } from "../../services/apiTicket";

export default function useGetMyTickets() {
  const { isLoading, data: tickets } = useQuery({
    queryKey: ["tickets"],
    queryFn: () => getMyTickets(),
  });

  return { isLoading, tickets };
}
