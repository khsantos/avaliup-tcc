export type User_Review = {
    id: string;
    user_id: string;
    product_id: string;
    title: string;
    description: string;
    performance: number;
    costBenefit: number;
    comfort: number;
    weight: number;
    durability: number;
    created_at: Date;
}