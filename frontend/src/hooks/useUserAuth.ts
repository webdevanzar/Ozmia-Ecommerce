import { axiosInstance } from "../utils/interceptor";
import { FormFieldType, MutationPayload } from "../utils/types";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

//register and login
const registerApi = async (data: FormFieldType) => {
  const res = await axiosInstance.post("/register", data);
  return res.data;
};
const LoginApi = async (data: FormFieldType) => {
  const res = await axiosInstance.post("/login", data);
  return res.data;
};
export const useUserAuth = () => {
  return useMutation({
    mutationFn: async ({ action, data }: MutationPayload) => {
      if (action === "register") {
        return await registerApi(data);
      } else if (action === "login") {
        return await LoginApi(data);
      } else {
        throw new Error("Invalid action type");
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message);
    },
  });
};
