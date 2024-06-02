import { useQuery } from "@tanstack/react-query";

import { getMyStakeHistories } from "../../../services/apiStake";

export default function useGetMyStakeHistories(fromDate, toDate) {
  const { isLoading, data: { result, count } = {} } = useQuery({
    queryKey: ["my-stake-histories", fromDate, toDate],
    queryFn: () => getMyStakeHistories(fromDate, toDate),
  });

  return { isLoading, result, count };
}
