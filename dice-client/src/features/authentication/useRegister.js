import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { register as registerApi } from "../../services/apiAuth";

export function useRegister() {
  const { isLoading, mutate: register } = useMutation({
    mutationFn: registerApi,
    onSuccess: () => {
      toast.success("Register successfull");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { register, isLoading };
}
