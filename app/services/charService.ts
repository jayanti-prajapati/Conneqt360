import { Chat, Message, User } from '../types';

// Mock users for chat
const mockUsers: User[] = [
    {
        id: 'user456',
        email: 'sarah@company.com',
        displayName: 'Sarah Johnson',
        photoURL: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
        bio: 'Marketing Director',
        followersCount: 890,
        followingCount: 650,
        postsCount: 32,
        isOnline: true,
        lastSeen: new Date(),
        createdAt: new Date('2023-02-20'),
    },
    {
        id: 'user789',
        email: 'mike@startup.com',
        displayName: 'Mike Chen',
        photoURL: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
        bio: 'Tech Entrepreneur',
        followersCount: 2100,
        followingCount: 450,
        postsCount: 67,
        isOnline: false,
        lastSeen: new Date(Date.now() - 3600000),
        createdAt: new Date('2022-11-10'),
    },
];

// Mock chats data
const mockChats: Chat[] = [
    {
        id: 'chat1',
        participants: ['user123', 'user456'],
        lastMessage: {
            id: 'msg1',
            senderId: 'user456',
            receiverId: 'user123',
            content: 'Hey! How did the presentation go today?',
            isRead: false,
            createdAt: new Date(Date.now() - 1800000), // 30 minutes ago
        },
        updatedAt: new Date(Date.now() - 1800000),
    },
    {
        id: 'chat2',
        participants: ['user123', 'user789'],
        lastMessage: {
            id: 'msg2',
            senderId: 'user123',
            receiverId: 'user789',
            content: 'Thanks for the business advice! Really helpful.',
            isRead: true,
            createdAt: new Date(Date.now() - 7200000), // 2 hours ago
        },
        updatedAt: new Date(Date.now() - 7200000),
    },
];

export const chatService = {
    async getUserChats(userId: string): Promise<Chat[]> {
        try {
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 600));

            // Return chats where user is a participant
            //@ts-ignore
            return mockChats.filter(chat => chat.participants.includes(userId));
        } catch (error) {
            console.error('Error fetching chats:', error);
            throw error;
        }
    },

    async createChat(participants: string[], initialMessage: string, senderId: string): Promise<string> {
        try {
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 800));

            const message: Message = {
                id: Date.now().toString(),
                senderId,
                receiverId: participants.find(p => p !== senderId)!,
                content: initialMessage,
                isRead: false,
                createdAt: new Date(),
            };

            const chat: Chat = {
                id: `chat${Date.now()}`,
                participants,
                lastMessage: message,
                updatedAt: new Date(),
            };

            mockChats.unshift(chat);
            return chat.id;
        } catch (error) {
            console.error('Error creating chat:', error);
            throw error;
        }
    },

    async sendMessage(chatId: string, senderId: string, receiverId: string, content: string) {
        try {
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 400));

            const message: Message = {
                id: Date.now().toString(),
                senderId,
                receiverId,
                content,
                isRead: false,
                createdAt: new Date(),
            };

            // Update the chat's last message
            const chat = mockChats.find(c => c.id === chatId);
            if (chat) {
                chat.lastMessage = message;
                chat.updatedAt = new Date();
            }
        } catch (error) {
            console.error('Error sending message:', error);
            throw error;
        }
    },

    subscribeToMessages(chatId: string, callback: (messages: Message[]) => void) {
        // Mock real-time messages
        const mockMessages: Message[] = [
            {
                id: 'msg1',
                senderId: 'user456',
                receiverId: 'user123',
                content: 'Hey! How did the presentation go today?',
                isRead: false,
                createdAt: new Date(Date.now() - 1800000),
            },
            {
                id: 'msg2',
                senderId: 'user123',
                receiverId: 'user456',
                content: 'It went really well! Thanks for asking.',
                isRead: true,
                createdAt: new Date(Date.now() - 1200000),
            },
        ];

        // Simulate real-time updates
        setTimeout(() => {
            callback(mockMessages);
        }, 500);

        // Return cleanup function
        return () => { };
    },
};