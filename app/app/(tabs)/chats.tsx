import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeStore } from '../../store/themeStore';
import { useAuthStore } from '../../services/demoStore';
import { MessageCircle, Plus, Search, Send } from 'lucide-react-native';
import { Chat, User } from '../../types';
import { chatService } from '../../services/charService';
import { ChatDetailModal } from '../../components/modal/ChatDetailModal';
import Input from '@/components/ui-components/Input';
import Layout from '@/components/common/Layout';

// Mock users for starting new chats
const availableUsers: User[] = [
  {
    id: 'user456',
    email: 'sarah@company.com',
    name: 'Sarah Johnson',
    profileUrl:
      'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    aboutUs: 'Marketing Director',
    followersCount: 890,
    followingCount: 650,
    postsCount: 32,
    isOnline: true,
    lastSeen: new Date(),
    createdAt: new Date('2023-02-20'),
  },
  {
    id: 'user789',
    email: 'mike@startup.com',
    name: 'Mike Chen',
    profileUrl:
      'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    aboutUs: 'Tech Entrepreneur',
    followersCount: 2100,
    followingCount: 450,
    postsCount: 67,
    isOnline: false,
    lastSeen: new Date(Date.now() - 3600000),
    createdAt: new Date('2022-11-10'),
  },
  {
    id: 'user101',
    email: 'alex@agency.com',
    name: 'Alex Rivera',
    profileUrl:
      'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
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
  const [selectedChatUserId, setSelectedChatUserId] = useState<string | null>(
    null
  );

  useEffect(() => {
    console.log('Fetching chats for user:', user);
    if (user) {
      fetchChats();
    }
  }, [user]);

  const fetchChats = async () => {
    try {
      if (user) {
        const userChats = await chatService.getUserChats(user.id);
        setChats(userChats);
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
      const chatId = await chatService.createChat(
        [user.id, targetUser.id],
        newMessage,
        user.id
      );

      setNewMessage('');
      setSelectedUser(null);
      setShowNewChat(false);
      fetchChats();

      // Open the new chat
      setSelectedChatUserId(targetUser.id);
      setShowChatModal(true);
    } catch (error) {
      console.error('Error starting chat:', error);
    }
  };

  const getOtherUser = (chat: Chat): User | undefined => {
    //@ts-ignore
    const otherUserId = chat?.participants.find((p) => p !== user?.id);
    return availableUsers.find((u) => u.id === otherUserId);
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (hours > 24) {
      return date.toLocaleDateString();
    } else if (hours > 0) {
      return `${hours}h ago`;
    } else if (minutes > 0) {
      return `${minutes}m ago`;
    } else {
      return 'Just now';
    }
  };

  const filteredUsers = availableUsers.filter(
    (u) =>
      u.id !== user?.id &&
      u.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleChatPress = (chat: Chat) => {
    const otherUser = getOtherUser(chat);
    if (otherUser) {
      setSelectedChatUserId(otherUser.id);
      setShowChatModal(true);
    }
  };

  const renderChatItem = ({ item }: { item: Chat }) => {
    const otherUser = getOtherUser(item);

    if (!otherUser) return null;

    return (
      <TouchableOpacity
        style={[
          styles.chatItem,
          { backgroundColor: theme.background, borderColor: theme.border },
        ]}
        onPress={() => handleChatPress(item)}
      >
        <View style={styles.avatarContainer}>
          <Image
            source={{
              uri: otherUser.profileUrl || 'https://via.placeholder.com/50',
            }}
            style={styles.chatAvatar}
          />
          {otherUser.isOnline && (
            <View
              style={[
                styles.onlineIndicator,
                { backgroundColor: theme.success },
              ]}
            />
          )}
        </View>

        <View style={styles.chatContent}>
          <View style={styles.chatHeader}>
            <Text style={[styles.chatName, { color: theme.text }]}>
              {otherUser.name}
            </Text>
            <Text style={[styles.timestamp, { color: theme.textSecondary }]}>
              {formatTime(item.lastMessage.createdAt)}
            </Text>
          </View>

          <Text
            style={[styles.lastMessage, { color: theme.textSecondary }]}
            numberOfLines={1}
          >
            {item.lastMessage.senderId === user?.id ? 'You: ' : ''}
            {item.lastMessage.content}
          </Text>
        </View>

        {!item.lastMessage.isRead && item.lastMessage.senderId !== user?.id && (
          <View
            style={[styles.unreadDot, { backgroundColor: theme.primary }]}
          />
        )}
      </TouchableOpacity>
    );
  };

  const renderUserItem = ({ item }: { item: User }) => (
    <TouchableOpacity
      style={[
        styles.userItem,
        { backgroundColor: theme.surface, borderColor: theme.border },
      ]}
      onPress={() => setSelectedUser(item)}
    >
      <View style={styles.avatarContainer}>
        <Image
          source={{ uri: item.profileUrl || 'https://via.placeholder.com/50' }}
          style={styles.chatAvatar}
        />
        {item.isOnline && (
          <View
            style={[styles.onlineIndicator, { backgroundColor: theme.success }]}
          />
        )}
      </View>

      <View style={styles.userInfo}>
        <Text style={[styles.userName, { color: theme.text }]}>
          {item.name}
        </Text>
        <Text
          style={[styles.useraboutUs, { color: theme.textSecondary }]}
          numberOfLines={1}
        >
          {item.aboutUs}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.background }]}
      >
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: theme.text }]}>
            Loading chats...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (showNewChat) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.background }]}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setShowNewChat(false)}>
            <Text style={[styles.backButton, { color: theme.primary }]}>
              Back
            </Text>
          </TouchableOpacity>
          <Text style={[styles.title, { color: theme.text }]}>New Chat</Text>
          <View style={{ width: 50 }} />
        </View>

        <View style={styles.searchContainer}>
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            leftIcon={<Search size={20} color="#666" />}
            inputStyle={styles.searchInput}
            containerStyle={styles.searchContainer}
          />
        </View>

        {selectedUser ? (
          <View style={styles.newChatContainer}>
            <View
              style={[
                styles.selectedUser,
                { backgroundColor: theme.surface, borderColor: theme.border },
              ]}
            >
              <Image
                source={{
                  uri:
                    selectedUser.profileUrl || 'https://via.placeholder.com/50',
                }}
                style={styles.chatAvatar}
              />
              <Text style={[styles.selectedUserName, { color: theme.text }]}>
                {selectedUser.name}
              </Text>
            </View>

            <View
              style={[
                styles.messageInputContainer,
                { backgroundColor: theme.surface, borderColor: theme.border },
              ]}
            >
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
            keyExtractor={(item) => item.id}
            renderItem={renderUserItem}
            contentContainerStyle={styles.usersList}
            showsVerticalScrollIndicator={false}
          />
        )}
      </SafeAreaView>
    );
  }

  return (
    <Layout title={'Chat'} scrollable>
      {chats.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MessageCircle size={64} color={theme.textSecondary} />
          <Text style={[styles.emptyTitle, { color: theme.text }]}>
            No messages yet
          </Text>
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

      <ChatDetailModal
        visible={showChatModal}
        userId={selectedChatUserId}
        onClose={() => {
          setShowChatModal(false);
          setSelectedChatUserId(null);
        }}
      />
    </Layout>
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
    marginTop: 16,
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  searchInput: {
    fontSize: 16,
    color: '#333',
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
