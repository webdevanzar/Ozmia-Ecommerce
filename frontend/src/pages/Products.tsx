import { useState } from "react";
import { Link, Outlet, useLocation, useParams } from "react-router-dom";
import { toast } from "sonner";

import { FaHeart } from "react-icons/fa";
import { useProducts } from "../hooks/useUserProducts";
import {
  useAddToWishlist,
  useDeleteFromWishlist,
  useGetWishlist,
} from "../hooks/useUserWishlist";
import { showToast } from "../utils/toast";

const Products = () => {
  const { id } = useParams();
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState("all");

  const { data, isLoading, isSuccess } = useProducts(selectedCategory,"");
  const { data: wishlist } = useGetWishlist();
  const { mutate: addToWishlist } = useAddToWishlist();
  const { mutate: deleteFromWishlist } = useDeleteFromWishlist();

  const isShow = [`/products/${id}`].includes(location.pathname);

  const handleCategory = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  };
  const handleWishlistToggle = (productId: string) => {
    const isInWishlist = wishlist?.some(
      (item) => item.product_id === productId
    );

    if (isInWishlist) {
      deleteFromWishlist(
        { product_id: productId },
        {
          onSuccess: () => {
            toast.dismiss();
            toast.success("Removed from wishlist", {
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
    } else {
      addToWishlist(productId, {
        onSuccess: () => {
          toast.dismiss();
          toast.success("Added to wishlist", {
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
    }
  };

  return (
    <div className="h-auto  bg-gradient-to-br from-primary to-white">
      {!isShow && (
        <div className="w-[98%] m-auto h-full">
          <div className="w-full flex justify-center items-center">
            <h1 className="text-3xl font-bold text-primary text-center border-b-2 w-[85%] m-auto pb-2 sticky p-5">
              Explore products...
            </h1>
          </div>

          <select
            value={selectedCategory}
            onChange={handleCategory}
            className="rounded-md absolute right-10 md:right-24 p-1 ml-2 border-2 outline-none"
          >
            <option value="all">All</option>
            <option value="women">Women</option>
            <option value="men">Men</option>
            <option value="gadget">Gadgets</option>
          </select>

          <div className="pt-14 flex justify-center gap-10 flex-wrap py-10 min-h-[80vh] w-full">
            {data
              ?.slice()
              .reverse()
              .map((product) => {
                const isInWishlist = wishlist?.some(
                  (item) => item.product_id === product.id
                );
                return (
                  <div className="relative" key={product.id}>
                    <Link to={`/products/${product.id}`}>
                      <div className="flex flex-col h-48 w-40 md:w-60 md:h-60 bg-white border-secondary border-2 rounded-md cursor-pointer ">
                        <div className="h-3/5 w-full border-b-2 relative">
                          <img
                            src={product?.image as string}
                            alt="Product"
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="h-2/5 w-full p-5">
                          <h2 className="text-xl font-semibold">
                            {product?.title}
                          </h2>
                          <p>
                            Rs.{product?.price}{" "}
                            <span className="text-xs text-gray-500 line-through">
                              ₹966
                            </span>
                          </p>
                        </div>
                      </div>
                    </Link>
                    <FaHeart
                      size={30}
                      className={`absolute top-2 right-2 cursor-pointer ${
                        isInWishlist ? "text-red-500" : "text-gray-300"
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleWishlistToggle(product.id as string);
                      }}
                    />
                  </div>
                );
              })}
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

          {isSuccess && Array.isArray(data) && data.length === 0 && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <h1 className="text-3xl text-secondary">No Product Found</h1>
            </div>
          )}
        </div>
      )}

      <Outlet />
    </div>
  );
};

export default Products;
