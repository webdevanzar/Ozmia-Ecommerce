import { useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { useDispatch } from "react-redux";
import type { AppDispatch } from "../redux/store";
import { login } from "../redux/authSlice";

import type { FormValuesType } from "../utils/types";

import { useLogin } from "../hooks/useLogin";
import { Input } from "../components/Input";
import { showToast } from "../utils/toast";
import { sanitizeEmail } from "../utils/sanitizor";

const defaultValues: FormValuesType = {
  email: "",
  password: "",
};

const Login = () => {
  const { control, handleSubmit } = useForm<FormValuesType>({
    defaultValues,
  });
  const { mutate } = useLogin();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const onSubmit = async (data: FormValuesType) => {
    const sanitizedData: FormValuesType = {
      email: sanitizeEmail(data.email),
      password: data.password,
    };
    mutate(sanitizedData, {
      onSuccess: (response) => {
        dispatch(login(response.token));
        navigate("/");
      },
      onError: (error) => {
        const message =
          error?.response?.data?.message || error?.message || "Unknown error";
        toast.dismiss();
        showToast(message, "error");
      },
    });
  };

  return (
    <div className="h-screen flex justify-center items-center bg-gradient-to-br from-primary to-secondary">
      <form
        noValidate
        className="login-bg p-4 rounded-xl md:w-[400px] bg-green-800"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1 className="text-center text-3xl font-bold mb-5">Login</h1>
        <Controller
          name="email"
          control={control}
          rules={{
            required: "Email is required",
          }}
          render={({ field, fieldState }) => (
            <Input
              id="email"
              type="email"
              label="Email"
              {...field}
              error={fieldState.error?.message}
              className="text-yellow-50"
            />
          )}
        />
        <Controller
          name="password"
          control={control}
          rules={{
            required: "Password is required",
          }}
          render={({ field, fieldState }) => (
            <Input
              id="password"
              type="password"
              label="Password"
              {...field}
              error={fieldState.error?.message}
              className="text-yellow-50"
            />
          )}
        />

        <button className="text-white bg-gradient-to-br hover:bg-gradient-to-tl from-[#CFB34C] to-[#765D03] text-[16px] font-semibold px-2.5 py-3 w-full rounded-sm mt-10">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Login;
