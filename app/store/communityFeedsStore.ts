import { create } from 'zustand';

interface CommunityPost {
  _id: string;
  user: {
    username: string;
    businessName: string;
    profileUrl: string;
    phone: string;
  };
  content: string;
  imageUrl?: string;
  videoUrl?: string;
  createdAt: string;
}

interface CommunityFeedsState {
  feeds: CommunityPost[];
  loading: boolean;
  error: string | null;
  getAllFeeds: () => Promise<void>;
  updateFeed: (post: CommunityPost) => void;
  getFeedById: (id: string) => CommunityPost | undefined;
}

export const useCommunityFeedsStore = create<CommunityFeedsState>((set) => ({
  feeds: [],
  loading: false,
  error: null,
  
  getAllFeeds: async () => {
    set({ loading: true, error: null });
    try {
      // TODO: Implement API call to fetch feeds
      const mockFeeds: CommunityPost[] = [];
      set({ feeds: mockFeeds });
    } catch (error) {
      set({ error: 'Failed to fetch feeds' });
    } finally {
      set({ loading: false });
    }
  },
  
  updateFeed: (post) => set((state) => ({
    feeds: state.feeds.map((feed) => (feed._id === post._id ? post : feed)),
  })),
  
  getFeedById: (id) => {
    const state = useCommunityFeedsStore.getState();
    return state.feeds.find((feed) => feed._id === id);
  },
}));
