import bcrypt from "bcryptjs";
import { PrismaClient } from "../generated/prisma";
import { FilterParams } from "@/types/types";
const prisma = new PrismaClient();

export const registerUser = async (
  name: string,
  email: string,
  password: string
) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.users.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
      },
    });
    return newUser.id;
  } catch (error) {
    throw new URIError(`Error registering user with email ${email}: ${error}`);
  }
};

export const findUserByEmail = async (email: string) => {
  const user = await prisma.users.findFirst({
    where: {
      email,
    },
  });
  return user ?? undefined;
};

export const loginUser = async (email: string, password: string) => {
  try {
    const user = await prisma.users.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
      },
    });

    if (!user || !user.password) {
      throw new Error("User not found or password missing");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Invalid Password");
    }

    // Return user data excluding the password
    return { id: user.id, email: user.email, name: user.name };
  } catch (error) {
    throw new Error(`Error logging in user with email ${email}: ${error}`);
  }
};

export const getCartModel = async (user_id: number) => {
  try {
    const getcart = await prisma.cart.findMany({
      where: {
        user_id,
        products: {
          isdeleted: false,
        },
      },
      include: {
        products: true,
      },
    });
    return getcart;
  } catch (error) {
    console.error("Error fetching cart items:", error);
    throw new Error("Error fetching cart items");
  }
};

export const addToCartModel = async (
  user_id: number,
  product_id: string,
  quantity: number
) => {
  try {
    const existing = await prisma.cart.findFirst({
      where: {
        user_id: user_id,
        product_id: product_id,
      },
    });

    if (existing) {
      return await prisma.cart.update({
        where: { id: existing.id },
        data: {
          quantity: existing.quantity! + quantity,
        },
      });
    }

    return await prisma.cart.create({
      data: {
        user_id: user_id,
        product_id: product_id,
        quantity: quantity,
      },
    });
  } catch (error) {
    console.error("Error adding products to cart:", error);
    throw new Error("Error adding products to cart");
  }
};

export const deleteCartModel = async (user_id: number, product_id: string) => {
  try {
    const existing = await prisma.cart.findFirst({
      where: {
        user_id,
        product_id,
      },
    });

    if (!existing) {
      throw new Error("Cart item is not found..");
    }

    const deletecart = await prisma.cart.delete({
      where: {
        id: existing.id,
      },
    });

    return deletecart;
  } catch (error) {
    console.error("Error deleting products to cart", error);
    throw new Error("Error deleting products to cart");
  }
};

export const upadetCartModel = async (
  user_id: number,
  product_id: string,
  quantity: boolean
) => {
  try {
    const existing = await prisma.cart.findFirst({
      where: {
        user_id: user_id,
        product_id: product_id,
      },
    });

    if (!existing || existing.quantity == null) {
      throw new Error("Product not found in cart");
    }

    let newQuantity = existing.quantity;

    if (quantity) {
      newQuantity += 1;
    } else {
      if (existing.quantity > 1) {
        newQuantity -= 1;
      } else {
        return {
          message: "Quantity is already at minimum (1), cannot decrease ",
        };
      }
    }

    const updatedCart = await prisma.cart.update({
      where: { id: existing.id },
      data: { quantity: newQuantity },
    });

    return updatedCart;
  } catch (error) {
    console.error("Error in updateCartQuantityModel:", error);
    throw new Error("Failed to update cart quantity");
  }
};

export const placeOrder = async (user_id: number) => {
  try {
    //fectch cart items
    const cartItems = await prisma.cart.findMany({
      where: { user_id },
      include: { products: true },
    });

    if (cartItems.length === 0) {
      throw new Error("Cart is Empty");
    }

    //calaculate Totals
    let total_price = 0;
    let total_items = 0;

    const orderItemsData = cartItems.map((item) => {
      const price = item.products?.price || 0;
      const quantity = item.quantity || 1;

      total_price = total_price + Number(price) * quantity;
      total_items = total_items + quantity;

      return {
        product_id: item.product_id!,
        quantity,
        price,
      };
    });

    //create the order
    const order = await prisma.orders.create({
      data: {
        user_id,
        total_price,
        total_items,
      },
    });

    //insert into orderitems
    for (const item of orderItemsData) {
      await prisma.order_items.create({
        data: {
          order_id: order.id,
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price,
        },
      });
    }

    await prisma.cart.deleteMany({
      where: { user_id },
    });

    return order;
  } catch (error) {
    console.error("order palcement failed", error);
    throw new Error("Failed to place order");
  }
};

export const getAllOrders = async (user_id: number) => {
  try {
    const getOrders = await prisma.orders.findMany({
      where: { user_id },
      include: {
        order_items: {
          include: {
            products: true,
          },
        },
      },
    });
    return getOrders;
  } catch (error) {
    console.error("Error fetching userwishlist", error);
    throw new Error("Error fetching userwishlist");
  }
};

export const getProductsByid = async (id: string) => {
  try {
    const productId = await prisma.products.findUnique({
      where: {
        id: id,
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

export const getFilteredProducts = async ({
  category,
  search,
}: FilterParams) => {
  try {
    const Products = await prisma.products.findMany({
      where: {
        isdeleted: false,
        ...(category && { category }),
        ...(search && {
          title: {
            contains: search,
            mode: "insensitive",
          },
        }),
      },
    });
    console.log(Products);

    const serializedProducts = Products.map((product) => ({
      ...product,
      id: product.id.toString(),
    }));
    return serializedProducts;
  } catch (error) {
    console.error("Error fetching products by category:", error);
    throw new Error("Error fetching category products");
  }
};

export const addwishListModel = async (user_id: number, product_id: string) => {
  try {
    const existing = await prisma.wishlists.findFirst({
      where: { user_id, product_id },
    });

    if (existing) {
      return existing;
    }

    const wishlist = await prisma.wishlists.create({
      data: { user_id, product_id },
    });

    return wishlist;
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    throw new Error("Error adding to wishlist");
  }
};

export const getWishlistModel = async (user_id: number) => {
  try {
    const getwishlist = await prisma.wishlists.findMany({
      where: {
        user_id,
        products: {
          isdeleted: false,
        },
      },
      include: {
        products: true,
      },
    });
    return getwishlist;
  } catch (error) {
    console.error("Error fetching userwishlist", error);
    throw new Error("Error fetching userwishlist");
  }
};

export const deletewishlist = async (user_id: number, product_id: string) => {
  try {
    const existing = await prisma.wishlists.findFirst({
      where: { user_id, product_id },
    });

    if (!existing) {
      throw new Error("Item not found in the wishlist");
    }

    const deletewishlist = await prisma.wishlists.delete({
      where: { id: existing.id },
    });

    return deletewishlist;
  } catch (error) {
    console.error("Error deleting from wishlist: ", error);
    throw new Error("Error deletingfrom wishlist");
  }
};
