import { useQuery } from "@tanstack/react-query";

import { getStakeHistories } from "../../../services/apiStake";

export default function useGetStakeHistories(fromDate, toDate) {
  const { isLoading, data: { result, count } = {} } = useQuery({
    queryKey: ["stake-histories", fromDate, toDate],
    queryFn: () => getStakeHistories(fromDate, toDate),
  });

  return { isLoading, result, count };
}
