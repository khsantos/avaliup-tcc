import { QuestionVote } from "./QuestionVote";
import { User } from "./User";

export type Question = {
  id: string;
  title: string;
  description: string;
  created_at: string;
  user_id: string;
  users?: User;
  faq_questions_votes?: QuestionVote[];
  likeCount?: number;
  dislikeCount?: number;
  userVote?: "like" | "dislike";
};