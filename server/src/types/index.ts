import mongoose, { Document, Model, Types } from "mongoose";
import { Request } from "express";
export interface IUser extends Document {
  name?: string;
  username?: string;
  email?: string;
  // password?: string;
  phone?: string;
  location?: string;
  connections?: number;
  products?: number;
  rating?: number;
  businessName?: string;
  businessEmail?: string;
  businessType?: string;
  jobTitle?: string;
  referrels?: number;
  verified?: boolean;
  isSkip?: boolean;
  website?: string;
  gstNumber?: string;
  address: string;
  city: string;
  state: string;
  postalCode: number;
  country: string;
  socialMedia?: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    facebook?: string;
    youtube?: string;
  };
  services?: string[];
  clients?: {
    id: string;
    name: string;
    logo: string;
    testimonial: string;
    rating: number;
    projectType: string;
    completedDate: Date;
  }[];
  catalog: string;
  //confirmPassword: String,
  udyamNumber?: string;
  interests?: string[];
  aboutUs?: Text;
  profileUrl?: string;
  thumbnail?: string;
  followersCount?: number;
  postsCount?: number;
  isOnline?: boolean;
  lastSeen?: Date;
  createdAt: Date;
  status: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IPost extends Document {
  //type: 'product' | 'deal' | 'help' | 'success';
  content: Text;
  imageUrl?: string;
  videoUrl?: string;
  user: IUser["_id"];
  likes: IUser["_id"][];
  comments: {
    user: IUser["_id"];
    content: Text;
    createdAt: Date;
  }[];
  description?: Text;
  share?: string;
  circle?: ICircle["_id"];
  isDeleted: boolean;
  createdAt: Date;
}

export interface ICustomFile {
  fileName?: string;
  type?: string;
  uploadedBy?: string;
  createdAt?: Date;
}

export interface ICustomFileDocument extends ICustomFile, Document {
  _id: Types.ObjectId;
}

export interface ICatalog extends Document {
  title?: string;
  description?: Text;
  images?: string[];
  price?: string;
  category?: string;
  tags?: string[];
  createdAt?: Date;
}

export interface IChat extends Document {
  senderId?: IUser["_id"];
  receiverId?: IUser["_id"];
  message?: Text;
  timestamp?: Date;
  isRead?: boolean;
  isDeleted?: boolean;
  attachments?: JSON;
}
export interface ICircle extends Document {
  name: string;
  description: string;
  type: "sector" | "location" | "building";
  members: IUser["_id"][];
  admins: IUser["_id"][];
  createdAt: Date;
}

export interface IProduct extends Document {
  title: string;
  price: string;
  description: string;
  imageUrl: string;
  sellerId: IUser["_id"];
  category: string;
  location: string;
  ratings: {
    userId: IUser["_id"];
    rating: number;
    review?: string;
  }[];
  createdAt: Date;
}

export interface IChat extends Document {
  isGroup: boolean;
  name?: string;
  participants: IUser["_id"][];
  messages: {
    senderId: IUser["_id"];
    content: string;
    createdAt: Date;
  }[];
  lastMessage?: {
    senderId: IUser["_id"];
    content: string;
    createdAt: Date;
  };
  createdAt: Date;
}

export interface AuthRequest extends Request {
  userId?: string;
}

export interface IAuthDocument extends IUser, Document {}
export interface IUserDocument extends IUser, Document {}

export interface IAuthModel extends Model<IAuthDocument> {
  findByPhone(phone: string, extraFilter?: any): Promise<IAuthDocument | null>;
}
