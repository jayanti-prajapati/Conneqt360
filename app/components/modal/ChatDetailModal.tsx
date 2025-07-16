import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform, Modal } from 'react-native';
import { ArrowLeft, Send, Phone, Video } from 'lucide-react-native';
import { useThemeStore } from '../../store/themeStore';
import { Message, User } from '../../types';
import useChatStore from '@/store/useChatStore';
import { combineChatsByParticipants } from '@/app/(tabs)/chats';



interface ChatDetailModalProps {
    visible: boolean;
    chatData: any;
    onClose: () => void;
    user: any;
}

export const ChatDetailModal: React.FC<ChatDetailModalProps> = ({
    visible,
    chatData,
    onClose,
    user,
}) => {
    const { theme } = useThemeStore();
    // const { user } = useAuthStore();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [otherUser, setOtherUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const { sendMessage, getConversation } = useChatStore();


    // console.log("sadsadsadasd", messages);

    useEffect(() => {
        if (chatData && visible) {
            fetchChatData();
        }
    }, [chatData, visible]);


    const fetchConversation = async () => {
        try {
            //@ts-ignore
            const conversation = await getConversation(user?._id, otherUser._id);
            const newMessage = combineChatsByParticipants(conversation);

            setMessages([...newMessage[0]?.messages]);
        } catch (error) {
            console.error('Error fetching conversation:', error);
        }
    };

    const fetchChatData = async () => {
        try {
            setOtherUser(chatData?.participants?.receiver);
            setMessages(chatData?.messages || []);
        } catch (error) {
            console.error('Error fetching chat data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !user || !otherUser) return;


        setNewMessage('');

        try {
            await sendMessage({ sender: user?._id, receiver: otherUser._id, content: newMessage.trim(), type: 'text' });
            fetchConversation();


        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const renderMessage = ({ item }: { item: any }) => {
        const isOwnMessage = item.sender._id === user?._id;

        return (
            <View style={[styles.messageContainer, isOwnMessage ? styles.ownMessage : styles.otherMessage]}>
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
                        { color: isOwnMessage ? 'rgba(255,255,255,0.7)' : theme.textSecondary }
                    ]}>
                        {formatTime(new Date(item.createdAt || Date.now()))}
                    </Text>
                </View>
            </View>
        );
    };

    if (!otherUser && !loading) {
        return null;
    }

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={false}
            presentationStyle="pageSheet"
            onRequestClose={onClose}
        >
            <View style={[styles.container, { backgroundColor: theme.background }]}>
                <KeyboardAvoidingView
                    style={styles.container}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                >
                    {/* Header */}
                    <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
                        <TouchableOpacity onPress={onClose}>
                            <ArrowLeft size={24} color={theme.text} />
                        </TouchableOpacity>

                        {otherUser && (
                            <View style={styles.headerUser}>
                                <Image
                                    source={{ uri: otherUser.profileUrl || 'https://via.placeholder.com/40' }}
                                    style={styles.headerAvatar}
                                />
                                <View style={styles.headerUserInfo}>
                                    <Text style={[styles.headerName, { color: theme.text }]}>{otherUser.name}</Text>
                                    <Text style={[styles.headerStatus, { color: theme.textSecondary }]}>
                                        {otherUser.isOnline ? 'Online' : 'Last seen recently'}
                                    </Text>
                                </View>
                            </View>
                        )}

                        <View style={styles.headerActions}>
                            <TouchableOpacity style={styles.headerAction}>
                                <Phone size={20} color={theme.primary} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.headerAction}>
                                <Video size={20} color={theme.primary} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Messages */}
                    {loading ? (
                        <View style={styles.loadingContainer}>
                            <Text style={[styles.loadingText, { color: theme.text }]}>Loading chat...</Text>
                        </View>
                    ) : (
                        <FlatList
                            data={messages}
                            keyExtractor={(item) => item?._id || ''}
                            renderItem={renderMessage}
                            style={styles.messagesList}
                            contentContainerStyle={styles.messagesContent}
                            showsVerticalScrollIndicator={false}
                            inverted
                        />
                    )}

                    {/* Input */}
                    <View style={[styles.inputContainer, { backgroundColor: theme.surface, borderTopColor: theme.border }]}>
                        <TextInput
                            style={[styles.input, { backgroundColor: theme.background, color: theme.text, borderColor: theme.border }]}
                            placeholder="Type a message..."
                            placeholderTextColor={theme.textSecondary}
                            value={newMessage}
                            onChangeText={setNewMessage}
                            multiline
                            maxLength={1000}
                        />
                        <TouchableOpacity
                            style={[styles.sendButton, { backgroundColor: theme.primary }]}
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        gap: 12,
    },
    headerUser: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    headerAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
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
    headerActions: {
        flexDirection: 'row',
        gap: 8,
    },
    headerAction: {
        padding: 8,
    },
    messagesList: {
        flex: 1,
    },
    messagesContent: {
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    messageContainer: {
        marginVertical: 4,
        maxWidth: '80%',
    },
    ownMessage: {
        alignSelf: 'flex-end',
    },
    otherMessage: {
        alignSelf: 'flex-start',
    },
    messageBubble: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 18,
        borderWidth: 1,
    },
    messageText: {
        fontSize: 16,
        lineHeight: 20,
        marginBottom: 4,
    },
    messageTime: {
        fontSize: 12,
        textAlign: 'right',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderTopWidth: 1,
        gap: 12,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        maxHeight: 100,
    },
    sendButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 16,
    },
});