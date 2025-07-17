import React, { useState, useEffect, useCallback } from 'react';
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

// ✅ Utility to combine chats
export function combineChatsByParticipants(messages: any[]) {
  const conversationMap = new Map<string, {
    participants: { sender: any; receiver: any };
    messages: any[];
  }>();

  messages.forEach((msg) => {
    const key = [msg.sender._id, msg.receiver._id].sort().join('_');
    if (!conversationMap.has(key)) {
      conversationMap.set(key, { participants: { sender: msg.sender, receiver: msg.receiver }, messages: [] });
    }
    conversationMap.get(key)!.messages.push(msg);
  });

  return Array.from(conversationMap.values()).map(convo => {
    convo.messages.sort((a, b) =>
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
    return convo;
  });
}

export default function ChatScreen() {
  const { theme } = useThemeStore();
  const [chats, setChats] = useState<any[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [showNewChat, setShowNewChat] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [showChatModal, setShowChatModal] = useState(false);
  const [selectedChatUserId, setSelectedChatUserId] = useState<any>(null);

  const { getAllUsers, clearUsers, response: usersResponse } = useUsersStore();
  const { getChatsBySenderUserId, sendMessage, getConversation } = useChatStore();
  const allUsers = usersResponse?.data || [];

  // 🔹 Fetch chats
  const fetchChats = useCallback(async (showLoader: boolean = false) => {
    try {
      if (showLoader) setInitialLoading(true);
      if (!user?._id) return;

      const userChats = await getChatsBySenderUserId(user._id);
      const sortedChats = [...(userChats || [])].sort((a, b) => {
        const aLast = a.messages[a.messages.length - 1]?.createdAt || a.updatedAt || 0;
        const bLast = b.messages[b.messages.length - 1]?.createdAt || b.updatedAt || 0;
        return new Date(bLast).getTime() - new Date(aLast).getTime();
      });
      setChats(sortedChats);
    } catch (error) {
      console.error('Error fetching chats:', error);
    } finally {
      if (showLoader) setInitialLoading(false);
    }
  }, [user, getChatsBySenderUserId]);

  // 🔹 Fetch user then chats initially
  const fetchUsers = async () => {
    try {
      const userData = await getAuthData();
      setUser(userData?.userData?.data || null);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (user?._id) {
      // First time loader
      fetchChats(true);

      // Interval updates without loader
      const interval = setInterval(() => {
        fetchChats(false);
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [user, fetchChats]);

  // 🔹 Handle search
  useEffect(() => {
    if (searchQuery.length > 0) {
      getAllUsers(searchQuery);
    } else {
      clearUsers();
    }
  }, [searchQuery]);

  const startNewChat = async (targetUser: User) => {
    if (!user || !newMessage.trim()) return;
    try {
      await sendMessage({
        sender: user._id,
        receiver: targetUser._id,
        content: newMessage.trim(),
        type: 'text'
      });
      setNewMessage('');
      setSelectedUser(null);
      setShowNewChat(false);

      const conversation = await getConversation(user?._id, targetUser._id);
      fetchChats(false); // refresh without loader
      setSelectedChatUserId(conversation[0]);
      setShowChatModal(true); ``
    } catch (error) {
      console.error('Error starting chat:', error);
    }
  };

  const getOtherUser = (chat: any): User | undefined => {
    const { sender, receiver } = chat.participants;
    return sender?._id === user?._id ? receiver : sender;
  };

  const formatTime = (date?: string | Date) => {
    if (!date) return '';
    const time = typeof date === 'string' ? new Date(date) : date;
    const diff = Date.now() - time.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (hours > 24) return time.toLocaleDateString();
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const renderChatItem = ({ item }: { item: any }) => {
    const otherUser = getOtherUser(item);
    if (!otherUser) return null;
    const lastMessage = item.messages[item.messages.length - 1];

    return (
      <TouchableOpacity
        style={[styles.chatItem, { backgroundColor: theme.background, borderColor: theme.border }]}
        onPress={() => {
          setSelectedChatUserId(item);
          setShowChatModal(true);
        }}
      >
        <View style={styles.avatarContainer}>
          {otherUser.profileUrl ? (
            <Image source={{ uri: otherUser.profileUrl }} style={styles.chatAvatar} />
          ) : (
            <Text style={styles.avatarText}>
              {otherUser.name?.charAt(0)?.toUpperCase() || 'U'}
            </Text>
          )}
        </View>

        <View style={styles.chatContent}>
          <View style={styles.chatHeader}>
            <Text style={[styles.chatName, { color: theme.text }]}>{otherUser.name}</Text>
            <Text style={[styles.timestamp, { color: theme.textSecondary }]}>
              {lastMessage?.createdAt ? formatTime(lastMessage.createdAt) : '-'}
            </Text>
          </View>
          <Text style={[styles.lastMessage, { color: theme.textSecondary }]} numberOfLines={1}>
            {lastMessage?.sender?._id === user?._id ? 'You: ' : ''}
            {lastMessage?.content || ''}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Messages</Text>
        <TouchableOpacity
          style={[styles.newChatButton, { backgroundColor: theme.primary }]}
          onPress={() => setShowNewChat(prev => !prev)}
        >
          {showNewChat ? <X size={24} color="#fff" /> : <Plus size={24} color="#fff" />}
        </TouchableOpacity>
      </View>

      {/* Loader only on initial fetch */}
      {initialLoading ? (
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: theme.text }]}>Loading chats...</Text>
        </View>
      ) : showNewChat ? (
        <>
          {/* Search bar */}
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

          {/* Selected user for new chat */}
          {selectedUser ? (
            <View style={styles.newChatContainer}>
              <View style={[styles.selectedUser, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <Image source={{ uri: selectedUser.profileUrl || placeholderImage }} style={styles.chatAvatar} />
                <Text style={[styles.selectedUserName, { color: theme.text }]}>{selectedUser.name}</Text>
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
              keyExtractor={item => item._id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.userItem, { backgroundColor: theme.surface, borderColor: theme.border }]}
                  onPress={() => setSelectedUser(item)}
                >
                  <Image source={{ uri: item.profileUrl || placeholderImage }} style={styles.chatAvatar} />
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
          keyExtractor={item => item.participants.sender._id + item.participants.receiver._id}
          renderItem={renderChatItem}
          contentContainerStyle={styles.chatsList}
          showsVerticalScrollIndicator={false}
        />
      )}

      {showChatModal && (
        <ChatDetailModal
          visible={showChatModal}
          receiverData={selectedChatUserId}
          user={user}
          onClose={() => {
            setShowChatModal(false);
            setSelectedChatUserId(null);
          }}
        />
      )}
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