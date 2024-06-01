import { useQuery } from "@tanstack/react-query";
import { getCommissionDetails } from "../../../services/apiReferral";

export default function useGetCommissionDetails() {
  const { isLoading, data } = useQuery({
    queryKey: ["commission-details"],
    queryFn: () => getCommissionDetails(),
  });

  return { isLoading, data };
}
