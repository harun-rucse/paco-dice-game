import PoolCard from "./PoolCard";

function MyStake() {
  return (
    <div className="flex flex-col md:self-stretch bg-[#3c2f61] rounded-2xl px-4 py-4 w-full lg:w-[33.33%] relative">
      <img
        src="/icons/rocket-icon.png"
        alt=""
        className="absolute -top-6 lg:-top-10 -right-4 lg:-right-6 w-20 lg:w-24"
      />
      <div className="flex gap-4 items-start border-b border-[#8b849d] pb-6">
        <img
          src="/icons/paco-icon.png"
          alt=""
          className="w-16 object-contain"
        />
        <div>
          <p className="uppercase lg:text-xl text-[#B4B3B3]">MY STAKED PACO</p>
          <p className="text-white lg:text-xl">26 798 101 458</p>
          <p className="text-[#B4B3B3] lg:text-lg">$1135,12</p>
        </div>
      </div>
      <p className="flex items-center gap-2 uppercase text-[#B4B3B3] pt-4">
        My Staking payouts
        <img src="/icons/money-bag.png" alt="" className="w-5" />
      </p>

      <PoolCard />

      <button className="button self-center mt-12 !bg-[#d11f1f] !px-12 !py-2">
        Claim
      </button>
    </div>
  );
}

export default MyStake;
