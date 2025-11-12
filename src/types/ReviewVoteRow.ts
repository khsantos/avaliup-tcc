export type ReviewVoteRow = {
  id: string;
  review_id: string;
  user_id: string;
  vote_type: "like" | "dislike";
  created_at?: string;
};
