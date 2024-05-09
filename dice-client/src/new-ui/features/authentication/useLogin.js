import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { login as loginApi } from "../../../services/apiAuth";

export function useLogin() {
  const { isLoading, mutate: login } = useMutation({
    mutationFn: loginApi,
    onSuccess: () => {
      toast.success("Login successfull");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { login, isLoading };
}
