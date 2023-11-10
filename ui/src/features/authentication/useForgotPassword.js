import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { forgotPassword as forgotPasswordApi } from "../../services/apiAuth";

export function useForgotPassword() {
  const { isLoading, mutate: forgotPassword } = useMutation({
    mutationFn: forgotPasswordApi,
    onSuccess: () => {
      toast.success("Reset token send successfull");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { forgotPassword, isLoading };
}
