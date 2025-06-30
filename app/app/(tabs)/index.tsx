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
} from 'react-native';
import { useRouter } from 'expo-router';
import { Search, Bell, Plus } from 'lucide-react-native';
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


// Mock data for posts
// const mockPosts: Post[] = [
//   {
//     id: '1',
//     type: 'product',
//     userId: 'user1',
//     username: 'textilecraft',
//     businessName: 'TextileCraft Industries',
//     timestamp: '2h ago',
//     content: 'Introducing our new range of eco-friendly fabrics made from recycled materials. Perfect for sustainable fashion brands!',
//     imageUrl: 'https://images.pexels.com/photos/3850512/pexels-photo-3850512.jpeg',
//     likes: 24,
//     comments: 8,
//     verified: true,
//   },
//   {
//     id: '2',
//     type: 'deal',
//     userId: 'user2',
//     username: 'supplychain',
//     businessName: 'Global Supply Solutions',
//     timestamp: '5h ago',
//     content: 'Looking for logistics partners in the Gujarat region. Offering special rates for bulk shipments this quarter.',
//     likes: 15,
//     comments: 7,
//     verified: false,
//   },
//   {
//     id: '3',
//     type: 'help',
//     userId: 'user3',
//     username: 'techstart',
//     businessName: 'TechStart Solutions',
//     timestamp: '1d ago',
//     content: 'Need recommendations for reliable IT infrastructure providers specializing in small business setups. Budget friendly options preferred.',
//     likes: 9,
//     comments: 12,
//     verified: true,
//   },
//   {
//     id: '4',
//     type: 'success',
//     userId: 'user4',
//     username: 'foodinnovate',
//     businessName: 'Food Innovation Labs',
//     timestamp: '2d ago',
//     content: 'Thrilled to announce our expansion to 3 new cities! Thanks to all our partners and customers who made this possible.',
//     imageUrl: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg',
//     likes: 47,
//     comments: 23,
//     verified: true,
//   },
// ];

// const mockPosts: any[] = [
//   {
//     "_id": "6855416abb007d5894b96158",

//     "content": "We are thrilled to announce the launch of our brand-new eco-friendly product line, designed with sustainability at its core. Our team has worked tirelessly over the past year to develop products that not only meet the highest quality standards but also minimize environmental impact. From biodegradable packaging to energy-efficient manufacturing, every detail has been carefully considered. We believe that small steps can lead to big changes, and we're committed to being part of the solution for a greener planet. Check out our latest collection and join us in making conscious choices for a better future.",
//     "imageUrl": "https://cdn.example.com/uploads/images/product-launch.jpg",
//     "videoUrl": "https://cdn.example.com/uploads/videos/demo.mp4",
//     "user": {
//       "_id": "6855414abb007d5894b96156",
//       "username": "suresh7994",
//       "email": "suresh@example.com",
//       "businessName": "Nayra Google",
//       "phone": "1111111111",
//       "businessType": "test",
//       "verified": true,
//     },
//     "likes": [
//       "60d21b8667d0d8992e610c87",
//       "60d21b9667d0d8992e610c88"
//     ],
//     "comments": [
//       {
//         "user": null,
//         "content": "Congratulations! Looking forward to trying it out.",
//         "_id": "6855416abb007d5894b96159",
//         "createdAt": "2025-06-20T11:09:30.445Z"
//       },
//       {
//         "user": null,
//         "content": "Great step towards sustainability!",
//         "_id": "6855416abb007d5894b9615a",
//         "createdAt": "2025-06-20T11:09:30.445Z"
//       }
//     ],
//     "description": "Explore our sustainable and environmentally-conscious products now available in our latest launch.",
//     "share": "https://example.com/post/eco-launch",
//     "createdAt": "2025-06-20T11:09:30.446Z",
//     "__v": 0
//   },
//   {
//     "_id": "685530843d61b612b86a2869",
//     "content": "We are thrilled to announce the launch of our brand-new eco-friendly product line, designed with sustainability at its core. Our team has worked tirelessly over the past year to develop products that not only meet the highest quality standards but also minimize environmental impact. From biodegradable packaging to energy-efficient manufacturing, every detail has been carefully considered. We believe that small steps can lead to big changes, and we're committed to being part of the solution for a greener planet. Check out our latest collection and join us in making conscious choices for a better future.",
//     "imageUrl": "https://cdn.example.com/uploads/images/product-launch.jpg",
//     "videoUrl": "https://cdn.example.com/uploads/videos/demo.mp4",
//     "user": {
//       "_id": "68552c084f90c50c839bebd3",
//       "username": "naresh7994",
//       "email": "naresh@example.com",
//       "businessName": "Naresh Enterprises",
//       "phone": "9876543210",
//       "businessType": "Manufacturing",
//       "verified": true,
//     },
//     "likes": [
//       "60d21b8667d0d8992e610c87",
//       "60d21b9667d0d8992e610c88"
//     ],
//     "comments": [
//       {
//         "user": null,
//         "content": "Congratulations! Looking forward to trying it out.",
//         "_id": "685530843d61b612b86a286a",
//         "createdAt": "2025-06-20T09:57:24.045Z"
//       },
//       {
//         "user": null,
//         "content": "Great step towards sustainability!",
//         "_id": "685530843d61b612b86a286b",
//         "createdAt": "2025-06-20T09:57:24.045Z"
//       }
//     ],
//     "description": "Explore our sustainable and environmentally-conscious products now available in our latest launch.",
//     "share": "https://example.com/post/eco-launch",
//     "createdAt": "2025-06-20T09:57:24.045Z",
//     "__v": 0
//   },
//   {
//     "_id": "68552ee3095758812b013a83",
//     "content": "Excited to launch our new eco-friendly product line!",
//     "imageUrl": "https://example.com/uploads/images/product-launch.jpg",
//     "videoUrl": "https://example.com/uploads/videos/demo.mp4",
//     "user": {
//       "_id": "68552c084f90c50c839bebd3",
//       "username": "atrsra123",
//       "email": "naresh@example.com",
//       "businessName": "Naresh Enterprises",
//       "phone": "9876543210",
//       "businessType": "Manufacturing",
//       "verified": true,
//     },
//     "likes": [
//       "60d21b8667d0d8992e610c87",
//       "60d21b9667d0d8992e610c88"
//     ],
//     "comments": [
//       {
//         "userId": "60d21b8667d0d8992e610c87",
//         "content": "Congratulations! Looking forward to trying it out.",
//         "_id": "68552ee3095758812b013a84",
//         "createdAt": "2025-06-20T09:50:27.757Z"
//       },
//       {
//         "userId": "60d21b9667d0d8992e610c88",
//         "content": "Great step towards sustainability!",
//         "_id": "68552ee3095758812b013a85",
//         "createdAt": "2025-06-20T09:50:27.758Z"
//       }
//     ],
//     "description": "We are proud to introduce a line of sustainable products to promote green living.",
//     "share": "https://example.com/post/share/eco-launch",
//     "createdAt": "2025-06-20T09:50:27.761Z",
//     "__v": 0
//   }
// ]

// ... mockPosts remains unchanged


export default function HomeScreen() {
  const router = useRouter();
  const { getAllFeeds, loading, updateFeed } = useCommunityFeedsStore()
  const [searchQuery, setSearchQuery] = useState('');
  const [feedData, setFeedData] = useState([]);
  const [visibleItemIds, setVisibleItemIds] = useState<string[]>([]);
  const isFocused = useIsFocused();
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
  }, [getAllFeeds]);

  const fetchFeeds = async () => {
    try {
      const user = await getAuthData()
      setUsers(user?.userData);
      const data = await getAllFeeds();
      // console.log('Fetched feeds successfully:', data);
      if (data?.data?.statusCode == 200 || data?.data?.statusCode == 201) {

        setFeedData(data?.data?.data || []);
      }
    } catch (error) {
      console.error('Error fetching feedsds:', error);
    }
  }



  return (
    <SafeAreaView style={styles.safeArea}>
      <Form closeText="Skip" />
      <CustomLoader visible={loading} />
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

        <FlatList
          data={feedData}
          keyExtractor={(item) => item?._id}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
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
