import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../utils/interceptor";
import { CartlistItem } from "../utils/types";

//get cart
const getCartList = async () => {
  const res = await axiosInstance.get("/cart");
  return res.data.cart;
};
export const useGetCart = () => {
  return useQuery<CartlistItem[]>({
    queryKey: ["cartlist"],
    queryFn: getCartList,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });
};

//add to cart
const addToCart = async (datas: { product_id: string; quantity: number }) => {
  const res = await axiosInstance.post("/cart", {
    product_id: datas.product_id,
    quantity: datas.quantity,
  });
  return res.data;
};
export const useAddToCart = () => {
  const query = useQueryClient();
  return useMutation({
    mutationFn: addToCart,
    onSuccess: () => {
      query.invalidateQueries({ queryKey: ["cartlist"] });
    },
  });
};

//update cart
const updateCart = async (datas: { product_id: string; quantity: boolean }) => {
  const res = await axiosInstance.put("/cart", {
    product_id: datas.product_id,
    quantity: datas.quantity,
  });
  return res.data;
};
export const useUpdateCart = () => {
  const query = useQueryClient();
  return useMutation({
    mutationFn: updateCart,
    onSuccess: () => {
      query.invalidateQueries({ queryKey: ["cartlist"] });
    },
  });
};

//delete from cart
const deleteFromCart = async (data: { product_id: string }) => {
  const res = await axiosInstance.delete("/cart", { data });
  return res.data;
};
export const useDeleteCart = () => {
  const quary = useQueryClient();
  return useMutation({
    mutationFn: deleteFromCart,
    onSuccess: () => {
      quary.invalidateQueries({ queryKey: ["cartlist"] });
    },
  });
};
