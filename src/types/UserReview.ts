export type UserReview = {
  id: string;
  title: string;
  text: string;
  time_of_use?: string;
  price_paid?: string;
  rating: number;
  rating_performance?: number;
  rating_cost_benefit?: number;
  rating_comfort?: number;
  rating_weight?: number;
  rating_durability?: number;
  likes?: number;
  dislikes?: number;
  comments?: number;
  images?: string[];
  store?: string;
  badges?: string[];
  created_at: string;
  product_id: number;
  products?: {
    id: string;
    name: string;
    image: string | null;
  } | null;
  users?: {                       
    id: string;
    name: string;
    profile_img: string | null;
  } | null;
  user_name?: string;
  user_profile_img?: string;
  product_image: string,
  product_name: string,
  setReviews?: React.Dispatch<React.SetStateAction<UserReview[]>>;
};
