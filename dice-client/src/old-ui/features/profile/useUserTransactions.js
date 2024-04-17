import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getUserTransactions } from "../../../services/apiAccount";
import { PAGE_SIZE } from "../../../utils/constant";

export default function useUserTransactions(current) {
  const [searchParams] = useSearchParams();
  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));
  const limit = PAGE_SIZE;

  const { isLoading, data: { result, count } = {} } = useQuery({
    queryKey: ["user-withdraws", current, page],
    queryFn: () => getUserTransactions(current, page, limit),
  });

  return { isLoading, result, count };
}
