import { useState } from "react";
import MyStake from "./MyStake";
import MyStakeLogin from "./MyStakeLogin";
import Pools from "./Pools";
import Stats from "./Stats";
import { useCurrentUser } from "../authentication/useCurrentUser";
import useGetStakePool from "./useGetStakePool";
import Spinner from "../../../components/Spinner";

function StakingCard() {
  const [totalPool, setTotalPool] = useState(0);
  const [totalNextPool, setTotalNextPool] = useState(0);
  const { isAuthenticated, isLoading } = useCurrentUser();
  const { isLoading: isFetching, pool } = useGetStakePool();

  if (isFetching) return <Spinner />;

  return (
    <div className="flex flex-col desktop:flex-row items-start justify-center gap-4">
      <div className="w-full desktop:w-[50rem] flex flex-col gap-4">
        <Stats totalNextPool={totalNextPool} totalBurn={pool?.burn} />
        <Pools
          totalPool={totalPool}
          setTotalPool={setTotalPool}
          setTotalNextPool={setTotalNextPool}
          pool={pool}
        />
      </div>

      {!isLoading && isAuthenticated ? <MyStake /> : <MyStakeLogin />}
    </div>
  );
}

export default StakingCard;
