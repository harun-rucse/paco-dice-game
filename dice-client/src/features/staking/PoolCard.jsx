import { numberFormat, currencyFormat } from "../../utils/format";

function SinglePool({ icon, title, subTitle, name }) {
  return (
    <div className="flex gap-3 items-center">
      <img src={icon} alt="" className="w-8 lg:w-10 object-contain" />
      <div className="flex flex-col">
        <p className="text-white lg:text-xl">
          {numberFormat(title)}
          <span className="text-[#b4b3b3] pl-3">{name}</span>
        </p>
        <span className="text-[#b4b3b3] lg:text-lg -mt-1">
          {currencyFormat(subTitle)}
        </span>
      </div>
    </div>
  );
}

function PoolCard({ btc, paco, eth, bnb, usdt }) {
  return (
    <div className="pt-6 space-y-5">
      <SinglePool
        icon="/tokens/btc.png"
        title={btc}
        subTitle="26208"
        name="BTC"
      />
      <SinglePool
        icon="/tokens/paco.png"
        title={paco}
        subTitle="130011"
        name="PACO"
      />
      <SinglePool
        icon="/tokens/eth.png"
        title={eth}
        subTitle="130011"
        name="ETH"
      />
      <SinglePool
        icon="/tokens/bnb.png"
        title={bnb}
        subTitle="130011"
        name="BNB"
      />
      <SinglePool
        icon="/tokens/usdt.png"
        title={usdt}
        subTitle="130011"
        name="USDT"
      />
    </div>
  );
}

export default PoolCard;
