import { useQuery } from "@tanstack/react-query";
import { getReferralStats } from "../../../services/apiReferral";

export default function useGetReferralStats() {
  const { isLoading, data } = useQuery({
    queryKey: ["referral-stats"],
    queryFn: () => getReferralStats(),
  });

  return { isLoading, data };
}
