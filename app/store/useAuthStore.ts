//@ts-ignore
// import { API_URL } from '@env';

import { create } from 'zustand';
import axios from 'axios';
import { LoginPayload, RegisterPayload } from './type';
import { saveAuthData, getAuthData, clearAuthData } from '../services/secureStore';

const API_URL = "http://84.247.177.87/api"; // change this to your testing API URL

interface AuthStore {
  loading: boolean;
  error: string | null;
  response: { token?: string; user?: any } | null;
  otpNumber: string | null;
  phone: string | null;

  register: (data: RegisterPayload) => Promise<any>;
  login: (data: LoginPayload) => Promise<any>;
  reset: () => void;
  sendOtp: (data: { phone: string }) => Promise<any>;
  verifyOtp: (data: { phone: string; otp: string }) => Promise<any>;
  clearAuth: () => Promise<void>;
  loadAuthData: () => Promise<void>;
}

const useAuthStore = create<AuthStore>((set) => ({
  loading: false,
  error: null,
  response: null,
  otpNumber: null,
  phone: null,

  register: async (data: RegisterPayload) => {
    set({ loading: true, error: null, response: null });
    try {
      const res = await axios.post(`${API_URL}/auth/register`, data);
      set({ response: res.data, loading: false });
    } catch (err: any) {
      set({ error: err?.response?.data?.message || 'Registration failed', loading: false });
    }
  },

  login: async (data: LoginPayload) => {
    set({ loading: true, error: null, response: null });
    try {
      const res = await axios.post(`${API_URL}/auth/login`, data);
      ;
      await saveAuthData(res.data.user);

      set({ response: { token: res.data.token, user: res.data.user }, loading: false });
      return res;
    } catch (err: any) {

      set({ error: err?.response?.data?.message || 'Login failed', loading: false });
      return err?.response;
    }
  },

  sendOtp: async (data: { phone: string }) => {
    set({ loading: true, error: null, response: null });
    try {
      const res = await axios.post(`${API_URL}/auth/send-otp`, data);
      set({ response: res.data, loading: false, otpNumber: res.data.otp, phone: data.phone });
      return res;
    } catch (err: any) {
      set({ error: err?.response?.data?.message || 'OTP sent failed', loading: false });
      return err?.response;
    }
  },

  verifyOtp: async (data: { phone: string; otp: string }) => {
    set({ loading: true, error: null, response: null });
    try {
      const res = await axios.post(`${API_URL}/auth/verify-otp`, data);
      set({ response: res.data, loading: false });
      return res;
    } catch (err: any) {
      set({ error: err?.response?.data?.message || 'OTP sent failed', loading: false });
      return err?.response;
    }
  },

  reset: () => {
    set({ loading: true, error: null, response: null });
  },

  clearAuth: async () => {
    await clearAuthData();
    set({ loading: false, error: null, response: null, otpNumber: null, phone: null });
  },

  loadAuthData: async () => {
    try {
      const authData = await getAuthData();
      if (authData) {
        set({
          loading: false,
          error: null,
          response: { user: authData.userData },
          otpNumber: null,
          phone: null
        });
      }
    } catch (error) {
      console.error('Error loading auth data:', error);
    }
  }
}));

export default useAuthStore;
