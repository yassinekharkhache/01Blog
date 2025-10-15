export interface Comment {
  id: number;
  content: string;
  user: { id: number; userName: string; pic: string };
  createdAt: string;
  updatedAt: string;
  postId: number;
}
