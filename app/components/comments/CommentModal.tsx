import React, { forwardRef, useImperativeHandle, useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    ScrollView,
    TextInput as RNTextInput,
    Image,
    KeyboardAvoidingView,
    Platform,
    StyleProp,
    ViewStyle,
    ImageStyle,
    TextStyle,
    TextInput
} from 'react-native';
import { Comment, User } from '@/types';
import { useThemeStore } from '@/store/themeStore';
import { X, Send } from 'lucide-react-native';



type CommentModalProps = {
    postId: string;
    comments: Comment[];
    user: User;
    onAddComment: (content: string, parentCommentId?: string, replyTo?: string) => Promise<void> | void;
};

export type CommentModalRef = {
    open: () => void;
    close: () => void;
};

const CommentModal = forwardRef<CommentModalRef, CommentModalProps>(
    ({ postId, comments, user, onAddComment }, ref) => {
        const { theme } = useThemeStore();
        const styles = createStyles(theme);
        const [visible, setVisible] = useState(false);
        const [newComment, setNewComment] = useState('');
        const [commentsState, setComments] = useState<Comment[]>([]);
        const [replyingTo, setReplyingTo] = useState<any | null>(null);
        const [expandedReplies, setExpandedReplies] = useState<Record<string, boolean>>({});
        const textInputRef = useRef<RNTextInput>(null);
        const scrollViewRef = useRef<ScrollView>(null);

        // Group comments by parentCommentId
        const groupCommentsByParent = (comments: Comment[]) => {
            const grouped: { [key: string]: Comment[] } = {};
            const rootComments: Comment[] = [];

            comments.forEach(comment => {
                if (!comment.parentCommentId) {
                    rootComments.push(comment);
                } else {
                    if (!grouped[comment.parentCommentId]) {
                        grouped[comment.parentCommentId] = [];
                    }
                    grouped[comment.parentCommentId].push(comment);
                }
            });

            // Sort root comments by date (newest first)
            rootComments.sort((a, b) =>
                new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime()
            );

            // Sort replies by date (oldest first)
            Object.keys(grouped).forEach(key => {
                grouped[key].sort((a, b) =>
                    new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime()
                );
            });

            return { rootComments, replies: grouped };
        };

        // Get grouped comments
        const { rootComments, replies } = groupCommentsByParent(commentsState);

        // Toggle replies visibility
        const toggleReplies = (commentId: string) => {
            setExpandedReplies(prev => ({
                ...prev,
                [commentId]: !prev[commentId]
            }));
        };

        // Handle adding a new comment
        const handleAddComment = async () => {
            if (!newComment.trim() || !user) return;


            // Update local state

            // Reset input
            setNewComment('');

            // If this is a reply, expand the parent comment's replies
            if (replyingTo?.commentId) {
                setExpandedReplies(prev => ({
                    ...prev,
                    [replyingTo.commentId]: true
                }));
            }

            // Call the onAddComment prop if provided
            // console.log("newComment", replyingTo);
            await onAddComment(
                newComment,
                replyingTo?.commentId,
                replyingTo?.user
            );


            setReplyingTo(null);
        };

        const handleReply = (commentId: string, username: string = 'user') => {
            setReplyingTo({
                commentId,
                username
            });
            // Small timeout to ensure the input is rendered before focusing
            setTimeout(() => {
                textInputRef.current?.focus();
            }, 100);
        };

        useEffect(() => {
            if (comments && comments.length > 0) {
                setComments(comments);
            } else {
                setComments([]);
            }
        }, [comments]);

        useImperativeHandle(ref, () => ({
            open: () => setVisible(true),
            close: () => setVisible(false),
        }));

        if (!visible) return null;

        // console.log("/", replies);
        return (
            <Modal
                visible={visible}
                animationType="slide"
                transparent
                onRequestClose={() => setVisible(false)}
                statusBarTranslucent
            >
                <View style={styles.container}>
                    <View style={styles.modalContent}>
                        <View style={styles.header}>
                            <Text style={styles.title}>Comments</Text>
                            <TouchableOpacity onPress={() => setVisible(false)} style={styles.closeButton}>
                                <X size={24} color={theme.text} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.commentsContainer}>
                            <ScrollView
                                ref={scrollViewRef}
                                style={{ flex: 1 }}
                                contentContainerStyle={styles.commentsContent}
                                showsVerticalScrollIndicator={true}
                            >
                                {rootComments.length === 0 ? (
                                    <View style={styles.noComments}>
                                        <Text style={{ color: theme.textSecondary }}>
                                            No comments yet
                                        </Text>
                                    </View>
                                ) : (
                                    rootComments.map(comment => (
                                        <View
                                            key={comment._id}
                                            style={[
                                                styles.commentContainer,
                                                {
                                                    backgroundColor: theme.background,
                                                    borderBottomColor: theme.border,
                                                }
                                            ]}
                                        >
                                            <Image
                                                source={{ uri: comment.user?.profileUrl || 'https://via.placeholder.com/32' }}
                                                style={[
                                                    styles.inputAvatar,
                                                    { backgroundColor: theme.border }
                                                ] as StyleProp<ImageStyle>}
                                                resizeMode="cover"
                                            />
                                            <View style={styles.commentContent}>
                                                <Text style={[styles.commentAuthor, { color: theme.text }]}>
                                                    {comment.user?.name || 'Anonymous'}
                                                    {comment.replyTo && (
                                                        <Text style={[styles.replyingToText, { color: theme.textSecondary }]}>
                                                            {' '}@{comment.replyTo}
                                                        </Text>
                                                    )}
                                                </Text>
                                                <Text style={[styles.commentText, { color: theme.text }]}>
                                                    {comment.content || ''}
                                                </Text>
                                                <View style={styles.commentActions}>
                                                    <TouchableOpacity
                                                        onPress={() => setReplyingTo({ commentId: comment._id || '', username: comment.user?.username, user: comment.user?._id || '' })}
                                                        style={styles.replyButton}
                                                    >
                                                        <Text style={[styles.replyButtonText, { color: theme.textSecondary }]}>
                                                            Reply
                                                        </Text>
                                                    </TouchableOpacity>
                                                    {comment._id && replies[comment._id]?.length > 0 && (
                                                        <TouchableOpacity
                                                            onPress={() => toggleReplies(comment._id || '')}
                                                            style={styles.viewRepliesButton}
                                                        >
                                                            <Text style={[styles.viewRepliesText, { color: theme.textSecondary }]}>
                                                                {expandedReplies[comment._id] ? 'Hide replies' : `View ${replies[comment._id]?.length} ${replies[comment._id]?.length === 1 ? 'reply' : 'replies'}`}
                                                            </Text>
                                                        </TouchableOpacity>
                                                    )}
                                                </View>

                                                {/* Nested replies */}
                                                {comment._id && expandedReplies[comment._id] && replies[comment._id]?.length > 0 && (
                                                    <View style={styles.repliesContainer}>
                                                        {replies[comment._id].map((reply: any) => (
                                                            <View
                                                                key={reply._id}
                                                                style={[
                                                                    styles.commentContainer,
                                                                    {
                                                                        backgroundColor: theme.background,
                                                                        borderBottomColor: theme.border,
                                                                        marginLeft: 0,
                                                                        paddingLeft: 12,
                                                                        borderLeftWidth: 2,
                                                                        borderLeftColor: theme.primary + '40',
                                                                        marginTop: 8
                                                                    }
                                                                ]}
                                                            >
                                                                <Image
                                                                    source={{ uri: reply?.user?.profileUrl || 'https://via.placeholder.com/32' }}
                                                                    style={[
                                                                        styles.inputAvatar,
                                                                        { backgroundColor: theme.border }
                                                                    ]}
                                                                    resizeMode="cover"
                                                                />
                                                                <View style={styles.commentContent}>
                                                                    <Text style={[styles.commentAuthor, { color: theme.text }]}>
                                                                        {/* {console.log("reply", reply)} */}
                                                                        {reply.user?.name || 'Anonymous'}
                                                                        {reply.replyTo && (
                                                                            <Text style={[styles.replyingToText, { color: theme.textSecondary }]}>
                                                                                {' '}@{reply.replyTo?.username}
                                                                            </Text>
                                                                        )}
                                                                    </Text>
                                                                    <Text style={[styles.commentText, { color: theme.text }]}>
                                                                        {reply.content}
                                                                    </Text>
                                                                    <View style={styles.commentActions}>
                                                                        <TouchableOpacity
                                                                            onPress={() => setReplyingTo({ commentId: comment._id || '', username: reply.user?.username, user: reply.user?._id || '' })}
                                                                            style={styles.replyButton}
                                                                        >
                                                                            <Text style={[styles.replyButtonText, { color: theme.textSecondary }]}>
                                                                                Reply
                                                                            </Text>
                                                                        </TouchableOpacity>
                                                                    </View>
                                                                </View>
                                                            </View>
                                                        ))}
                                                    </View>
                                                )}
                                            </View>
                                        </View>
                                    ))
                                )}
                            </ScrollView>
                        </View>

                        {/* Footer with input */}
                        <View style={[styles.footer, { borderTopColor: theme.border, backgroundColor: theme.background }]}>
                            {replyingTo && (
                                <View style={[styles.repliesContainer, { backgroundColor: theme.surface }]}>
                                    <Text style={[styles.replyingToText, { color: theme.text }]}>
                                        Replying to @{replyingTo?.username || 'user'}
                                    </Text>
                                    <TouchableOpacity
                                        onPress={() => setReplyingTo(null)}
                                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                    >
                                        <Text style={[styles.cancelReplyText, { color: theme.primary }]}>
                                            Cancel
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                            <View style={styles.inputContainer}>
                                <Image
                                    source={{ uri: user?.profileUrl }}
                                    style={[
                                        styles.inputAvatar,
                                        { backgroundColor: theme.border }
                                    ] as StyleProp<ImageStyle>}
                                    defaultSource={{ uri: 'https://via.placeholder.com/32' }}
                                    resizeMode="cover"
                                />
                                <TextInput
                                    ref={textInputRef}
                                    style={[styles.input, {
                                        color: theme.text,
                                        backgroundColor: theme.background,
                                        borderColor: theme.border,
                                    }]}
                                    placeholder={replyingTo ? `Reply to @${replyingTo.username || 'user'}...` : 'Add a comment...'}
                                    placeholderTextColor={theme.textSecondary}
                                    value={newComment}
                                    onChangeText={setNewComment}
                                    onSubmitEditing={handleAddComment}
                                    returnKeyType="send"
                                    multiline
                                    maxLength={500}
                                    textAlignVertical="center"
                                />
                                <TouchableOpacity
                                    style={[styles.sendButton, {
                                        backgroundColor: newComment.trim() ? theme.primary : theme.background,
                                        borderColor: theme.border
                                    }]}
                                    onPress={handleAddComment}
                                    disabled={!newComment.trim()}
                                >
                                    <Send size={20} color={newComment.trim() ? '#FFFFFF' : theme.textSecondary} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }
);
export default CommentModal;

const createStyles = (theme: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
        minHeight: '100%',
    },
    modalContent: {
        backgroundColor: theme.background,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '90%',
        minHeight: '90%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: theme.border,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: theme.text,
    },
    closeButton: {
        padding: 4,
    },
    commentsContainer: {
        flex: 1,
    },
    commentsContent: {
        padding: 8,
        paddingBottom: 80, // Extra padding for the input field
    },
    commentContainer: {
        flexDirection: 'row',
        padding: 8,
        borderRadius: 8,
        marginBottom: 8,
    },
    commentHeader: {
        flexDirection: 'row',
        marginBottom: 4,
    },
    commentContent: {
        flex: 1,
        marginLeft: 8,
    },
    commentAuthor: {
        fontWeight: '600',
        fontSize: 14,
        color: theme.text,
    },
    commentText: {
        fontSize: 14,
        lineHeight: 20,
        color: theme.text,
        marginVertical: 4,
    },
    commentActions: {
        flexDirection: 'row',
        marginTop: 4,
        alignItems: 'center',
    },
    replyButton: {
        marginRight: 16,
    },
    replyButtonText: {
        fontSize: 12,
        color: theme.textSecondary,
    },
    viewRepliesButton: {
        marginLeft: 8,
    },
    viewRepliesText: {
        fontSize: 12,
        color: theme.textSecondary,
        fontStyle: 'italic',
    },
    repliesContainer: {
        marginTop: 8,
        borderLeftWidth: 2,
        borderLeftColor: theme.primary + '40',
        paddingLeft: 12,
    },
    replyingToText: {
        fontSize: 12,
        color: theme.textSecondary,
        fontStyle: 'italic',
        marginLeft: 4,
    },
    footer: {
        borderTopWidth: 1,
        padding: 16,
        backgroundColor: theme.background,
        borderTopColor: theme.border,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    inputAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        marginRight: 8,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginRight: 8,
        maxHeight: 100,
        color: theme.text,
        backgroundColor: theme.background,
    },
    sendButton: {
        padding: 8,
        backgroundColor: theme.primary,
        opacity: 1,
        borderRadius: 20,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
    },
    noComments: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    cancelReplyText: {
        fontSize: 14,
        fontWeight: '500',
        marginLeft: 8,
    },
});