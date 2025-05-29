import bcrypt from "bcryptjs";
import { PrismaClient } from "../generated/prisma";
const prisma = new PrismaClient();

export const getAdminLogin = async (email: string) => {
  try {
    const admin = await prisma.admin_users.findUnique({
      where: {
        email: email,
      },
    });

    if (!admin) {
      return null;
    }
    return admin;
  } catch (error) {
    console.error("Error querying the database:", error);
    throw new Error("Database error");
  }
};

export const comparePasswords = async (plain: string, hash: string) => {
  return bcrypt.compare(plain, hash);
};

export const getallUsers = async () => {
  try {
    const users = await prisma.users.findMany();
    return users;
  } catch (error) {
    console.error("Error querying the database:", error);
    throw new Error("Database error");
  }
};

export const getallProducts = async () => {
  try {
    const Products = await prisma.products.findMany();

    return Products;
  } catch (error) {
    console.error("Error querying the database:", error);
    throw new Error("Database error");
  }
};

export const getProductsByid = async (id: string) => {
  // Use bigint here
  try {
    const productId = await prisma.products.findUnique({
      where: {
        id: String(id),
      },
    });

    if (!productId) {
      throw new Error("Product not found");
    }

    return productId;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("Error fetching products");
  }
};

export interface Product {
  id?: string;
  title: string;
  description: string;
  image?: string;
  price: number;
  category: string;
  quantity: number;
  publicid?: string;
}

export const createProducts = async (product: Product) => {
  const { title, description, image, price, category, quantity, publicid } =
    product;

  try {
    const newProduct = await prisma.products.create({
      data: {
        title,
        description,
        image,
        price,
        category,
        quantity,
        publicid,
      },
    });

    return newProduct;
  } catch (error) {
    console.error("Error creating product:", error);
    throw new Error("Error creating product");
  }
};

export const updateProducts = async (product: Product) => {
  const { id, title, description, image, price, category, quantity } = product;

  try {
    const updateProduct = await prisma.products.update({
      where: { id },
      data: {
        title,
        description,
        image,
        price,
        category,
        quantity,
      },
    });
    return updateProduct;
  } catch (error) {
    console.error("Error updating product:", error);
    throw new Error("Error updating product");
  }
};

export const ToggleProducts = async (id: string, status: boolean) => {
  try {
    const deleteProduct = await prisma.products.update({
      where: { id },
      data: {
        isdeleted: status,
      },
    });
    return deleteProduct;
  } catch (error) {
    console.error("Error Toggling product:", error);
    throw new Error("Error Toggling product");
  }
};

export const getAllOrders = async () => {
  try {
    const orders = await prisma.orders.findMany({
      orderBy: {
        purchase_date: "desc",
      },
      include: {
        users: true,
        order_items: true,
      },
    });

    return orders;
  } catch (error) {
    console.error("Error listing the orders:", error);
    throw new Error("Error Listing the orders");
  }
};
