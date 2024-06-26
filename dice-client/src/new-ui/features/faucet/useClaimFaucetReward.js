import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { claimFaucetReward } from "../../../services/apiFaucet";

export function useClaimFaucetReward() {
  const queryClient = useQueryClient();

  const { isLoading, mutate: claim } = useMutation({
    mutationFn: claimFaucetReward,
    onSuccess: (data) => {
      if (data?.success) {
        toast.success("Claim successful");
      } else {
        toast.error("Claim failed");
      }

      queryClient.invalidateQueries(["user"]);
      queryClient.invalidateQueries(["my-faucet"]);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { claim, isLoading };
}
