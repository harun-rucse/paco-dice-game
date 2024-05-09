import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { resetBurn as resetBurnApi } from "../../../../services/apiStake";

export function useResetBurn() {
  const { isLoading, mutate: resetBurn } = useMutation({
    mutationFn: resetBurnApi,
    onSuccess: () => {
      toast.success("Paco burn successful");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { resetBurn, isLoading };
}
