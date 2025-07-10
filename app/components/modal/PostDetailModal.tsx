import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions, Modal } from 'react-native';
import { ArrowLeft, Heart, MessageCircle, Share as ShareIcon, MoreVertical } from 'lucide-react-native';



import { PostOptionsModal } from './PostOptionsModal';
import { ProfileImageModal } from './ProfileImageModal';


import { Comment } from '@/types';
import { useThemeStore } from '@/store/themeStore';
import { getAuthData } from '@/services/secureStore';
import { CommunityPost } from '@/types/feeds';
import { CommentSection } from '../comments/CommentSection';
import { formatTimestamp } from '../utils/dateconverter';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import { ResizeMode, Video } from 'expo-av';
import CustomVideoPlayer from '../utils/CustomVideoPlayer';
import { handleBlock, handleCopyLink, handleDelete, handleReport, handleSave, handleShare } from '@/app/(tabs)';
import useCommunityFeedsStore from '@/store/useCommunityFeeds';

const { width, height } = Dimensions.get('window');

interface PostDetailModalProps {
    visible: boolean;
    post: CommunityPost | null;
    onClose: () => void;
    onRefresh?: () => void;
}

export const PostDetailModal: React.FC<PostDetailModalProps> = ({
    visible,
    post,
    onClose,
    onRefresh,
}) => {
    const { theme } = useThemeStore();
    const [user, setUser] = useState<any>(null);

    const { updateFeed } = useCommunityFeedsStore()
    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(0);
    const [comments, setComments] = useState<Comment[]>([]);
    const [showOptions, setShowOptions] = useState(false);
    const [showProfileImage, setShowProfileImage] = useState(false);
    const [showComments, setShowComments] = useState(false);


    useEffect(() => {
        const fetchUser = async () => {
            const authData = await getAuthData();
            setUser(authData?.userData || null);
        };
        fetchUser();
    }, []);



    useEffect(() => {
        if (post) {
            setIsLiked(post.likes.includes(user?.data?._id || ''));
            setLikesCount(post.likes.length);
            setComments(post.comments);


        }
    }, [post, user, comments]);

    const handleLike = async () => {
        if (!user || !post) return;
        try {
            if (isLiked) {
                const updatedLikes = post?.likes?.filter((likeId) => likeId !== user?.data?._id);
                updateFeed(post?._id, { likes: updatedLikes });
                setLikesCount(prev => prev - 1);
            } else {
                // Like the post
                const updatedLikes = [...post?.likes, user?.data?._id];
                updateFeed(post._id, { likes: updatedLikes });
                setLikesCount(prev => prev + 1);
                // await postService.unlikePost(post.id, user.id);

            }
            setIsLiked(!isLiked);
        } catch (error) {
            console.error('Error toggling like:', error);
        }
    };




    const handleAddComment = (content: string) => {
        if (!user || !post) return;

        const newComment: Comment = {
            // id: Date.now().toString(),
            // userId: user.id,
            user: user?.data?._id,
            content,
            // createdAt: new Date(),
        };


        updateFeed(post?._id, { comments: [newComment] });
        onRefresh?.()
        // setComments(post.comments)
        // setComments(prev => [...prev, newComment]);
    };


    if (!post) return null;

    const isOwnPost = post?.user?._id === user?.data?._id;

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose}
        >
            <View style={[styles.container, { backgroundColor: theme.background }]}>
                <View style={[styles.header, { borderBottomColor: theme.border }]}>
                    <TouchableOpacity onPress={onClose}>
                        <ArrowLeft size={24} color={theme.text} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: theme.text }]}>Post</Text>
                    <TouchableOpacity onPress={() => setShowOptions(true)}>
                        <MoreVertical size={24} color={theme.textSecondary} />
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                    <View style={[styles.postContainer, { borderColor: theme.border }]}>
                        {/* Post Header */}
                        <View style={styles.postHeader}>
                            <TouchableOpacity onPress={() => setShowProfileImage(true)}>

                                {post?.user?.profileUrl ? <Image
                                    source={{ uri: post?.user?.profileUrl || 'https://via.placeholder.com/50' }}
                                    style={styles.avatar}
                                /> : (
                                    <View style={styles.avatar}>
                                        <Text style={styles.avatarText}>{post?.user?.email?.charAt(0)?.toUpperCase() || "U"}</Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                            <View style={styles.userInfo}>
                                <Text style={[styles.username, { color: theme.text }]}>{post?.user?.businessName || 'Unknown User'}</Text>
                                <Text style={[styles.timestamp, { color: theme.textSecondary }]}>
                                    {formatTimestamp(post?.createdAt)}
                                </Text>
                            </View>
                        </View>

                        {/* Post Content */}
                        <Text style={[styles.postContent, { color: theme.text }]}>{post?.content}</Text>

                        {/* Post Media */}
                        {post?.imageUrl && (
                            <Image
                                source={{ uri: post?.imageUrl }}
                                style={styles.media}
                                resizeMode="cover"
                            />
                        )}
                        {post?.videoUrl && (
                            <CustomVideoPlayer videoUrl={post.videoUrl} isVisible={false}
                            />
                        )}

                        {/* Post Actions */}
                        <View style={[styles.actions, { borderTopColor: theme.border }]}>
                            <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
                                <Heart
                                    size={24}
                                    fill={isLiked ? '#E0245E' : 'none'}
                                    color={isLiked ? '#E0245E' : Colors.gray[600]}
                                />
                                <Text style={[styles.actionText, { color: theme.textSecondary }]}>
                                    {likesCount}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.actionButton} onPress={(e) => {
                                e.stopPropagation();
                                setShowComments(!showComments)

                            }}>
                                <MessageCircle size={24} color={theme.textSecondary} />
                                <Text style={[styles.actionText, { color: theme.textSecondary }]}>
                                    {comments.length}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.actionButton} onPress={() => handleShare(post?._id)}
                            >
                                <ShareIcon size={24} color={theme.textSecondary} />

                            </TouchableOpacity>
                        </View>

                        {/* Comments Section */}
                        {showComments && <CommentSection
                            postId={post?._id}
                            comments={comments}
                            user={user}
                            onAddComment={handleAddComment}
                        />}
                    </View>
                </ScrollView>

                <PostOptionsModal
                    visible={showOptions}
                    onClose={() => setShowOptions(false)}
                    isOwnPost={isOwnPost}
                    onShare={() => handleShare(post?._id || '')}
                    onReport={() => handleReport()}
                    onSave={() => handleSave()}
                    onCopyLink={() => handleCopyLink()}
                    onBlock={() => handleBlock()}
                    onDelete={() => handleDelete()}
                />

                <ProfileImageModal
                    visible={showProfileImage}
                    userEmail={post?.user?.email || 'Unknown User'}
                    imageUri={post?.user?.profileUrl || 'https://via.placeholder.com/400'}
                    onClose={() => setShowProfileImage(false)}
                />
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    avatarText: {
        color: Colors.primary[700],
        fontSize: Typography.size.lg,
        fontWeight: Typography.weight.bold as any,
    },
    content: {
        flex: 1,
    },
    postContainer: {
        margin: 5,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
    },
    postHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 12,
        backgroundColor: Colors.primary[100],
        justifyContent: 'center',
        alignItems: 'center',
    },
    userInfo: {
        flex: 1,
    },
    username: {
        fontSize: 16,
        fontWeight: '600',
    },
    timestamp: {
        fontSize: 12,
        marginTop: 2,
    },
    postContent: {
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 16,
    },
    media: {
        width: "100%",
        height: 400,
        borderRadius: 12,
        marginBottom: 16,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingTop: 12,
        borderTopWidth: 1,
        marginBottom: 16,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    actionText: {
        fontSize: 14,
        fontWeight: '500',
    },
});