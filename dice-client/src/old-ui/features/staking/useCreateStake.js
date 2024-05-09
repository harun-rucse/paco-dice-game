import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createStake as createStakeApi } from "../../../services/apiStake";

export function useCreateStake() {
  const queryClient = useQueryClient();

  const { isLoading, mutate: create } = useMutation({
    mutationFn: createStakeApi,
    onSuccess: () => {
      toast.success("Stake successful");
      queryClient.invalidateQueries(["user"]);
      queryClient.invalidateQueries(["stake-payouts"]);
      queryClient.invalidateQueries(["stake-pool"]);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { create, isLoading };
}
