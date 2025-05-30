import { MdCurrencyRupee } from "react-icons/md";
import { FaArrowTrendDown } from "react-icons/fa6";
import { GoArrowDownRight } from "react-icons/go";
import { BsArrowUpRight } from "react-icons/bs";

import { Chart } from "../components/Chart";
import { useOrders } from "../hooks/useAdmin";
import type { IconType } from "react-icons";
import { ChartTwo } from "../components/BarChart";

type StatItem = {
  id: "sales" | "expense" | "credit" | "debit";
  title: string;
  icon: IconType;
  value: number | undefined;
};
const Dashbord = () => {
  const { data: orders, isLoading } = useOrders();
  const totalSales = orders?.reduce(
    (total, item) => (total += Number(item.total_price)),
    0
  );
  const data: StatItem[] = [
    {
      id: "sales",
      title: "Total Sales",
      icon: MdCurrencyRupee, //blue
      value: totalSales,
    },
    {
      id: "expense",
      title: "Total Expenses",
      icon: FaArrowTrendDown, //red
      value: 30000,
    },
    {
      id: "credit",
      title: "Total Credit",
      icon: BsArrowUpRight, //orange
      value: 75999,
    },
    {
      id: "debit",
      title: "Total Debit",
      icon: GoArrowDownRight, //violet
      value: 50000,
    },
  ];
  const colorMap = {
    sales: "blue",
    expense: "red",
    credit: "orange",
    debit: "violet",
  };

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-bl from-primary to-white">
      <div className="w-full flex justify-center items-center">
        <h1 className="text-3xl font-bold text-primary text-center border-b-2 w-[85%] m-auto pb-2 sticky p-5">
          Dashbord
        </h1>
      </div>

      <div className="w-full h-full">
        <div className="w-10/12 h-1/2 flex justify-between m-auto">
          <div className="w-1/2  mt-5 flex flex-wrap justify-start gap-5">
            {data.map((Item) => (
              <div
                key={Item.id}
                className="bg-white rounded-md border-2 border-secondary w-48 h-32 shadow-md"
              >
                <div className="flex justify-center items-center pt-10 gap-x-2 h-1/3">
                  <h2 className="text-lg">{Item.title}</h2>
                  <Item.icon color={colorMap[Item.id]} />
                </div>
                <div className="h-2/3 flex justify-center items-center p-4">
                  <p className="text-2xl font-semibold">₹{Item.value}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="w-1/2 p-10">
            <h1 className="text-xl pt-3 text-white font-bold">
              Today's status
            </h1>
            <ChartTwo />
          </div>
        </div>

        <div className="h-1/2 w-11/12 m-auto pb-10">
          <Chart />
        </div>
      </div>

      {isLoading && (
        <div
          role="status"
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        >
          <svg
            aria-hidden="true"
            className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      )}
    </div>
  );
};

export default Dashbord;
