import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Database types for TypeScript (optional but helpful)
export const ProfileType = {
  id: "string",
  email: "string | null",
  full_name: "string | null",
  avatar_url: "string | null",
  phone: "string | null",
  address: "string | null",
  created_at: "string",
  updated_at: "string",
};

export const OrderType = {
  id: "string",
  user_id: "string",
  total_amount: "number",
  status: "pending | completed | cancelled",
  shipping_address: "string | null",
  created_at: "string",
};

export const OrderItemType = {
  id: "string",
  order_id: "string",
  product_id: "number",
  quantity: "number",
  price: "number",
  created_at: "string",
};
