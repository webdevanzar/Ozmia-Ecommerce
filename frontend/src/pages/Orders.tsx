import { Link } from "react-router-dom";
import { useGetOrders } from "../hooks/useUserOrders";
import { formatDate } from "../utils/formatDate";

const Orders = () => {
  const { data: orders, isSuccess, isLoading } = useGetOrders();

  return (
    <div className="min-h-[100dvh] py-10 text-center bg-slate-50  max-h-screen  overflow-y-auto">
      <h1 className="text-3xl font-bold p-2 border-b-2 w-2/3 m-auto">
        Your Orders
      </h1>

      {orders
        ?.slice()
        .reverse()
        .map((order) => (
          <div
            key={order.id}
            className="w-5/6 lg:w-2/3 m-auto pt-2 flex flex-col gap-y-2 border-2 border-slate-400 my-5 rounded-md p-5"
          >
            <div className="flex justify-between items-center">
              <h1 className="text-left p-2 text-xl font-semibold">
                {formatDate(order.purchase_date)}
              </h1>
              <p className="font-semibold text-green-800">
                Total Price:₹{order.total_price}
              </p>
            </div>
            {order.order_items?.map((item) => (
              <div
                key={item.id}
                className="w-full h-[320px] md:h-[220px] rounded-lg border-2"
              >
                <div className="bg-gray-100 px-5 flex justify-between items-center m-auto h-1/6 md:h-1/3 text-sm text-gray-700">
                  <div className="flex justify-start gap-x-10 items-center ">
                    <div>
                      <p>ORDER PLACED</p>
                      <p>{formatDate(order.purchase_date)}</p>
                    </div>
                    <div>
                      <p>PRICE</p>
                      <p>₹{item.price}</p>
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <p>ORDER # 402-4277828-6313169</p>
                    <p className="text-blue-800 text-right hover:underline">
                      View Order Details
                    </p>
                  </div>
                </div>
                <div className="w-full px-5 h-3/6 md:h-2/3 flex justify-between items-center">
                  <div className="flex gap-x-5">
                    <div className="w-32 md:w-24 md:h-24 border-2 rounded-full">
                      <img
                        src={item.products.image as string}
                        alt="Product"
                        className="w-full rounded-full h-full"
                      />
                    </div>
                    <div>
                      <Link to={`/products/${item.products.id}`}>
                        <p className="text-blue-800 text-left hover:underline">
                          {item.products.title}
                        </p>
                      </Link>

                      <p className="pt-1">
                        Return window closed on 14 December 2024
                      </p>
                    </div>
                  </div>
                  <div className="hidden md:flex flex-col gap-y-2">
                    <button className="border-[1px] border-black rounded-full py-1 px-4 text-sm cursor-pointer">
                      Write a product review
                    </button>
                    <button className="border-[1px] border-black rounded-full  py-1 px-4  text-sm cursor-pointer">
                      buy again
                    </button>
                  </div>
                </div>
                <div className="block md:hidden px-2">
                  <p className="text-right">ORDER # 402-4277828-6313169</p>
                  <p className="text-blue-800 text-right hover:underline">
                    View Order Details
                  </p>
                </div>
                <div className="flex md:hidden flex-row gap-x-2 w-full p-3">
                  <button className="w-1/2 border-[1px] border-black rounded-full py-1 px-2 text-sm cursor-pointer">
                    Write a review
                  </button>
                  <button className="w-1/2 border-[1px] border-black rounded-full  py-1 px-2  text-sm cursor-pointer">
                    buy again
                  </button>
                </div>
              </div>
            ))}
          </div>
        ))}

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

      {isSuccess && Array.isArray(orders) && orders.length === 0 && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <h1 className="text-3xl text-secondary">No Items Ordered</h1>
        </div>
      )}
    </div>
  );
};

export default Orders;
