import { Document } from 'mongoose';
import { Request } from 'express';
export interface IUser extends Document {
  email: string;
  password: string;
  businessName: string;
  phone: string;
  // location?: string;
  businessType?: string;
  verified: boolean;
  gstNumber?: string;
  confirmPassword: String,


  udyamNumber?: string;
  interests: string[];
  createdAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IPost extends Document {
  type: 'product' | 'deal' | 'help' | 'success';
  content: string;
  imageUrl?: string;
  userId: IUser['_id'];
  likes: IUser['_id'][];
  comments: {
    userId: IUser['_id'];
    content: string;
    createdAt: Date;
  }[];
  circle?: ICircle['_id'];
  createdAt: Date;
}

export interface ICircle extends Document {
  name: string;
  description: string;
  type: 'sector' | 'location' | 'building';
  members: IUser['_id'][];
  admins: IUser['_id'][];
  createdAt: Date;
}

export interface IProduct extends Document {
  title: string;
  price: string;
  description: string;
  imageUrl: string;
  sellerId: IUser['_id'];
  category: string;
  location: string;
  ratings: {
    userId: IUser['_id'];
    rating: number;
    review?: string;
  }[];
  createdAt: Date;
}

export interface IChat extends Document {
  isGroup: boolean;
  name?: string;
  participants: IUser['_id'][];
  messages: {
    senderId: IUser['_id'];
    content: string;
    createdAt: Date;
  }[];
  lastMessage?: {
    senderId: IUser['_id'];
    content: string;
    createdAt: Date;
  };
  createdAt: Date;
}

export interface AuthRequest extends Request {
  userId?: string;
}