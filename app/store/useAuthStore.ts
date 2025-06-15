//@ts-ignore
import { API_URL } from '@env';

import { create } from 'zustand';
import axios from 'axios';
import { LoginPayload, RegisterPayload } from './type';


interface AuthStore {
    loading: boolean;
    error: string | null;
    response: any;

    register: (data: RegisterPayload) => {};
    login: (data: LoginPayload) => {};
    // tokenVerify: (data: any) => {};
    reset: () => void;

}

const baseUrl = process.env.API_URL!;


const useAuthStore = create<AuthStore>((set) => ({
    loading: false,
    error: null,
    response: null,

    register: async (data) => {
        set({ loading: true, error: null, response: null });
        try {

            const res = await axios.post(API_URL + '/auth/register', data);
            set({ response: res.data, loading: false });
            return res;
        } catch (err: any) {
            set({ error: err?.response?.data?.message || 'Registration failed', loading: false });
            return err?.response;

        }
    },

    login: async (data: { email: string; password: string }): Promise<any | null> => {
        set({ loading: true, error: null, response: null });
        try {
            const res = await axios.post(API_URL + '/auth/login', data);
            set({ response: res.data, loading: false });
            return res;
        } catch (err: any) {
            set({ error: err?.response?.data?.message || 'Login failed', loading: false });
            return err?.response;
        }
    },
    reset: () => set({ loading: true, error: null, response: null }),
    // tokenVerify: async (data: { email: string; password: string }): Promise<any | null> => {
    //     set({ loading: true, error: null, response: null });
    //     try {
    //         const res = await axios.post('http://192.168.1.3:5001/api/auth/login', data);
    //         set({ response: res.data, loading: false });
    //         return res.data; // ✅ return value
    //     } catch (err: any) {
    //         set({ error: err?.response?.data?.message || 'Login failed', loading: false });
    //         return err?.response?.data; // ✅ return null on failure
    //     }
    // }

}));

export default useAuthStore;
