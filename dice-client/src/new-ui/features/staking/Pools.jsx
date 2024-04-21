import PoolCard from "./PoolCard";
import StatItem from "./StatItem";
import { useCurrentUser } from "../authentication/useCurrentUser";
import { currencyFormat, numberFormat } from "../../../utils/format";

function Pools({ totalPool, setTotalPool, setTotalNextPool, pool }) {
  const { isAuthenticated, isLoading } = useCurrentUser();

  return (
    <div className="bg-[#1e1c3a] dark:bg-[#31294c] rounded-2xl px-6 py-6">
      <div className="flex items-center gap-8 desktop:gap-16 border-b border-[#797878] w-full pb-2">
        <StatItem title="Total pool" subTitle={currencyFormat(totalPool)} />
        <StatItem title="Gaming pool" subTitle={currencyFormat(totalPool)} />
        <StatItem title="Lottery pool" subTitle={currencyFormat(totalPool)} />
      </div>

      <PoolCard
        btc={pool?.btc || 0}
        paco={pool?.paco || 0}
        eth={pool?.eth || 0}
        bnb={pool?.bnb || 0}
        usdt={pool?.usdt || 0}
        setTotalPool={setTotalPool}
        setTotalNextPool={setTotalNextPool}
      />

      <div className="mt-8 flex flex-col desktop:flex-row items-center justify-between border-t border-[#797878] pt-4">
        <div className="flex items-center gap-4">
          <h4 className="uppercase text-sm desktop:text-xl text-[#b4b3b3]">
            TOTAL STAKED PACO
          </h4>
          <p className="text-white text-sm desktop:text-xl">
            {numberFormat(pool?.totalStakePaco || 0)}
          </p>
        </div>
        {!isLoading && !isAuthenticated && (
          <div className="flex items-center gap-2 desktop:gap-4">
            <h4 className="uppercase text-sm desktop:text-xl text-[#b4b3b3]">
              YOUR SHARE
            </h4>
            <p className="text-white text-sm desktop:text-xl">LOG IN TO SEE</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Pools;
