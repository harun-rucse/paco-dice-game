import { useQuery } from "@tanstack/react-query";
import { getCoinPrice } from "../services/apiCommon";

export default function useGetCoinPrice() {
  const { isLoading, data: price } = useQuery({
    queryKey: ["coin-price"],
    queryFn: getCoinPrice,
    staleTime: 10 * 1000,
  });

  return { isLoading, price };
}
