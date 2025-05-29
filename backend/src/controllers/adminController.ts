import {
  createProducts,
  getAdminLogin,
  getAllOrders,
  getallUsers,
  getProductsByid,
  ToggleProducts,
  updateProducts,
} from "../models/adminModel";
import { comparePasswords } from "../models/adminModel";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { handleDelete, handleUpload } from "../config/cloudinary";
import { PrismaClient } from "../generated/prisma";
const prisma = new PrismaClient();
import { z } from "zod";

const adminLoginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

export const adminLogin = async (
  req: Request,
  res: Response
): Promise<void> => {
  console.log("Request Body:", req.body);

  const parsedResult = adminLoginSchema.safeParse(req.body);

  if (!parsedResult.success) {
    const errors = parsedResult.error.flatten();
    res.status(400).json({ message: "Validation failed", errors });
    return;
  }

  const { email, password } = parsedResult.data;

  try {
    const admin = await getAdminLogin(email);
    console.log("Admin found:", admin);

    if (!admin) {
      res.status(401).json({ message: "Invalid admin credentials" });
      return;
    }

    const isMatch = await comparePasswords(password, admin.password);
    if (!isMatch) {
      res.status(401).json({ message: "Invalid password" });
      return;
    }

    const JWT_SECRET = process.env.ADMIN_JWT_SECRET;
    if (!JWT_SECRET) {
      res.status(500).json({
        message: "Server configuration error: JWT_SECRET is not defined",
      });
      return;
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: "admin" },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Admin login error:", error);
    if (!res.headersSent) {
      res.status(500).json({ message: "Server Error", error: error });
    }
  }
};

export const getAllusersData = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const users = await getallUsers();
    res.status(200).json({ message: "Successfully fetch users", users: users });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch user Data", error: error });
  }
};

export const getAllProductDatas = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const category = req.query.category as string;

    let products;

    if (category) {
      products = await prisma.products.findMany({
        where: {
          category: {
            equals: category,
            mode: "insensitive",
          },
        },
      });
    } else {
      products = await prisma.products.findMany();
    }
    const serializedProducts = products.map((product) => ({
      ...product,
      id: product.id.toString(),
    }));

    res.status(200).json({
      message: "Successfully fetched products",
      products: serializedProducts,
    });
    return;
  } catch (error) {
    console.error("Error fetching Product:", error);
    res.status(500).json({ error: "Could not fetch products" });
  }
};

export const getproductbyId = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  try {
    const productbyId = await getProductsByid(id);

    if (!productbyId) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    const serializedProduct = {
      ...productbyId,
      id: productbyId.id.toString(),
    };

    res.status(200).json({ product: serializedProduct });
  } catch (error) {
    console.error("Error fetching Product:", error);
    res.status(500).json({ error: "Could not fetch Product" });
  }
};

const productSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  price: z.coerce.number().positive("Price must be as a positive number"),
  category: z.string().min(1, "Cateegory is required"),
  quantity: z.coerce.number().int("quantity must be an number"),
});

export const createProductController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const parsedResults = productSchema.safeParse(req.body);

    if (!parsedResults.success) {
      const errors = parsedResults.error.flatten();
      res.status(400).json({ message: "Validation failed", errors });
      return;
    }

    const { title, description, price, category, quantity } =
      parsedResults.data;

    if (!req.file || !req.file?.mimetype.startsWith("image/")) {
      res.status(400).json({
        message: "Only image files are allowed",
      });
      return;
    }

    //upload to cloudinary
    const result = await handleUpload(req.file.buffer);

    if (!result || !result.secure_url || !result.public_id) {
      res.status(400).json({
        message: "Cloudinary upload failed",
      });
      return;
    }

    const newQuantity = Number(quantity);
    const productData = {
      publicid: result.public_id.toString(),
      title,
      description,
      image: result.secure_url,
      price,
      category,
      quantity: newQuantity,
    };

    await createProducts(productData);
    res.status(200).send("Product created successfully");
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Error creating product" });
  }
};

export const imageUploadSchema = z.object({
  product_id: z.string().uuid("product_id is required"),
  publicid: z.string().min(1, "PublicId is required"),
});

export const addImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const parsedResult = imageUploadSchema.safeParse(req.body);
    console.log(parsedResult);

    if (!parsedResult.success) {
      const errors = parsedResult.error.flatten();
      res.status(400).json({ message: "Validation failed", errors });
      return;
    }
    console.log(parsedResult.data);

    const { publicid, product_id } = parsedResult.data;

    // Check if file is uploaded
    if (!req.file) {
      res.status(400).json({
        message: "Image is required ",
      });
      return;
    }

    // if(req.file)

    // Validate image MIME type
    if (!req.file.mimetype.startsWith("image/")) {
      res.status(400).json({
        message: "Only jpg, jpeg, svg, png image files are allowed.",
      });
      return;
    }

    // Delete old image if publicid provided
    if (publicid) {
      await handleDelete(publicid);
    }

    // Upload new image to Cloudinary
    const result = await handleUpload(req.file.buffer);

    if (!result?.secure_url || !result?.public_id) {
      res.status(400).json({ message: "Cloudinary upload failed" });
      return;
    }

    if (product_id) {
      await prisma.products.update({
        where: { id: product_id },
        data: {
          image: result.secure_url,
          publicid: result.public_id,
        },
      });
    }

    res.status(200).json({
      message: "Image uploaded successfully",
      imageUrl: result.secure_url,
      publicid: result.public_id,
    });
    return;
  } catch (error) {
    console.error("Image upload error:", error);
    res.status(500).json({ message: "Image upload failed" });
    return;
  }
};

const deleteImageSchema = z.object({
  public_id: z.string().min(1, "public_id is required"),
  product_id: z.string().uuid().optional(),
});

export const deleteImage = async (req: Request, res: Response) => {
  try {
    const parsedResult = deleteImageSchema.safeParse(req.body);

    if (!parsedResult.success) {
      const errors = parsedResult.error.flatten();
      res.status(400).json({ message: "Validation failed", errors });
      return;
    }
    const { public_id, product_id } = parsedResult.data;

    await handleDelete(public_id);

    if (product_id) {
      await prisma.products.update({
        where: { id: product_id },
        data: {
          image: null,
          publicid: null,
        },
      });
    }

    res.status(200).json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error("Image deleted failed", error);
    res.status(500).json({ message: "Image deleted failed" });
  }
};

const updateProductSchema = z.object({
  id: z.string().uuid("Invalid product ID"),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  price: z.coerce.number().positive("Price must be a positive number"),
  category: z.string().min(1, "Category is required"),
  quantity: z.coerce
    .number()
    .int()
    .nonnegative("Quantity must be a non-negative integer"),
});

export const updateProductController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const parsedResult = updateProductSchema.safeParse(req.body);

    if (!parsedResult.success) {
      const errors = parsedResult.error.flatten();
      res
        .status(400)
        .json({ status: "fail", message: "Validation failed", errors });
      return;
    }

    let { id, title, description, price, category, quantity } =
      parsedResult.data;

    await updateProducts({
      id,
      title,
      description,
      price: Number(price),
      category,
      quantity: Number(quantity),
    });
    res.status(200).json({ status: "success", message: "Product updated" });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to update product.",
    });
  }
};

const ToggleroductSchema = z.object({
  id: z.string().uuid("Invalid product ID"),
  status: z.boolean({ invalid_type_error: "status must be true or false" }),
});

export const ToggleProductscontroll = async (
  req: Request,
  res: Response
): Promise<void> => {
  const parsedResult = ToggleroductSchema.safeParse(req.body);

  if (!parsedResult.success) {
    const errors = parsedResult.error.flatten();
    res.status(400).json({ message: "Validation failed", errors });
    return;
  }

  const { id, status } = parsedResult.data;

  try {
    await ToggleProducts(id,status);
    res.status(200).json({ message: "Product Toggled successfully" });
  } catch (error) {
    res.status(404).json({
      status: "error",
      message: error || "Failed to Toggle product.",
    });
  }
};

export const getAllOrdersController = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const orderDetails = await getAllOrders();

    res.status(200).json({
      status: "success",
      message: "Successfully fetched order details.",
      data: orderDetails,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch order details.",
    });
  }
};
