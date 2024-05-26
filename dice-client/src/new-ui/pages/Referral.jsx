import { useEffect } from "react";
import ReferralCard from "../features/referral/ReferralCard";

function Referral() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="px-4 desktop:px-8 pt-4 tablet:py-8 pb-60 space-y-6">
      <h4 className="text-xl tablet:text-2xl">Referral</h4>
      <ReferralCard />
    </div>
  );
}

export default Referral;
