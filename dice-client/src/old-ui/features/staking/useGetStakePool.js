import { useQuery } from "@tanstack/react-query";
import { getStakePool } from "../../../services/apiStake";

export default function useGetStakePool() {
  const { isLoading, data: pool } = useQuery({
    queryKey: ["stake-pool"],
    queryFn: getStakePool,
  });

  return { isLoading, pool };
}
