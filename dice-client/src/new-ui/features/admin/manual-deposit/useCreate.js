import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createManualDeposit as createManualDepositApi } from "../../../../services/apiAccount";

export function useCreate() {
  const queryClient = useQueryClient();

  const { isLoading, mutate: createManualDeposit } = useMutation({
    mutationFn: createManualDepositApi,
    onSuccess: () => {
      toast.success("Deposit added successfull");
      queryClient.invalidateQueries({
        queryKey: ["manual-deposits"],
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { createManualDeposit, isLoading };
}
