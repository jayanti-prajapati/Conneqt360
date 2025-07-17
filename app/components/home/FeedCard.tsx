import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Dimensions, Alert } from 'react-native';
import Card from '@/components/ui-components/Card';
import { Heart, MessageSquare, Share, MoreVertical } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import Spacing from '@/constants/Spacing';
import { formatTimestamp } from '../utils/dateconverter';

import CustomVideoPlayer from '../utils/CustomVideoPlayer';

import { CommunityPost } from '@/types/feeds';

import { CommentSection } from '../comments/CommentSection';
import { Comment } from '@/types';
import { UserProfileModal } from '../modal/UserProfileModal';

const { width } = Dimensions.get('window');

export type PostType = 'product' | 'deal' | 'help' | 'success';

interface FeedCardProps {
  id: string;
  // type: PostType;
  phone?: string;
  user?: any;
  username: string;
  businessName: string;
  timestamp: string;
  content: string;
  imageUrl?: string;
  likes: number;
  videoUrl: string;
  verified?: boolean;
  profileImage?: string;
  isVisible?: boolean;
  likesIds?: string[];
  onShare: (id: string) => void;
  onMoreOptions: (post: CommunityPost) => void;
  onPress: (post: CommunityPost) => void;
  post: any;

  onLike: (id: any, likes: any) => void;
  onComment: (id: any, comments: any) => void;


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
  user,
  post,
  onShare,
  onMoreOptions,
  onPress,
  onLike,
  onComment,
  profileImage,
  isVisible = false,
  verified = false,

}: FeedCardProps) {

  // const isliked = user?.data?._id ? likesIds?.includes(user?.data?._id) : false;

  // console.log("isliked", likesIds, userId);
  const [comments, setComments] = useState<Comment[]>(post.comments);
  const [showComments, setShowComments] = useState(false);
  const [showFullText, setShowFullText] = useState(false);
  const [isLiked, setIsLiked] = useState(post.likes.includes(user?.data?._id || false));
  const [likesCount, setLikesCount] = useState(post.likes.length);
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    if (post && post?.likes && Array.isArray(post.likes) && user?.data?._id) {
      setIsLiked(post.likes.includes(user.data._id));
      setLikesCount(post.likes.length);
    }

    if (post && post.comments) {
      setComments(post.comments);
    }
  }, [post]);


  const handleAddComment = (content: string) => {
    if (!user) return;

    const newComment: Comment = {
      user: user?.data?._id,
      content,
    };

    // setComments(prev => [...prev, newComment]);
    onComment(post?._id, newComment)
  };
  const handleLike = () => {
    const updatedLikes = isLiked
      ? post?.likes?.filter((id: string) => id !== user?.data?._id)
      : [...post?.likes, user?.data?._id];

    setIsLiked(!isLiked);
    setLikesCount((prev: any) => (isLiked ? prev - 1 : prev + 1));
    onLike(post._id, updatedLikes);
  };

  return (

    <Card style={styles.card}>
      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setShowProfileModal(true)}
          style={styles.profileContainer}
        >
          <View style={{ flexDirection: 'row', flex: 1 }}>

            <View style={styles.avatar}>
              {profileImage ? (
                <Image
                  source={{ uri: profileImage }}
                  style={{ width: '100%', height: '100%', borderRadius: 20 }}
                />
              ) : (
                <Text style={styles.avatarText}>{username?.charAt(0)?.toUpperCase() || "U"}</Text>
              )}
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
        </TouchableOpacity>
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={() => onMoreOptions(post)} hitSlop={10}>
            <MoreVertical size={20} color={Colors.gray[600]} />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity activeOpacity={0.9} onPress={() => onPress(post)}>
        {content && (
          <View style={styles.content}>
            <Text
              style={styles.contentText}
              numberOfLines={showFullText ? undefined : 3}
            >
              {content}
            </Text>

            {content.length > 100 && (
              <TouchableOpacity onPress={() => setShowFullText(!showFullText)}>
                <Text style={styles.seeMoreText}>
                  {showFullText ? 'See less' : 'See more'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {imageUrl && (
          <View style={{ width: '100%' }}>
            <Image
              source={{ uri: imageUrl }}
              style={styles.image}
              resizeMode='contain'
            />
          </View>
        )}

        {videoUrl && (
          <CustomVideoPlayer
            videoUrl={videoUrl}
            isVisible={isVisible}
          />
        )}
      </TouchableOpacity>
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleLike}
        >
          <Heart
            size={20}
            fill={isLiked ? '#E0245E' : 'none'}
            color={isLiked ? '#E0245E' : Colors.gray[600]}
          />
          <Text style={styles.actionText}>{likesCount}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={(e) => {
            e.stopPropagation();
            setShowComments(!showComments);
          }}
        >
          <MessageSquare size={20} color={Colors.gray[600]} />
          <Text style={styles.actionText}>{comments?.length}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onShare(id)}
        >
          <Share size={20} color={Colors.gray[600]} />
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>
      </View>

      {
        showComments && (
          <CommentSection
            postId={post.id}
            comments={comments}
            user={user}
            onAddComment={handleAddComment}
          />
        )
      }

      <UserProfileModal visible={showProfileModal} onClose={() => setShowProfileModal(false)} userId={post?.user?._id} />
    </Card >

  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: Spacing.md,
    width: "100%",
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',

    paddingRight: Spacing.md,
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
    fontSize: Typography.size.sm,
    color: Colors.gray[800],
    lineHeight: 22,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: Spacing.md,
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
  seeMoreText: {
    color: Colors.primary[600],
    fontWeight: '600',
    marginTop: 4,
  },

});