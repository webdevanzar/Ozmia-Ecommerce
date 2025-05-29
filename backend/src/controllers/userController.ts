import { Request, Response } from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import {
  addToCartModel,
  deleteCartModel,
  getCartModel,
  upadetCartModel,
  placeOrder,
  getProductsByid,
  addwishListModel,
  deletewishlist,
  getWishlistModel,
  registerUser,
  findUserByEmail,
  loginUser,
  getAllOrders,
  getFilteredProducts,
} from "../models/userModel";
import { AuthenticatedRequest } from "@/types/requestTypes";
import { PrismaClient } from "../generated/prisma";
import { z } from "zod";

const prisma = new PrismaClient();
dotenv.config();

const resgisterSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Inavlid email address"),
    password: z.string().min(8, "Password must be at least 8 charecters"),
    cpassword: z.string(),
  })
  .refine((data) => data.password === data.cpassword, {
    message: "Password do not match",
    path: ["cpassword"],
  });

export const register = async (req: Request, res: Response): Promise<void> => {
  const parseResult = resgisterSchema.safeParse(req.body);

  if (!parseResult.success) {
    const errors = parseResult.error.flatten();
    res.status(400).json({ message: "Validation failed", errors });
    return;
  }

  const { name, email, password } = parseResult.data;

  try {
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      res.status(409).json({ message: "User already exists with this email" });
      return;
    }

    const userId = await registerUser(name, email, password);
    res.status(201).json({ message: "User registered successfully", userId });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const login = async (req: Request, res: Response): Promise<void> => {
  const parseResult = loginSchema.safeParse(req.body);

  if (!parseResult.success) {
    const errors = parseResult.error.flatten();
    res.status(400).json({ message: "Validation failed", errors });
    return;
  }

  const { email, password } = parseResult.data;

  try {
    const user = await loginUser(email, password);

    const secret = process.env.USER_JWT_SECRET;
    if (!secret) {
      res.status(500).json({
        message: "Server configuration error: JWT_SECRET is not defined",
      });
      return;
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      secret as string,
      { expiresIn: "1h" }
    );

    const cartItems = await prisma.cart.findMany({
      where: {
        user_id: user.id,
        products: {
          isdeleted: false,
        },
      },
      include: {
        products: true,
      },
    });

    console.log(cartItems);

    const cartCount = cartItems.reduce(
      (total, item) => total + (item.quantity ?? 0),
      0
    );

    res.json({
      message: "Login successful",
      token,
      username: user.name,
      cartCount,
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

const addToCartSchema = z.object({
  product_id: z.string().uuid("product_id is required"),
  quantity: z.number().int().positive("Quantity must be a number"),
});

export const addToCartController = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }
    const parseResult = addToCartSchema.safeParse(req.body);

    if (!parseResult.success) {
      const errors = parseResult.error.flatten();
      res.status(400).json({ message: "Validation failed", errors });
      return;
    }

    const { product_id, quantity } = parseResult.data;

    const insertedItem = await addToCartModel(
      Number(userId),
      product_id,
      quantity
    );

    res
      .status(200)
      .json({ status: "Cart item added successfully", cart: insertedItem });
  } catch (error) {
    console.error("Error in addToCartController:", error);
    res.status(500).json({ message: "Error adding to cart" });
  }
};

export const getCartControll = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    const cartItems = await getCartModel(Number(userId));
    res.status(200).json({ message: "Success", cart: cartItems });
  } catch (error) {
    console.error("Error in getCartController:", error);
    res.status(500).json({ message: "Error fetching cart items" });
  }
};

const updateCartSchema = z.object({
  product_id: z.string().uuid("product_id is required"),
  quantity: z.boolean({ invalid_type_error: "Quantity must be true or false" }),
});

export const updateCartControll = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: "User not Authenticated." });
      return;
    }

    const parseResult = updateCartSchema.safeParse(req.body);

    if (!parseResult.success) {
      const errors = parseResult.error.flatten();
      res.status(400).json({ message: "Validation failed", errors });
      return;
    }

    const { product_id, quantity } = parseResult.data;

    const result = await upadetCartModel(Number(userId), product_id, quantity);
    res
      .status(200)
      .json({ message: "Cart quantity updated successfully.", result });
  } catch (error) {
    console.error("Error in updateQuantity", error);
    res.status(500).json({ message: "Error in updateQuantity" });
  }
};

const deletecartSchema = z.object({
  product_id: z.string().uuid("product_id is required"),
});

export const deleteCartControll = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: "User not authenticated.." });
      return;
    }

    const parseResult = deletecartSchema.safeParse(req.body);

    if (!parseResult.success) {
      const errors = parseResult.error.flatten();
      res.status(400).json({ message: "Validation failed", errors });
      return;
    }

    const { product_id } = parseResult.data;

    const deleteItem = await deleteCartModel(Number(userId), product_id);
    res.status(200).json({
      message: "Product deleted from cart successfully..",
      deleteItem,
    });
  } catch (error) {
    console.error("Deleting products to cart ", error);
    res.status(500).json({ message: "Error products to delete cart" });
  }
};

export const getAllOrdersController = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const user_id = req.user?.id;

  if (!user_id) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const orderDetails = await getAllOrders(Number(user_id));

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

export const placeOrdersController = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const user_id = req.user?.id;

    if (!user_id) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const order = await placeOrder(Number(user_id));
    res.status(200).json({ message: "Order Placed Successfully", order });
  } catch (error) {
    console.error("Order error:", error);
    res.status(500).json({ message: error || "Order failed" });
  }
};

export const getAllProductsController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const category = req.query.category as string;
  const search = req.query.search as string;

  try {
    const products = await getFilteredProducts({ category, search });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: "Could not fetch products" });
  }
};

export const getProductByIdController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  try {
    const proId = await getProductsByid(id);
    if (!proId) {
      res.status(404).json({ error: "Product not found" });
      return;
    }
    res.status(200).json(proId);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Could not fetch user" });
  }
};

export const getWishlistControll = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const wishlist = await getWishlistModel(Number(userId));
    res.status(200).json({ message: "success", wishlist: wishlist });
  } catch (error) {
    console.error("Error in getWishlistController:", error);
    res.status(500).json({ message: "Error fetching wishlist" });
  }
};

const addwishListSchema = z.object({
  product_id: z.string().uuid("Inavlid product_id or product_id is required"),
});

export const addwishListControll = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(400).json({ message: "Missing user ID " });
      return;
    }

    const parseResult = addwishListSchema.safeParse(req.body);
    console.log(parseResult);

    if (!parseResult.success) {
      const errors = parseResult.error.flatten();
      res.status(400).json({ message: "Validation failed", errors });
      return;
    }

    const { product_id } = parseResult.data;
    console.log(product_id);

    if (!product_id) {
      res.status(400).json({ message: "product_id is required" });
    }

    const addwishList = await addwishListModel(Number(userId), product_id);
    res.status(200).json({ Message: "Added to wishlist", addwishList });
  } catch (error) {
    console.error("Error in addWishlistController:", error);
    res.status(500).json({ message: "Error fetching wishlist" });
  }
};

const deletewishlistSchema = z.object({
  product_id: z.string().uuid("product_id is required"),
});

export const deleteWishListControll = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;

    const parseResult = deletewishlistSchema.safeParse(req.body);

    if (!parseResult.success) {
      const errors = parseResult.error.flatten();
      res.status(400).json({ message: "Validation failed", errors });
      return;
    }

    const { product_id } = parseResult.data;

    if (!userId || !product_id) {
      res.status(400).json({ message: "Missing user ID or product ID" });
      return;
    }
    const deleteWish = await deletewishlist(Number(userId), product_id);
    res.status(200).json({ Message: "Delete to wishlist", deleteWish });
  } catch (error) {
    console.error("Error deleteing wishList", error);
    res.status(500).json({ message: "Error deleting wishlist" });
  }
};
