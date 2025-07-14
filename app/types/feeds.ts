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
    imageUrl: string;
    videoUrl: string;
    user: User;
    likes: string[]; // assuming it's an array of user IDs
    isDeleted: boolean;
    comments: Comment[]; // assuming it's an array of comment IDs or empty array
    createdAt: string; // or Date if you're parsing it
    __v: number;
}
