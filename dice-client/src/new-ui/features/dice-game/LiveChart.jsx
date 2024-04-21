import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function TextBox({ title, value, color = "#fff" }) {
  return (
    <div className="flex flex-col text-left">
      <span className="text-[#8775b2] text-lg">{title}</span>
      <span className={`${color} text-xl font-extralight text-right`}>
        {value}
      </span>
    </div>
  );
}

function LiveChart({ setShowLiveChart }) {
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

  return (
    <div className="p-4 h-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-lg">Live Chart</span>
          <img src="/images/refresh.png" alt="" className="w-6" />
        </div>
        <img
          src="/images/cross.png"
          alt=""
          className="w-6"
          onClick={() => setShowLiveChart((state) => !state)}
        />
      </div>

      <div className="bg-[#3e325a] py-2 rounded-xl mt-2 desktop:mt-6">
        <div className="space-y-3 desktop:space-y-6">
          <div className="flex justify-between items-center px-4">
            <TextBox title="Profit" value={"122.31$"} />
            <TextBox title="Wins" value={228} color="text-[#6bbb60]" />
          </div>
          <div className="flex justify-between items-center px-4">
            <TextBox title="Wager" value={"1542.22$"} />
            <TextBox title="Looses" value={532} color="text-[#df4850]" />
          </div>

          <div style={{ width: "100%", height: 150 }} className="mt-8">
            <ResponsiveContainer>
              <AreaChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="uv"
                  stroke="#4d905c"
                  fill="#517261"
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
