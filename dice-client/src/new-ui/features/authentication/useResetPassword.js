import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { resetPassword as resetPasswordApi } from "../../../services/apiAuth";

export function useResetPassword() {
  const { isLoading, mutate: resetPassword } = useMutation({
    mutationFn: resetPasswordApi,
    onSuccess: () => {
      toast.success("Password reset successfull");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { resetPassword, isLoading };
}
