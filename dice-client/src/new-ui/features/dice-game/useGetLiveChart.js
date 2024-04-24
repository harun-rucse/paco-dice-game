import { useQuery } from "@tanstack/react-query";
import { getLiveChart } from "../../../services/apiGame";

export default function useGetLiveChart(refresh) {
  const { isLoading, data } = useQuery({
    queryKey: ["live-chart", refresh],
    queryFn: () => getLiveChart(),
  });

  return { isLoading, data };
}
