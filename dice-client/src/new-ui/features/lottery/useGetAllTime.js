import { useQuery } from "@tanstack/react-query";
import { getAllTime } from "../../../services/apiTicket";

export default function useGetAllTime() {
  const { isLoading, data: { allTime, stats } = {} } = useQuery({
    queryKey: ["all-time"],
    queryFn: () => getAllTime(),
  });

  return { isLoading, allTime, stats };
}
