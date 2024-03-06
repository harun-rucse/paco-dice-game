import { useCurrentUser } from "../features/authentication/useCurrentUser";
import Banner from "../features/lottery/Banner";
import LotteryCard from "../features/lottery/LotteryCard";
import LotteryLogin from "../features/lottery/LotteryLogin";
import PacoLottery from "../features/lottery/PacoLottery";

function Staking() {
  const { isAuthenticated, isLoading } = useCurrentUser();

  return (
    <div className="w-full h-full py-2 pb-32 space-y-8">
      <Banner />
      {!isLoading && isAuthenticated ? (
        <>
          <PacoLottery />
          <LotteryCard />
        </>
      ) : (
        <LotteryLogin />
      )}
    </div>
  );
}

export default Staking;
