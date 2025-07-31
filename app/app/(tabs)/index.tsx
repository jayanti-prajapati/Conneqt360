import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  RefreshControl,
  Alert,
  Share,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useIsFocused } from '@react-navigation/native';

import FeedCard from '@/components/home/FeedCard';
import Form from '@/components/profile/Form';
import CustomLoader from '@/components/loader/CustomLoader';
import NotFound from '@/components/utils/NotFound';
import NoInternetScreen from '@/components/utils/NoInternetScreen';
import Layout from '@/components/common/Layout';
import Search from '@/components/common/Search';
import { PostDetailModal } from '@/components/modal/PostDetailModal';
import { PostOptionsModal } from '@/components/modal/PostOptionsModal';
import { UserProfileModal } from '@/components/modal/UserProfileModal';

import useCommunityFeedsStore from '@/store/useCommunityFeeds';
import useNetworkStatus from '@/hooks/useNetworkStatus';

import { getAuthData } from '@/services/secureStore';
import Colors from '@/constants/Colors';
import Spacing from '@/constants/Spacing';
import { CommunityPost } from '@/types/feeds';
import SafeView from '@/components/common/SafeView';

export const handleReport = () => {
  Alert.alert('Report Post', 'Why are you reporting this post?', [
    { text: 'Spam', onPress: () => Alert.alert('Reported', 'Thank you for reporting this post.') },
    { text: 'Inappropriate Content', onPress: () => Alert.alert('Reported', 'Thank you for reporting this post.') },
    { text: 'Harassment', onPress: () => Alert.alert('Reported', 'Thank you for reporting this post.') },
    { text: 'Cancel', style: 'cancel' },
  ]);
};

export const handleSave = () => Alert.alert('Saved', 'Post saved to your bookmarks.');

export const handleCopyLink = () => Alert.alert('Link Copied', 'Post link copied to clipboard.');

export const handleBlock = () => {
  Alert.alert('Block User', 'Are you sure you want to block?', [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Block', style: 'destructive', onPress: () => Alert.alert('Blocked', 'User has been blocked.') },
  ]);
};

export const handleShare = async (id: string) => {
  try {
    const message = `Check out this post on our app: https://yourapp.com/directory/${id}`;
    const result = await Share.share({ message, url: message, title: 'Check out this post!' });
    if (result.action === Share.sharedAction) console.log('Post shared');
    else if (result.action === Share.dismissedAction) console.log('Share dismissed');
  } catch (error) {
    console.error('Error sharing:', error);
  }
};

export default function HomeScreen() {
  const router = useRouter();
  const { getAllFeeds, loading, updateFeed, deleteFeed, getFeedById } = useCommunityFeedsStore();
  const isConnected = useNetworkStatus(false);
  const isFocused = useIsFocused();

  const [searchQuery, setSearchQuery] = useState('');
  const [feedData, setFeedData] = useState([]);
  const [visibleItemIds, setVisibleItemIds] = useState<string[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPost, setSelectedPost] = useState<CommunityPost | null>(null);
  const [users, setUsers] = useState<any>(null);
  const [showPostModal, setShowPostModal] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [isOwnPost, setIsOwnPost] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // const onViewRef = useRef(({ viewableItems }: { viewableItems: Array<{ item: any }> }) => {
  //   const visibleIds = viewableItems.map((item) => item?.item?._id);
  //   setVisibleItemIds(visibleIds);
  // });

  const onViewRef = useRef(({ viewableItems = [] }: { viewableItems: Array<{ item: any }> }) => {
    const visibleIds = viewableItems
      .filter((item) => item?.item?._id)
      .map((item) => item?.item?._id);
    setVisibleItemIds(visibleIds);
  });

  const viewConfigRef = useRef({ itemVisiblePercentThreshold: 60 });

  // useEffect(() => {
  //   const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
  //     BackHandler.exitApp();
  //     return true;
  //   });
  //   return () => backHandler.remove();
  // }, []);

  useEffect(() => { fetchFeeds(); }, [searchQuery]);

  const fetchFeeds = async () => {
    try {
      const user = await getAuthData();
      setUsers(user?.userData);
      const data = await getAllFeeds(searchQuery);
      if (data?.data?.statusCode === 200 || data?.data?.statusCode === 201)
        setFeedData(data?.data?.data || []);
    } catch (error) {
      console.error('Error fetching feeds:', error);
    }
  };

  const handlePostPress = useCallback((post: CommunityPost) => {
    setSelectedPost(post);
    setShowPostModal(true);
  }, []);

  const refreshSelectedPost = useCallback(async () => {
    if (!selectedPost?._id) return;
    const data = await getFeedById(selectedPost?._id);
    setSelectedPost(data?.data?.data);
  }, [selectedPost]);

  const handleLike = useCallback((id: string, likes: string[]) => {
    updateFeed(id, { likes });
    fetchFeeds();
  }, []);

  const handleComments = useCallback((id: string, comment: any) => {
    updateFeed(id, { comments: [comment] });
    fetchFeeds();
  }, []);


  const handleDelete = useCallback((id: string | undefined) => {
    if (!id) return;
    Alert.alert('Delete Post', 'Are you sure you want to delete this post?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteFeed(id);
          await fetchFeeds();
          setShowOptions(false);
        },
      },
    ]);
  }, []);

  const handleMoreOptions = useCallback((post: CommunityPost) => {
    if (!post?.user?._id) return;
    setSelectedPost(post);
    setIsOwnPost(post?.user?._id === users?.data?._id);
    setShowOptions(true);
  }, [users]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchFeeds();
    setRefreshing(false);
  }, []);


  return (

    isConnected ? (
      // <SafeView style={styles.safeArea}>
      <Layout title="Home">
        <Search searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <Form closeText="Skip" />
        {feedData?.length > 0 ? (
          <FlatList
            data={feedData}
            keyExtractor={(item) => item?._id}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary[600]]} tintColor={Colors.primary[600]} />}
            renderItem={({ item }) => (
              <FeedCard
                id={item?._id || ''}
                phone={item?.user?.phone || ''}
                profileImage={item?.user?.profileUrl || ''}
                user={users}
                post={item}
                username={item?.user?.username || 'Anonymous'}
                businessName={item?.user?.businessName || ''}
                timestamp={item?.createdAt || ''}
                content={item?.content || ''}
                imageUrl={item?.imageUrl}
                videoUrl={item?.videoUrl}
                onLike={handleLike}
                onComment={handleComments}
                onShare={handleShare}
                setSelectedPost={setSelectedPost}
                setShowPostModal={setShowPostModal}
                setShowProfileModal={setShowProfileModal}
                onMoreOptions={handleMoreOptions}
                onPress={handlePostPress}
                likesIds={item?.likes || []}
                verified={item?.user?.verified || false}
                isVisible={visibleItemIds.includes(item?._id || '') && isFocused}

              />
            )}
            onViewableItemsChanged={onViewRef.current}
            viewabilityConfig={viewConfigRef.current}
          />
        ) : loading ? <CustomLoader visible={loading} /> : <NotFound />}

        {selectedPost && (
          <PostDetailModal visible={showPostModal} post={selectedPost} onClose={() => setShowPostModal(false)} onRefresh={refreshSelectedPost} />
        )}
        {selectedPost?.user && (
          <UserProfileModal visible={showProfileModal} onClose={() => setShowProfileModal(false)} userId={selectedPost?.user?._id} />
        )}
        {showOptions && <PostOptionsModal
          visible={showOptions}
          onClose={() => setShowOptions(false)}
          isOwnPost={isOwnPost}
          onShare={() => handleShare(selectedPost?._id || '')}
          onReport={handleReport}
          onSave={handleSave}
          onCopyLink={handleCopyLink}
          onBlock={handleBlock}
          onDelete={() => handleDelete(selectedPost?._id || '')}
          onViewProfile={() => setShowProfileModal(true)}
        />}

      </Layout>
      // </SafeView>
    ) : <NoInternetScreen />

  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    // marginTop: Spacing.sm,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.xl + 72,
    paddingTop: Spacing.sm,
  },
});