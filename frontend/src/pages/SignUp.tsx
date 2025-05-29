import { Input } from "../components/Input";

import bgImage from "../assets/images/carousel/image1.png";
import { Link, useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { FormFieldType } from "../utils/types";
import { useUserAuth } from "../hooks/useUserAuth";
import { toast } from "sonner";
import { showToast } from "../utils/toast";
import {
  sanitizeEmail,
  sanitizePassword,
  sanitizeString,
} from "../utils/sanitizor";

const defaultValues: FormFieldType = {
  email: "",
  name: "",
  password: "",
  cpassword: "",
};

export const SignUp = () => {
  const { mutate } = useUserAuth();
  const navigate = useNavigate();
  const {
    control,
    getValues,
    reset,
    formState: { isSubmitting },
    handleSubmit,
  } = useForm({
    defaultValues,
  });

  const onSubmit = (data: FormFieldType) => {
    const sanitizedData: FormFieldType = {
      name: sanitizeString(data.name as string),
      email: sanitizeEmail(data.email),
      password: sanitizePassword(data.password),
      cpassword: sanitizePassword(data.cpassword as string),
    };
    mutate(
      {
        action: "register",
        data: sanitizedData,
      },
      {
        onSuccess: (response) => {
          reset();
          if (response) navigate("/login");
        },
        onError: (error) => {
          const message =
            error?.response?.data?.message || error?.message || "Unknown error";
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
        noValidate
        className="login-bg p-4 rounded-xl md:w-[400px]"
      >
        <h1 className="text-center text-3xl font-bold mb-5">Sign Up</h1>
        <Controller
          name="name"
          control={control}
          rules={{
            required: "name is required",
          }}
          render={({ field, fieldState }) => (
            <Input
              type="text"
              id="name"
              label="Name"
              {...field}
              error={fieldState.error?.message}
            />
          )}
        />

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
              error={fieldState.error?.message}
            />
          )}
        />

        <Controller
          name="cpassword"
          control={control}
          rules={{
            required: "Retype password",
            validate: (value) =>
              value === getValues("password") || "password must match",
          }}
          render={({ field, fieldState }) => (
            <Input
              type="password"
              id="cpassword"
              label="Confirm Password"
              {...field}
              // value={field.value}
              error={fieldState.error?.message}
            />
          )}
        />

        <button
          disabled={isSubmitting}
          className="text-white bg-gradient-to-br from-[#CFB34C] to-[#765D03] text-[16px] font-semibold px-2.5 py-3 w-full rounded-sm mt-2.5  disabled:opacity-60"
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>

        <p className="text-right pt-4">
          <span className="font-bold text-sm text-secondary">
            Have an Account Already..
          </span>
          <Link
            to="/"
            className="cursor-pointer hover:text-blue-700 underline text-sm p-1"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};
