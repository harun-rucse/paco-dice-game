import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getAllWithdrawables } from "../../../../services/apiAccount";
import { PAGE_SIZE } from "../../../../utils/constant";

export default function useWithdrawables() {
  const [searchParams] = useSearchParams();
  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));
  const limit = PAGE_SIZE;

  const { isLoading, data: { withdrawables, count } = {} } = useQuery({
    queryKey: ["withdrawables", page],
    queryFn: () => getAllWithdrawables(page, limit),
  });

  return { isLoading, withdrawables, count };
}
