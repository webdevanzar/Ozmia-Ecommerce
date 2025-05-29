export type ProductType = {
  id?: string;
  title: string;
  image: string | File;
  description: string;
  price: number;
  quantity: number;
  isdeleted: boolean;
  category: string;
  publicid?: string;
};

export type UserType = {
  id: number;
  name: string;
  email: string;
  acc_created: string;
};

export type AddPayloadType = {
  url: string;
  data: FormData;
};

export type FormValuesType = {
  email: string;
  password: string;
};

export type TogglePayLoadType = {
  id: string;
  status: boolean;
};

export type MutationPayload = {
  action: "add" | "delete" | "update";
  url: string;
  data: any;
};

type OrderItemType = {
  id: number;
  order_id: number;
  product_id: string;
  quantity: number;
  price: string;
};

export type OrdersType = {
  id: number;
  user_id: number;
  purchase_date: string; // ISO date string
  total_price: string;
  total_items: number;
  users: UserType;
  order_items: OrderItemType[];
};
