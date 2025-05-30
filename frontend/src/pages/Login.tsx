import { useForm, Controller } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useDispatch } from "react-redux";

import bgImage from "../assets/images/carousel/image1.png";

import type { FormFieldType } from "../utils/types";
import type { AppDispatch } from "../redux/store";

import { useUserAuth } from "../hooks/useUserAuth";
import { login } from "../redux/authSlice";
import { showToast } from "../utils/toast";

import { Input } from "../components/Input";
import { sanitizeEmail, sanitizePassword } from "../utils/sanitizor";

const defaultValues: FormFieldType = {
  email: "",
  name: "",
  password: "",
  cpassword: "",
};

export const Login = () => {
  const { mutate } = useUserAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const {
    control,
    reset,
    formState: { isSubmitting },
    handleSubmit,
  } = useForm({
    defaultValues,
  });

  const onSubmit = (data: FormFieldType) => {
    const sanitizedData: FormFieldType = {
      email: sanitizeEmail(data.email),
      password: sanitizePassword(data.password),
    };
    mutate(
      {
        action: "login",
        data: sanitizedData,
      },
      {
        onSuccess: (response) => {
          const { token, username, cartCount } = response;
          dispatch(login({ token, username, cartCount }));
          reset();
          toast.success("Login successful", {
            duration: 3000,
            style: { background: "green" },
          });
          navigate("/");
        },
        onError: (error) => {
          console.log(error);

          const message = error?.response?.data?.error;
          console.log(message);

          toast.dismiss();
          showToast(message, "error");
          reset();
        },
      }
    );
  };

  return (
    <div
      className="h-screen flex justify-center items-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        action=""
        noValidate
        className="login-bg p-4 rounded-xl md:w-[400px]"
      >
        <h1 className="text-center text-3xl font-bold mb-5">Login</h1>

        <Controller
          name="email"
          control={control}
          rules={{
            required: "email is required",
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: "Email is not valide",
            },
          }}
          render={({ field, fieldState }) => (
            <Input
              type="email"
              label="Email"
              id="email"
              {...field}
              value={field.value}
              error={fieldState.error?.message}
            />
          )}
        />

        <Controller
          name="password"
          control={control}
          rules={{
            required: "password is required",
            minLength: {
              value: 8,
              message: "Password must contain at least 8 characters",
            },
            maxLength: {
              value: 15,
              message: "Password must be less than 15 characters",
            },
            pattern: {
              value:
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~])/,
              message:
                "password must include uppercase ,lowercase, and a special character",
            },
          }}
          render={({ field, fieldState }) => (
            <Input
              type="password"
              label="Password"
              id="password"
              {...field}
              value={field.value}
              error={fieldState.error?.message}
            />
          )}
        />

        <button
          disabled={isSubmitting}
          className="text-white bg-gradient-to-br from-[#CFB34C] to-[#765D03] text-[16px] font-semibold px-2.5 py-3 w-full rounded-sm mt-10  disabled:opacity-60"
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>

        <p className="text-right pt-4">
          <span className="font-bold text-sm text-secondary">
            New to OZMIYA..
          </span>
          <Link
            to="/signup"
            className="cursor-pointer hover:text-blue-700 underline text-sm p-1"
          >
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
};
