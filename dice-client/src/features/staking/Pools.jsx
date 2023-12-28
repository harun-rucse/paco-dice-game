import PoolCard from "./PoolCard";
import StatItem from "./StatItem";
import { useCurrentUser } from "../authentication/useCurrentUser";

function Pools() {
  const { isAuthenticated, isLoading } = useCurrentUser();

  return (
    <div className="bg-[#3c2f61] rounded-2xl px-6 py-6">
      <div className="flex items-center gap-8 lg:gap-16 border-b border-[#797878] w-full pb-2">
        <StatItem title="Total pool" subTitle="$27,508" />
        <StatItem title="Gaming pool" subTitle="$26,672" />
      </div>

      <PoolCard btc={0} paco={0} eth={0} bnb={0} usdt={0} />

      <div className="mt-8 flex flex-col lg:flex-row items-center justify-between border-t border-[#797878] pt-4">
        <div className="flex items-center gap-4">
          <h4 className="uppercase text-sm lg:text-xl text-[#b4b3b3]">
            TOTAL STAKED PACO
          </h4>
          <p className="text-white text-sm lg:text-xl">260 798 101 488</p>
        </div>
        {!isLoading && !isAuthenticated && (
          <div className="flex items-center gap-2 lg:gap-4">
            <h4 className="uppercase text-sm lg:text-xl text-[#b4b3b3]">
              YOUR SHARE
            </h4>
            <p className="text-white text-sm lg:text-xl">LOG IN TO SEE</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Pools;
