//@ts-ignore
// import { API_URL } from '@env';

import { create } from 'zustand';
import axios from 'axios';
import { LoginPayload, RegisterPayload } from './type';

const API_URL = "http://84.247.177.87/api"   // change this to your testing API URL
interface AuthStore {
    loading: boolean;
    error: string | null;
    response: any;
    otpNumber: string | null;

    register: (data: RegisterPayload) => {};
    login: (data: LoginPayload) => {};
    // tokenVerify: (data: any) => {};
    reset: () => void;
    sendOtp: (data: { phone: string; }) => Promise<any | null>;
    verifyOtp: (data: { phone: string; otp: string }) => Promise<any | null>;

}

const baseUrl = process.env.API_URL!;


const useAuthStore = create<AuthStore>((set) => ({
    loading: false,
    error: null,
    response: null,
    otpNumber: null,

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
    sendOtp: async (data: { phone: string; }): Promise<any | null> => {
        console.log(API_URL);

        set({ loading: true, error: null, response: null });
        try {
            const res = await axios.post(API_URL + '/auth/send-otp', data);

            set({ response: res.data, loading: false, otpNumber: res.data.otp });
            console.log('Register response:', res.data);
            return res;
        } catch (err: any) {
            console.log(err);
            set({ error: err?.response?.data?.message || 'OTP sent failed', loading: false });
            return err?.response;
        }
    },
    verifyOtp: async (data: { phone: string; otp: string }): Promise<any | null> => {
        set({ loading: true, error: null, response: null });
        try {
            const res = await axios.post(API_URL + '/auth/verify-otp', data);
            set({ response: res.data, loading: false });
            return res;
        } catch (err: any) {
            set({ error: err?.response?.data?.message || 'OTP sent failed', loading: false });
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
