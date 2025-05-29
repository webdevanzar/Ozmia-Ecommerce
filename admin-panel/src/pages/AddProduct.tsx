import { useState } from "react";
import { toast } from "sonner";
import { useAddProduct } from "../hooks/useAdmin";
import type { ProductType } from "../utils/types";
import { Input } from "../components/Input";
import { Controller, useForm } from "react-hook-form";
import { showToast } from "../utils/toast";
import { sanitizeNumber, sanitizeString } from "../utils/sanitizor";

const defaultValues: ProductType = {
  title: "",
  image: "",
  description: "",
  price: 0,
  quantity: 0,
  category: "",
};
const AddProduct = () => {
  const [file, setFile] = useState<string | null>(null);
  const { control, handleSubmit, reset, resetField } = useForm<ProductType>({
    defaultValues,
  });
  const { mutate, isPending } = useAddProduct();

  const onSubmit = async (data: ProductType) => {
    const formData = new FormData();

    if (
      !(data.image instanceof File) ||
      !data.image.type.startsWith("image/")
    ) {
      showToast("Invalid image", "error");
      resetField("image"); // Resets just image
      setFile(null); // Clears preview
      return;
    }

    const sanitizedData: ProductType = {
      image: data.image,
      title: sanitizeString(data.title),
      price: sanitizeNumber(data.price),
      category: sanitizeString(data.category),
      quantity: sanitizeNumber(data.quantity),
      description: sanitizeString(data.description),
    };

    formData.append("image", sanitizedData.image);
    formData.append("title", sanitizedData.title);
    formData.append("price", sanitizedData.price.toString());
    formData.append("category", sanitizedData.category);
    formData.append("quantity", sanitizedData.quantity.toString());
    formData.append("description", sanitizedData.description);

    toast.dismiss();
    toast.loading("Please wait..");

    mutate(formData, {
      onSuccess: () => {
        toast.dismiss();
        toast.success("Uploaded successfully", {
          duration: 3000,
          style: {
            background: "green",
          },
        });
        reset();
        resetField("image");
        setFile(null);
      },
      onError: (error: any) => {
        const message =
          error?.response?.data?.message || error?.message || "Unknown error";
        toast.dismiss();
        showToast(message, "error");
        resetField("image");
        setFile(null);
      },
    });
  };

  return (
    <div className="flex justify-center items-center w-full max-h-[100dvh] overflow-y-auto">
      <form
        onSubmit={handleSubmit(onSubmit)}
        encType="multipart/form-data"
        className="flex flex-col mt-7 gap-y-4 justify-center items-center w-2/4 h-auto border-2 border-secondary px-7 py-5 rounded-md"
      >
        <h1 className="text-4xl font-bold text-primary">Add Product</h1>
        <Controller
          name="image"
          control={control}
          defaultValue={undefined}
          rules={{
            required: "image is required",
          }}
          render={({ field: { onChange, value }, fieldState }) => (
            <>
              {!value ? (
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="dropzone-file"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 hover:border-gray-400"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg
                        className="w-8 h-8 mb-4 text-gray-500"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 16"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                        />
                      </svg>
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        SVG, PNG, JPG or GIF (MAX. 800x400px)
                      </p>
                    </div>
                    <input
                      id="dropzone-file"
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          onChange(file); // ✅ set RHF value
                          setFile(URL.createObjectURL(file)); // For preview if needed
                        }
                      }}
                    />
                  </label>
                </div>
              ) : (
                <div className="flex justify-center w-full bg-white rounded-md flex-col items-center  h-32">
                  <img
                    src={
                      typeof value === "string"
                        ? value
                        : URL.createObjectURL(value)
                    }
                    alt="Preview"
                    className="w-full h-full object-contain rounded-md border border-gray-300"
                  />
                </div>
              )}
              {fieldState.error && (
                <p className="text-[12px] text-red-900">
                  {fieldState.error?.message}
                </p>
              )}
            </>
          )}
        />

        <div className="w-full">
          <Controller
            name="title"
            control={control}
            rules={{
              required: "title is required",
            }}
            render={({ field, fieldState }) => (
              <Input
                id="title"
                label="Title"
                type="text"
                {...field}
                value={field.value}
                error={fieldState.error?.message}
                labelClassName="text-base font-semibold text-primary"
                className="outline-none p-2 rounded-md bg-white w-full"
              />
            )}
          />
        </div>

        <div className="flex w-full gap-x-5">
          <div className="flex flex-col w-1/2">
            <Controller
              name="price"
              control={control}
              rules={{
                required: "Price is required",
                validate: (val) =>
                  Number(val) > 0 || "Price must be greater than 0",
              }}
              render={({ field, fieldState }) => (
                <Input
                  id="price"
                  label="Price"
                  type="number"
                  {...field}
                  value={field.value}
                  error={fieldState.error?.message}
                  labelClassName="text-base font-semibold text-primary"
                  className="outline-none p-2 rounded-md bg-white w-full"
                />
              )}
            />
          </div>
          <div className="flex flex-col w-1/2">
            <Controller
              name="category"
              control={control}
              rules={{
                required: "Category is required",
              }}
              render={({ field, fieldState }) => (
                <Input
                  id="category"
                  label="category"
                  type="text"
                  {...field}
                  value={field.value}
                  error={fieldState.error?.message}
                  labelClassName="text-base font-semibold text-primary"
                  className="outline-none p-2 rounded-md bg-white w-full"
                />
              )}
            />
          </div>
        </div>

        <div className="flex flex-col w-full">
          <Controller
            name="quantity"
            control={control}
            rules={{
              required: "Quantity is required",
            }}
            render={({ field, fieldState }) => (
              <Input
                id="quantity"
                label="quantity"
                type="number"
                {...field}
                value={field.value}
                error={fieldState.error?.message}
                labelClassName="text-base font-semibold text-primary"
                className="outline-none p-2 rounded-md bg-white w-full"
              />
            )}
          />
        </div>
        <div className="flex flex-col w-full">
          <Controller
            name="description"
            control={control}
            rules={{
              required: "description is required",
            }}
            render={({ field, fieldState }) => (
              <div className="flex flex-col w-full">
                <label className="text-base font-semibold text-primary">
                  Description
                </label>
                <textarea
                  {...field}
                  rows={3}
                  value={field.value}
                  className="outline-none p-2 rounded-md resize-none"
                />
                {fieldState.error && (
                  <p className="text-[12px] text-red-900">
                    {fieldState.error?.message}
                  </p>
                )}
              </div>
            )}
          />
        </div>
        <button
          disabled={isPending}
          className={`p-4 w-full rounded-md font-bold ${
            isPending
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-br from-secondary to-yellow-300"
          }`}
        >
          {isPending ? "Submitting..." : "Add"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
