export interface Comment {
  id: number;
  content: string;
  user: { id: number; username: string; pic: string };
  createdAt: string;
  updatedAt: string;
  postId: number;
}
