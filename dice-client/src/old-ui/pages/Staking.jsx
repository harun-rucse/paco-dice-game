import StakingCard from "../features/staking/StakingCard";
import StakingControls from "../features/staking/StakingControls";
import { useCurrentUser } from "../features/authentication/useCurrentUser";

function Staking() {
  const { isAuthenticated, isLoading } = useCurrentUser();

  return (
    <div className="w-full h-full py-4 pb-32">
      <div className="flex flex-col lg:flex-row items-center justify-between pb-4">
        <div className="flex lg:items-center gap-3 mb-4">
          <h2 className="uppercase text-2xl lg:text-4xl text-white">
            Paco Staking
          </h2>
          <img src="/icons/staking-title.png" alt="" className="w-[44px]" />
        </div>
        {!isLoading && isAuthenticated && <StakingControls />}
      </div>
      <StakingCard />
    </div>
  );
}

export default Staking;
