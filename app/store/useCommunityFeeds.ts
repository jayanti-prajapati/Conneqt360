import { create } from 'zustand';
import axios from 'axios';

const API_URL = 'http://84.247.177.87/api'; // Replace with your actual feed endpoint base


interface CommunityFeedsStore {
    loading: boolean;
    error: string | null;
    response: any;

    createFeed: (data: any) => Promise<any>;
    getAllFeeds: () => Promise<any>;
    getFeedById: (id: string) => Promise<any>;
    updateFeed: (id: string, data: Partial<any>) => Promise<any>;
    deleteFeed: (id: string) => Promise<any>;
    getFeedsByUserId: (userId: string) => Promise<any>;
}

const useCommunityFeedsStore = create<CommunityFeedsStore>((set) => ({
    loading: false,
    error: null,
    response: null,

    createFeed: async (data) => {
        set({ loading: true, error: null });
        try {
            const res = await axios.post(`${API_URL}/community-feeds`, data);
            set({ response: res.data, loading: false });
            return res;
        } catch (err: any) {
            set({ error: err?.response?.data?.message || 'Feed creation failed', loading: false });
            return err?.response;
        }
    },

    getAllFeeds: async () => {
        set({ loading: true, error: null });
        try {
            const res = await axios.get(`${API_URL}/community-feeds`);
            set({ response: res.data, loading: false });
            return res;
        } catch (err: any) {
            set({ error: err?.response?.data?.message || 'Failed to fetch feeds', loading: false });
            return err?.response;
        }
    },

    getFeedById: async (id) => {
        set({ loading: true, error: null });
        try {
            const res = await axios.get(`${API_URL}/community-feeds/${id}`);
            set({ response: res.data, loading: false });
            return res;
        } catch (err: any) {
            set({ error: err?.response?.data?.message || 'Failed to fetch feed', loading: false });
            return err?.response;
        }
    },

    updateFeed: async (id, data) => {
        set({ loading: true, error: null });
        try {
            const res = await axios.put(`${API_URL}/community-feeds/${id}`, data);
            set({ response: res.data });
            return res;
        } catch (err: any) {
            set({ error: err?.response?.data?.message || 'Feed update failed', loading: false });
            return err?.response;
        }
    },

    deleteFeed: async (id) => {
        set({ loading: true, error: null });
        try {
            const res = await axios.delete(`${API_URL}/community-feeds/${id}`);
            set({ response: res.data, loading: false });
            return res;
        } catch (err: any) {
            set({ error: err?.response?.data?.message || 'Feed deletion failed', loading: false });
            return err?.response;
        }
    },

    getFeedsByUserId: async (userId: string) => {
        set({ loading: true, error: null });
        try {
            const res = await axios.get(`${API_URL}/community-feeds/user/${userId}`);
            set({ response: res.data, loading: false });
            return res;
        } catch (err: any) {
            set({ error: err?.response?.data?.message || 'Failed to fetch user feeds', loading: false });
            return err?.response;
        }
    },
}));

export default useCommunityFeedsStore;
