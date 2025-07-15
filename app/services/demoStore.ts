import { create } from 'zustand';
import { User } from '../types';

const HARDCODED_USER: User = {
    id: 'user123',
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
    services: [
        'Web Development',
        'Mobile App Development',
        'Cloud Solutions',
        'Digital Marketing',
        'Business Consulting',
        'UI/UX Design'
    ],
    clients: [
        {
            id: 'client1',
            name: 'TechCorp Inc.',
            logo: 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
            testimonial: 'Excellent service and professional delivery. Highly recommended!',
            rating: 5,
            projectType: 'E-commerce Platform',
            completedDate: new Date('2024-01-15'),
        },
        {
            id: 'client2',
            name: 'StartupXYZ',
            logo: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
            testimonial: 'Amazing work on our mobile app. Great communication throughout.',
            rating: 5,
            projectType: 'Mobile Application',
            completedDate: new Date('2024-02-20'),
        },
        {
            id: 'client3',
            name: 'Global Enterprises',
            logo: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
            testimonial: 'Professional team with excellent technical expertise.',
            rating: 4,
            projectType: 'Cloud Migration',
            completedDate: new Date('2024-03-10'),
        },
    ],
    catalog: [
        {
            id: 'catalog1',
            title: 'E-commerce Website Development',
            description: 'Complete e-commerce solution with payment integration, inventory management, and responsive design.',
            images: [
                'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2',
                'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2'
            ],
            price: 'Starting from $2,500',
            category: 'Web Development',
            tags: ['E-commerce', 'React', 'Node.js', 'Payment Gateway'],
            createdAt: new Date('2024-01-01'),
        },
        {
            id: 'catalog2',
            title: 'Mobile App Development',
            description: 'Cross-platform mobile applications for iOS and Android with modern UI/UX design.',
            images: [
                'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2',
                'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2'
            ],
            price: 'Starting from $5,000',
            category: 'Mobile Development',
            tags: ['React Native', 'iOS', 'Android', 'UI/UX'],
            createdAt: new Date('2024-01-15'),
        },
        {
            id: 'catalog3',
            title: 'Cloud Infrastructure Setup',
            description: 'Complete cloud migration and infrastructure setup with monitoring and security.',
            images: [
                'https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2'
            ],
            price: 'Starting from $3,000',
            category: 'Cloud Services',
            tags: ['AWS', 'Azure', 'DevOps', 'Security'],
            createdAt: new Date('2024-02-01'),
        },
    ],
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