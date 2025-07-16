import { create } from 'zustand';
import axios from 'axios';

const API_URL = 'http://84.247.177.87/api';

interface Message {
    content: string;
    sender: string;
    receiver: string;
    type: string;

}

interface ChatStore {
    loading: boolean;
    error: string | null;
    response: any;
    messages: Message[];
    conversations: any[];
    selectedConversation: any | null;

    sendMessage: (message: Message) => Promise<any>;
    getConversation: (sender: string, receiver: string) => Promise<any>;
    getChatsByUserId: (userId: string) => Promise<any>;
    getChatsBySenderUserId: (userId: string) => Promise<any>;
}

const useChatStore = create<ChatStore>((set, get) => ({
    loading: false,
    error: null,
    response: null,
    messages: [],
    conversations: [],
    selectedConversation: null,

    sendMessage: async (message: Message) => {
        try {
            set({ loading: true, error: null });
            const response = await axios.post(`${API_URL}/messages/send`, message);
            const updatedMessages = [...get().messages, response.data];
            set({
                loading: false,
                messages: [...get().messages, response.data]
            });
            return response.data;
        } catch (error) {
            set({ loading: false, error: error instanceof Error ? error.message : 'An error occurred' });
            throw error;
        }
    },
    getChatsByUserId: async (userId: string) => {
        try {
            set({ loading: true, response: null, error: null });
            const response = await axios.get(`${API_URL}/messages/sender/${userId}`);

            set({
                loading: false,
                response: response.data
            });
            return response.data;
        } catch (error) {
            set({ loading: false, error: error instanceof Error ? error.message : 'An error occurred' });
            throw error;
        }
    },
    getChatsBySenderUserId: async (userId: string) => {
        try {

            const response = await axios.get(`${API_URL}/messages/sender?sender=${userId}`);

            return response.data;
        } catch (error) {
            set({ loading: false, error: error instanceof Error ? error.message : 'An error occurred' });
            throw error;
        }
    },
    getConversation: async (sender: string, receiver: string) => {
        try {
            set({ loading: true, error: null });
            const response = await axios.get(`${API_URL}/messages/conversation`, {
                params: { sender, receiver }
            });
            set({
                loading: false,
                conversations: response.data
            });
            return response.data;
        } catch (error) {
            set({ loading: false, error: error instanceof Error ? error.message : 'An error occurred' });
            throw error;
        }
    }
}));

export default useChatStore;
