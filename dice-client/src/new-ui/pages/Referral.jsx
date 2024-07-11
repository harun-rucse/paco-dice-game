import { useEffect } from "react";
import ReferralCard from "../features/referral/ReferralCard";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import ReferralUnAuth from "../features/referral/ReferralUnAuth";

function Referral() {
  const { isLoading, isAuthenticated } = useCurrentUser();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="px-4 desktop:px-8 pt-4 tablet:py-8 pb-60 space-y-6 tablet:mb-[12rem]">
      <h4 className="text-xl tablet:text-2xl">
        Referral
        {/* <span className="text-base text-green-400 ml-1">(Beta version)</span> */}
      </h4>
      {!isLoading && isAuthenticated ? <ReferralCard /> : <ReferralUnAuth />}
    </div>
  );
}

export default Referral;
