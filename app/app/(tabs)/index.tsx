import React, { useEffect, useState, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  BackHandler,
  Alert,
  Share,
  RefreshControl,
  FlatList,
  SafeAreaView,
  TextInput,
} from 'react-native';
import { Colors, Spacing } from '@/constants/theme';
import { Bell, Filter } from 'lucide-react-native';
import { getAuthData } from '@/services/authService';
import { useIsFocused } from '@react-navigation/native';
import { Form } from '@/components/form/Form';
import { NotFound } from '@/components/NotFound';
import { CustomLoader } from '@/components/CustomLoader';
import { FeedCard } from '@/components/FeedCard';
import { PostDetailModal } from '@/components/modal/PostDetailModal';
import { PostOptionsModal } from '@/components/modal/PostOptionsModal';
import { CommunityPost, User } from '@/types/feeds';
import { useRouter } from 'expo-router';
import { useCommunityFeedsStore } from '@/store/communityFeedsStore';
import Input from '@/components/ui-components/Input';
import Header from '@/components/common/Header';
import Layout from '@/components/common/Layout';
import Search from '@/components/common/Search';

const HomeScreen = () => {
  const router = useRouter();
  const { feeds, loading, error, getAllFeeds } = useCommunityFeedsStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [feedData, setFeedData] = useState<CommunityPost[]>([]);
  const [visibleItemIds, setVisibleItemIds] = useState<string[]>([]);
  const isFocused = useIsFocused();
  const [isOwnPost, setIsOwnPost] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPost, setSelectedPost] = useState<CommunityPost | null>(null);
  const [showPostModal, setShowPostModal] = useState(false);
  const [users, setUsers] = useState<any>(null);

  const onViewRef = useRef(
    ({ viewableItems }: { viewableItems: Array<{ item: any }> }) => {
      const visibleIds = viewableItems.map((item) => item.item._id);
      setVisibleItemIds(visibleIds);
    }
  );

  const viewConfigRef = useRef({
    itemVisiblePercentThreshold: 60,
  });

  const refreshSelectedPost = async () => {
    if (!selectedPost?._id) return;
    try {
      const post = feeds.find((f) => f._id === selectedPost._id);
      if (post) {
        setSelectedPost({
          ...post,
          likes: [],
          comments: [],
          user: {
            username: post.user.username || '',
            businessName: post.user.businessName || '',
            profileUrl: post.user.profileUrl || '',
            phone: post.user.phone || '',
          },
        });
      } else {
        setSelectedPost(null);
      }
    } catch (error) {
      console.error('Error refreshing selected post:', error);
    }
  };

  const handlePostPress = (post: CommunityPost) => {
    setSelectedPost(post);
    setShowPostModal(true);
  };

  const handleLike = async (id: string) => {
    // updateFeed(id, { likes });
    fetchFeeds();
  };

  const handleComments = async (id: string, comments: any) => {
    // updateFeed(id, { comments: [comments] });
    fetchFeeds();
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchFeeds();
    } catch (error) {
      console.error('Error refreshing feeds:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleMoreOptions = (post: CommunityPost) => {
    setSelectedPost(post);
    setIsOwnPost(post?.user.id === users?.id);
    setShowOptions(true);
  };

  useEffect(() => {
    const backAction = () => {
      BackHandler.exitApp();
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );
    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    fetchFeeds();
  }, [searchQuery, showPostModal]);

  const fetchFeeds = async () => {
    try {
      const authData = await getAuthData();
      console.log('Auth Data:', authData);
      if (!authData) return;
      const { user, token } = authData;
      const userId = user.id;
      await getAllFeeds();
      setFeedData(
        (feeds || []).map((post) => ({
          ...post,
          likes: [],
          comments: [],
          user: {
            ...post.user,
            id: post.user.id || '',
          },
        }))
      );
    } catch (error) {
      console.error('Error fetching feeds:', error);
    }
  };

  const handleClosePostModal = () => {
    setShowPostModal(false);
    setSelectedPost(null);
  };

  const handleReport = () => {
    Alert.alert('Report Post', 'Why are you reporting this post?', [
      {
        text: 'Spam',
        onPress: () =>
          Alert.alert('Reported', 'Thank you for reporting this post.'),
      },
      {
        text: 'Inappropriate Content',
        onPress: () =>
          Alert.alert('Reported', 'Thank you for reporting this post.'),
      },
      {
        text: 'Harassment',
        onPress: () =>
          Alert.alert('Reported', 'Thank you for reporting this post.'),
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleSave = () => {
    Alert.alert('Saved', 'Post saved to your bookmarks.');
  };

  const handleCopyLink = () => {
    Alert.alert('Link Copied', 'Post link copied to clipboard.');
  };

  const handleBlock = () => {
    Alert.alert('Block User', `Are you sure you want to block ?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Block',
        style: 'destructive',
        onPress: () => Alert.alert('Blocked', 'User has been blocked.'),
      },
    ]);
  };

  const handleShare = async (id: string) => {
    try {
      const message = `Check out this post on our app: https://yourapp.com/directory/${id}`;
      const result = await Share.share({
        message,
        url: `https://yourapp.com/directory/${id}`,
        title: 'Check out this post!',
      });
      if (result.action === Share.sharedAction) {
        console.log('Post shared');
      } else if (result.action === Share.dismissedAction) {
        console.log('Share dismissed');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleDelete = () => {
    // implement delete logic
  };

  const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: Colors.white,
    },
    notificationBadge: {
      position: 'absolute',
      top: -4,
      right: -4,
      backgroundColor: Colors.primary[600],
      width: 16,
      height: 16,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
    },
    notificationBadgeText: {
      color: Colors.white,
      fontSize: 10,
      fontWeight: 'bold',
    },
    notificationButton: {
      marginLeft: Spacing.md,
    },
  });

  return (
    <Layout title={'Home'} scrollable>
      <Search />
      {feedData.length > 0 ? (
        <FlatList
          data={feedData}
          keyExtractor={(item) => item?._id}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[Colors.primary[600]]} // Customize the loading indicator color
              tintColor={Colors.primary[600]} // For iOS
            />
          }
          renderItem={({ item }) => (
            <FeedCard
              id={item?._id}
              phone={item?.user?.phone}
              profileImage={item?.user?.profileUrl}
              user={users}
              post={item}
              username={item?.user?.username}
              businessName={item?.user?.businessName}
              timestamp={item?.createdAt}
              content={item?.content}
              imageUrl={item?.imageUrl}
              videoUrl={item?.videoUrl}
              onLike={handleLike}
              onComment={handleComments}
              onShare={handleShare}
              onMoreOptions={handleMoreOptions}
              onPress={handlePostPress}
              likesIds={item?.likes}
              verified={item?.user?.verified}
              isVisible={visibleItemIds.includes(item._id) && isFocused}
              likes={0}
            />
          )}
          onViewableItemsChanged={onViewRef.current}
          viewabilityConfig={viewConfigRef.current}
        />
      ) : loading ? (
        <CustomLoader visible={loading} />
      ) : (
        <NotFound />
      )}

      <PostDetailModal
        visible={showPostModal}
        post={selectedPost}
        onClose={handleClosePostModal}
        onRefresh={refreshSelectedPost}
      />
      <PostOptionsModal
        visible={showOptions}
        onClose={() => setShowOptions(false)}
        isOwnPost={isOwnPost}
        onShare={() => handleShare(selectedPost?._id || '')}
        onReport={() => handleReport()}
        onSave={() => handleSave()}
        onCopyLink={() => handleCopyLink()}
        onBlock={() => handleBlock()}
        onDelete={() => handleDelete()}
      />
    </Layout>
  );
};

export default HomeScreen;
