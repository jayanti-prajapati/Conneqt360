import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  BackHandler,
  FlatList,
  RefreshControl,
  Share,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Search, Bell, Plus, FileWarning } from 'lucide-react-native';
import FeedCard from '@/components/home/FeedCard';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import Spacing from '@/constants/Spacing';
import { Post } from '@/types';
import Form from '@/components/profile/Form';
import useCommunityFeedsStore from '@/store/useCommunityFeeds';
import CustomLoader from '@/components/loader/CustomLoader';
import { useIsFocused } from '@react-navigation/native';
import { getAuthData } from '@/services/secureStore';
import NotFound from '@/components/utils/NotFound';
import { PostDetailModal } from '@/components/modal/PostDetailModal';
import { CommunityPost } from '@/types/feeds';
import { PostOptionsModal } from '@/components/modal/PostOptionsModal';



export const handleDelete = () => {
  Alert.alert(
    'Delete Post',
    'Are you sure you want to delete this post?',
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive', onPress: () => {
          Alert.alert('Deleted', 'Post has been deleted.');
          // onRefresh?.()
        }
      },
    ]
  );
};
export const handleReport = () => {
  Alert.alert(
    'Report Post',
    'Why are you reporting this post?',
    [
      { text: 'Spam', onPress: () => Alert.alert('Reported', 'Thank you for reporting this post.') },
      { text: 'Inappropriate Content', onPress: () => Alert.alert('Reported', 'Thank you for reporting this post.') },
      { text: 'Harassment', onPress: () => Alert.alert('Reported', 'Thank you for reporting this post.') },
      { text: 'Cancel', style: 'cancel' },
    ]
  );
};

export const handleSave = () => {
  Alert.alert('Saved', 'Post saved to your bookmarks.');
};

export const handleCopyLink = () => {
  Alert.alert('Link Copied', 'Post link copied to clipboard.');
};

export const handleBlock = () => {
  Alert.alert(
    'Block User',
    `Are you sure you want to block ?`,
    [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Block', style: 'destructive', onPress: () => Alert.alert('Blocked', 'User has been blocked.') },
    ]
  );
};
export const handleShare = async (id: string) => {

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

export default function HomeScreen() {
  const router = useRouter();
  const { getAllFeeds, loading, updateFeed, response, getFeedById } = useCommunityFeedsStore()
  const [searchQuery, setSearchQuery] = useState('');
  const [feedData, setFeedData] = useState([]);
  const [visibleItemIds, setVisibleItemIds] = useState<string[]>([]);
  const isFocused = useIsFocused();
  const [isOwnPost, setIsOwnPost] = useState(false); // Add this state to track if the post is owned by the user
  const [showOptions, setShowOptions] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPost, setSelectedPost] = useState<CommunityPost | null>(null);
  const [showPostModal, setShowPostModal] = useState(false);

  const [users, setUsers] = useState<any>(null);
  const onViewRef = useRef(({ viewableItems }: { viewableItems: Array<{ item: any }> }) => {
    const visibleIds = viewableItems.map((item) => item.item._id);
    setVisibleItemIds(visibleIds);
  });

  const viewConfigRef = useRef({
    itemVisiblePercentThreshold: 60, // play only if 60% is visible
  });

  const refreshSelectedPost = async () => {
    if (!selectedPost?._id) return;
    try {
      const data = await getFeedById(selectedPost?._id);
      setSelectedPost(data?.data?.data);
    } catch (error) {
      console.error('Error refreshing selected post:', error);
    }
  };

  const handlePostPress = (post: CommunityPost) => {
    setSelectedPost(post);
    setShowPostModal(true);
  };
  const handleLike = async (id: string, likes: string[]) => {
    console.log(likes);


    updateFeed(id, { likes: likes });
    fetchFeeds();
  };
  const handleComments = async (id: string, comments: any) => {
    updateFeed(id, { comments: [comments] });
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
    setIsOwnPost(post?.user?._id === users?.data?._id); // Check if the post belongs to the current user
    setShowOptions(true);
  };

  useEffect(() => {
    const backAction = () => {
      BackHandler.exitApp();
      return true;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    fetchFeeds();
  }, [searchQuery, showPostModal]);

  const fetchFeeds = async () => {
    try {

      const user = await getAuthData()
      setUsers(user?.userData);
      const data = await getAllFeeds(searchQuery);
      // console.log('Fetched feeds successfully:', data);
      if (data?.data?.statusCode == 200 || data?.data?.statusCode == 201) {
        setFeedData(data?.data?.data || []);
      }
    } catch (error) {
      console.error('Error fetching feedsds:', error);
    }
  }

  // console.log("feedData", feedData);
  const handleClosePostModal = () => {
    setShowPostModal(false);
    setSelectedPost(null);
  };



  return (
    <SafeAreaView style={styles.safeArea}>
      <Form closeText="Skip" />
      {/* <CustomLoader visible={loading} /> */}
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >

        <View style={styles.header}>

          <View style={styles.searchBar}>
            <Search size={20} color={Colors.gray[500]} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search businesses, products..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Bell size={24} color={Colors.gray[700]} />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>3</Text>
            </View>
          </TouchableOpacity>
        </View>
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
                isVisible={visibleItemIds.includes(item._id) && isFocused} likes={0} />
            )}
            onViewableItemsChanged={onViewRef.current}
            viewabilityConfig={viewConfigRef.current}
          />
        )
          :
          loading ? (
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
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.gray[100],
  },
  container: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: Spacing.xl + 72,
    paddingTop: Spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Spacing.xxl,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray[100],
    borderRadius: 8,
    paddingHorizontal: Spacing.sm,
  },
  searchIcon: {
    marginRight: Spacing.xs,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: Typography.size.md,
    color: Colors.gray[800],
  },
  notificationButton: {
    marginLeft: Spacing.md,
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: Colors.primary[600],
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: Typography.weight.bold as any,
  },
  feedHeaderContainer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  feedHeader: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.semiBold as any,
    color: Colors.gray[800],
  },
});
