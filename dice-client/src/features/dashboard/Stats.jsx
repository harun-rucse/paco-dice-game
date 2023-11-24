import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Filter from "../../components/admin/Filter";

const data = [
  {
    name: "Jan",
    uv: 1000,
    pv: 1000,
    amt: 1000,
  },
  {
    name: "Feb",
    uv: 2000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "Mar",
    uv: 900,
    pv: 9800,
    amt: 2290,
  },
  {
    name: "April",
    uv: 1500,
    pv: 3908,
    amt: 2000,
  },
  {
    name: "May",
    uv: 1200,
    pv: 4800,
    amt: 2181,
  },
  {
    name: "Jun",
    uv: 2900,
    pv: 3800,
    amt: 2500,
  },
  {
    name: "Jul",
    uv: 2400,
    pv: 4300,
    amt: 2100,
  },
  {
    name: "Aug",
    uv: 1800,
    pv: 4300,
    amt: 2100,
  },
  {
    name: "SEp",
    uv: 2800,
    pv: 250,
    amt: 1200,
  },
  {
    name: "Oct",
    uv: 2000,
    pv: 4300,
    amt: 2100,
  },
  {
    name: "Nov",
    uv: 1600,
    pv: 4300,
    amt: 2100,
  },
  {
    name: "Dec",
    uv: 2400,
    pv: 4300,
    amt: 2100,
  },
];

function Stats() {
  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <div className="self-end">
        <Filter
          filterField="last"
          options={[
            { value: "all", label: "All" },
            { value: "week", label: "Week" },
            { value: "month", label: "Month" },
            { value: "year", label: "Year" },
          ]}
        />
      </div>
      <div className="bg-[#24292d] rounded-xl">
        <ResponsiveContainer width="95%" height={360}>
          <AreaChart
            data={data}
            margin={{
              top: 0,
              right: 0,
              left: 0,
              bottom: 0,
            }}
          >
            <XAxis
              dataKey="name"
              tick={{ fill: "#fff" }}
              tickLine={{ stroke: "#fff" }}
            />
            <YAxis style={{ display: "none" }} />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="uv"
              stroke="#5819ae"
              fill="#81429c"
              unit="$"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Stats;
