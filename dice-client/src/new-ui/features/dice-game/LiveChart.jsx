import {
  AreaChart,
  Area,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useDarkMode } from "../../../context/DarkModeContext";
import { useEffect, useState } from "react";
import * as decimal from "../../../utils/decimal";
import { useBalance } from "../../../context/BalanceContext";

function TextBox({ title, value, color = "#fff" }) {
  return (
    <div className="flex flex-col text-left">
      <span className="text-[#817dc3] dark:text-[#8775b2] text-lg">
        {title}
      </span>
      <span className={`${color} text-xl font-extralight text-right`}>
        {value}
      </span>
    </div>
  );
}

function LiveChart({
  setShowLiveChart,
  totalProfit,
  setTotalProfit,
  totalWins,
  setTotalWins,
  totalWager,
  setTotalWager,
  totalLoss,
  setTotalLoss,
  tokenPrice,
}) {
  const [totalWinsUSD, setTotalWinsUSD] = useState(0);
  const [totalLossesUSD, setTotalLossesUSD] = useState(0);
  const [data, setData] = useState([]);
  const [isRefresh, setIsRefresh] = useState(false);

  const { isDarkMode } = useDarkMode();
  const { currentBalance } = useBalance();

  useEffect(() => {
    if (!tokenPrice) return;

    const _totalWinsUSD = decimal.addition(
      decimal.multiply(totalProfit.btc, tokenPrice.btc),
      decimal.multiply(totalProfit.usdt, tokenPrice.usdt),
      decimal.multiply(totalProfit.paco, tokenPrice.paco),
      decimal.multiply(totalProfit.eth, tokenPrice.eth),
      decimal.multiply(totalProfit.bnb, tokenPrice.bnb)
    );

    setTotalWinsUSD(_totalWinsUSD);
  }, [totalProfit, tokenPrice]);

  useEffect(() => {
    if (!tokenPrice) return;

    const _totalLossesUSD = decimal.addition(
      decimal.multiply(totalWager.btc, tokenPrice.btc),
      decimal.multiply(totalWager.usdt, tokenPrice.usdt),
      decimal.multiply(totalWager.paco, tokenPrice.paco),
      decimal.multiply(totalWager.eth, tokenPrice.eth),
      decimal.multiply(totalWager.bnb, tokenPrice.bnb)
    );

    setTotalLossesUSD(_totalLossesUSD);
  }, [totalWager, tokenPrice]);

  useEffect(() => {
    setData((prev) => [
      ...prev,
      { profit: Number(totalWinsUSD) < 0 ? 0 : Number(totalWinsUSD) },
    ]);
  }, [totalWinsUSD]);

  useEffect(() => {
    setTotalWins(0);
    setTotalLoss(0);
    setTotalProfit({
      btc: 0,
      usdt: 0,
      paco: 0,
      eth: 0,
      bnb: 0,
    });
    setTotalWager({
      btc: 0,
      usdt: 0,
      paco: 0,
      eth: 0,
      bnb: 0,
    });
    setData([]);
  }, [currentBalance?.name, isRefresh]);

  return (
    <div className="p-4 h-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-lg">Live Chart</span>
          <img
            src={
              isDarkMode ? "/images/refresh-dark.png" : "/images/refresh.png"
            }
            alt=""
            className="w-8 cursor-pointer"
            onClick={() => setIsRefresh((prev) => !prev)}
          />
        </div>
        <img
          src="/images/cross.png"
          alt=""
          className="w-6 cursor-pointer"
          onClick={() => setShowLiveChart((state) => !state)}
        />
      </div>

      <div className="bg-[#2b295d] dark:bg-[#3e325a] py-2 rounded-xl mt-2 desktop:mt-6">
        <div className="space-y-3 desktop:space-y-6">
          <div className="flex justify-between items-center px-4">
            <TextBox
              title="Profit"
              color={
                totalWinsUSD == 0
                  ? "text-white"
                  : totalWinsUSD < 0
                  ? "text-[#df4850]"
                  : "text-[#6bbb60]"
              }
              value={`${Number(totalWinsUSD).toFixed(8)}$`}
            />
            <TextBox title="Wins" value={totalWins} color="text-[#6bbb60]" />
          </div>
          <div className="flex justify-between items-center px-4">
            <TextBox
              title="Wager"
              value={`${Number(totalLossesUSD).toFixed(8)}$`}
            />
            <TextBox title="Looses" value={totalLoss} color="text-[#df4850]" />
          </div>

          <div style={{ width: "100%", height: 150 }} className="mt-8">
            <ResponsiveContainer>
              <AreaChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip formatter={(val) => Number(val).toFixed(8)} />
                <Area
                  type="monotone"
                  dataKey="profit"
                  stroke={isDarkMode ? "#4d905c" : "#4b905d"}
                  fill={isDarkMode ? "#517261" : "#4e7162"}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LiveChart;
