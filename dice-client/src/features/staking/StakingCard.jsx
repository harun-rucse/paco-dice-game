import MyStake from "./MyStake";
import MyStakeLogin from "./MyStakeLogin";
import Pools from "./Pools";
import Stats from "./Stats";

function StakingCard() {
  return (
    <div className="flex flex-col lg:flex-row items-start gap-4">
      <div className="w-full xl:w-[66.66%] flex flex-col gap-4">
        <Stats />
        <Pools />
      </div>

      {/* <MyStakeLogin /> */}
      <MyStake />
    </div>
  );
}

export default StakingCard;
