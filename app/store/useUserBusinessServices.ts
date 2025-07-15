import { create } from 'zustand';
import axios from 'axios';

const API_URL = 'http://84.247.177.87/api';

interface UserServiceData {
    user: string;
    services?: Array<{

        title: string;
        description: string;
        features: string[];

    }>;
    catalog?: Array<{
        title: string;
        description: string;
        images: string[];
        price: string;
        category: string;
        tags: string[];
    }>;
    client?: Array<{
        name: string;
        logo: string;
        testimonial: string;
        rating: string;
        projectType: string;
        completedDate: string;
    }>;
}

interface UserServicesStore {
    loading: boolean;
    error: string | null;
    response: any;

    createUserService: (data: UserServiceData) => Promise<any>;
    getAllUserServices: () => Promise<any>;
    getUserServiceById: (id: string) => Promise<any>;
    updateUserService: (userId: string, data: Partial<UserServiceData>) => Promise<any>;
    deleteUserService: (id: string) => Promise<any>;
    getUserServicesByUserId: (userId: string) => Promise<any>;
}

const useUserServiceStore = create<UserServicesStore>((set, get) => ({
    loading: false,
    error: null,
    response: null,

    createUserService: async (data) => {
        try {
            const res = await axios.post(`${API_URL}/user-services`, data);
            await get().getAllUserServices();
            return res;
        } catch (err: any) {
            set({
                error: err?.response?.data?.message || 'Failed to create user service',
                loading: false,
            });
            return err?.response;
        }
    },

    getAllUserServices: async () => {
        set({ loading: true, error: null });
        try {
            const res = await axios.get(`${API_URL}/user-services`);
            set({ response: res.data, loading: false });
            return res;
        } catch (err: any) {
            set({
                error: err?.response?.data?.message || 'Failed to fetch user services',
                loading: false,
            });
            return err?.response;
        }
    },

    getUserServiceById: async (id) => {
        try {
            const res = await axios.get(`${API_URL}/user-services/${id}`);
            return res;
        } catch (err: any) {
            set({
                error: err?.response?.data?.message || 'Failed to fetch user service by ID',
                loading: false,
            });
            return err?.response;
        }
    },

    updateUserService: async (userId, data) => {
        try {

            const res = await axios.put(`${API_URL}/user-services/${userId}`, data);
            await get().getUserServicesByUserId(userId);
            return res.data;
        } catch (err: any) {
            set({
                error: err?.response?.data?.message || 'Failed to update user service',
                loading: false,
            });
            console.log(err?.response, "error");
            return err?.response;
        }
    },

    deleteUserService: async (id) => {
        try {
            const res = await axios.delete(`${API_URL}/user-services/${id}`);
            await get().getAllUserServices();
            return res;
        } catch (err: any) {
            set({
                error: err?.response?.data?.message || 'Failed to delete user service',
                loading: false,
            });
            return err?.response;
        }
    },

    getUserServicesByUserId: async (userId: string) => {

        try {
            set({ loading: true, error: null });

            const res = await axios.get(`${API_URL}/user-services/user/${userId}`);
            set({ response: res, loading: false });
            return res;
        } catch (err: any) {
            set({
                error: err?.response?.data?.message || 'Failed to fetch services for user',
                loading: false,
            });
            return err?.response;
        }
    },
}));

export default useUserServiceStore;
