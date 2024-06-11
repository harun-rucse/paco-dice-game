import { useEffect } from "react";
import FaucetCard from "../features/faucet/FaucetCard";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import FaucetUnAuth from "../features/faucet/FaucetUnAuth";

function Referral() {
  const { isLoading, isAuthenticated } = useCurrentUser();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="px-1 tablet:px-4 desktop:px-8 pt-4 tablet:py-8 pb-60 space-y-6 tablet:mb-[12rem]">
      {!isLoading && isAuthenticated ? <FaucetCard /> : <FaucetUnAuth />}
    </div>
  );
}

export default Referral;
