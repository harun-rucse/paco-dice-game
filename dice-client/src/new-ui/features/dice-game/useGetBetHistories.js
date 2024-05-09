import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getBetHistories } from "../../../services/apiGame";

export default function useGetBetHistories(limit, type) {
  const [searchParams] = useSearchParams();
  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));

  const { isLoading, data: { result, count } = {} } = useQuery({
    queryKey: ["game-bet-histories", page, limit, type],
    queryFn: () => getBetHistories(page, limit, type),
  });

  return { isLoading, result, count };
}
