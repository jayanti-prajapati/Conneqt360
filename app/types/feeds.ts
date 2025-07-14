import { Comment } from ".";

export interface User {
  username: string;
  businessName: string;
  profileUrl: string;
  phone: string;
}

export interface CommunityPost {
  _id: string;
  content: string;
  imageUrl?: string;
  videoUrl?: string;
  user: User;
  createdAt: string;
  likes: string[];
  comments: Comment[];
}
