import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { Colors, Typography, Spacing } from '@/constants/theme';
import { CommunityPost } from '@/types/feeds';

interface FeedCardProps {
  id: string;
  phone: string;
  profileImage: string;
  user: any;
  post: CommunityPost;
  username: string;
  businessName: string;
  timestamp: string;
  content: string;
  imageUrl?: string;
  videoUrl?: string;
  onLike: () => void;
}

export const FeedCard: React.FC<FeedCardProps> = ({
  id,
  phone,
  profileImage,
  user,
  post,
  username,
  businessName,
  timestamp,
  content,
  imageUrl,
  videoUrl,
  onLike,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Image
          source={{ uri: profileImage }}
          style={styles.profileImage}
        />
        <View style={styles.userDetails}>
          <Text style={styles.username}>{username}</Text>
          <Text style={styles.businessName}>{businessName}</Text>
        </View>
      </View>
      
      <Text style={styles.content}>{content}</Text>

      {imageUrl && (
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
      )}

      <View style={styles.actions}>
        <TouchableOpacity onPress={onLike} style={styles.actionButton}>
          <Text style={styles.actionText}>Like</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Spacing.md,
    marginHorizontal: Spacing.sm,
    marginBottom: Spacing.sm,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: Spacing.sm,
  },
  userDetails: {
    flex: 1,
  },
  username: {
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.medium,
    color: Colors.gray[800],
  },
  businessName: {
    fontSize: Typography.size.sm,
    color: Colors.gray[600],
  },
  content: {
    fontSize: Typography.size.md,
    color: Colors.gray[800],
    lineHeight: 24,
    marginBottom: Spacing.sm,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: Spacing.sm,
  },
  actions: {
    flexDirection: 'row',
    marginTop: Spacing.sm,
  },
  actionButton: {
    marginRight: Spacing.sm,
  },
  actionText: {
    fontSize: Typography.size.sm,
    color: Colors.primary[600],
  },
});
