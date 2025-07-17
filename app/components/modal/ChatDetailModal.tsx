import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TextInput,
    TouchableOpacity,
    Image,
    KeyboardAvoidingView,
    Platform,
    Modal,
    ActivityIndicator,
} from 'react-native';
import { ArrowLeft, Send } from 'lucide-react-native';
import { useThemeStore } from '../../store/themeStore';
import { User } from '../../types';
import useChatStore from '@/store/useChatStore';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';

interface ChatDetailModalProps {
    visible: boolean;
    receiverData: any;
    onClose: () => void;
    user: any;
}

export const ChatDetailModal: React.FC<ChatDetailModalProps> = ({
    visible,
    receiverData,
    user,
    onClose,
}) => {
    const { theme } = useThemeStore();
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [otherUser, setOtherUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [chatData, setChatData] = useState<any>(null);

    const { sendMessage, getConversation } = useChatStore();

    const isCurrentUserSender = useCallback(
        (message: any) => message.sender._id === user?._id,
        [user?._id]
    );

    const getOtherUser = useCallback(() => {
        if (!receiverData?.participants) return null;
        const { sender, receiver } = receiverData.participants;
        return sender._id === user?._id ? receiver : sender;
    }, [receiverData?.participants, user?._id]);

    const fetchChatData = useCallback(async () => {
        try {
            const other = getOtherUser();
            setOtherUser(other);
            if (receiverData?.messages) {
                const sortedMessages = [...receiverData.messages];
                setMessages(sortedMessages);
            }
        } catch (error) {
            console.error('Error fetching chat data:', error);
        } finally {
            setLoading(false);
        }
    }, [getOtherUser, receiverData?.messages]);

    const fetchConversation = async () => {
        if (!user?._id || !otherUser?._id) return;
        try {
            //@ts-ignore
            const conversation = await getConversation(user._id, otherUser._id);
            if (conversation && conversation.length > 0) {
                setChatData(conversation[0]);
                setMessages([...conversation[0]?.messages]);
            }
        } catch (error) {
            console.error('Error fetching conversation:', error);
        }
    };

    useEffect(() => {
        if (!user) return;
        let intervalId: NodeJS.Timeout;

        const initializeChat = async () => {
            setLoading(true);
            await fetchChatData();

            intervalId = setInterval(() => {
                if (otherUser) fetchConversation();
            }, 2000);
        };
        initializeChat();

        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [user, otherUser, fetchChatData]);

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !user?._id || !otherUser?._id) return;
        const temp = newMessage.trim();
        setNewMessage('');
        try {
            await sendMessage({
                sender: user._id,
                receiver: otherUser._id,
                content: temp,
                type: 'text',
            });
            fetchConversation();
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const renderMessage = ({ item }: { item: any }) => {
        const isOwnMessage = isCurrentUserSender(item);
        const messageDate = new Date(item.createdAt);
        const formattedTime = messageDate.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
        });

        return (
            <View
                style={[
                    styles.messageContainer,
                    isOwnMessage ? styles.ownMessage : styles.otherMessage,
                ]}
            >
                {!isOwnMessage && otherUser?.profileUrl && (
                    <Image source={{ uri: otherUser.profileUrl }} style={styles.messageAvatar} />
                )}
                <View
                    style={[
                        styles.messageBubble,
                        {
                            backgroundColor: isOwnMessage ? theme.primary : theme.surface,
                            borderColor: theme.border,
                        },
                    ]}
                >
                    <Text
                        style={[
                            styles.messageText,
                            { color: isOwnMessage ? '#fff' : theme.text },
                        ]}
                    >
                        {item.content}
                    </Text>
                    <Text
                        style={[
                            styles.messageTime,
                            {
                                color: isOwnMessage
                                    ? 'rgba(255,255,255,0.7)'
                                    : theme.textSecondary,
                                textAlign: isOwnMessage ? 'right' : 'left',
                            },
                        ]}
                    >
                        {formattedTime}
                    </Text>
                </View>
            </View>
        );
    };

    if (loading) {
        return (
            <Modal
                visible={visible}
                transparent={false}
                animationType="slide"
                onRequestClose={onClose}
            >
                <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
                    <ActivityIndicator size="large" color={theme.primary} />
                </View>
            </Modal>
        );
    }

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={false}
            onRequestClose={onClose}
        >
            <View style={[styles.container, { backgroundColor: theme.background }]}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    style={styles.keyboardAvoidingView}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
                >
                    {/* Header */}
                    <View
                        style={[
                            styles.header,
                            { backgroundColor: theme.surface, borderBottomColor: theme.border },
                        ]}
                    >
                        <TouchableOpacity onPress={onClose} style={styles.backButton}>
                            <ArrowLeft size={24} color={theme.text} />
                        </TouchableOpacity>

                        {otherUser && (
                            <View style={styles.headerUser}>
                                <View style={styles.headerAvatar}>
                                    {otherUser.profileUrl ? (
                                        <Image
                                            source={{ uri: otherUser.profileUrl }}
                                            style={styles.avatarImage}
                                        />
                                    ) : (
                                        <Text style={styles.avatarText}>
                                            {otherUser.name?.charAt(0)?.toUpperCase() || 'U'}
                                        </Text>
                                    )}
                                </View>
                                <View style={styles.headerUserInfo}>
                                    <Text style={[styles.headerName, { color: theme.text }]}>
                                        {otherUser.name || 'Unknown User'}
                                    </Text>
                                    <Text style={[styles.headerStatus, { color: theme.textSecondary }]}>
                                        {otherUser.isOnline ? 'Online' : 'Offline'}
                                    </Text>
                                </View>
                            </View>
                        )}
                    </View>

                    {/* Messages */}
                    {messages?.length > 0 ? (
                        <FlatList
                            data={[...messages].reverse()}
                            keyExtractor={(item) => item._id}
                            renderItem={renderMessage}
                            contentContainerStyle={[styles.messagesList, { justifyContent: 'flex-end' }]}
                            inverted
                            showsVerticalScrollIndicator={false}
                        />
                    ) : (
                        <View style={styles.noMessagesContainer}>
                            <Text style={[styles.noMessagesText, { color: theme.textSecondary }]}>
                                No messages yet
                            </Text>
                        </View>
                    )}

                    {/* Input */}
                    <View
                        style={[
                            styles.inputContainer,
                            { backgroundColor: theme.surface, borderTopColor: theme.border },
                        ]}
                    >
                        <TextInput
                            style={[
                                styles.input,
                                {
                                    backgroundColor: theme.background,
                                    color: theme.text,
                                    borderColor: theme.border,
                                },
                            ]}
                            placeholder="Type a message..."
                            placeholderTextColor={theme.textSecondary}
                            value={newMessage}
                            onChangeText={setNewMessage}
                            multiline
                            maxLength={1000}
                        />
                        <TouchableOpacity
                            style={[
                                styles.sendButton,
                                { backgroundColor: theme.primary, opacity: newMessage.trim() ? 1 : 0.5 },
                            ]}
                            onPress={handleSendMessage}
                            disabled={!newMessage.trim()}
                        >
                            <Send size={20} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    keyboardAvoidingView: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
    },
    backButton: { padding: 8, marginRight: 8 },
    headerUser: { flex: 1, flexDirection: 'row', alignItems: 'center' },
    headerAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.primary[100],
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        overflow: 'hidden',
    },
    avatarImage: { width: '100%', height: '100%' },
    avatarText: {
        color: Colors.primary[700],
        fontSize: Typography.size.lg,
        fontWeight: Typography.weight.bold as any,
    },
    headerUserInfo: { flex: 1 },
    headerName: { fontSize: 16, fontWeight: '600' },
    headerStatus: { fontSize: 12, marginTop: 2 },
    messagesList: { flexGrow: 1, padding: 16 },
    messageContainer: { marginVertical: 4, flexDirection: 'row', alignItems: 'flex-end' },
    ownMessage: { justifyContent: 'flex-end', alignSelf: 'flex-end' },
    otherMessage: { justifyContent: 'flex-start', alignSelf: 'flex-start' },
    messageAvatar: { width: 32, height: 32, borderRadius: 16, marginRight: 8 },
    messageBubble: { maxWidth: '80%', padding: 12, borderRadius: 16, borderWidth: 1 },
    messageText: { fontSize: 16, lineHeight: 20 },
    messageTime: { fontSize: 12, marginTop: 4 },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderTopWidth: 1,
    },
    input: {
        flex: 1,
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
        fontSize: 16,
        maxHeight: 120,
    },
    noMessagesContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    noMessagesText: { fontSize: 16, color: Colors.gray[500] },
    sendButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
    },
});
