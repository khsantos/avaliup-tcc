export type Product_Prices = {
  name: string;
  marketplace: string;
  price: number;
  old_price: number | null;
  href: string;
  is_on_sale: boolean;
  products_id: number;
  products?: { image: string } | { image: string }[] | null;
  product_image?: string;
};