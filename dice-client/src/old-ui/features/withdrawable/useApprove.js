import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { claimWithdrawable as claimWithdrawableApi } from "../../../services/apiAccount";

export function useApprove() {
  const queryClient = useQueryClient();

  const { isLoading, mutate: approveWithdrawable } = useMutation({
    mutationFn: claimWithdrawableApi,
    onSuccess: () => {
      toast.success("Withdrawable claim successfull");
      queryClient.invalidateQueries({
        queryKey: ["withdrawables"],
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { approveWithdrawable, isLoading };
}
