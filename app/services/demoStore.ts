import { create } from 'zustand';
import { User } from '../types';

const HARDCODED_USER: User = {
    _id: 'user123',
    email: 'demo@business.com',
    name: 'Demo User',
    profileUrl: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    aboutUs: 'Business professional passionate about networking and growth',
    businessName: 'TechSolutions Pro',
    businessType: 'Technology Consulting',
    businessEmail: 'contact@techsolutionspro.com',
    website: 'https://techsolutionspro.com',
    phone: '+1 (555) 123-4567',
    address: '123 Business Street',
    city: 'San Francisco',
    state: 'California',
    postalCode: '94105',
    country: 'United States',
    gstNumber: '29ABCDE1234F1Z5',
    udyamNumber: 'UDYAM-CA-12-1234567',
    socialMedia: {
        linkedin: 'https://linkedin.com/in/demouser',
        twitter: 'https://twitter.com/demouser',
        instagram: 'https://instagram.com/demouser',
        facebook: 'https://facebook.com/demouser',
        youtube: 'https://youtube.com/@demouser',
    },

    followersCount: 1250,
    followingCount: 890,
    postsCount: 45,
    isOnline: true,
    lastSeen: new Date(),
    createdAt: new Date('2023-01-15'),
};
interface AuthState {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    setUser: (user: User | null) => void;
    setLoading: (loading: boolean) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: HARDCODED_USER,
    isLoading: true,
    isAuthenticated: false,
    setUser: (user) => set({ user, isAuthenticated: !!user }),
    setLoading: (isLoading) => set({ isLoading }),
    logout: () => set({ user: null, isAuthenticated: false }),
}));