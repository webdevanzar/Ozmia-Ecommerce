import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { useDispatch } from "react-redux";

import { FaShoppingCart } from "react-icons/fa";
import { BsLightningFill } from "react-icons/bs";

import { useProduct } from "../hooks/useUserProducts";
import { useAddToCart } from "../hooks/useUserCart";
import { addToCart } from "../redux/cartSlice";
import { showToast } from "../utils/toast";

const ProductDetail = () => {
  const { id } = useParams();
  const { data, isSuccess } = useProduct(id);

  const { mutate } = useAddToCart();
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    if (!id) return;

    mutate(
      {
        product_id: id,
        quantity: 1,
      },
      {
        onSuccess: () => {
          dispatch(addToCart());
          toast.dismiss();
          toast.success("Item Added to Cart", {
            duration: 3000,
            style: { background: "green" },
          });
        },
        onError: (error: any) => {
          const message =
            error?.response?.data?.message || error?.message || "Unknown error";
          toast.dismiss();
          showToast(message, "error");
        },
      }
    );
  };
  return (
    <div className="min-h-[100vh]">
      <div className="w-full flex justify-center items-center relative">
        <h1 className="text-3xl font-bold text-primary text-center border-b-2 w-[85%] m-auto pb-2 sticky p-5">
          {data?.title}
        </h1>
      </div>

      {isSuccess && (
        <div className="flex justify-center items-center w-full md:h-[80vh] py-10 md:py-0">
          <div className="w-3/4 border-2 flex flex-col md:flex-row justify-between gap-x-5 h-4/5 md:h-5/6 border-secondary rounded-md">
            <div className="md:w-1/2 h-1/2 md:h-full">
              <img
                src={data?.image as string}
                alt="data image"
                className="h-full w-full object-contain md:object-fill rounded-md"
              />
            </div>
            <div className="md:w-1/2 max-h-[500px] md:h-auto flex flex-col items-center justify-center gap-y-3 md:gap-y-7 p-2">
              <p className="text-xl font-bold text-primary">
                Price :₹{data.price}
                <span className="pl-2 text-sm text-gray-700 line-through">
                  ₹1569
                </span>
              </p>

              <p className="text-left text-sm text-gray-800 p-2 overflow-y-auto border-[1px] rounded-md">
                <span className="font-bold">Details:-</span>
                <br />
                <br />
                {data?.description}
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum
                vero a ullam itaque molestiae quam iste voluptatibus ipsam
                impedit, libero natus. Maxime voluptas itaque dignissimos ad
                quibusdam culpa ducimus voluptatem? Lorem ipsum dolor sit amet
                consectetur adipisicing elit. Earum vero a ullam itaque
                molestiae quam iste voluptatibus ipsam impedit, libero natus.
                Maxime voluptas itaque dignissimos ad quibusdam culpa ducimus
                voluptatem?
              </p>
              <div className="flex justify-center gap-x-2 w-full">
                <button
                  onClick={handleAddToCart}
                  disabled={data.isdeleted}
                  className={`${
                    data.isdeleted
                      ? "bg-yellow-200 cursor-not-allowed text-gray-400"
                      : "bg-secondary cursor-pointer text-white"
                  } w-1/2 gap-x-2 flex justify-center items-center rounded-sm p-2 lg:p-4 font-bold  text-xs md:text-base`}
                >
                  <FaShoppingCart />
                  ADD TO CART
                </button>
                <button
                  disabled={data.isdeleted}
                  className={`${
                    data.isdeleted
                      ? "bg-blue-400 cursor-not-allowed text-gray-600"
                      : "bg-blue-700 text-white cursor-pointer"
                  } w-1/2 gap-x-2 flex justify-center items-center  rounded-sm p-2 lg:p-4 font-bold  text-xs md:text-base`}
                >
                  <BsLightningFill />
                  BUY NOW
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
