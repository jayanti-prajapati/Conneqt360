import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { Send, ChevronDown, ChevronRight, MessageCircle, ChevronUp } from 'lucide-react-native';
import { useThemeStore } from '@/store/themeStore';
import { Comment } from '@/types';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
// import { formatDistanceToNow } from 'date-fns';

interface CommentSectionProps {
    postId: string;
    comments: Comment[];
    user: any;
    onAddComment: (content: string, parentCommentId?: string, replyTo?: string) => void;
}

export const CommentSection: React.FC<CommentSectionProps> = ({
    postId,
    comments = [],
    user,
    onAddComment,
}) => {
    const { theme } = useThemeStore();
    const [newComment, setNewComment] = useState('');
    const [replyingTo, setReplyingTo] = useState<{ commentId: string; username: string } | null>(null);
    const [expandedReplies, setExpandedReplies] = useState<Record<string, boolean>>({});

    const handleSubmitComment = () => {
        if (newComment.trim() && user) {
            onAddComment(
                newComment.trim(),
                replyingTo?.commentId,
                replyingTo?.username
            );
            setNewComment('');
            setReplyingTo(null);
        }
    };
    const toggleReplies = (commentId: string) => {
        setExpandedReplies(prev => ({
            ...prev,
            [commentId]: !prev[commentId]
        }));
    };
    // console.log("comments", comments);
    const renderComment = (comment: any, level = 0) => {
        const hasReplies = comments.some(c => c.parentCommentId === comment._id);
        const isExpanded = expandedReplies[comment._id] !== false;
        const replies = comments.filter(c => c.parentCommentId === comment._id);

        // Safely get the replyTo username
        const replyToUsername = typeof comment.replyTo === 'string'
            ? comment.replyTo
            : comment.replyTo?.username || comment.replyTo?.name || 'user';

        return (
            <View
                key={comment._id}
                style={[
                    styles.commentContainer,
                    level > 0 && styles.replyContainer,
                    { marginLeft: level * 16 }
                ]}
            >
                <View style={styles.commentHeader}>
                    {comment.user?.profileUrl ? (
                        <Image
                            source={{ uri: comment.user.profileUrl }}
                            style={styles.avatar}
                        />
                    ) : (
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>
                                {comment.user?.email?.charAt(0)?.toUpperCase() || "U"}
                            </Text>
                        </View>
                    )}
                    <View style={styles.commentContent}>
                        <View style={styles.commentHeader}>
                            <Text style={[styles.commentUser, { color: theme.text }]}>
                                {comment.user?.businessName || comment.user?.name || 'Unknown User'}
                            </Text>
                            <Text style={[styles.commentTime, { color: theme.textSecondary }]}>
                                {/* Format your time here */}
                            </Text>
                        </View>
                        {comment.replyTo && (
                            <Text style={[styles.replyTo, { color: theme.primary }]}>
                                Replying to @{replyToUsername}
                            </Text>
                        )}
                        <Text style={[styles.commentText, { color: theme.text }]}>
                            {comment.content}
                        </Text>
                        <TouchableOpacity
                            style={styles.replyButton}
                            onPress={() => {
                                setReplyingTo({
                                    commentId: comment._id,
                                    username: comment.user?._id
                                });
                            }}
                        >
                            <MessageCircle size={14} color={theme.textSecondary} />
                            <Text style={[styles.replyButtonText, { color: theme.textSecondary }]}>
                                Reply
                            </Text>
                        </TouchableOpacity>

                        {/* Render replies if they exist */}
                        {hasReplies && (
                            <TouchableOpacity
                                style={styles.showRepliesButton}
                                onPress={() => toggleReplies(comment._id)}
                            >
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    {isExpanded ? (
                                        <ChevronUp size={16} color={theme.textSecondary} />
                                    ) : (
                                        <ChevronDown size={16} color={theme.textSecondary} />
                                    )}
                                    <Text style={[styles.showRepliesText, { color: theme.textSecondary }]}>
                                        {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        )}

                        {/* Render the replies if expanded */}
                        {isExpanded && hasReplies && (
                            <View style={styles.repliesContainer}>
                                {replies.map(reply => renderComment(reply, level + 1))}
                            </View>
                        )}
                    </View>
                </View>
            </View>
        );
    };
    const topLevelComments = comments.filter(comment => !comment.parentCommentId);

    return (
        <View style={[styles.container, { borderTopColor: theme.border }]}>
            <Text style={[styles.title, { color: theme.text }]}>
                Comments ({comments.length})
            </Text>

            <ScrollView style={styles.commentsList}>
                {topLevelComments.map(comment => renderComment(comment))}
            </ScrollView>

            <View style={[styles.inputContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                {replyingTo && (
                    <View style={styles.replyingToContainer}>
                        <Text style={[styles.replyingToText, { color: theme.primary }]}>
                            Replying to @{replyingTo.username}
                        </Text>
                        <TouchableOpacity onPress={() => setReplyingTo(null)}>
                            <Text style={[styles.cancelReplyText, { color: theme.textSecondary }]}>
                                Cancel
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
                <Image
                    source={{ uri: user?.data?.profileUrl || 'https://via.placeholder.com/32' }}
                    style={styles.inputAvatar}
                />
                <TextInput
                    style={[styles.input, {
                        color: theme.text,
                        backgroundColor: theme.background
                    }]}
                    placeholder={replyingTo ? `Reply to @${replyingTo.username}...` : 'Add a comment...'}
                    placeholderTextColor={theme.textSecondary}
                    value={newComment}
                    onChangeText={setNewComment}
                    multiline
                    maxLength={500}
                />
                <TouchableOpacity
                    style={[styles.sendButton, {
                        backgroundColor: newComment.trim() ? theme.primary : theme.background,
                        borderColor: theme.border
                    }]}
                    onPress={handleSubmitComment}
                    disabled={!newComment.trim()}
                >
                    <Send size={20} color={newComment.trim() ? '#FFFFFF' : theme.textSecondary} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderTopWidth: 1,
        paddingTop: 16,
        marginTop: 16,
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
        paddingHorizontal: 16,
    },
    commentsList: {
        flex: 1,
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    commentContainer: {
        marginBottom: 12,
    },
    replyContainer: {
        marginTop: 8,
        paddingLeft: 8,
        borderLeftWidth: 2,
        borderLeftColor: 'rgba(0,0,0,0.1)',
    },
    commentHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    commentContent: {
        flex: 1,
        marginLeft: 8,
    },
    commentUser: {
        fontSize: 14,
        fontWeight: '600',
        marginRight: 8
    },
    commentTime: {
        fontSize: 12,
        opacity: 0.7,
    },
    commentText: {
        fontSize: 14,
        lineHeight: 20,
        marginTop: 2,
    },
    replyTo: {
        fontSize: 12,
        marginTop: 2,
        marginBottom: 2,
    },
    replyButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    replyButtonText: {
        fontSize: 12,
        marginLeft: 4,
    },
    viewRepliesButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    viewRepliesText: {
        fontSize: 12,
        marginLeft: 4,
        fontWeight: '500',
    },
    repliesContainer: {
        marginTop: 8,
        paddingLeft: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        gap: 8,
        position: 'relative',
    },
    replyingToContainer: {
        position: 'absolute',
        top: -30,
        left: 12,
        right: 12,
        backgroundColor: 'rgba(0,0,0,0.05)',
        padding: 4,
        borderRadius: 4,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    replyingToText: {
        fontSize: 12,
    },
    cancelReplyText: {
        fontSize: 12,
        textDecorationLine: 'underline',
    },
    inputAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: Colors.primary[100],
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        fontSize: 14,
        maxHeight: 120,
        minHeight: 36,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 18,
    },
    sendButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
    },
    avatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: Colors.primary[100],
        justifyContent: 'center',
        alignItems: 'center',
    },
    // repliesContainer: {
    //     marginTop: 8,
    //     borderLeftWidth: 2,
    //     borderLeftColor: theme.border,
    //     paddingLeft: 12,
    // },
    showRepliesButton: {
        marginTop: 4,
    },
    showRepliesText: {
        fontSize: 12,
        marginLeft: 4,
    },
    avatarText: {
        color: Colors.primary[700],
        fontSize: 14,
        fontWeight: 'bold',
    },
});