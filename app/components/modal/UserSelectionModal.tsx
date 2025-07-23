import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  Modal,
  Dimensions,
  Platform,
  TextInput,
  Image
} from 'react-native';
import { useThemeStore } from '@/store/themeStore';
import useUsersStore from '@/store/useUsersStore';
import { User } from '@/types';
import useChatStore from '@/store/useChatStore';
import { getAuthData } from '@/services/secureStore';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface UserSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  onUserSelect: (user: User) => void;
}

export const UserSelectionModal: React.FC<UserSelectionModalProps> = ({
  visible,
  onClose,
  onUserSelect,
}) => {
  const { theme } = useThemeStore();
  const { getAllUsers, loading } = useUsersStore();
  // const [user, setUser] = useState<User | null>(null);
  const [recentChats, setRecentChats] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'recent' | 'suggested'>('recent');
  const [searchQuery, setSearchQuery] = useState('');
  const [response, setResponse] = useState<any>(null);
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const { getChatsBySenderUserId } = useChatStore();

  useEffect(() => {
    if (visible) {
      // Fetch recent chats and suggested users when modal becomes visible
      fetchRecentChats();
      fetchSuggestedUsers();

      // Animate modal in
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      // Reset animation when modal is closed
      slideAnim.setValue(SCREEN_HEIGHT);
    }
  }, [visible]);

  const fetchRecentChats = async () => {
    const userData = await getAuthData();
    const currentUser = userData?.userData?.data || null;
    // setUser(currentUser);

    const userChats = await getChatsBySenderUserId(currentUser?._id);

    const uniqueParticipants = new Map<string, User>();

    userChats?.forEach((chat: any) => {
      const { receiver, sender } = chat.participants;

      // Add receiver if not current user and not already added
      if (receiver._id !== currentUser._id && !uniqueParticipants.has(receiver._id)) {
        uniqueParticipants.set(receiver._id, receiver);
      }

      // Add sender if not current user and not already added
      if (sender._id !== currentUser._id && !uniqueParticipants.has(sender._id)) {
        uniqueParticipants.set(sender._id, sender);
      }
    });

    const usersWithChatInfo = userChats.map((chat: any) => {
      const otherUser = chat.participants.receiver._id === currentUser._id
        ? chat.participants.sender
        : chat.participants.receiver;

      return {
        ...otherUser,
        lastMessage: chat.messages[chat.messages.length - 1],
        chatId: chat._id
      };
    });

    // Remove duplicates from usersWithChatInfo
    const uniqueUsersWithChatInfo = Array.from(
      new Map(usersWithChatInfo.map((user: any) => [user._id, user])).values()
    );
    setRecentChats(uniqueUsersWithChatInfo);
    // setActiveTab('recent');
  };
  const fetchSuggestedUsers = async () => {
    try {
      const users = await getAllUsers();

      setResponse(users?.data);
    } catch (error) {
      console.error('Error fetching suggested users:', error);
    }
  };

  const filteredUsers = (response || [])?.filter((user: User) =>
    user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user?.email?.toLowerCase().includes(searchQuery.toLowerCase())
  )?.slice(0, 10);

  const filteredRecentChats = recentChats
    ?.filter(participant =>
      participant?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      participant?.email?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    ?.slice(0, 10);

  const renderUserItem = ({ item }: { item: User }) => (
    <TouchableOpacity
      style={[styles.userItem, { borderBottomColor: theme.border }]}
      onPress={() => onUserSelect(item)}
    >
      <View style={styles.userInfo}>
        <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
          {item.profileUrl ? (
            <Image
              source={{ uri: item.profileUrl }}
              style={{ width: '100%', height: '100%', borderRadius: 20 }}
            />
          ) : (
            <Text style={styles.avatarText}>
              {item.name?.charAt(0).toUpperCase() || 'U'}
            </Text>
          )}
        </View>
        <View>
          <Text style={[styles.userName, { color: theme.text }]}>{item.name || 'Unknown User'}</Text>
          {item.email && <Text style={[styles.userEmail, { color: theme.text + '80' }]}>{item.email}</Text>}
        </View>
      </View>
    </TouchableOpacity>
  );

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const modalTranslateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [500, 0],
  });

  const backdropOpacity = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.5],
  });

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View
        style={[
          styles.backdrop,
          { opacity: backdropOpacity }
        ]}
      >
        <TouchableOpacity
          style={styles.backdropPressable}
          activeOpacity={1}
          onPress={onClose}
        />
      </Animated.View>

      <Animated.View
        style={[
          styles.modalContainer,
          {
            backgroundColor: theme.background,
            transform: [{ translateY: modalTranslateY }]
          }
        ]}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>Send Post</Text>
        </View>

        <View style={[styles.searchContainer, { backgroundColor: theme.background + '80' }]}>
          <TextInput
            style={[styles.searchInput, { color: theme.text, backgroundColor: theme.background + '40' }]}
            placeholder="Search..."
            placeholderTextColor={theme.text + '80'}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <View style={styles.tabs}>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'recent' && [styles.activeTab, { borderBottomColor: theme.primary }],
            ]}
            onPress={() => setActiveTab('recent')}
          >
            <Text style={[styles.tabText, activeTab === 'recent' && { color: theme.primary }]}>
              Recent
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'suggested' && [styles.activeTab, { borderBottomColor: theme.primary }],
            ]}
            onPress={() => setActiveTab('suggested')}
          >
            <Text style={[styles.tabText, activeTab === 'suggested' && { color: theme.primary }]}>
              Suggested
            </Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.primary} />
          </View>
        ) : (
          <FlatList
            data={activeTab === 'suggested' ? filteredUsers : filteredRecentChats}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => renderUserItem({ item })}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={[styles.emptyText, { color: theme.text + '80' }]}>
                  {searchQuery ? 'No users found' : 'No users available'}
                </Text>
              </View>
            }
            keyboardShouldPersistTaps="handled"
          />
        )}
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
  },
  backdropPressable: {
    flex: 1,
  },
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT * 0.8,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    padding: 0,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  searchContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  searchInput: {
    height: 36,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    marginBottom: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    paddingBottom: 20,
  },
  userItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  userName: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 12,
    opacity: 0.7,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
  },
});