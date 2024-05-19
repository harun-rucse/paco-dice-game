import { useEffect } from "react";
import Banner from "../features/home/Banner";
import FeatureBanner from "../features/home/FeatureBanner";
import BetHistoryTable from "../features/home/BetHistoryTable";
import AcceptedCurrencies from "../features/home/AcceptedCurrencies";

function Homepage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pb-40">
      <Banner />
      <FeatureBanner />
      <BetHistoryTable />
      <AcceptedCurrencies />
    </div>
  );
}

export default Homepage;
