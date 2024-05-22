import { useEffect } from "react";
import Banner from "../features/lottery/Banner";
import LotteryCard from "../features/lottery/LotteryCard";
import PacoLottery from "../features/lottery/PacoLottery";

function Lottery() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="px-4 desktop:px-12 pt-4 tablet:pt-8 desktop:pt-10 pb-60 space-y-8">
      <Banner />
      <PacoLottery />
      <LotteryCard />
    </div>
  );
}

export default Lottery;
