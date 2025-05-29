import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../utils/interceptor";
import { WishlistItem } from "../utils/types";

const getWishlist = async () => {
  const res = await axiosInstance.get("/wishlist");
  return res.data.wishlist;
};
export const useGetWishlist = () => {
  return useQuery<WishlistItem[]>({
    queryKey: ["wishlist"],
    queryFn: getWishlist,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });
};

const addToWishlist = async (data: string) => {
  const res = await axiosInstance.post("/wishlist", { product_id: data });
  return res.data;
};
export const useAddToWishlist = () => {
  const query = useQueryClient();
  return useMutation({
    mutationFn: addToWishlist,
    onSuccess: () => {
      query.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });
};

const deleteFromWishlist = async (data: { product_id: string }) => {
  const res = await axiosInstance.delete("/wishlist", {
    data,
  });
  return res.data;
};
export const useDeleteFromWishlist = () => {
  const query = useQueryClient();

  return useMutation({
    mutationFn: deleteFromWishlist,
    onSuccess: () => {
      query.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });
};
