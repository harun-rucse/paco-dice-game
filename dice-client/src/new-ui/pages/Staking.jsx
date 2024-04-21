import StakingCard from "../features/staking/StakingCard";
import StakingControls from "../features/staking/StakingControls";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import StakeHistoryTable from "../features/staking/StakeHistoryTable";

function Staking() {
  const { isAuthenticated, isLoading } = useCurrentUser();

  return (
    <div className="bg-[#120e1f] w-full h-full px-4 desktop:px-12 py-16 pb-60 space-y-20">
      <div className="desktop:px-12 flex flex-col items-center">
        <div className="flex flex-col desktop:flex-row items-center w-full desktop:w-[77rem] justify-between pb-4">
          <div className="flex desktop:items-center gap-5 mb-4">
            <h2 className="uppercase text-2xl desktop:text-3xl text-white">
              Paco Staking
            </h2>
            <img src="/icons/staking-title.png" alt="" className="w-[38px]" />
          </div>
          {!isLoading && isAuthenticated && <StakingControls />}
        </div>
        <StakingCard />
      </div>
      <StakeHistoryTable />
    </div>
  );
}

export default Staking;
