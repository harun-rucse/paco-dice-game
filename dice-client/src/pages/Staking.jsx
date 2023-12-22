import StakingCard from "../features/staking/StakingCard";

function Staking() {
  return (
    <div className="w-full h-full py-4 pb-32">
      <div className="flex flex-col lg:flex-row items-center justify-between pb-4">
        <div className="flex lg:items-center gap-3 mb-4">
          <h2 className="uppercase text-2xl lg:text-4xl text-white">
            Paco Staking
          </h2>
          <img src="/icons/staking-title.png" alt="" className="w-[44px]" />
        </div>
        <div className="flex items-center gap-3 lg:gap-8">
          <button className="button text-sm lg:text-lg">About Staking</button>
          <button className="button text-sm lg:text-lg">About Paco</button>
          <button className="button text-sm lg:text-lg !bg-[#32a45f] !border-[#316A48]">
            Calculate
          </button>
        </div>
      </div>
      <StakingCard />
    </div>
  );
}

export default Staking;
