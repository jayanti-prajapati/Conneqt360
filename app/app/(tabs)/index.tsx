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


export default function HomeScreen() {
  const router = useRouter();
  const { getAllFeeds, loading, updateFeed } = useCommunityFeedsStore()
  const [searchQuery, setSearchQuery] = useState('');
  const [feedData, setFeedData] = useState([]);
  const [visibleItemIds, setVisibleItemIds] = useState<string[]>([]);
  const isFocused = useIsFocused();
  // Add this state near your other state declarations
  const [refreshing, setRefreshing] = useState(false);

  const [users, setUsers] = useState<any>(null);
  const onViewRef = useRef(({ viewableItems }: { viewableItems: Array<{ item: any }> }) => {
    const visibleIds = viewableItems.map((item) => item.item._id);
    setVisibleItemIds(visibleIds);
  });

  const viewConfigRef = useRef({
    itemVisiblePercentThreshold: 60, // play only if 60% is visible
  });

  const handlePostPress = (id: string) => console.log(`Post ${id} pressed`);
  const handleLike = async (id: string, likes: string[]) => {
    // const data = await getAuthData()
    // if (likes.includes(data?.userData?._id)) {
    //   // Unlike the post
    //   const updatedLikes = likes.filter((likeId) => likeId !== data?.userData?._id);
    //   updateFeed(id, { likes: updatedLikes });
    // } else {
    //   // Like the post
    //   const updatedLikes = [...likes, data?.userData?._id];
    //   updateFeed(id, { likes: updatedLikes });
    // }
    // fetchFeeds();
    console.log(`Liked post ${id}`);




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
  const handleComment = (id: string) => console.log(`Comment on post ${id}`);
  const handleShare = (id: string) => console.log(`Share post ${id}`);
  const handleMoreOptions = (id: string) => console.log(`More options for post ${id}`);

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
  }, [searchQuery, getAllFeeds]);

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
                userId={users?._id}
                username={item?.user?.username}
                businessName={item?.user?.businessName}
                timestamp={item?.createdAt}
                content={item?.content}
                imageUrl={item?.imageUrl}
                videoUrl={item?.videoUrl}
                likes={item?.likes?.length}
                comments={item?.comments?.length}
                onLike={handleLike}

                onComment={handleComment}
                onShare={handleShare}
                onMoreOptions={handleMoreOptions}
                onPress={handlePostPress}
                likesIds={item?.likes}
                verified={item?.user?.verified}
                isVisible={visibleItemIds.includes(item._id) && isFocused
                }
              />
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
