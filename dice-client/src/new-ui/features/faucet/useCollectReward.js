import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { collectGambleReward } from "../../../services/apiFaucet";

export function useCollectReward() {
  const queryClient = useQueryClient();

  const { isLoading, mutate: collect } = useMutation({
    mutationFn: collectGambleReward,
    onSuccess: (data) => {
      if (data?.success) {
        toast.success("Collect successful");
      } else {
        toast.error("Collect failed");
      }

      queryClient.invalidateQueries(["user"]);
      queryClient.invalidateQueries(["my-faucet"]);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { collect, isLoading };
}
