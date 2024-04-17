import Banner from "../features/lottery/Banner";
import LotteryCard from "../features/lottery/LotteryCard";
import PacoLottery from "../features/lottery/PacoLottery";

function Staking() {
  return (
    <div className="w-full h-full py-2 pb-32 space-y-8">
      <Banner />
      <PacoLottery />
      <LotteryCard />
    </div>
  );
}

export default Staking;
