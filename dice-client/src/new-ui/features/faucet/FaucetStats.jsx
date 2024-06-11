function FaucetStats() {
  return (
    <div className="bg-[#24224a] border border-[#3d3b72] p-3 rounded-md flex flex-col tablet:flex-row gap-3 tablet:gap-0 items-center justify-between">
      <div className="flex items-center gap-2">
        <img src="/images/paco.png" alt="" className="w-7" />
        <span className="uppercase laptop:text-lg">Faucet Tournament</span>
      </div>

      <div className="flex items-center gap-2">
        <span className="uppercase laptop:text-lg">
          Prize pool: {"1M"} Paco
        </span>
        <img src="/images/paco.png" alt="" className="w-7" />
      </div>

      <div className="flex items-center gap-2">
        <img src="/images/paco.png" alt="" className="w-7" />
        <span className="uppercase laptop:text-lg">
          Time left: {"1H 23M 20S"}
        </span>
      </div>
    </div>
  );
}

export default FaucetStats;
