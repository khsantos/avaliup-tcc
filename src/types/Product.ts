export type Product = {
    id: number;
    name: string;
    price?: number;
    image: string;
    images?: string[];
    category?: string;
    subcategory?: string;
    isActive?: boolean;
    rank?: number;
    rating?: number;
    review_count?: number;
}