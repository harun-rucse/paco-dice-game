import { useQuery } from "@tanstack/react-query";
import { getStakeCalculator } from "../../../services/apiStake";

export default function useGetStakeCalculator(paco) {
  const { isLoading, data: calculator } = useQuery({
    queryKey: ["stake-calculator", paco],
    queryFn: () => getStakeCalculator(paco),
  });

  return { isLoading, calculator };
}
