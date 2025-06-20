import React, { useState } from 'react';
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
} from 'react-native';
import { useRouter } from 'expo-router';
import { Search, Bell, Plus } from 'lucide-react-native';
import FeedCard from '@/components/home/FeedCard';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import Spacing from '@/constants/Spacing';
import { Post } from '@/types';
import Form from '@/components/profile/Form';


// Mock data for posts
const mockPosts: Post[] = [
  {
    id: '1',
    type: 'product',
    userId: 'user1',
    username: 'textilecraft',
    businessName: 'TextileCraft Industries',
    timestamp: '2h ago',
    content: 'Introducing our new range of eco-friendly fabrics made from recycled materials. Perfect for sustainable fashion brands!',
    imageUrl: 'https://images.pexels.com/photos/3850512/pexels-photo-3850512.jpeg',
    likes: 24,
    comments: 8,
    verified: true,
  },
  {
    id: '2',
    type: 'deal',
    userId: 'user2',
    username: 'supplychain',
    businessName: 'Global Supply Solutions',
    timestamp: '5h ago',
    content: 'Looking for logistics partners in the Gujarat region. Offering special rates for bulk shipments this quarter.',
    likes: 15,
    comments: 7,
    verified: false,
  },
  {
    id: '3',
    type: 'help',
    userId: 'user3',
    username: 'techstart',
    businessName: 'TechStart Solutions',
    timestamp: '1d ago',
    content: 'Need recommendations for reliable IT infrastructure providers specializing in small business setups. Budget friendly options preferred.',
    likes: 9,
    comments: 12,
    verified: true,
  },
  {
    id: '4',
    type: 'success',
    userId: 'user4',
    username: 'foodinnovate',
    businessName: 'Food Innovation Labs',
    timestamp: '2d ago',
    content: 'Thrilled to announce our expansion to 3 new cities! Thanks to all our partners and customers who made this possible.',
    imageUrl: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg',
    likes: 47,
    comments: 23,
    verified: true,
  },
];


// ... mockPosts remains unchanged

export default function HomeScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handlePostPress = (id: string) => console.log(`Post ${id} pressed`);
  const handleLike = (id: string) => console.log(`Liked post ${id}`);
  const handleComment = (id: string) => console.log(`Comment on post ${id}`);
  const handleShare = (id: string) => console.log(`Share post ${id}`);
  const handleMoreOptions = (id: string) => console.log(`More options for post ${id}`);
  const handleNewPost = () => console.log('Create new post');

  return (
    <SafeAreaView style={styles.safeArea} >
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

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Form />

          <View style={styles.feedHeaderContainer}>
            <Text style={styles.feedHeader}>Your Business Feed</Text>
          </View>

          {mockPosts.map((post) => (
            <FeedCard
              key={post.id}
              id={post.id}
              username={post.username}
              businessName={post.businessName}
              timestamp={post.timestamp}
              content={post.content}
              imageUrl={post.imageUrl}
              likes={post.likes}
              comments={post.comments}
              onLike={handleLike}
              onComment={handleComment}
              onShare={handleShare}
              onMoreOptions={handleMoreOptions}
              onPress={handlePostPress}
              verified={post.verified}
            />
          ))}
        </ScrollView>

        {/* <TouchableOpacity style={styles.floatingButton} onPress={handleNewPost}>
          <Plus size={24} color={Colors.white} />
        </TouchableOpacity> */}
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
    paddingBottom: Spacing.xl + 72, // Leave space for floating button & bottom safe area
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
  floatingButton: {
    position: 'absolute',
    bottom: Spacing.lg,
    right: Spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary[600],
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
