import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform, Modal, ActivityIndicator } from 'react-native';
import { ArrowLeft, Send, Phone, Video } from 'lucide-react-native';
import { useThemeStore } from '../../store/themeStore';
import { Message, User } from '../../types';
import useChatStore from '@/store/useChatStore';
import { combineChatsByParticipants } from '@/app/(tabs)/chats';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';



interface ChatDetailModalProps {
    visible: boolean;
    receiverData: any;
    onClose: () => void;
    user: any;
}

// In ChatDetailModal.tsx

// ... (imports remain the same)

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

    // Determine if current user is the sender or receiver
    const isCurrentUserSender = useCallback((message: any) => {
        return message.sender._id === user?._id;
    }, [user?._id]);

    useEffect(() => {
        // console.log("user", user);
        if (!user) return;

        let intervalId: NodeJS.Timeout;

        const initializeChat = async () => {
            setLoading(true);
            await fetchChatData();

            // Set up interval after fetchChatData completes
            intervalId = setInterval(() => {
                if (otherUser) {
                    fetchConversation();
                }
            }, 2000);
        };

        initializeChat();

        // Cleanup function to clear the interval when component unmounts
        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [user, otherUser]); // Add other
    // Get the other user in the conversation
    const getOtherUser = useCallback(() => {
        if (!receiverData?.participants) return null;
        const { sender, receiver } = receiverData.participants;
        return sender._id === user?._id ? receiver : sender;
    }, [receiverData?.participants, user?._id]);

    // Fetch conversation data
    const fetchChatData = useCallback(async () => {
        try {
            const otherUser = getOtherUser();
            setOtherUser(otherUser);

            if (receiverData?.messages) {
                const sortedMessages = [...receiverData.messages]
                setMessages(sortedMessages);
            }
        } catch (error) {
            console.error('Error fetching chat data:', error);
        } finally {
            setLoading(false);
        }
    }, [chatData, getOtherUser, user]);

    const fetchConversation = async () => {
        try {
            //@ts-ignore
            const conversation = await getConversation(user?._id, otherUser._id);
            setChatData(conversation[0]);
            setMessages([...conversation[0]?.messages]);
        } catch (error) {
            console.error('Error fetching conversation:', error);
        }
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !user?._id || !otherUser?._id) return;
        setNewMessage('');
        try {
            await sendMessage({
                sender: user._id,
                receiver: otherUser._id,
                content: newMessage.trim(),
                type: 'text'
            });

            fetchConversation();
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const renderMessage = ({ item }: { item: any }) => {
        const isOwnMessage = isCurrentUserSender(item);
        const messageDate = new Date(item.createdAt);
        const formattedTime = messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        return (
            <View style={[
                styles.messageContainer,
                isOwnMessage ? styles.ownMessage : styles.otherMessage
            ]}>
                {!isOwnMessage && (
                    <Image
                        source={{ uri: otherUser?.profileUrl }}
                        style={styles.messageAvatar}
                    />
                )}
                <View style={[
                    styles.messageBubble,
                    {
                        backgroundColor: isOwnMessage ? theme.primary : theme.surface,
                        borderColor: theme.border,
                    }
                ]}>
                    <Text style={[
                        styles.messageText,
                        { color: isOwnMessage ? '#FFFFFF' : theme.text }
                    ]}>
                        {item.content}
                    </Text>
                    <Text style={[
                        styles.messageTime,
                        {
                            color: isOwnMessage ? 'rgba(255,255,255,0.7)' : theme.textSecondary,
                            textAlign: isOwnMessage ? 'right' : 'left'
                        }
                    ]}>
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
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardAvoidingView}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
                >
                    {/* Header */}
                    <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
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

                    {/* Messages List */}
                    {messages?.length > 0 ? (
                        <FlatList
                            data={[...messages].reverse()}
                            keyExtractor={(item) => item._id}
                            renderItem={renderMessage}
                            contentContainerStyle={[styles.messagesList, { justifyContent: 'flex-end' }]}

                            inverted={true}
                            style={{ flexGrow: 1 }}
                            onEndReachedThreshold={0.5}
                            showsVerticalScrollIndicator={false}
                        />
                    ) : (
                        <View style={styles.noMessagesContainer}>
                            <Text style={[styles.noMessagesText, { color: theme.textSecondary }]}>
                                No messages yet
                            </Text>
                        </View>
                    )}
                    {/* Message Input */}
                    <View style={[styles.inputContainer, { backgroundColor: theme.surface, borderTopColor: theme.border }]}>
                        <TextInput
                            style={[styles.input, {
                                backgroundColor: theme.background,
                                color: theme.text,
                                borderColor: theme.border
                            }]}
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
                                {
                                    backgroundColor: theme.primary,
                                    opacity: 1
                                }
                            ]}
                            onPress={handleSendMessage}
                            disabled={!newMessage.trim()}
                        >
                            <Send size={20} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
    },
    backButton: {
        padding: 8,
        marginRight: 8,
    },
    headerUser: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
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
    avatarImage: {
        width: '100%',
        height: '100%',
    },
    avatarText: {
        color: Colors.primary[700],
        fontSize: Typography.size.lg,
        fontWeight: Typography.weight.bold as any,
    },
    headerUserInfo: {
        flex: 1,
    },
    headerName: {
        fontSize: 16,
        fontWeight: '600',
    },
    headerStatus: {
        fontSize: 12,
        marginTop: 2,
    },
    messagesList: {
        flexGrow: 1,
        padding: 16,
        justifyContent: 'flex-end',
    },
    messageContainer: {
        marginVertical: 4,
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    ownMessage: {
        justifyContent: 'flex-end',
    },
    otherMessage: {
        justifyContent: 'flex-start',
    },
    messageAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        marginRight: 8,
    },
    messageBubble: {
        maxWidth: '80%',
        padding: 12,
        borderRadius: 16,
        borderWidth: 1,
    },
    messageText: {
        fontSize: 16,
        lineHeight: 20,
    },
    messageTime: {
        fontSize: 12,
        marginTop: 4,
    },
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
    noMessagesContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noMessagesText: {
        fontSize: 16,
        color: Colors.gray[500],
    },
    sendButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
    },
});