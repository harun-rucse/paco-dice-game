import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getMyReferredUsers } from "../../../services/apiReferral";

export default function useGetMyReferredUsers(limit) {
  const [searchParams] = useSearchParams();
  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));

  const { isLoading, data: { result, count } = {} } = useQuery({
    queryKey: ["my-referred-users", page, limit],
    queryFn: () => getMyReferredUsers(page, limit),
  });

  return { isLoading, result, count };
}
