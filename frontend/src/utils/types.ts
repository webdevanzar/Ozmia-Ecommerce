export type FormFieldType = {
  email: string;
  name?: string;
  password: string;
  cpassword?: string;
};

export type MutationPayload = {
  action: "register" | "login";
  data: any;
};

export type ProductType = {
  id?: string;
  title: string;
  image: string | File;
  description: string;
  price: string;
  isdeleted: boolean;
  quantity: string;
  category: string;
  publicid?: string;
};

export type WishlistItem = {
  id: number;
  product_id: string;
  created_at: string; // ISO timestamp
  products: ProductType; // Related product
};

export type CartlistItem = {
  id: number;
  product_id: string;
  quantity: number;
  created_at: string; // ISO timestamp
  products: ProductType; // Related product
};

export type OrderItem = {
  id: number;
  product_id: string;
  quantity: number;
  price: string;
  products: ProductType;
};

export type Order = {
  id: number;
  user_id: number;
  purchase_date: string;
  total_price: string;
  total_items: number;
  order_items: OrderItem[];
};
