import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { claimStakeReward } from "../../../services/apiStake";

export function useClaimReward() {
  const queryClient = useQueryClient();

  const { isLoading, mutate: makeClaim } = useMutation({
    mutationFn: claimStakeReward,
    onSuccess: () => {
      toast.success("Stake claim successful");
      queryClient.invalidateQueries(["stake-payouts"]);
      queryClient.invalidateQueries(["user"]);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { makeClaim, isLoading };
}
