import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { buyTicket as buyTicketApi } from "../../services/apiTicket";

export function useBuyTicket() {
  const queryClient = useQueryClient();

  const { isLoading, mutate: buyTicket } = useMutation({
    mutationFn: buyTicketApi,
    onSuccess: () => {
      toast.success("Ticket buy successful");
      queryClient.invalidateQueries(["tickets"]);
      queryClient.invalidateQueries(["user"]);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { buyTicket, isLoading };
}
