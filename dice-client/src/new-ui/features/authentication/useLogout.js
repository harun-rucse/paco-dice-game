import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { logout as logoutApi } from "../../../services/apiAuth";

export function useLogout() {
  const { isLoading, mutate: logout } = useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      toast.success("Logout successful");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { logout, isLoading };
}
