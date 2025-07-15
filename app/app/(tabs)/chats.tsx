import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, StyleSheet,
  TouchableOpacity, Image, TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MessageCircle, Plus, Search, Send } from 'lucide-react-native';

import { useThemeStore } from '../../store/themeStore';
import { useAuthStore } from '../../services/demoStore';
import { chatService } from '../../services/charService';
import { ChatDetailModal } from '../../components/modal/ChatDetailModal';
import { Chat, User } from '../../types';

const placeholderImage = 'https://via.placeholder.com/50';

// Mock users list
const availableUsers: User[] = [
  {
    _id: 'user456',
    email: 'sarah@company.com',
    name: 'Sarah Johnson',
    profileUrl: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
    aboutUs: 'Marketing Director',
    followersCount: 890,
    followingCount: 650,
    postsCount: 32,
    isOnline: true,
    lastSeen: new Date(),
    createdAt: new Date('2023-02-20'),
  },
  {
    _id: 'user789',
    email: 'mike@startup.com',
    name: 'Mike Chen',
    profileUrl: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg',
    aboutUs: 'Tech Entrepreneur',
    followersCount: 2100,
    followingCount: 450,
    postsCount: 67,
    isOnline: false,
    lastSeen: new Date(Date.now() - 3600000),
    createdAt: new Date('2022-11-10'),
  },
  {
    _id: 'user101',
    email: 'alex@agency.com',
    name: 'Alex Rivera',
    profileUrl: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
    aboutUs: 'Creative Director',
    followersCount: 1500,
    followingCount: 780,
    postsCount: 89,
    isOnline: true,
    lastSeen: new Date(),
    createdAt: new Date('2023-03-10'),
  },
];

export default function ChatScreen() {
  const { theme } = useThemeStore();
  const { user } = useAuthStore();
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewChat, setShowNewChat] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [showChatModal, setShowChatModal] = useState(false);
  const [selectedChatUserId, setSelectedChatUserId] = useState<string | null>(null);

  useEffect(() => {
    if (user) fetchChats();
  }, [user]);

  const fetchChats = async () => {
    try {
      if (user) {
        const userChats = await chatService.getUserChats(user._id);
        setChats(userChats || []);
      }
    } catch (error) {
      console.error('Error fetching chats:', error);
    } finally {
      setLoading(false);
    }
  };

  const startNewChat = async (targetUser: User) => {
    if (!user || !newMessage.trim()) return;

    try {
      await chatService.createChat([user._id, targetUser._id], newMessage, user._id);
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

  const getOtherUser = (chat: Chat): User | undefined => {
    const otherUserId = chat?.participants?.find(p => p !== user?._id);
    return availableUsers.find(u => u._id === otherUserId);
  };

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

  const renderChatItem = ({ item }: { item: Chat }) => {
    const otherUser = getOtherUser(item);
    const lastMessage = item.lastMessage || {};

    if (!otherUser) return null;

    return (
      <TouchableOpacity
        style={[styles.chatItem, { backgroundColor: theme.background, borderColor: theme.border }]}
        onPress={() => {
          setSelectedChatUserId(otherUser._id);
          setShowChatModal(true);
        }}
      >
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: otherUser.profileUrl || placeholderImage }}
            style={styles.chatAvatar}
          />
          {otherUser.isOnline && <View style={[styles.onlineIndicator, { backgroundColor: theme.success }]} />}
        </View>

        <View style={styles.chatContent}>
          <View style={styles.chatHeader}>
            <Text style={[styles.chatName, { color: theme.text }]}>{otherUser.name}</Text>
            <Text style={[styles.timestamp, { color: theme.textSecondary }]}>
              {lastMessage.createdAt ? formatTime(new Date(lastMessage.createdAt)) : '-'}
            </Text>
          </View>

          <Text style={[styles.lastMessage, { color: theme.textSecondary }]} numberOfLines={1}>
            {lastMessage.senderId === user?._id ? 'You: ' : ''}
            {lastMessage.content || ''}
          </Text>
        </View>

        {!lastMessage.isRead && lastMessage.senderId !== user?._id && (
          <View style={[styles.unreadDot, { backgroundColor: theme.primary }]} />
        )}
      </TouchableOpacity>
    );
  };

  const filteredUsers = availableUsers.filter(u =>
    u._id !== user?._id &&
    u.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Messages</Text>
        <TouchableOpacity
          style={[styles.newChatButton, { backgroundColor: theme.primary }]}
          onPress={() => setShowNewChat(true)}
        >
          <Plus size={24} color="#FFFFFF" />
        </TouchableOpacity>
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
              data={filteredUsers}
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
                      {item.aboutUs}
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
          keyExtractor={(item) => item.id}
          renderItem={renderChatItem}
          contentContainerStyle={styles.chatsList}
          showsVerticalScrollIndicator={false}
        />
      )}

      {showChatModal && <ChatDetailModal
        visible={showChatModal}
        userId={selectedChatUserId}
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
    paddingVertical: 12,
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
    position: 'relative',
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