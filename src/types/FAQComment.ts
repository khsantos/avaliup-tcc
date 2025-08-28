import { User } from "./User";

export type Comentario = {
  id: string;
  content: string;
  faq_questions_id: string;
  user_id: string;
  created_at: string;
  users?: User
};