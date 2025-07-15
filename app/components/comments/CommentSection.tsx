import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { Send } from 'lucide-react-native';

import { useThemeStore } from '@/store/themeStore';
import { useAuthStore } from '@/services/demoStore';
import { Comment } from '@/types';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';

interface CommentSectionProps {
    postId: string;
    comments: Comment[];
    user: any; // Assuming user is an object with properties like displayName, photoURL, etc.
    onAddComment: (content: string) => void;
}

export const CommentSection: React.FC<CommentSectionProps> = ({
    postId,
    user,
    comments,
    onAddComment,
}) => {
    const { theme } = useThemeStore();

    const [newComment, setNewComment] = useState('');



    const handleSubmitComment = () => {
        if (newComment.trim() && user) {
            onAddComment(newComment.trim());
            setNewComment('');
        }
    };

    const formatTime = (input: Date | string) => {
        const date = typeof input === 'string' ? new Date(input) : input;
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor(diff / (1000 * 60));

        if (hours > 24) return date.toLocaleDateString();
        if (hours > 0) return `${hours}h ago`;
        if (minutes > 0) return `${minutes}m ago`;
        return 'Just now';
    };

    return (
        <View style={[styles.container, { borderTopColor: theme.border }]}>
            <Text style={[styles.title, { color: theme.text }]}>
                Comments ({comments?.length})
            </Text>

            <View style={styles.commentsList}>
                {comments?.map((item: any) => (
                    <View key={item._id} style={styles.commentItem}>
                        {item?.user?.profileUrl ? <Image
                            source={{ uri: item?.user?.profileUrl || 'https://via.placeholder.com/32' }}
                            style={styles.commentAvatar}
                        /> : <View style={styles.avatar}>
                            <Text style={styles.avatarText}>{item?.user?.email?.charAt(0)?.toUpperCase() || "U"}</Text>
                        </View>}
                        <View style={styles.commentContent}>
                            <View style={styles.commentHeader}>
                                <Text style={[styles.commentUser, { color: theme.text }]}>
                                    {item?.user?.businessName || 'Unknown User'}
                                </Text>
                                <Text style={[styles.commentTime, { color: theme.textSecondary }]}>
                                    {formatTime(item?.createdAt)}
                                </Text>
                            </View>
                            <Text style={[styles.commentText, { color: theme.text }]}>
                                {item?.content}
                            </Text>
                        </View>
                    </View>
                ))}
            </View>

            <View style={[styles.inputContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <Image
                    source={{ uri: user?.data?.profileUrl || 'https://via.placeholder.com/32' }}
                    style={styles.inputAvatar}
                />
                <TextInput
                    style={[styles.input, { color: theme.text }]}
                    placeholder="Add a comment..."
                    placeholderTextColor={theme.textSecondary}
                    value={newComment}
                    onChangeText={setNewComment}
                    multiline
                    maxLength={500}
                />
                <TouchableOpacity
                    style={[styles.sendButton, { backgroundColor: theme.primary }]}
                    onPress={handleSubmitComment}
                    disabled={!newComment.trim()}
                >
                    <Send size={20} color="#FFFFFF" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { borderTopWidth: 1, paddingTop: 16, marginTop: 16 },
    title: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
    commentsList: { marginBottom: 16 },
    commentItem: { flexDirection: 'row', marginBottom: 12, paddingHorizontal: 4 },
    commentAvatar: { width: 32, height: 32, borderRadius: 16, marginRight: 8 },
    commentContent: { flex: 1 },
    commentHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
    commentUser: { fontSize: 14, fontWeight: '600', marginRight: 8 },
    commentTime: { fontSize: 12 },
    commentText: { fontSize: 14, lineHeight: 18 },
    inputContainer: { flexDirection: 'row', alignItems: 'flex-end', padding: 12, borderRadius: 12, borderWidth: 1, gap: 8 },
    inputAvatar: { width: 32, height: 32, borderRadius: 16 },
    input: { flex: 1, fontSize: 14, maxHeight: 80, minHeight: 36, paddingVertical: 8 },
    avatarText: {
        color: Colors.primary[700],
        fontSize: Typography.size.lg,
        fontWeight: Typography.weight.bold as any,
    },
    avatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        marginRight: 8,
        backgroundColor: Colors.primary[100],
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendButton: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
});
