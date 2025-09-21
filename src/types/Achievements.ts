export type Achievement = {
    id: number;
    title: string;
    description: string;
    image_url: string | null;
    unlocked?: boolean;
}