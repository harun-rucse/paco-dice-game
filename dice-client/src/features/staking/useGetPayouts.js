import { useQuery } from "@tanstack/react-query";
import { getStakePayouts } from "../../services/apiStake";

export default function useGetPayouts() {
  const { isLoading, data: payouts } = useQuery({
    queryKey: ["stake-payouts"],
    queryFn: getStakePayouts,
  });

  return { isLoading, payouts };
}
