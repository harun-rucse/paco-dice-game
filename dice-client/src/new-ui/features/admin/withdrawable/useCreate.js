import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createWithdrawable as createWithdrawableApi } from "../../../../services/apiAccount";

export function useCreate() {
  const queryClient = useQueryClient();

  const { isLoading, mutate: createWithdrawable } = useMutation({
    mutationFn: createWithdrawableApi,
    onSuccess: () => {
      toast.success("Withdrawable added successfull");
      queryClient.invalidateQueries({
        queryKey: ["withdrawables"],
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { createWithdrawable, isLoading };
}
