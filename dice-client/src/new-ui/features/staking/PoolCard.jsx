import { useEffect, useState } from "react";
import { numberFormat, currencyFormat } from "../../../utils/format";
import { getCoinPrice } from "../../../utils/tokenPrice";
import LoadingSpinner from "../../components/LoadingSpinner";
import { addition, multiply } from "../../../utils/decimal";

function SinglePool({ icon, title, subTitle, name }) {
  return (
    <div className="flex gap-3 items-center">
      <img src={icon} alt="" className="w-8 tablet:w-10 object-contain" />
      <div className="flex flex-col">
        <p className="text-white tablet:text-xl">
          {numberFormat(title)}
          <span className="text-[#b4b3b3] pl-3">{name}</span>
        </p>
        {subTitle && (
          <span
            className={`text-[#b4b3b3] tablet:text-lg -mt-1 cursor-pointer`}
            onClick={
              isNaN(subTitle)
                ? () =>
                    window.open(
                      `https://www.dexview.com/bsc/0xe1d0065c4cd16C14C539547bac404cA6F586b8ce`,
                      "_blank"
                    )
                : ""
            }
          >
            {isNaN(subTitle) ? subTitle : currencyFormat(subTitle)}
          </span>
        )}
      </div>
    </div>
  );
}

function PoolCard({
  btc,
  paco,
  eth,
  bnb,
  usdt,
  setTotalPool = () => {},
  setTotalNextPool = () => {},
}) {
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

    setTotalPool(addition(btcUSD, pacoUSD, ethUSD, bnbUSD, usdtUSD));
    setTotalNextPool(
      addition(
        btcUSD < 0 ? 0 : btcUSD,
        pacoUSD < 0 ? 0 : pacoUSD,
        ethUSD < 0 ? 0 : ethUSD,
        bnbUSD < 0 ? 0 : bnbUSD,
        usdtUSD < 0 ? 0 : usdtUSD
      )
    );

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
            subTitle={"$paco"}
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
            name="WBNB"
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
