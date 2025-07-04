import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import Card from '@/components/common/Card';
import { Heart, MessageSquare, Share, MoreVertical } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import Spacing from '@/constants/Spacing';
import { formatTimestamp } from '../utils/dateconverter';
import { ResizeMode, Video } from 'expo-av';
import { getAuthData } from '@/services/secureStore';

const { width } = Dimensions.get('window');

export type PostType = 'product' | 'deal' | 'help' | 'success';

interface FeedCardProps {
  id: string;
  // type: PostType;
  phone?: string;
  userId?: string;
  username: string;
  businessName: string;
  timestamp: string;
  content: string;
  imageUrl?: string;
  likes: number;
  comments: number;
  videoUrl: string;
  verified?: boolean;
  profileImage?: string;
  isVisible?: boolean;
  likesIds?: string[];
  onLike: (id: string, likes: string[]) => void;
  onComment: (id: string) => void;
  onShare: (id: string) => void;
  onMoreOptions: (id: string) => void;
  onPress: (id: string) => void;

}

export default function FeedCard({
  id,
  phone,
  username,
  businessName,
  timestamp,
  content,
  imageUrl,
  videoUrl,
  likes,
  likesIds,
  userId,
  comments,
  onLike,
  onComment,
  onShare,
  onMoreOptions,
  onPress,
  profileImage,
  isVisible = false,
  verified = false,
}: FeedCardProps) {

  const videoRef = useRef<Video>(null);


  const isliked = userId ? likesIds?.includes(userId) : false;


  useEffect(() => {
    if (videoRef.current) {
      if (isVisible) {
        videoRef.current.playAsync();
      } else {
        videoRef.current.pauseAsync();
      }
    }
  }, [isVisible]);
  return (
    <TouchableOpacity activeOpacity={0.9} onPress={() => onPress(id)}>
      <Card style={styles.card}>
        <View style={styles.header}>
          <View style={styles.profileContainer}>
            <View style={styles.avatar}>
              {profileImage ? (
                <Image
                  source={{ uri: profileImage }}
                  style={{ width: '100%', height: '100%', borderRadius: 20 }}
                />
              ) : (
                <Text style={styles.avatarText}>{username?.charAt(0)?.toUpperCase() || "U"}</Text>
              )}
              {/* <Text style={styles.avatarText}>{username?.charAt(0) ? username?.charAt(0)?.toUpperCase() : "U"}</Text> */}
            </View>
            <View style={styles.userInfo}>
              <View style={styles.nameContainer}>
                <Text style={styles.businessName}>{businessName || "Unknown User"}</Text>
                {verified && (
                  <View style={styles.verifiedBadge}>
                    <Text style={styles.verifiedText}>✓</Text>
                  </View>
                )}
              </View>
              <Text style={styles.username}>@{username ? username : phone} • {formatTimestamp(timestamp)}</Text>
            </View>
          </View>

          <View style={styles.headerRight}>
            {/* <View style={[styles.postTypeTag, { backgroundColor: getPostTypeColor(type) }]}>
              <Text style={styles.postTypeText}>{getPostTypeLabel(type)}</Text>
            </View> */}
            <TouchableOpacity onPress={() => onMoreOptions(id)} hitSlop={10}>
              <MoreVertical size={20} color={Colors.gray[600]} />
            </TouchableOpacity>
          </View>
        </View>

        {content && (<View style={styles.content}>
          <Text style={styles.contentText}>{content}</Text>
        </View>)}

        {imageUrl && (
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
        )}

        {videoUrl && (
          <Video
            source={{ uri: videoUrl }}
            style={styles.video}
            ref={videoRef}
            useNativeControls
            resizeMode={ResizeMode.CONTAIN}
            shouldPlay={true} // Set true to autoplay
            isLooping
          />
        )}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onLike(id, likesIds ?? [])}
          >
            <Heart size={20}
              fill={isliked ? '#E0245E' : 'none'}
              color={isliked ? '#E0245E' : Colors.gray[600]} />
            <Text style={styles.actionText}>{likes}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onComment(id)}
          >
            <MessageSquare size={20} color={Colors.gray[600]} />
            <Text style={styles.actionText}>{comments}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onShare(id)}
          >
            <Share size={20} color={Colors.gray[600]} />
            <Text style={styles.actionText}>Share</Text>
          </TouchableOpacity>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: Spacing.md,
    width: width - Spacing.lg * 2,
    alignSelf: 'center',
  },
  video: {
    width: '100%',
    height: 200,
    backgroundColor: Colors.gray[200], // fallback in case video doesn't load
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    // paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: Spacing.sm,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: Colors.primary[700],
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.bold as any,
  },
  userInfo: {
    marginLeft: Spacing.sm,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  businessName: {
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.semiBold as any,
    color: Colors.gray[800],
  },
  verifiedBadge: {
    marginLeft: Spacing.xs,
    backgroundColor: Colors.primary[500],
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifiedText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: Typography.weight.bold as any,
  },
  username: {
    fontSize: Typography.size.sm,
    color: Colors.gray[500],
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postTypeTag: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: Spacing.sm,
  },
  postTypeText: {
    color: Colors.white,
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.medium as any,
  },
  content: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  contentText: {
    fontSize: Typography.size.md,
    color: Colors.gray[800],
    lineHeight: 22,
  },
  image: {
    width: '100%',
    height: 200,
    // paddingTop: Spacing.lg,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.gray[200],
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.sm,
  },
  actionText: {
    marginLeft: Spacing.xs,
    fontSize: Typography.size.sm,
    color: Colors.gray[600],
  },
});