import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { gambleReward } from "../../../services/apiFaucet";

export function useGamble() {
  const queryClient = useQueryClient();

  const { isLoading, mutate: gamble } = useMutation({
    mutationFn: gambleReward,
    onSuccess: (data) => {
      if (data?.status === "won") {
        toast.success("Won");
      } else if (data?.status === "lost") {
        toast.error("Lost");
      } else {
        toast.success("Claimed");
      }

      queryClient.invalidateQueries(["user"]);
      queryClient.invalidateQueries(["my-faucet"]);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { gamble, isLoading };
}
