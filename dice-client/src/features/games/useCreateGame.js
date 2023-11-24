import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createGame as createGameApi } from "../../services/apiGame";

export function useCreateGame() {
  const queryClient = useQueryClient();

  const { isLoading, mutate: create } = useMutation({
    mutationFn: createGameApi,
    onSuccess: () => {
      queryClient.invalidateQueries(["user"]);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { create, isLoading };
}
