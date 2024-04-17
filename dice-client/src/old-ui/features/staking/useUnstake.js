import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { unStake as unStakeApi } from "../../../services/apiStake";

export function useUnstake() {
  const queryClient = useQueryClient();

  const { isLoading, mutate: unStake } = useMutation({
    mutationFn: unStakeApi,
    onSuccess: () => {
      toast.success("Un-stake successful");
      queryClient.invalidateQueries(["user"]);
      queryClient.invalidateQueries(["stake-payouts"]);
      queryClient.invalidateQueries(["stake-pool"]);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { unStake, isLoading };
}
