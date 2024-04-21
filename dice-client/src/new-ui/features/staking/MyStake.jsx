import { useEffect, useState } from "react";
import { useBalance } from "../../../context/BalanceContext";
import PoolCard from "./PoolCard";
import { useCreateStake } from "./useCreateStake";
import Spinner from "../../../components/Spinner";
import useGetPayouts from "./useGetPayouts";
import { numberFormat } from "../../../utils/format";
import { useClaimReward } from "./useClaimReward";
import { useUnstake } from "./useUnstake";
import toast from "react-hot-toast";
import { addition } from "../../../utils/decimal";
import { cn } from "../../../utils";

function MyStake() {
  const [stakeAmount, setStakeAmount] = useState("");
  const { currentBalance } = useBalance();
  const { isLoading, create } = useCreateStake();
  const { isLoading: isFetching, payouts } = useGetPayouts();
  const { isLoading: isClaiming, makeClaim } = useClaimReward();
  const { isLoading: isUnstaking, unStake } = useUnstake();
  const [totalReward, setTotalReward] = useState(0);

  useEffect(() => {
    if (payouts) {
      // get total with addition
      const total = addition(
        payouts?.btc,
        payouts?.paco,
        payouts?.eth,
        payouts?.bnb,
        payouts?.usdt
      );

      setTotalReward(total);
    }
  }, [payouts]);

  function handleChange(e) {
    const val = e.target.value;
    if (
      (isNaN(val) || Number(currentBalance?.value)) < Number(val) &&
      currentBalance?.name === "PACO"
    ) {
      toast.error("Stake amount must be less than your balance");
    }

    setStakeAmount(val);
  }

  function handleStake() {
    if (!stakeAmount) {
      return toast.error("Please enter stake amount");
    }
    if (currentBalance?.name !== "PACO") {
      return toast.error("You can only stake PACO");
    }

    create({ amount: stakeAmount });
    setStakeAmount("");
  }

  function handleUnStake() {
    if (!stakeAmount) {
      return toast.error("Please enter un-stake amount");
    }

    unStake({ amount: stakeAmount });
    setStakeAmount("");
  }

  function handleClaim() {
    makeClaim();
  }

  if (isLoading || isFetching || isClaiming || isUnstaking) return <Spinner />;

  return (
    <div className="flex flex-col tablet:self-stretch bg-[#1e1c3a] dark:bg-[#31294c] rounded-2xl px-4 py-4 w-full laptop:w-[24rem] desktop:w-[26rem] relative">
      <img
        src="/icons/rocket-icon.png"
        alt=""
        className="absolute -top-6 desktop:-top-10 -right-4 desktop:-right-6 w-20 desktop:w-24"
      />
      <div className="border-b border-[#8b849d] pb-2 space-y-2">
        <div className="flex gap-4 items-start">
          <img
            src="/icons/paco-icon.png"
            alt=""
            className="w-16 object-contain"
          />
          <div>
            <p className="uppercase desktop:text-xl text-[#B4B3B3]">
              MY STAKED PACO
            </p>
            <p className="text-white desktop:text-xl">
              {numberFormat(payouts?.amount || 0)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Enter stake amount"
            value={stakeAmount}
            onChange={handleChange}
            className="w-full px-4 py-2 text-white rounded-xl bg-[#1e1c3a] border border-gray-500 focus:outline-none"
          />
          <div className="flex items-center gap-2">
            <button
              className="button self-center !bg-[#413e72] dark:!bg-[#3a2354] !border-[#34325c] dark:!border-[#2f1c44] tablet:!px-6 tablet:!py-2 text-sm tablet:text-base"
              onClick={handleStake}
            >
              Stake
            </button>
            <button
              className="button self-center !bg-[#d11f1f] tablet:!px-6 tablet:!py-2 text-sm tablet:text-base"
              onClick={handleUnStake}
            >
              Unstake
            </button>
          </div>
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
        className={cn(
          `button self-center mt-12 laptop:mt-6 desktop:mt-12 !bg-[#413e72] dark:!bg-[#3a2354] !border-[#34325c] dark:!border-[#2f1c44] !px-12 !py-2`,
          totalReward == 0 &&
            "!bg-[#333143] dark:!bg-[#292735] !border-[#434057] dark:!border-[#383549]"
        )}
        onClick={handleClaim}
        disabled={totalReward == 0}
      >
        Claim
      </button>
    </div>
  );
}

export default MyStake;
