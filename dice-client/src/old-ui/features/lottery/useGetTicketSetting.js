import { useQuery } from "@tanstack/react-query";
import { getTicketSetting } from "../../../services/apiTicket";

export default function useGetTicketSetting() {
  const { isLoading, data: ticketSetting } = useQuery({
    queryKey: ["ticket-setting"],
    queryFn: getTicketSetting,
  });

  return { isLoading, ticketSetting };
}
