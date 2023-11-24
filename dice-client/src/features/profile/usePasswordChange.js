import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { passwordChange as passwordChangeApi } from "../../services/apiAuth";

export function usePasswordChange() {
  const { isLoading, mutate: passwordChange } = useMutation({
    mutationFn: passwordChangeApi,
    onSuccess: () => {
      toast.success("Password change successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { passwordChange, isLoading };
}
