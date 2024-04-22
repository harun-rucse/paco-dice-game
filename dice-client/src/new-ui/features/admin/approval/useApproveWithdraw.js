import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { approveWithdraw as approveWithdrawApi } from "../../../../services/apiAccount";

export function useApproveWithdraw() {
  const queryClient = useQueryClient();

  const { isLoading, mutate: approveWithdraw } = useMutation({
    mutationFn: approveWithdrawApi,
    onSuccess: () => {
      toast.success("Withdraw approval successfull");
      queryClient.invalidateQueries({
        queryKey: ["withdraws"],
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { approveWithdraw, isLoading };
}
