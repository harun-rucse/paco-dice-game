import { useQuery } from "@tanstack/react-query";
import { getMyFaucet } from "../../../services/apiFaucet";

export default function useGetMyFaucet() {
  const { isLoading, data } = useQuery({
    queryKey: ["my-faucet"],
    queryFn: () => getMyFaucet(),
  });

  return { isLoading, data };
}
