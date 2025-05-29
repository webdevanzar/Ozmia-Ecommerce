import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../utils/interceptor";
import type { FormValuesType } from "../utils/types";
import { showToast } from "../utils/toast";
import { toast } from "sonner";

const LoginApi = async (data: FormValuesType) => {
  const res = await axiosInstance.post("/login", data);
  return res.data;
};
export const useLogin = () => {
  return useMutation({
    mutationFn: (data: FormValuesType) => LoginApi(data),
    onSuccess: (data) => {
      toast.success("Login successful", {
        duration: 3000,
        style: {
          background: "green",
        },
      });
      console.log("Login data:", data);
    },
    onError: (error: any) => {
      showToast(error?.response?.data?.message || "Login failed", "error");
    },
  });
};
