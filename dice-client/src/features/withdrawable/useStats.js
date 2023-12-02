import { useQuery } from "@tanstack/react-query";
import { getWithdrawableStats } from "../../services/apiAccount";

export function useStats() {
  const { isLoading, data } = useQuery({
    queryKey: ["withdrawable-stats"],
    queryFn: getWithdrawableStats,
  });

  return { isLoading, data };
}
