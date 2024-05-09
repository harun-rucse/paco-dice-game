function AcceptedCurrencies() {
  return (
    <div className="pb-0 tablet:pb-16 desktop:pb-28 flex flex-col desktop:flex-row items-center justify-center gap-4 desktop:gap-16">
      <h2 className="uppercase text-[#6d5e90] text-lg desktop:text-xl">
        Accepted Currencies
      </h2>
      <div className="flex items-center gap-12 desktop:gap-16">
        <img src="/images/btc.png" alt="" className="w-10" />
        <img src="/images/bnb.png" alt="" className="w-10" />
        <img src="/images/eth.png" alt="" className="w-8" />
        <img src="/images/usdt.png" alt="" className="w-10" />
      </div>
    </div>
  );
}

export default AcceptedCurrencies;
