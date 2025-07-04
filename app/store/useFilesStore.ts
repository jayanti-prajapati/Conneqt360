import { create } from 'zustand';
import axios from 'axios';
import { saveAuthData, getAuthData, clearAuthData } from '../services/secureStore';

const API_URL = "http://84.247.177.87/api"; // change this to your testing API URL

interface FileStore {
  loading: boolean;
  error: string | null;
  response: any;

  uploadFile: (data: any) => Promise<any>;
  fetchFileByFileName: (id: string) => Promise<any>;

}

const useFilesStore = create<FileStore>((set) => ({
  loading: false,
  error: null,
  response: null,



  uploadFile: async (data: any) => {
    set({ loading: true, error: null, response: null });
    try {
      const formData = new FormData(); // Create a new FormData object
      formData.append('file', data);
      formData.append('emailAddress', 'admin@gmail.com');
      formData.append('description', "test");

      const res = await axios.post(`${API_URL}/custom-file/upload-file`, formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        });
      set({ response: res.data, loading: false });
      return res;
    } catch (err: any) {
      set({ error: err?.response?.data?.message || 'User creation failed', loading: false });
      return err?.response;
    }
  },

  fetchFileByFileName: async (name: string) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get(`${API_URL}/custom-file/fetch-doc?fileName=${name}`, {
        responseType: 'blob', // Ensure you're receiving binary data (Blob)
      });
      set({ response: res.data, loading: false });
      return res;
    } catch (err: any) {
      set({ error: err?.response?.data?.message || 'Failed to fetch user by ID', loading: false });
      return err?.response;
    }
  },


}));

export default useFilesStore;
