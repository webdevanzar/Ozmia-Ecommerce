import {
  RadialBarChart,
  RadialBar,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    name: "Revenue",
    uv: 799,
    fill: "#83a6ed",
  },
  {
    name: "Orders",
    uv: 111,
    fill: "#8884d8",
  },

  {
    name: "New Customers",
    uv: 199,
    fill: "#8dd1e1",
  },
  {
    name: "Delivered Orders",
    uv: 300,
    fill: "#82ca9d",
  },
  {
    name: "Pending Orders",
    uv: 200,
    fill: "#a4de6c",
  },
];

const style = {
  top: "50%",
  right: 0,
  transform: "translate(0, -50%)",
  lineHeight: "24px",
};

export const ChartTwo = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadialBarChart
        cx="30%"
        cy="50%"
        innerRadius="10%"
        outerRadius="100%"
        barSize={14}
        data={data}
      >
        <RadialBar
          label={{ position: "insideStart", fill: "#000" }}
          background
          //   clockWise
          dataKey="uv"
        />
        <Legend
          iconSize={10}
          layout="vertical"
          verticalAlign="middle"
          wrapperStyle={style}
        />
      </RadialBarChart>
    </ResponsiveContainer>
  );
};
