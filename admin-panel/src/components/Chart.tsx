import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Jan", items: 4000, revenue: 2400 },
  { name: "Feb", items: 4500, revenue: 2900 },
  { name: "Mar", items: 2000, revenue: 9800 },
  { name: "Apr", items: 3000, revenue: 6800 },
  { name: "May", items: 1890, revenue: 4800 },
  { name: "Jun", items: 2890, revenue: 5000 },
  { name: "Jul", items: 3490, revenue: 4300 },
  { name: "Aug", items: 7490, revenue: 5300 },
  { name: "Sep", items: 3490, revenue: 2000 },
  { name: "Oct", items: 3790, revenue: 2500 },
  { name: "Nov", items: 3490, revenue: 4300 },
  { name: "Dec", items: 5490, revenue: 2300 },
];

export const Chart = () => {
  return (
    <div className="w-full h-full rounded-2xl p-5 text-black m-auto">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          // margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid stroke="#4A7D5D" />
          <XAxis dataKey="name" stroke="#000" />
          <YAxis stroke="#000" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#00CF67",
              borderColor: "#765D03",
              width: "150px", // 👈 Set fixed width
              maxWidth: "250px",
              color: "#fff",
            }}
            labelStyle={{ color: "#fff" }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="items"
            stroke="#765D03"
            strokeWidth={2}
            dot={{ fill: "#FFD700" }}
            activeDot={{ r: 8 }}
            name="Items Sold"
          />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#004A25"
            strokeWidth={2}
            dot={{ fill: "#00CF67" }}
            name="Revenue"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
