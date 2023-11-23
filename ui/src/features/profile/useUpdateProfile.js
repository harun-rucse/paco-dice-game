import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { profileUpdate as profileUpdateApi } from "../../services/apiAuth";

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  const { isLoading, mutate: profileUpdate } = useMutation({
    mutationFn: profileUpdateApi,
    onSuccess: () => {
      toast.success("Profile update successfull");
      queryClient.invalidateQueries({
        queryKey: ["user"],
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { profileUpdate, isLoading };
}
