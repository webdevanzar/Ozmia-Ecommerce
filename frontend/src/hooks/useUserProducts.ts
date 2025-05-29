import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../utils/interceptor";
import { ProductType } from "../utils/types";

//get all products
const getProducts = async (
  category: string,
  search: string
): Promise<ProductType[]> => {
  try {
    const params: Record<string, string> = {};

    if (category !== "all") {
      params.category = category;
    }

    if (search) {
      params.search = search;
    }

    const res = await axiosInstance.get("/products", { params });
    return res.data;
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
};
export const useProducts = (category: string, search: string) => {
  return useQuery<ProductType[]>({
    queryKey: ["products", category, search],
    queryFn: ({ queryKey }) =>
      getProducts(queryKey[1] as string, queryKey[2] as string),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });
};

//get product id
const getProductById = async (id: string): Promise<ProductType> => {
  const res = await axiosInstance.get(`/products/${id}`);
  return res.data;
};
export const useProduct = (id: string | undefined) => {
  return useQuery<ProductType>({
    queryKey: ["product", id] as const,
    queryFn: ({ queryKey }) => getProductById(queryKey[1] as string),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });
};
