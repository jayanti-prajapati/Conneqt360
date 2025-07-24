import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, FlatList, StyleSheet,
  TouchableOpacity, Image, TextInput
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MessageCircle, Plus, Send, X, Search as SearchIcon } from 'lucide-react-native';

import { useThemeStore } from '../../store/themeStore';
import { ChatDetailModal } from '../../components/modal/ChatDetailModal';
import { User } from '../../types';
import useUsersStore from '@/store/useUsersStore';
import { getAuthData } from '@/services/secureStore';
import useChatStore from '@/store/useChatStore';
import Layout from '@/components/common/Layout';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import useNetworkStatus from '@/hooks/useNetworkStatus';
import NoInternetScreen from '@/components/utils/NoInternetScreen';
import Search from '@/components/common/Search';
import { ScrollView } from 'react-native-gesture-handler';
import Spacing from '@/constants/Spacing';
import Input from '@/components/ui-components/Input';

const placeholderImage = 'https://via.placeholder.com/50';

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
  const isConnected = useNetworkStatus(false);
  const { getAllUsers, clearUsers, response: usersResponse } = useUsersStore();
  const { getChatsBySenderUserId, sendMessage, getConversation } = useChatStore();
  let allUsers = usersResponse?.data || [];

  // Fetch chats with latest logic
  const fetchChats = useCallback(async (showLoader: boolean = false) => {
    try {
      if (showLoader && !searchQuery) setInitialLoading(true);
      if (!user?._id || !isConnected) return;

      const userChats = await getChatsBySenderUserId(user._id);
      // const sortedChats = [...(userChats || [])].sort((a, b) => {
      //   const aLast = a.messages[a.messages.length - 1]?.createdAt || a.updatedAt || 0;
      //   const bLast = b.messages[b.messages.length - 1]?.createdAt || b.updatedAt || 0;
      //   return new Date(bLast).getTime() - new Date(aLast).getTime();
      // });
      setChats(userChats);
    } catch (error) {
      console.error('Error fetching chats:', error);
    } finally {
      if (showLoader && !searchQuery) setInitialLoading(false);
    }
  }, [user, getChatsBySenderUserId, isConnected]);

  useEffect(() => {
    (async () => {
      try {
        const userData = await getAuthData();
        setUser(userData?.userData?.data || null);
      } catch (e) {
        console.error('Error fetching user:', e);
      }
    })();
  }, []);

  useEffect(() => {
    if (user?._id) {
      fetchChats(true);
      const interval = setInterval(() => fetchChats(false), 2000);
      return () => clearInterval(interval);
    }
  }, [user, fetchChats]);

  // Search logic
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
      fetchChats(false);
      setSelectedChatUserId(conversation[0]);
      setShowChatModal(true);
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
        <View style={styles.avatar}>
          {/* <View style={styles.avatarContainer}> */}
          {otherUser.profileUrl ? <Image
            source={{ uri: otherUser.profileUrl || placeholderImage }}
            style={styles.chatAvatar}
          /> : <Text style={[styles.avatarText, { color: theme.text }]}>{otherUser.name[0].toUpperCase()}</Text>}
          {/* </View> */}
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

  const renderUserItem = ({ item }: { item: User }) => (
    <TouchableOpacity
      style={[styles.userItem, { backgroundColor: theme.surface, borderColor: theme.border }]}
      onPress={() => setSelectedUser(item)}
    >
      <View style={styles.avatarContainer}>
        <Image source={{ uri: item.profileUrl || placeholderImage }} style={styles.chatAvatar} />
      </View>
      <View style={styles.userInfo}>
        <Text style={[styles.userName, { color: theme.text }]}>{item.name}</Text>
        <Text style={[styles.useraboutUs, { color: theme.textSecondary }]} numberOfLines={1}>
          @{item.username}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (initialLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: theme.text }]}>Loading chats...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (showNewChat) {
    return (
      isConnected ? (
        <Layout title={'New Chat'} showBackButton={true} onBackPress={() => { setShowNewChat(false); allUsers = [], setSelectedUser(null) }}>
          {/* <View style={[styles.container, { backgroundColor: theme.background }]}> */}
          {/* <View style={styles.header}>
            <TouchableOpacity onPress={() => {
              setShowNewChat(false)
              allUsers = [];
            }}>
              <X size={24} color={theme.primary} />
            </TouchableOpacity>
            <Text style={[styles.title, { color: theme.text }]}>New Chat</Text>
            <View style={{ width: 50 }} />
          </View> */}
          <View style={[styles.searchContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <SearchIcon size={20} color={theme.textSecondary} />
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
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <Image source={{ uri: selectedUser.profileUrl || placeholderImage }} style={styles.chatAvatar} />
                  <Text style={[styles.selectedUserName, { color: theme.text }]}>{selectedUser.name}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => setSelectedUser(null)}
                  style={styles.closeButton}
                >
                  <Ionicons name="close" size={20} color={theme.text} />
                </TouchableOpacity>
              </View>
              <View style={[styles.messageInputContainer, { width: "80%", alignItems: "center" }]}>
                <Input
                  // style={[styles.messageInput, { color: theme.text }]}
                  placeholder="Type your message..."
                  // placeholderTextColor={theme.textSecondary}
                  value={newMessage}
                  onChangeText={setNewMessage}

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
              renderItem={renderUserItem}
              contentContainerStyle={styles.usersList}
              showsVerticalScrollIndicator={false}
            />
          )}
          {/* </View> */}
        </Layout>
      ) : (
        <NoInternetScreen />
      )
    );
  }

  return (
    isConnected ? (
      <Layout title={'Chat'} headerRight={
        <TouchableOpacity
          style={[styles.newChatButton, { backgroundColor: theme.primary }]}
          onPress={() => setShowNewChat(true)}
        >
          <Plus size={20} color="#FFFFFF" />
        </TouchableOpacity>
      }>
        <Search placeholder="Search User" searchQuery={searchQuery} setSearchQuery={setSearchQuery} />


        {chats.length === 0 ? (
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
          <ScrollView
            contentContainerStyle={[styles.chatsList, { paddingBottom: 100 }]} // 👈 padding at bottom
            showsVerticalScrollIndicator={false}
          >
            {chats.map((item) => (
              <View
                key={item.participants.sender._id + item.participants.receiver._id}
              >
                {renderChatItem({ item })}
              </View>
            ))}
          </ScrollView>


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
      </Layout>
    ) : (
      <NoInternetScreen />
    )
  );
}

const styles = StyleSheet.create({
  // Reuse the latest UI styles from your second code block
  container: { flex: 1 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingHorizontal: 16, paddingVertical: 20,
    borderBottomWidth: 1, borderBottomColor: '#E5E7EB',
  },
  title: { fontSize: 28, fontWeight: 'bold' },
  searchContainer: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: 16, marginTop: 16,
    borderRadius: 12, borderWidth: 1, paddingHorizontal: 12,
  },
  searchInput: { flex: 1, fontSize: 16, marginLeft: 8 },
  chatsList: { paddingVertical: 8 },
  usersList: { paddingHorizontal: 16, paddingVertical: 8 },
  chatItem: {
    flexDirection: 'row', alignItems: 'center',
    padding: 16, marginHorizontal: 16, marginVertical: 4,
    borderRadius: 12, borderWidth: 1,
  },
  userItem: {
    flexDirection: 'row', alignItems: 'center',
    padding: 16, marginVertical: 4, borderRadius: 12, borderWidth: 1,
  },
  newChatButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarContainer: { marginRight: 12 },
  chatAvatar: { width: 50, height: 50, borderRadius: 25 },
  chatContent: { flex: 1 },
  chatHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  chatName: { fontSize: 16, fontWeight: '600' },
  timestamp: { fontSize: 12 },
  lastMessage: { fontSize: 14 },
  userInfo: { flex: 1 },
  userName: { fontSize: 16, fontWeight: '600', marginBottom: 2 },
  useraboutUs: { fontSize: 14 },
  newChatContainer: { flex: 1, padding: 16 },
  selectedUser: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    justifyContent: 'space-between',
  },
  closeButton: {
    padding: 5,
    marginLeft: 10,
  },
  newChatText: { fontSize: 16, fontWeight: '600' },
  selectedUserName: { fontSize: 16, fontWeight: '600', marginLeft: 12 },
  messageInputContainer: {
    flexDirection: 'row', alignItems: 'flex-end',
    padding: 2, gap: 12, width: "80%"
  },
  messageInput: { flex: 1, fontSize: 16, maxHeight: 100, minHeight: 40 },
  sendButton: {
    width: 40, height: 40, borderRadius: 20,
    justifyContent: 'center', alignItems: 'center',
  },
  avatarText: {
    color: Colors.primary[700],
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.bold as any,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 },
  emptyTitle: { fontSize: 24, fontWeight: 'bold', marginTop: 16, marginBottom: 8 },
  emptySubtitle: { fontSize: 16, textAlign: 'center', lineHeight: 24, marginBottom: 24 },
  startChatButton: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 25 },
  startChatText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { fontSize: 16 },
});
