export type Comments = {
    id: string;
    text: string;
    review_id: number;
    user_id: number;
    created_at: Date;
    users?: {
        name: string;
        profile_img: string | null;
    };
}