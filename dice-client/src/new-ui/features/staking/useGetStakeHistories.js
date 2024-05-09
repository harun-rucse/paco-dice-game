import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getStakeHistories } from "../../../services/apiStake";

export default function useGetStakeHistories(limit, date) {
  const [searchParams] = useSearchParams();
  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));

  const { isLoading, data: { result, count } = {} } = useQuery({
    queryKey: ["stake-histories", page, limit, date],
    queryFn: () => getStakeHistories(page, limit, date),
  });

  return { isLoading, result, count };
}
