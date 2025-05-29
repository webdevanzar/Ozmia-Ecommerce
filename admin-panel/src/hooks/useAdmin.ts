import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../utils/interceptor";
import type {
  OrdersType,
  ProductType,
  TogglePayLoadType,
  UserType,
} from "../utils/types";
import { toast } from "sonner";

//get All Products
const getProducts = async (category: string): Promise<ProductType[]> => {
  const res = await axiosInstance.get("/products", {
    params: category === "all" ? {} : { category },
  });
  return res.data.products;
};
export const useProducts = (category: string) => {
  return useQuery<ProductType[]>({
    queryKey: ["products", category],
    queryFn: ({ queryKey }) => getProducts(queryKey[1] as string),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });
};

//get by id
const getProductById = async (id: string): Promise<ProductType> => {
  const res = await axiosInstance.get(`/products/${id}`);
  return res.data.product;
};
export const useProduct = (id: string | undefined) => {
  return useQuery<ProductType>({
    queryKey: ["product", id] as const,
    queryFn: ({ queryKey }) => getProductById(queryKey[1] as string),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });
};

//get All users
const getUsers = async () => {
  const res = await axiosInstance.get("/users");
  return res.data.users;
};
export const useUsers = () => {
  return useQuery<UserType[]>({
    queryKey: ["users"],
    queryFn: getUsers,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });
};

//get All Orders
const getOrders = async () => {
  const res = await axiosInstance.get("/orders");
  return res.data.data;
};
export const useOrders = () => {
  return useQuery<OrdersType[]>({
    queryKey: ["orders"],
    queryFn: getOrders,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });
};

//add product
const addProduct = async (data: FormData): Promise<string> => {
  const res = await axiosInstance.post("/products", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};
export const useAddProduct = () => {
  const query = useQueryClient();
  return useMutation<string, Error, FormData>({
    mutationFn: addProduct,
    onSuccess: () => {
      query.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error) => {
      toast.error(error?.message);
    },
  });
};

//Toggle prodect
const toggleProduct = async (data: TogglePayLoadType): Promise<string> => {
  const res = await axiosInstance.patch("/products", data);
  return res.data;
};
export const useToggleProduct = () => {
  const query = useQueryClient();
  return useMutation<string, Error, TogglePayLoadType>({
    mutationFn: toggleProduct,
    onSuccess: () => {
      query.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error) => {
      toast.error(error?.message);
    },
  });
};

//update product
const updateProduct = async (data: FormData): Promise<string> => {
  const res = await axiosInstance.put("/products", data);
  return res.data;
};
export const useUpdateProduct = () => {
  const query = useQueryClient();
  return useMutation<string, Error, FormData>({
    mutationFn: updateProduct,
    onSuccess: () => {
      query.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error) => {
      toast.error(error?.message);
    },
  });
};

//update image
export const updateImage = async (data: FormData) => {
  const res = await axiosInstance.post("/image", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};
export const useUpdateImage = () => {
  const query = useQueryClient();
  return useMutation<string, Error, FormData>({
    mutationFn: updateImage,
    onSuccess: () => {
      query.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error) => {
      toast.error(error?.message);
    },
  });
};
