import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getAllWithdraws } from "../../services/apiAccount";
import { PAGE_SIZE } from "../../utils/constant";

export default function useWithdraws() {
  const [searchParams] = useSearchParams();
  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));
  const limit = PAGE_SIZE;

  const { isLoading, data: { withdraws, count } = {} } = useQuery({
    queryKey: ["withdraws", page],
    queryFn: () => getAllWithdraws(page, limit),
  });

  return { isLoading, withdraws, count };
}
