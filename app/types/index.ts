export interface User {
  _id: string;
  username?: string;
  jobTitle?: string;

  email: string;
  name: string;
  profileUrl?: string;
  verified?: boolean

  aboutUs?: string;
  businessName?: string;
  businessType?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  gstNumber?: string;
  udyamNumber?: string;
  businessEmail?: string;
  website?: string;
  socialMedia?: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    facebook?: string;
    youtube?: string;
  };
  services?: string[];
  clients?: Client[];
  catalog?: CatalogItem[];
  followersCount: number;
  followingCount: number;
  postsCount: number;
  isOnline: boolean;
  lastSeen: Date;
  createdAt: Date;
}

export interface Client {
  _id: string;
  name: string;
  logo: string;
  testimonial: string;
  rating: string;
  projectType: string;
  completedDate: string;
}


export interface Service {
  _id?: string;
  title: string;
  description: string;
  features: string[];
}
export interface Post {
  id: string;
  type: 'product' | 'deal' | 'help' | 'success';
  content: string;
  imageUrl?: string;
  userId: string;
  username: string;
  businessName: string;
  timestamp: string;
  likes: string[];
  comments: Comment[];
  verified: boolean;
}

export interface Circle {
  id: string;
  name: string;
  members: number;
  description: string;
  type: 'sector' | 'location' | 'building';
  unreadMessages: number;
}

export interface Product {
  id: string;
  title: string;
  price: string;
  description: string;
  imageUrl: string;
  sellerId: string;
  sellerName: string;
  rating: number;
  location: string;
  verified: boolean;
}

export interface Message {
  _id?: string;
  sender: string;
  receiver: string;
  content: string;
  type?: 'text' | 'image' | 'video';
  isRead?: boolean;
  createdAt?: Date;

}


export interface Comment {
  id?: string;
  userId?: string;
  user: User;
  content: string;
  createdAt?: Date;
}

export interface CatalogItem {
  _id: string;
  title: string;
  description: string;
  images: string[];
  price?: string;
  category: string;
  tags?: string[];
  createdAt: Date;
}