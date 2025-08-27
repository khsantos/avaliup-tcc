export type Comments = {
    id: string;
    text: string;
    review_id: string;
    user_id: string;
    created_at: string;
    users?: {
        name: string;
        profile_img: string | null;
    };
}