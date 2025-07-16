import { create } from 'zustand';
import axios from 'axios';
import { saveAuthData, getAuthData, clearAuthData } from '../services/secureStore';

const API_URL = "http://84.247.177.87/api"; // change this to your testing API URL

interface UsersStore {
  loading: boolean;
  error: string | null;
  response: any;
  users: any[];

  fetchUserByPhoneNumber: (phone: string) => Promise<any>;
  createUser: (data: any) => Promise<any>;
  getUserById: (id: string) => Promise<any>;
  updateUser: (id: string, data: any) => Promise<any>;
  deleteUser: (id: string) => Promise<any>;
  getAllUsers: (searchQuery?: string) => Promise<any>;
  clearUsers: () => void;
}

const useUsersStore = create<UsersStore>((set) => ({
  loading: false,
  error: null,
  response: null,
  users: [],

  fetchUserByPhoneNumber: async (phone: string) => {
    set({ loading: true });
    try {
      const res = await axios.get(`${API_URL}/user/phone/${phone}`);
      set({ loading: false });
      return res;
    } catch (err: any) {
      set({ error: err?.response?.data?.message || 'Failed to fetch user', loading: false });
      return err?.response;
    }
  },

  createUser: async (data: any) => {
    set({ loading: true, error: null, response: null });
    try {
      const res = await axios.post(`${API_URL}/user`, data);
      set({ response: res.data, loading: false });
      return res;
    } catch (err: any) {
      set({ error: err?.response?.data?.message || 'User creation failed', loading: false });
      return err?.response;
    }
  },

  getUserById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get(`${API_URL}/user/${id}`);
      set({ response: res.data, loading: false });
      return res;
    } catch (err: any) {
      set({ error: err?.response?.data?.message || 'Failed to fetch user by ID', loading: false });
      return err?.response;
    }
  },

  updateUser: async (id: string, data: any) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.put(`${API_URL}/user/${id}`, data);
      set({ response: res.data, loading: false });
      await saveAuthData(res.data)
      return res;
    } catch (err: any) {
      set({ error: err?.response?.data?.message || 'User update failed', loading: false });
      return err?.response;
    }
  },

  deleteUser: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.delete(`${API_URL}/user/${id}`);
      set({ response: res.data, loading: false });
      return res;
    } catch (err: any) {
      set({ error: err?.response?.data?.message || 'User deletion failed', loading: false });
      return err?.response;
    }
  },

  getAllUsers: async (searchQuery?: string) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get(searchQuery ? `${API_URL}/user?search=${searchQuery}` : `${API_URL}/user`);
      set({ response: res.data, loading: false });
      return res.data;
    } catch (err: any) {
      set({ error: err?.response?.data?.message || 'Failed to fetch users', loading: false });
      return err?.response;
    }
  },
  clearUsers: () => {
    set({ response: null, loading: false });
  },
}));

export default useUsersStore;
