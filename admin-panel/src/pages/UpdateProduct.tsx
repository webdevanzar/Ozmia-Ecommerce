import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";

import { RiEdit2Fill } from "react-icons/ri";
import type { ProductType } from "../utils/types";
import { useProducts, useToggleProduct } from "../hooks/useAdmin";
import { EditingField } from "../components/EditingField";
import { CommonTable } from "../components/CommonTable";
import { FaToggleOff, FaToggleOn } from "react-icons/fa6";

const UpdateProduct = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const isShow = ["/products/addproduct", `/products/${id}`].includes(
    location.pathname
  );
  const [editing, setEditing] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(
    null
  );
  const [selectedCategory, setSelectedCategory] = useState("all");
  const {
    data: products,
    isSuccess,
    isLoading,
    isError,
  } = useProducts(selectedCategory);
  if (isError) {
    toast.error("Error While fetching products");
  }
  const { mutate } = useToggleProduct();
  const toggleOneProduct = (id: string, status: boolean) => {
    const confirmToggle = async () => {
      toast.dismiss();
      if (!id) {
        toast.error(" id missing");
        return;
      }

      const data = {
        id,
        status,
      };

      toast.dismiss();
      toast.loading(
        `${status ? "Product inactivating" : "product activating"}`
      );
      mutate(data, {
        onError: (error: any) => {
          toast.dismiss();
          toast.error(
            error?.response?.data?.message || "Error while Toggling product"
          );
        },
        onSuccess: () => {
          toast.dismiss();
          toast.success(
            `${
              status
                ? "Product inactivated successfully"
                : "product activated successfully"
            }`,
            {
              duration: 3000,
              style: {
                background: "green",
              },
            }
          );
        },
      });
    };

    const cancelToggle = () => {
      toast.dismiss();
    };

    toast.info(
      <div>
        <p>{`${
          status ? "Want Inactivate this Item?" : "Want Activate this Item?"
        } `}</p>
        <div className="flex gap-2 justify-center mt-2 ">
          <button
            onClick={() => confirmToggle()}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            OK
          </button>
          <button
            onClick={cancelToggle}
            className="bg-green-400 text-white px-3 py-1 rounded"
          >
            Cancel
          </button>
        </div>
      </div>,
      {
        duration: Infinity,
      }
    );
  };
  const handleCategory = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  };

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-br from-primary to-white">
      {!isShow && (
        <>
          <div className="w-full flex justify-center items-center">
            <h1 className="text-3xl font-bold text-primary text-center border-b-2 w-[85%] m-auto pb-2 sticky p-5">
              Edit Products
            </h1>
          </div>

          <div className="flex justify-end">
            <select
              value={selectedCategory}
              onChange={handleCategory}
              className="rounded-md p-1 ml-2 border-2 outline-none"
            >
              <option value="all">All</option>
              <option value="women">Women</option>
              <option value="men">Men</option>
              <option value="gadget">Gadgets</option>
            </select>
          </div>

          <div className="w-full text-left border-none flex justify-between rounded-md">
            <div className="w-full flex justify-center items-center">
              <CommonTable
                fields={[
                  "SI.No",
                  "Image",
                  "Product Name",
                  "Product Price",
                  "Product Category",
                  "Product Quantity",
                  "Status",
                  "Action",
                ]}
                data={products ?? []}
                formatRow={(product, index) => (
                  <tr
                    className="text-sm font-semibold cursor-pointer"
                    key={product.id}
                    onClick={() => navigate(`/products/${product.id}`)}
                  >
                    <td className="w-1/12 border border-gray-400 p-2">
                      {index + 1}
                    </td>
                    <td className="w-14 h-14 border border-gray-400 p-1">
                      <img
                        src={product?.image as string}
                        alt="product image"
                        className="w-full h-full object-contain"
                      />
                    </td>
                    <td className="w-2/12 border border-gray-400 p-2">
                      {product.title}
                    </td>
                    <td className="w-2/12 border border-gray-400 p-2">
                      {product.price}
                    </td>
                    <td className="w-2/12 border border-gray-400 p-2">
                      {product.category}
                    </td>
                    <td className="w-1/12 border border-gray-400 p-2">
                      {product.quantity}
                    </td>
                    <td className="w-1/12 border border-gray-400 p-2">
                      <div
                        className={`${
                          product.isdeleted
                            ? "bg-red-200 text-red-800"
                            : "bg-green-200 text-green-800"
                        }  flex justify-center items-center rounded-full py-1`}
                      >
                        {product.isdeleted ? "Inactive" : "Active"}
                      </div>
                    </td>
                    <td className="w-2/12 border border-gray-400 p-2">
                      <div className="flex gap-x-3 items-center xl:w-2/12">
                        <button
                          disabled={product.isdeleted}
                          className={`${
                            product.isdeleted
                              ? "text-gray-200 bg-blue-400 cursor-not-allowed"
                              : "text-white bg-blue-900 cursor-pointer"
                          } flex items-center gap-1 font-bold  rounded-md px-4 py-1`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedProduct(product);
                            setEditing(true);
                          }}
                        >
                          Edit <RiEdit2Fill className="text-xl" />
                        </button>
                        <button
                          className={`${
                            product.isdeleted ? "bg-green-900" : " bg-red-900"
                          } flex items-center gap-1 font-bold text-white  rounded-md px-3 py-1`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleOneProduct(
                              product.id as string,
                              !product.isdeleted
                            );
                          }}
                        >
                          {product.isdeleted
                            ? "Activate\u00A0\u00A0\u00A0\u00A0\u00A0"
                            : "Deactivate"}
                          {product.isdeleted ? (
                            <FaToggleOff className="text-green-500 text-xl" />
                          ) : (
                            <FaToggleOn className=" text-red-500 text-xl" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              />
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

          {isSuccess && Array.isArray(products) && products.length === 0 && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <h1 className="text-3xl text-secondary">No Product Found</h1>
            </div>
          )}
          <AnimatePresence>
            {selectedProduct && editing && (
              <EditingField
                product={selectedProduct}
                onClose={() => setEditing(false)}
              />
            )}
          </AnimatePresence>
        </>
      )}

      <Outlet />
    </div>
  );
};

export default UpdateProduct;
