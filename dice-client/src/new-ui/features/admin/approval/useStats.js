import { useQuery } from "@tanstack/react-query";
import { getStats } from "../../../../services/apiAccount";

export function useStats() {
  const { isLoading, data } = useQuery({
    queryKey: ["stats"],
    queryFn: getStats,
  });

  return { isLoading, data };
}
