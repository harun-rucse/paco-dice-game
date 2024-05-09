import { useEffect, useState } from "react";
import Table from "../../components/TableClient";
import useGetStakeCalculator from "./useGetStakeCalculator";
import { numberFormat, currencyFormat } from "../../../utils/format";
import { useGetUsdPricePaco } from "./useGetUsdPricePaco";
import { getCoinPrice } from "../../../utils/tokenPrice";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useCurrentUser } from "../../features/authentication/useCurrentUser";
import { addition, multiply } from "../../../utils/decimal";
import { cn } from "../../../utils";
import useGetPayouts from "./useGetPayouts";

function SelectButton({ handleOnClick, children, activeTab }) {
  return (
    <button
      className={cn(
        "text-sm lg:text-lg px-1 lg:px-8 py-1 rounded-lg transition hover:bg-[#66478e]",
        activeTab && "bg-[#66478e]"
      )}
      onClick={handleOnClick}
    >
      {children}
    </button>
  );
}

function StakingCalculator() {
  const [paco, setPaco] = useState("1000000");
  const [dailyUSD, setDailyUSD] = useState("");
  const [monthlyUSD, setMonthlyUSD] = useState("");
  const [perQuarterUSD, setPerQuarterUSD] = useState("");
  const [perYearUSD, setPerYearUSD] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("1M");

  const [btcPrice, setBtcPrice] = useState(0);
  const [pacoPrice, setPacoPrice] = useState(0);
  const [ethPrice, setEthPrice] = useState(0);
  const [bnbPrice, setBnbPrice] = useState(0);
  const [usdtPrice, setUsdtPrice] = useState(0);

  const { isLoading: isFetching, calculator } = useGetStakeCalculator(paco);
  const { pacoUSD } = useGetUsdPricePaco(paco);
  const { user: account } = useCurrentUser();
  const { isLoading: isFetching2, payouts } = useGetPayouts();
  const {
    rewardPaco = 0,
    rewardBtc = 0,
    rewardEth = 0,
    rewardBnb = 0,
    rewardUsdt = 0,
  } = calculator || {};

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
    const btcUSD = multiply(btcPrice, rewardBtc);
    const pacoUSD = multiply(pacoPrice, rewardPaco);
    const ethUSD = multiply(ethPrice, rewardEth);
    const bnbUSD = multiply(bnbPrice, rewardBnb);
    const usdtUSD = multiply(usdtPrice, rewardUsdt);

    const dailyTotalUSD = addition(btcUSD, pacoUSD, ethUSD, bnbUSD, usdtUSD);
    setDailyUSD(dailyTotalUSD);
    setMonthlyUSD(multiply(dailyTotalUSD, 30));
    setPerQuarterUSD(multiply(dailyTotalUSD, 90));
    setPerYearUSD(multiply(dailyTotalUSD, 365));
  }, [
    btcPrice,
    pacoPrice,
    ethPrice,
    bnbPrice,
    usdtPrice,
    rewardBtc,
    rewardPaco,
    rewardEth,
    rewardBnb,
    rewardUsdt,
  ]);

  const handleChange = (e) => {
    const { value } = e.target;
    // if (!value) return;

    setPaco(Number(value));
  };

  const handleSelectBtn = (value, tabName) => {
    setPaco(value);
    setActiveTab(tabName);
  };

  const data = [
    {
      icon: "/tokens/paco.png",
      daily: rewardPaco,
      monthly: multiply(rewardPaco, 3),
      perQuarter: multiply(rewardPaco, 90),
      perYear: multiply(rewardPaco, 365),
    },
    {
      icon: "/tokens/btc.png",
      daily: rewardBtc,
      monthly: multiply(rewardBtc, 30),
      perQuarter: multiply(rewardBtc, 90),
      perYear: multiply(rewardBtc, 365),
    },
    {
      icon: "/tokens/eth.png",
      daily: rewardEth,
      monthly: multiply(rewardEth, 30),
      perQuarter: multiply(rewardEth, 90),
      perYear: multiply(rewardEth, 365),
    },
    {
      icon: "/tokens/bnb.png",
      daily: rewardBnb,
      monthly: multiply(rewardBnb, 30),
      perQuarter: multiply(rewardBnb, 90),
      perYear: multiply(rewardBnb, 365),
    },
    {
      icon: "/tokens/usdt.png",
      daily: rewardUsdt,
      monthly: multiply(rewardUsdt, 30),
      perQuarter: multiply(rewardUsdt, 90),
      perYear: multiply(rewardUsdt, 365),
    },
  ];

  return (
    <div className="text-white p-4 lg:p-8 space-y-4">
      <h4 className="text-2xl font-[Poppins]">Staking Calculator</h4>
      <p className="text-sm font-[Poppins]">
        Calculate the potential earnings from your staked $PACO tokens! Simply
        input the quantity in the field to view estimated payouts in each
        cryptocurrencies over different timeframes. The greater the number of
        tokens you stake, the greater your potential profit.
      </p>

      <div className="bg-[#1e132d] border p-1 border-[#A856E9] rounded-lg flex items-center justify-between">
        <SelectButton
          handleOnClick={() => handleSelectBtn("1000000", "1M")}
          activeTab={activeTab === "1M"}
        >
          1M
        </SelectButton>
        <SelectButton
          handleOnClick={() => handleSelectBtn("10000000", "10M")}
          activeTab={activeTab === "10M"}
        >
          10M
        </SelectButton>
        <SelectButton
          handleOnClick={() => handleSelectBtn("100000000", "100M")}
          activeTab={activeTab === "100M"}
        >
          100M
        </SelectButton>
        <SelectButton
          handleOnClick={() => handleSelectBtn("1000000000", "1B")}
          activeTab={activeTab === "1B"}
        >
          1B
        </SelectButton>
        <SelectButton
          handleOnClick={() => handleSelectBtn("10000000000", "10B")}
          activeTab={activeTab === "10B"}
        >
          10B
        </SelectButton>
        <SelectButton
          handleOnClick={() => handleSelectBtn(payouts?.amount, "My Balance")}
          activeTab={activeTab === "My Balance"}
        >
          My Balance
        </SelectButton>
      </div>

      <div className="space-y-2 pt-4 lg:pt-8">
        <span className="text-[#b4b3b3] text-xl">
          {currencyFormat(pacoUSD || 0)}
        </span>
        <div className="bg-[#1e132d] border px-6 py-2 border-[#A856E9] rounded-lg flex items-center gap-12">
          <img src="/tokens/paco.png" alt="" className="object-contain w-8" />
          <input
            type="text"
            className="text-lg bg-transparent w-full focus:outline-none "
            value={paco}
            onChange={handleChange}
          />
        </div>
      </div>

      {isFetching || loading || isFetching2 ? (
        <LoadingSpinner className="h-[25rem]" />
      ) : (
        <Table columns="grid-cols-[1fr_1fr_1fr_1fr]">
          <Table.Header>
            <span>Daily</span>
            <span>Monthly</span>
            <span>Per quarter</span>
            <span>Per year</span>
          </Table.Header>
          <Table.Body>
            {data?.map((row, i) => (
              <Table.Row key={i}>
                <div className="flex items-start gap-2">
                  <img
                    src={row.icon}
                    alt=""
                    className="h-6 lg:h-8 object-contain -mt-1"
                  />
                  <span>{numberFormat(row.daily)}</span>
                </div>
                <span>{numberFormat(row.monthly)}</span>
                <span>{numberFormat(row.perQuarter)}</span>
                <span>{numberFormat(row.perYear)}</span>
              </Table.Row>
            ))}
          </Table.Body>
          <Table.Footer className="pt-2">
            <div className="flex items-center gap-2 border-b pb-2 mx-1">
              <img
                src="/icons/currency-icon.png"
                alt=""
                className="h-6 lg:h-8 object-contain"
              />
              <span className="text-[#b4b3b3] uppercase">TOTAL IN USD</span>
            </div>
            <Table.Row className="px-6">
              <span>{currencyFormat(dailyUSD)}</span>
              <span>{currencyFormat(monthlyUSD)}</span>
              <span>{currencyFormat(perQuarterUSD)}</span>
              <span>{currencyFormat(perYearUSD)}</span>
            </Table.Row>
          </Table.Footer>
        </Table>
      )}
    </div>
  );
}

export default StakingCalculator;
