import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { withdraw as withdrawApi } from "../../../services/apiAccount";

export function useWithdraw() {
  const { isLoading, mutate: withdraw } = useMutation({
    mutationFn: withdrawApi,
    onSuccess: () => {
      toast.success("Withdraw successfull");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { withdraw, isLoading };
}
