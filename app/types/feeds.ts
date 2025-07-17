import { Comment } from ".";
export interface User {
  _id: string;
  username: string;
  email: string;
  businessName: string;
  phone: string;
  businessType: string;
  profileUrl: string;
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
