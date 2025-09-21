export type Achievement = {
    id: string;
    title: string;
    description: string;
    image_url: string | null;
    unlocked?: boolean;
}