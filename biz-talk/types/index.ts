export interface User {
  id: string;
  name: string;
  businessName: string;
  avatar?: string;
  coverImage?: string;
  email: string;
  phone: string;
  location: string;
  businessType: string;
  verified: boolean;
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
  likes: number;
  comments: number;
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

export interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isGroup: boolean;
}