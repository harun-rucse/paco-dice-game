import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getUserTransactions } from "../../../services/apiAccount";

export default function useUserTransactions(current, limit) {
  const [searchParams] = useSearchParams();
  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));

  const { isLoading, data: { result, count } = {} } = useQuery({
    queryKey: ["user-withdraws", current, page, limit],
    queryFn: () => getUserTransactions(current, page, limit),
  });

  return { isLoading, result, count };
}
