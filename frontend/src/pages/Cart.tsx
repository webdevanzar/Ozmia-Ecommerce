import { CiCircleMinus, CiCirclePlus } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { useDeleteCart, useGetCart, useUpdateCart } from "../hooks/useUserCart";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { showToast } from "../utils/toast";
import { useDispatch } from "react-redux";
import {
  decrement,
  increment,
  deletefromCart,
  makeCartEmpty,
} from "../redux/cartSlice";
import { usePlaceOrder } from "../hooks/useUserOrders";
type UpdateCartArgs = {
  product_id: string;
  quantity: boolean;
};

const Cart = () => {
  const dispatch = useDispatch();
  const [total, setTotal] = useState(0);
  const { data: cartlist, isLoading, isSuccess } = useGetCart();
  const { mutate: update } = useUpdateCart();
  const { mutate: deleteFromCart } = useDeleteCart();
  const { mutate: placeOrder } = usePlaceOrder();

  const updateCart = ({ product_id, quantity }: UpdateCartArgs) => {
    if (!product_id) return;

    update(
      { product_id, quantity },
      {
        onSuccess: () => {
          if (quantity) {
            dispatch(increment());
          } else {
            dispatch(decrement());
          }

          toast.dismiss();
          toast.success("quantity updated", {
            duration: 3000,
            style: { background: "black", color: "white" },
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

  const deleteCartProduct = (productId: string, quantity: number) => {
    const confirmDelete = () => {
      deleteFromCart(
        { product_id: productId },
        {
          onSuccess: () => {
            dispatch(deletefromCart(quantity));
            toast.dismiss();
            toast.success("Removed from cart", {
              duration: 3000,
              style: { background: "red" },
            });
          },
          onError: (error: any) => {
            const message =
              error?.response?.data?.message ||
              error?.message ||
              "Unknown error";
            toast.dismiss();
            showToast(message, "error");
          },
        }
      );
    };

    const cancelDelete = () => {
      toast.dismiss();
    };

    toast.info(
      <div>
        <p>Do you want remove this item..!?</p>
        <div className="flex gap-2 justify-center mt-2 ">
          <button
            onClick={confirmDelete}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            OK
          </button>
          <button
            onClick={cancelDelete}
            className="bg-green-400 text-white px-3 py-1 rounded"
          >
            Cancel
          </button>
        </div>
      </div>,
      {
        duration: Infinity, // Disable auto-close for this toast
      }
    );
  };

  const PlaceOrders = () => {
    const confirmOrder = () => {
      placeOrder(undefined, {
        onSuccess: () => {
          dispatch(makeCartEmpty());
          toast.dismiss();
          toast.success("Order Placed", {
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
      });
    };

    const cancelOrder = () => {
      toast.dismiss();
    };

    toast.info(
      <div>
        <p>Buy all Products..!</p>
        <div className="flex gap-2 justify-center mt-2 ">
          <button
            onClick={confirmOrder}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            OK
          </button>
          <button
            onClick={cancelOrder}
            className="bg-green-400 text-white px-3 py-1 rounded"
          >
            Cancel
          </button>
        </div>
      </div>,
      {
        duration: Infinity, // Disable auto-close for this toast
      }
    );
  };

  useEffect(() => {
    if (!cartlist) return;
    const totalPrice = cartlist?.reduce((total, item) => {
      const quantity = item.quantity;
      const price = parseFloat(item.products.price);

      return total + quantity * price;
    }, 0);
    setTotal(totalPrice);
  }, [cartlist]);

  return (
    <div className="min-h-[100dvh] w-10/12 m-auto flex flex-col lg:flex-row justify-center gap-y-10 gap-x-10  py-16">
      <div className="max-h-[100dvh] flex flex-col  overflow-y-auto w-full  md:w-2/3  bg-[#f1f3f6]">
        <div className="w-full m-auto bg-white p-5">
          <h1 className="font-bold text-center">
            My Cart ({cartlist?.length})
          </h1>
        </div>

        {cartlist?.map((user) => (
          <div
            className="flex py-5 p-1 m-auto border-gray-400 border-b-2 lg:w-11/12 justify-between lg:gap-x-5 lg:h-[200px]"
            key={user.id}
          >
            <div className="w-1/2 lg:w-1/6 flex flex-col justify-between items-center gap-y-4">
              <div className="h-3/4">
                <img
                  src={user.products.image as string}
                  alt="Product"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex h-1/4 justify-center gap-x-2 items-center">
                {user.quantity <= 1 ? (
                  <MdDelete
                    size={24}
                    className="text-gray-600 cursor-pointer"
                    onClick={() =>
                      deleteCartProduct(
                        user.products.id as string,
                        user.quantity
                      )
                    }
                  />
                ) : (
                  <button disabled={user.quantity <= 1}>
                    <CiCircleMinus
                      size={30}
                      className="text-gray-600 cursor-pointer"
                      onClick={() =>
                        updateCart({
                          product_id: user.products.id as string,
                          quantity: false,
                        })
                      }
                    />
                  </button>
                )}

                <p className="text-lg border-2 border-black px-2 rounded-sm">
                  {user.quantity}
                </p>
                <button>
                  <CiCirclePlus
                    size={30}
                    className="text-gray-600 cursor-pointer"
                    onClick={() =>
                      updateCart({
                        product_id: user.products.id as string,
                        quantity: true,
                      })
                    }
                  />
                </button>
              </div>
            </div>
            <div className="w-1/2 lg:w-4/6 pl-5 lg:pl-10 flex flex-col gap-y-2 ">
              <Link
                to={`/products/${user.products.id}`}
                className="hover:text-blue-700 hover:underline"
              >
                <h2 className="font-bold">{user.products.title}</h2>
              </Link>
              <p className="text-sm text-gray-400">Size: xl</p>
              <p className="text-sm text-gray-400">Seller: privt ltd</p>
              <p>
                Price: {user.products.price}
                <span className="pl-2 text-sm text-gray-700 line-through">
                  ₹1569
                </span>
              </p>
              <button
                className="text-sm hidden lg:flex lg:text-base text-left pt-3 text-gray-800 font-semibold hover:text-red-900"
                onClick={() =>
                  deleteCartProduct(user.products.id as string, user.quantity)
                }
              >
                REMOVE FROM CART
              </button>
              <div className="lg:hidden text-xs w-full flex justify-start items-star">
                <p>Delivery by Thu May 22</p>
              </div>
              <MdDelete
                className="flex lg:hidden"
                onClick={() =>
                  deleteCartProduct(user.products.id as string, user.quantity)
                }
              />
            </div>
            <div className="w-2/6 hidden lg:flex justify-start items-star">
              <p>Delivery by Thu May 22</p>
            </div>
          </div>
        ))}

        {isSuccess && Array.isArray(cartlist) && cartlist.length !== 0 && (
          <div className="flex items-center w-11/12 m-auto justify-end py-5 p-1 border-gray-400 border-b-2 ">
            <button
              onClick={PlaceOrders}
              className="bg-blue-800 text-white text-2xl p-2 rounded-md"
            >
              Place order
            </button>
          </div>
        )}

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

      {isSuccess && Array.isArray(cartlist) && cartlist.length !== 0 && (
        <div className="w-full lg:w-1/3 border-2 h-[340px] p-5 mt-16">
          <h1 className="text-base font-semibold border-b-2 pb-4">
            PRICE DETAILS
          </h1>
          <table className="w-full text-left  border-collapse">
            <tbody>
              <tr>
                <td className="py-2 font-medium">
                  Price ({cartlist?.length} items)
                </td>
                <td className="py-2 text-right">₹{total}</td>
              </tr>
              <tr>
                <td className="py-2 font-medium">Discount</td>
                <td className="py-2 text-right text-green-600">− ₹31,758</td>
              </tr>
              <tr>
                <td className="py-2 font-medium">Buy more & save more</td>
                <td className="py-2 text-right text-green-600">− ₹105</td>
              </tr>
              <tr>
                <td className="py-2 font-medium">Delivery Charges</td>
                <td className="py-2 text-right">
                  <span className="line-through text-gray-500">₹720</span>
                  <span className="ml-1 text-green-600 font-semibold">
                    Free
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-2 font-medium">Protect Promise Fee</td>
                <td className="py-2 text-right">₹57</td>
              </tr>
              <tr className="border-t-2 border-dashed font-bold">
                <td className="py-5">Total Amount</td>
                <td className="py-5 text-right">₹{total}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Cart;
