import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { toast } from "sonner";

import type { ProductType } from "../utils/types";
import { useUpdateImage, useUpdateProduct } from "../hooks/useAdmin";
import { Controller, useForm } from "react-hook-form";
import { Input } from "./Input";
import { showToast } from "../utils/toast";
import { sanitizeNumber, sanitizeString } from "../utils/sanitizor";

const defaultValues: ProductType = {
  id: "",
  title: "",
  image: "",
  description: "",
  price: 0,
  quantity: 0,
  category: "",
};

export const EditingField = ({
  product,
  onClose,
}: {
  product: ProductType;
  onClose: () => void;
}) => {
  const [file, setFile] = useState<string | null>(null);
  const { control, handleSubmit, reset, setValue } = useForm<ProductType>({
    defaultValues,
  });
  const { mutate, isPending } = useUpdateProduct();
  const { mutate: updateImage } = useUpdateImage();

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const imageUrl = URL.createObjectURL(selectedFile);
      setFile(imageUrl);
      setValue("image", selectedFile);
    }
  };

  const onSubmit = async (data: ProductType) => {
    const formData = new FormData();
    if (!product.id || !product.publicid) {
      showToast("id and publicid does not exist", "error");
      return;
    }

    formData.append("product_id", sanitizeString(product.id));
    formData.append("publicid", sanitizeString(product.publicid));

    if (data.image instanceof File) {
      formData.append("image", data.image);

      toast.loading("Image Uploading...");
      updateImage(formData, {
        onSuccess: (response) => {
          console.log("Image uploaded successfully", response);
          reset();
        },
        onError: (error) => {
          console.error("Image update failed:", error);
          showToast(error?.response?.data?.message, "error");
          setFile(null);
          return; // stop further processing if image upload fails
        },
      });
    }

    const sanitizedData = {
      id: sanitizeString(product.id),
      title: sanitizeString(data.title),
      price: sanitizeNumber(data.price),
      category: sanitizeString(data.category),
      quantity: sanitizeNumber(data.quantity),
      description: sanitizeString(data.description),
    };
    
    // Only append text fields after the image upload logic
    formData.append("id", sanitizedData.id);
    formData.append("title", sanitizedData.title);
    formData.append("description", sanitizedData.description);
    formData.append("price", sanitizedData.price.toString());
    formData.append("quantity", sanitizedData.quantity.toString());
    formData.append("category", sanitizedData.category);

    toast.dismiss();
    toast.loading("please wait...");

    mutate(formData, {
      onSuccess: () => {
        toast.dismiss();
        toast.success("Updated Successfully", {
          duration: 3000,
          style: {
            background: "green",
          },
        });
        reset(defaultValues);
        setFile(null);
        onClose();
      },
      onError: (error) => {
        const message =
          error?.response?.data?.message || error?.message || "Unknown error";
        toast.dismiss();
        showToast(message, "error");
        setFile(null);
      },
    });
  };

  useEffect(() => {
    if (product) {
      reset(product);
      setFile(null);
    }
    return () => reset();
  }, [product, reset]);

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ duration: 0.9, ease: "easeInOut" }}
      className="fixed h-[90vh] w-[450px] bg-gradient-to-br from-primary to-[#00ed8e] rounded-md border-2 border-secondary bottom-0 right-0 p-1"
    >
      <IoClose
        className="text-white absolute cursor-pointer"
        size={30}
        onClick={onClose}
      />
      <form
        encType="multipart/form-data"
        onSubmit={handleSubmit(onSubmit)}
        className="flex pt-5 flex-col text-black gap-y-7 justify-center items-center w-full h-full px-3 rounded-md bg-transparent"
      >
        <div className="flex rounded-md w-full gap-x-1 h-32">
          <div className="w-1/2 border-2 border-secondary rounded-md  bg-white">
            <img
              src={product?.image as string}
              alt="Product image"
              className="w-full h-full object-contain"
            />
          </div>
          {!file ? (
            <div className="flex items-center justify-center w-1/2  border-2 border-secondary rounded-md">
              <label
                htmlFor="dropzone-file"
                className="flex flex-col items-center justify-center w-full h-full border-gray-300 rounded-md cursor-pointer bg-gray-50"
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
                  <p className="mb-2 text-sm text-gray-500 font-semibold">
                    Replace current Image
                  </p>
                </div>
                <input
                  id="dropzone-file"
                  type="file"
                  className="hidden"
                  onChange={handleFile}
                />
              </label>
            </div>
          ) : (
            <div className="flex justify-center w-1/2 bg-white rounded-md flex-col items-center  h-full border-2 border-secondary">
              <img
                src={file}
                alt="image"
                className="object-contain h-full overflow-hidden"
              />
            </div>
          )}
        </div>

        <div className="flex flex-col w-full">
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
                labelClassName="text-base font-semibold"
                className="outline-none p-2 rounded-md bg-white w-full"
              />
            )}
          />
        </div>
        <div className="flex justify-between w-full gap-x-5">
          <div className="flex flex-col w-3/5">
            <Controller
              name="price"
              control={control}
              rules={{
                required: "price is required",
              }}
              render={({ field, fieldState }) => (
                <Input
                  id="price"
                  type="number"
                  label="Price"
                  {...field}
                  value={field.value}
                  error={fieldState.error?.message}
                  labelClassName="text-base font-semibold"
                  className="outline-none p-2 rounded-md bg-white w-full"
                />
              )}
            />
          </div>
          <div className="flex flex-col w-2/5">
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
                  labelClassName="text-base font-semibold"
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
                labelClassName="text-base font-semibold"
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
                <label className="text-base font-semibold">Description</label>
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
          className={`p-4 w-full bg-gradient-to-br from-secondary to-yellow-300 rounded-md font-bold`}
        >
          {isPending ? "Submitting..." : "Submit"}
        </button>
      </form>
    </motion.div>
  );
};
