import {
  AreaChart,
  Area,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useGetUsdPricePaco } from "../staking/useGetUsdPricePaco";
import { useDarkMode } from "../../../context/DarkModeContext";

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
  totalWins,
  setTotalWins,
  totalLosses,
  setTotalLosses,
}) {
  const { pacoUSD: totalWinsUSD } = useGetUsdPricePaco(totalWins);
  const { pacoUSD: totalLossesUSD } = useGetUsdPricePaco(totalLosses);
  const { isDarkMode } = useDarkMode();

  const data = [
    {
      name: "Page A",
      uv: 400,
    },
    {
      name: "Page B",
      uv: 800,
    },
    {
      name: "Page C",
      uv: 2600,
    },
    {
      name: "Page D",
      uv: 780,
    },
    {
      name: "Page E",
      uv: 1890,
    },
    {
      name: "Page F",
      uv: 2390,
    },
    {
      name: "Page G",
      uv: 3490,
    },
  ];

  function handleRefresh() {
    setTotalWins(0);
    setTotalLosses(0);
  }

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
            className="w-6 cursor-pointer"
            onClick={handleRefresh}
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
              value={`${Number(totalWinsUSD).toFixed(8)}$`}
            />
            <TextBox title="Wins" value={totalWins} color="text-[#6bbb60]" />
          </div>
          <div className="flex justify-between items-center px-4">
            <TextBox
              title="Wager"
              value={`${Number(totalLossesUSD).toFixed(8)}$`}
            />
            <TextBox
              title="Looses"
              value={totalLosses}
              color="text-[#df4850]"
            />
          </div>

          <div style={{ width: "100%", height: 150 }} className="mt-8">
            <ResponsiveContainer>
              <AreaChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="uv"
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
