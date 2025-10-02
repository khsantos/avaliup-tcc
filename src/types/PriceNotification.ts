export type PriceNotification = {
  id: string;
  product_id: string;
  min_price: number;
  max_price: number;
  created_at: string;
  product: {
    id: string;
    name: string;
  } | null;
  current_price?: number;
  triggered?: boolean;
}