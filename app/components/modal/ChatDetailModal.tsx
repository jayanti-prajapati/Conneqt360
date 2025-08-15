import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform, Modal, ActivityIndicator } from 'react-native';
import { ArrowLeft, Send, Phone, Video } from 'lucide-react-native';
import { useThemeStore } from '../../store/themeStore';
import { Message, User } from '../../types';
import useChatStore from '@/store/useChatStore';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import CustomVideoPlayer from '../utils/CustomVideoPlayer';
import { UserProfileModal } from './UserProfileModal';



interface ChatDetailModalProps {
    visible: boolean;
    receiverData: any;
    onClose: () => void;
    user: any;
}

interface TruncatedTextProps {
    text: string;
    maxLength: number;
    textStyle: any;
    seeMoreStyle: any;
}

const TruncatedText: React.FC<TruncatedTextProps> = ({ text, maxLength, textStyle, seeMoreStyle }) => {
    const [expanded, setExpanded] = useState(false);
    const shouldTruncate = text.length > maxLength;
    const displayText = expanded || !shouldTruncate
        ? text
        : `${text.substring(0, maxLength)}...`;

    return (
        <View >
            <Text style={textStyle}>
                {displayText}
            </Text>
            {shouldTruncate && (
                <TouchableOpacity
                    onPress={() => setExpanded(!expanded)}
                    style={styles.seeMoreButton}
                >
                    <Text style={seeMoreStyle}>
                        {expanded ? 'See Less' : 'See More'}
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

export const ChatDetailModal: React.FC<ChatDetailModalProps> = ({
    visible,
    receiverData,
    user,
    onClose,
}: ChatDetailModalProps) => {
    const { theme } = useThemeStore();
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [otherUser, setOtherUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [chatData, setChatData] = useState<any>(null);
    const [showUserProfile, setShowUserProfile] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
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
            await fetchChatData();
            setLoading(true);


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

    const groupMessagesByDate = (messages: any[]) => {
        const grouped: { [key: string]: any[] } = {};

        messages.forEach(message => {
            const messageDate = new Date(message.createdAt);
            const today = new Date();
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);

            let dateKey;
            if (messageDate.toDateString() === today.toDateString()) {
                dateKey = 'Today';
            } else if (messageDate.toDateString() === yesterday.toDateString()) {
                dateKey = 'Yesterday';
            } else {
                dateKey = messageDate.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
            }

            if (!grouped[dateKey]) {
                grouped[dateKey] = [];
            }
            grouped[dateKey].push(message);
        });

        return Object.entries(grouped).map(([date, messages]) => ({
            date,
            messages
        }));
    };


    const fetchConversation = async () => {
        // if (!user?._id || !otherUser?._id) return;
        // setLoading(true);
        try {
            //@ts-ignore
            const conversation = await getConversation(user._id, otherUser._id);
            const groupedMessages = groupMessagesByDate(conversation[0]?.messages || []);
            setMessages(groupedMessages);
        } catch (error) {
            console.error('Error fetching conversation:', error);
        } finally {
            setLoading(false);
            setInitialLoading(false);
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

    const formatMessageTime = (date: Date) => {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        const isToday = date.toDateString() === today.toDateString();
        const isYesterday = date.toDateString() === yesterday.toDateString();

        const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        if (isToday) return `Today, ${timeString}`;
        if (isYesterday) return `Yesterday, ${timeString}`;

        const dateString = date.toLocaleDateString([], { day: 'numeric', month: 'short' });
        return `${dateString}, ${timeString}`;
    };

    const renderDateHeader = (date: string) => (
        <View style={styles.dateHeaderContainer}>
            <View style={[styles.dateHeader, { backgroundColor: theme.border }]}>
                <Text style={[styles.dateHeaderText, { color: theme.text }]}>{date}</Text>
            </View>
        </View>
    );

    const renderMessage = ({ item }: { item: any }) => {
        if (item.date) {
            return renderDateHeader(item.date);
        }

        const isOwnMessage = isCurrentUserSender(item);
        const messageDate = new Date(item.createdAt);
        const formattedTime = messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        return (
            <View key={item._id}>


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
                            backgroundColor: isOwnMessage ? Colors.gray[700] : theme.surface,
                            borderColor: theme.border,
                        }
                    ]}>
                        {
                            (() => {
                                try {
                                    const messageData = JSON.parse(item.content);
                                    if (messageData.type === 'post_share') {
                                        return (
                                            <View style={styles.postShareContainer}>
                                                <Text style={[styles.postShareHeader, { color: isOwnMessage ? '#FFFFFF' : theme.primary }]}>
                                                    Shared Post from {messageData.username}
                                                </Text>
                                                {messageData.content && (
                                                    <TruncatedText
                                                        text={messageData.content}
                                                        maxLength={200}
                                                        textStyle={[styles.messageText, { color: isOwnMessage ? '#FFFFFF' : theme.text }]}
                                                        seeMoreStyle={[styles.seeMoreText, { color: isOwnMessage ? 'rgba(255,255,255,0.8)' : theme.primary }]}
                                                    />
                                                )}
                                                {messageData.imageUrl && (
                                                    <Image
                                                        source={{ uri: messageData.imageUrl }}
                                                        style={styles.postShareImage}
                                                        resizeMode="cover"
                                                    />
                                                )}

                                                {
                                                    messageData?.videoUrl && (
                                                        <CustomVideoPlayer
                                                            videoUrl={messageData.videoUrl}
                                                            isVisible={true}
                                                        />
                                                    )
                                                }
                                            </View>
                                        );
                                    }
                                } catch (e) {
                                    // If parsing fails, fall back to regular text
                                    // console.log("e", e);
                                    return (
                                        <TruncatedText
                                            text={item.content}
                                            maxLength={200}
                                            textStyle={[styles.messageText, { color: isOwnMessage ? '#FFFFFF' : theme.text }]}
                                            seeMoreStyle={[styles.seeMoreText, { color: isOwnMessage ? 'rgba(255,255,255,0.8)' : theme.primary }]}
                                        />
                                    );
                                }
                                // Default fallback
                                return (
                                    <TruncatedText
                                        text={item.content}
                                        maxLength={200}
                                        textStyle={[styles.messageText, { color: isOwnMessage ? '#FFFFFF' : theme.text }]}
                                        seeMoreStyle={[styles.seeMoreText, { color: isOwnMessage ? 'rgba(255,255,255,0.8)' : theme.primary }]}
                                    />
                                );
                            })()
                            // ) : (
                            //     <Text style={[
                            //         styles.messageText,
                            //         { color: isOwnMessage ? '#FFFFFF' : theme.text }
                            //     ]}>
                            //         {item.content}
                            //     </Text>
                            // )}
                        }
                        <View style={styles.messageTimeContainer}>
                            <Text style={[
                                styles.messageTime,
                                {
                                    color: isOwnMessage ? 'rgba(255,255,255,0.7)' : theme.textSecondary,
                                }
                            ]}>
                                {formattedTime}
                            </Text>
                            {/* {isOwnMessage && (
                                <View style={styles.statusIcon}>
                                    <Text style={{ color: isOwnMessage ? 'rgba(255,255,255,0.7)' : theme.textSecondary }}>✓✓</Text>
                                </View>
                            )} */}
                        </View>
                    </View>
                </View>
            </View>
        );
    };

    const renderItem = ({ item }: { item: any }) => {
        if (item.date) {
            return renderDateHeader(item.date);
        }
        return renderMessage({ item });
    };

    const getMessageItems = () => {
        if (!messages || !Array.isArray(messages)) return [];

        return messages.flatMap((group, groupIndex) => {
            if (!group?.date || !Array.isArray(group.messages)) return [];

            const dateItem = { type: 'date', id: `date-${group.date}-${groupIndex}`, date: group.date };
            const messageItems = group.messages.map((message: any, index: number) => ({
                ...message,
                type: 'message',
                id: message._id || `msg-${group.date}-${index}`
            }));

            return [dateItem, ...messageItems];
        });
    };



    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={false}
            onRequestClose={onClose}
        >
            {initialLoading ? (
                <View style={[styles.loaderContainer, { backgroundColor: theme.background }]}>
                    <ActivityIndicator size="large" color={theme.primary} />
                    <Text style={[styles.loadingText, { color: theme.text }]}>
                        Loading chat...
                    </Text>
                </View>
            ) : (
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
                                <TouchableOpacity style={styles.headerUser} onPress={() => setShowUserProfile(true)}>
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
                                        {otherUser.isOnline && <View style={[styles.onlineIndicator, { backgroundColor: theme.success }]} />}

                                    </View>
                                    <View style={styles.headerUserInfo}>
                                        <Text style={[styles.headerName, { color: theme.text }]}>
                                            {otherUser.name || 'Unknown User'}
                                        </Text>
                                        <Text style={[styles.headerStatus, { color: theme.textSecondary }]}>
                                            {otherUser.isOnline ? 'Online' : 'Offline'}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            )}
                        </View>

                        {/* Messages List */}
                        {messages?.length > 0 ? (
                            <FlatList
                                data={getMessageItems().reverse()}
                                renderItem={renderItem}
                                keyExtractor={(item) => item._id}
                                contentContainerStyle={styles.messagesList}
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
                                        backgroundColor: Colors.gray[700],
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
                </View>)}

            {showUserProfile && (
                <UserProfileModal visible={showUserProfile} onClose={() => setShowUserProfile(false)} userId={otherUser?._id} />
            )}
        </Modal>
    );
};

const styles = StyleSheet.create({
    postShareContainer: {
        padding: 10,
        borderRadius: 8,
        maxWidth: '100%',
    },
    postShareHeader: {
        fontWeight: 'bold',
        marginBottom: 5,
        fontSize: 14,
        opacity: 0.9,
    },
    postShareImage: {
        width: '100%',
        height: 150,
        borderRadius: 8,
        marginTop: 8,
    },
    seeMoreButton: {
        marginTop: 4,
        alignSelf: 'flex-start',
    },
    seeMoreText: {
        fontSize: 14,
        fontWeight: '500',
    },
    container: {
        flex: 1,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    onlineIndicator: {
        position: 'absolute',
        bottom: -4,
        right: -4,
        width: 16,
        height: 16,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#FFFFFF',
        zIndex: 1,
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
        position: 'relative',
        overflow: 'visible',
    },
    avatarImage: {
        width: '100%',
        height: '100%',
        borderRadius: 20,
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
        padding: 16,
        paddingBottom: 80,
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
        fontSize: 14,
        lineHeight: 20,
    },
    messageTime: {
        fontSize: 11,
        marginTop: 2,
    },
    dateHeaderContainer: {
        alignItems: 'center',
        marginVertical: 10,
    },
    dateHeader: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 10,
        backgroundColor: 'rgba(0,0,0,0.1)',
    },
    dateHeaderText: {
        fontSize: 12,
        opacity: 0.8,
    },
    messageTimeContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginTop: 2,
    },
    statusIcon: {
        marginLeft: 4,
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
    loadingText: {
        fontSize: 16,
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