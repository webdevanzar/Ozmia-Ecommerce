import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../utils/interceptor";
import { Order } from "../utils/types";

//get orders
const getOrders = async () => {
  const res = await axiosInstance.get("/orders");
  return res.data.data;
};
export const useGetOrders = () => {
  return useQuery<Order[]>({
    queryKey: ["orderslist"],
    queryFn: getOrders,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 5 * 60,
  });
};

//place orders
const placeOrders = async () => {
  const res = await axiosInstance.post("/orders");
  return res.data;
};
export const usePlaceOrder = () => {
  const query = useQueryClient();
  return useMutation({
    mutationFn: placeOrders,
    onSuccess: () => {
      query.invalidateQueries({ queryKey: ["orderslist"] });
      query.invalidateQueries({ queryKey: ["cartlist"] });
    },
  });
};
