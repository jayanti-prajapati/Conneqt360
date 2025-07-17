import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, StyleSheet,
  TouchableOpacity, Image, TextInput
} from 'react-native';
import { MessageCircle, Plus, Search, Send, X } from 'lucide-react-native';

import { useThemeStore } from '../../store/themeStore';

import { ChatDetailModal } from '../../components/modal/ChatDetailModal';
import { User } from '../../types';
import useUsersStore from '@/store/useUsersStore';
import { getAuthData } from '@/services/secureStore';
import useChatStore from '@/store/useChatStore';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';

const placeholderImage = 'https://via.placeholder.com/50';

// Mock users list


export function combineChatsByParticipants(messages: any[]) {
  const conversationMap = new Map<string, {
    participants: { sender: any; receiver: any };
    messages: any[];
  }>();

  messages.forEach((msg) => {
    // Create a unique key for this conversation, ignoring direction
    const key = [msg.sender._id, msg.receiver._id].sort().join('_');

    if (!conversationMap.has(key)) {
      conversationMap.set(key, {
        participants: {
          sender: msg.sender,
          receiver: msg.receiver,
        },
        messages: [],
      });
    }

    // Push this message to the array
    conversationMap.get(key)!.messages.push(msg);
  });

  // Convert Map to array
  const combinedConversations = Array.from(conversationMap.values());

  // Sort messages in each conversation by createdAt (optional)
  combinedConversations.forEach((conversation) => {
    conversation.messages.sort((a, b) => {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });
  });

  return combinedConversations;
}

export default function ChatScreen() {
  const { theme } = useThemeStore();
  // const { user } = useAuthStore();
  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [showNewChat, setShowNewChat] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [showChatModal, setShowChatModal] = useState(false);
  const [selectedChatUserId, setSelectedChatUserId] = useState<string | null>(null);
  const { getAllUsers, clearUsers, response } = useUsersStore();
  const { getChatsBySenderUserId, response: chatResponse, sendMessage } = useChatStore();
  const allUsers = response?.data;

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (user?._id) {
        fetchChats();
      }
    }, 2000);

    // Cleanup function to clear the interval when component unmounts


    return () => clearInterval(interval);
  }, [user]);
  const fetchChats = async () => {
    try {
      // setLoading(true);
      if (user) {
        const userChats = await getChatsBySenderUserId(user._id);
        // console.log(combineChatsByParticipants(userChats || []), "userChats")
        const sortedChats = [...(userChats || [])].sort((a, b) => {
          // Get the latest message time for chat a
          const aMessages = a.messages || [];
          const aLatestMessage = aMessages.length > 0
            ? new Date(aMessages[aMessages.length - 1].createdAt).getTime()
            : new Date(a.updatedAt || 0).getTime();

          // Get the latest message time for chat b
          const bMessages = b.messages || [];
          const bLatestMessage = bMessages.length > 0
            ? new Date(bMessages[bMessages.length - 1].createdAt).getTime()
            : new Date(b.updatedAt || 0).getTime();

          return bLatestMessage - aLatestMessage; // Sort in descending order
        });

        setChats(sortedChats);
      }
    } catch (error) {
      console.error('Error fetching chats:', error);
    } finally {
      setLoading(false);
    }
  };
  const fetchUsers = async () => {
    try {

      const userData = await getAuthData();
      setUser(userData?.userData?.data)
      fetchChats();
    } catch (error) {
      console.error('Error fetching chats:', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (searchQuery?.length > 0) {
      getAllUsers(searchQuery);
    } else {
      clearUsers();
    }
  }, [searchQuery]);


  const startNewChat = async (targetUser: User) => {
    if (!user || !newMessage.trim()) return;

    try {
      await sendMessage({ sender: user._id, receiver: targetUser._id, content: newMessage.trim(), type: 'text' });
      setNewMessage('');
      setSelectedUser(null);
      setShowNewChat(false);
      fetchChats();

      setSelectedChatUserId(targetUser._id);
      setShowChatModal(true);
    } catch (error) {
      console.error('Error starting chat:', error);
    }
  };

  // const getOtherUser = (chat: any): User | undefined => {
  //   const otherUserId = chat?.participants?.receiver?._id != user?._id ? chat?.receiver : null;
  //   // console.log(otherUserId, "otherUserId")
  //   if (!otherUserId) {
  //     return undefined;
  //   }

  //   return otherUserId;
  // };

  const getOtherUser = (chat: any): User | undefined => {
    if (!chat?.participants) return undefined;

    const { sender, receiver } = chat.participants;
    // Return the participant who is not the current user
    return sender?._id === user?._id ? receiver : sender;
  };

  // console.log(chats, "chats")
  const formatTime = (date?: string | Date) => {
    if (!date) return '';
    const time = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diff = now.getTime() - time.getTime();
    const hours = diff ? Math.floor(diff / (1000 * 60 * 60)) : 0;
    const minutes = diff ? Math.floor(diff / (1000 * 60)) : 0;

    if (hours > 24) return time.toLocaleDateString();
    else if (hours > 0) return `${hours}h ago`;
    else if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const renderChatItem = ({ item }: { item: any }) => {
    const otherUser = getOtherUser(item);
    // const lastMessage = item.lastMessage || {};

    if (!otherUser) return null;

    return (
      <TouchableOpacity
        style={[styles.chatItem, { backgroundColor: theme.background, borderColor: theme.border }]}
        onPress={() => {
          setSelectedChatUserId(item);
          setShowChatModal(true);
        }}
      >
        <View style={styles.avatarContainer}>
          {otherUser?.profileUrl ? <Image
            source={{ uri: otherUser.profileUrl || placeholderImage }}
            style={styles.chatAvatar}
          /> :
            <Text style={styles.avatarText}>{otherUser?.name?.charAt(0)?.toUpperCase() || "U"}</Text>}
          {otherUser?.isOnline && <View style={[styles.onlineIndicator, { backgroundColor: theme.success }]} />}
        </View>

        <View style={styles.chatContent}>
          <View style={styles.chatHeader}>
            <Text style={[styles.chatName, { color: theme.text }]}>{otherUser.name}</Text>
            <Text style={[styles.timestamp, { color: theme.textSecondary }]}>
              {item.messages[item.messages.length - 1].createdAt ? formatTime(new Date(item.messages[item.messages.length - 1].createdAt)) : '-'}
            </Text>
          </View>

          <Text style={[styles.lastMessage, { color: theme.textSecondary }]} numberOfLines={1}>
            {item.participants.sender._id === user?._id ? 'You: ' : ''}
            {item.messages[item.messages.length - 1].content || ''}
          </Text>
        </View>

        {/* {!lastMessage.isRead && lastMessage.senderId !== user?._id && (
          <View style={[styles.unreadDot, { backgroundColor: theme.primary }]} />
        )} */}
      </TouchableOpacity>
    );
  };

  // const filteredUsers = availableUsers.filter(u =>
  //   u._id !== user?._id &&
  //   u.name.toLowerCase().includes(searchQuery.toLowerCase())
  // );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Messages</Text>
        {!showNewChat ? <TouchableOpacity
          style={[styles.newChatButton, { backgroundColor: theme.primary }]}
          onPress={() => setShowNewChat(true)}
        >
          <Plus size={24} color="#FFFFFF" />
        </TouchableOpacity> :
          <TouchableOpacity
            style={[styles.newChatButton, { backgroundColor: theme.primary }]}
            onPress={() => setShowNewChat(false)}
          >
            <X size={24} color="#FFFFFF" />
          </TouchableOpacity>

        }
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: theme.text }]}>Loading chats...</Text>
        </View>
      ) : showNewChat ? (
        <>
          <View style={[styles.searchContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Search size={20} color={theme.textSecondary} />
            <TextInput
              style={[styles.searchInput, { color: theme.text }]}
              placeholder="Search users..."
              placeholderTextColor={theme.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          {selectedUser ? (
            <View style={styles.newChatContainer}>
              <View style={[styles.selectedUser, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <Image
                  source={{ uri: selectedUser.profileUrl || placeholderImage }}
                  style={styles.chatAvatar}
                />
                <Text style={[styles.selectedUserName, { color: theme.text }]}>
                  {selectedUser.name}
                </Text>
              </View>
              <View style={[styles.messageInputContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <TextInput
                  style={[styles.messageInput, { color: theme.text }]}
                  placeholder="Type your message..."
                  placeholderTextColor={theme.textSecondary}
                  value={newMessage}
                  onChangeText={setNewMessage}
                  multiline
                />
                <TouchableOpacity
                  style={[styles.sendButton, { backgroundColor: theme.primary }]}
                  onPress={() => startNewChat(selectedUser)}
                  disabled={!newMessage.trim()}
                >
                  <Send size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <FlatList
              data={allUsers}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.userItem, { backgroundColor: theme.surface, borderColor: theme.border }]}
                  onPress={() => setSelectedUser(item)}
                >
                  <Image
                    source={{ uri: item.profileUrl || placeholderImage }}
                    style={styles.chatAvatar}
                  />
                  <View style={styles.userInfo}>
                    <Text style={[styles.userName, { color: theme.text }]}>{item.name}</Text>
                    <Text style={[styles.useraboutUs, { color: theme.textSecondary }]} numberOfLines={1}>
                      @{item.username}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
              contentContainerStyle={styles.usersList}
              showsVerticalScrollIndicator={false}
            />
          )}
        </>
      ) : chats.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MessageCircle size={64} color={theme.textSecondary} />
          <Text style={[styles.emptyTitle, { color: theme.text }]}>No messages yet</Text>
          <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
            Start a conversation with someone from the community
          </Text>
          <TouchableOpacity
            style={[styles.startChatButton, { backgroundColor: theme.primary }]}
            onPress={() => setShowNewChat(true)}
          >
            <Text style={styles.startChatText}>Start New Chat</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={chats}
          keyExtractor={(item) => item.participants.sender._id + item.participants.receiver._id}
          renderItem={renderChatItem}
          contentContainerStyle={styles.chatsList}
          showsVerticalScrollIndicator={false}
        />
      )}

      {showChatModal && <ChatDetailModal
        visible={showChatModal}
        receiverData={selectedChatUserId}
        user={user}
        onClose={() => {
          setShowChatModal(false);
          setSelectedChatUserId(null);
        }}
      />}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  backButton: {
    fontSize: 16,
    fontWeight: '600',
  },
  newChatButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 16,
    // paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 12,
  },
  chatsList: {
    paddingVertical: 8,
  },
  avatarText: {
    color: Colors.primary[700],
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.bold as any,
  },
  usersList: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  chatAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  chatContent: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  chatName: {
    fontSize: 16,
    fontWeight: '600',
  },
  timestamp: {
    fontSize: 12,
  },
  lastMessage: {
    fontSize: 14,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  useraboutUs: {
    fontSize: 14,
  },
  newChatContainer: {
    flex: 1,
    padding: 16,
  },
  selectedUser: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  selectedUserName: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
  messageInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  messageInput: {
    flex: 1,
    fontSize: 16,
    maxHeight: 100,
    minHeight: 40,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  startChatButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  startChatText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
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