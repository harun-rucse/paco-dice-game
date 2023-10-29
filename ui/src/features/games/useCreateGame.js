import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createGame as createGameApi } from "../../services/apiGame";

export function useCreateGame() {
  const queryClient = useQueryClient();

  const { isLoading, mutate: create } = useMutation({
    mutationFn: createGameApi,
    onSuccess: (data) => {
      data?.status === "win"
        ? toast.success("Hurra! You own the bet")
        : toast.error("Sorry! You lost the bet");

      queryClient.invalidateQueries(["user"]);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { create, isLoading };
}
