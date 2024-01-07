import { useEffect, useState } from "react";
import { numberFormat, currencyFormat } from "../../utils/format";
import { getCoinPrice } from "../../utils/tokenPrice";
import LoadingSpinner from "../../components/LoadingSpinner";
import { addition, multiply } from "../../utils/decimal";

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

function PoolCard({ btc, paco, eth, bnb, usdt, setTotalPool = () => {} }) {
  const [loading, setLoading] = useState(false);
  const [btcPrice, setBtcPrice] = useState(0);
  const [pacoPrice, setPacoPrice] = useState(0);
  const [ethPrice, setEthPrice] = useState(0);
  const [bnbPrice, setBnbPrice] = useState(0);
  const [usdtPrice, setUsdtPrice] = useState(0);

  const [usdBtc, setUsdBtc] = useState(0);
  const [usdPaco, setUsdPaco] = useState(0);
  const [usdEth, setUsdEth] = useState(0);
  const [usdBnb, setUsdBnb] = useState(0);
  const [usdUsdt, setUsdUsdt] = useState(0);

  useEffect(() => {
    const convertInUSDPrice = async () => {
      setLoading(true);

      const btcPrice = await getCoinPrice("btc");
      const pacoPrice = await getCoinPrice("paco");
      const ethPrice = await getCoinPrice("eth");
      const bnbPrice = await getCoinPrice("bnb");
      const usdtPrice = await getCoinPrice("usdt");

      setBtcPrice(btcPrice);
      setPacoPrice(pacoPrice);
      setEthPrice(ethPrice);
      setBnbPrice(bnbPrice);
      setUsdtPrice(usdtPrice);

      setLoading(false);
    };

    convertInUSDPrice();
  }, []);

  useEffect(() => {
    const btcUSD = multiply(btcPrice, btc);
    const pacoUSD = multiply(pacoPrice, paco);
    const ethUSD = multiply(ethPrice, eth);
    const bnbUSD = multiply(bnbPrice, bnb);
    const usdtUSD = multiply(usdtPrice, usdt);

    // Update total pool price in usd
    setTotalPool(addition(btcUSD, pacoUSD, ethUSD, bnbUSD, usdtUSD));

    setUsdBtc(btcUSD);
    setUsdPaco(pacoUSD);
    setUsdEth(ethUSD);
    setUsdBnb(bnbUSD);
    setUsdUsdt(usdtUSD);
  }, [
    btcPrice,
    pacoPrice,
    ethPrice,
    bnbPrice,
    usdtPrice,
    btc,
    paco,
    eth,
    bnb,
    usdt,
    setTotalPool,
  ]);

  return (
    <div className="pt-6 space-y-5">
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <SinglePool
            icon="/tokens/btc.png"
            title={btc}
            subTitle={usdBtc}
            name="BTC"
          />
          <SinglePool
            icon="/tokens/paco.png"
            title={paco}
            subTitle={usdPaco}
            name="PACO"
          />
          <SinglePool
            icon="/tokens/eth.png"
            title={eth}
            subTitle={usdEth}
            name="ETH"
          />
          <SinglePool
            icon="/tokens/bnb.png"
            title={bnb}
            subTitle={usdBnb}
            name="BNB"
          />
          <SinglePool
            icon="/tokens/usdt.png"
            title={usdt}
            subTitle={usdUsdt}
            name="USDT"
          />
        </>
      )}
    </div>
  );
}

export default PoolCard;
