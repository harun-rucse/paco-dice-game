import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { claimCommission } from "../../../services/apiReferral";

export function useClaimCommission() {
  const queryClient = useQueryClient();

  const { isLoading, mutate: claim } = useMutation({
    mutationFn: claimCommission,
    onSuccess: (data) => {
      if (data?.success) {
        toast.success("Claim successful");
      } else {
        toast.error("You don't have any claim value!");
      }

      queryClient.invalidateQueries(["user"]);
      queryClient.invalidateQueries(["referral-stats"]);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { claim, isLoading };
}
