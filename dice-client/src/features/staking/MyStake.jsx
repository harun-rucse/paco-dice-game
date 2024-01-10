import { useState } from "react";
import { useBalance } from "../../context/BalanceContext";
import PoolCard from "./PoolCard";
import { useCreateStake } from "./useCreateStake";
import Spinner from "../../components/Spinner";
import useGetPayouts from "./useGetPayouts";
import { numberFormat, currencyFormat } from "../../utils/format";
import { useGetUsdPricePaco } from "./useGetUsdPricePaco";
import { useClaimReward } from "./useClaimReward";

function MyStake() {
  const [stakeAmount, setStakeAmount] = useState("");
  const { currentBalance } = useBalance();
  const { isLoading, create } = useCreateStake();
  const { isLoading: isFetching, payouts } = useGetPayouts();
  const { pacoUSD } = useGetUsdPricePaco(payouts?.amount);
  const { isLoading: isClaiming, makeClaim } = useClaimReward();

  function handleChange(e) {
    const val = e.target.value;
    if (isNaN(val) || Number(currentBalance?.value) < Number(val)) return;

    setStakeAmount(val);
  }

  function handleStake() {
    if (!stakeAmount) return;

    create({ amount: stakeAmount });
    setStakeAmount("");
  }

  function handleClaim() {
    makeClaim();
  }

  if (isLoading || isFetching || isClaiming) return <Spinner />;

  return (
    <div className="flex flex-col md:self-stretch bg-[#3c2f61] rounded-2xl px-4 py-4 w-full lg:w-[33.33%] relative">
      <img
        src="/icons/rocket-icon.png"
        alt=""
        className="absolute -top-6 lg:-top-10 -right-4 lg:-right-6 w-20 lg:w-24"
      />
      <div className="border-b border-[#8b849d] pb-2 space-y-2">
        <div className="flex gap-4 items-start">
          <img
            src="/icons/paco-icon.png"
            alt=""
            className="w-16 object-contain"
          />
          <div>
            <p className="uppercase lg:text-xl text-[#B4B3B3]">
              MY STAKED PACO
            </p>
            <p className="text-white lg:text-xl">
              {numberFormat(payouts?.amount || 0)}
            </p>
            <p className="text-[#B4B3B3] lg:text-lg">
              {currencyFormat(pacoUSD)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Enter stake amount"
            value={stakeAmount}
            onChange={handleChange}
            className="w-full px-4 py-2 text-white rounded-md bg-[#2e2550] border border-gray-500 focus:outline-none"
          />
          <button
            className="button self-center !bg-[#1ca15f] !px-6 !py-2"
            onClick={handleStake}
          >
            Stake
          </button>
        </div>
      </div>
      <p className="flex items-center gap-2 uppercase text-[#B4B3B3] pt-4">
        My Staking payouts
        <img src="/icons/money-bag.png" alt="" className="w-5" />
      </p>

      <PoolCard
        btc={payouts?.btc || 0}
        paco={payouts?.paco || 0}
        eth={payouts?.eth || 0}
        bnb={payouts?.bnb || 0}
        usdt={payouts?.usdt || 0}
      />

      <button
        className="button self-center mt-12 !bg-[#d11f1f] !px-12 !py-2"
        onClick={handleClaim}
      >
        Claim
      </button>
    </div>
  );
}

export default MyStake;
