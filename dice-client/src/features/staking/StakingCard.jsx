import MyStake from "./MyStake";
import MyStakeLogin from "./MyStakeLogin";
import Pools from "./Pools";
import Stats from "./Stats";
import { useCurrentUser } from "../authentication/useCurrentUser";

function StakingCard() {
  const { isAuthenticated, isLoading } = useCurrentUser();

  return (
    <div className="flex flex-col lg:flex-row items-start gap-4">
      <div className="w-full xl:w-[66.66%] flex flex-col gap-4">
        <Stats />
        <Pools />
      </div>

      {!isLoading && isAuthenticated ? <MyStake /> : <MyStakeLogin />}
    </div>
  );
}

export default StakingCard;
