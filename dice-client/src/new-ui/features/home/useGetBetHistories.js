import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getBetHistories } from "../../../services/apiCommon";

export default function useGetBetHistories(limit) {
  const [searchParams] = useSearchParams();
  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));

  const { isLoading, data: { result, count } = {} } = useQuery({
    queryKey: ["all-bet-histories", page, limit],
    queryFn: () => getBetHistories(page, limit),
  });

  return { isLoading, result, count };
}
