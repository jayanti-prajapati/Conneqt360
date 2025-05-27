import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Search, CreditCard as Edit } from 'lucide-react-native';
import ChatItem from '@/components/chats/ChatItem';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import Spacing from '@/constants/Spacing';
import { Chat } from '@/types';

// Mock data for chats
const mockChats: Chat[] = [
  {
    id: '1',
    name: 'Textile Manufacturers Group',
    lastMessage:
      'Rahul: Does anyone have a contact for organic cotton suppliers?',
    timestamp: '10:30 AM',
    unreadCount: 3,
    isGroup: true,
  },
  {
    id: '2',
    name: 'Priya Sharma',
    lastMessage: 'I can offer a 10% discount on bulk orders above 100 units',
    timestamp: 'Yesterday',
    unreadCount: 0,
    isGroup: false,
  },
  {
    id: '3',
    name: 'Raj Patel',
    lastMessage: 'The samples will be delivered by tomorrow evening',
    timestamp: 'Yesterday',
    unreadCount: 2,
    isGroup: false,
  },
  {
    id: '4',
    name: 'Silver Tower Businesses',
    lastMessage:
      'Admin: Meeting scheduled for Friday at 3 PM in the conference room',
    timestamp: '2 days ago',
    unreadCount: 0,
    isGroup: true,
  },
  {
    id: '5',
    name: 'Anil Mehta',
    lastMessage: "Thanks for the information. I'll get back to you next week.",
    timestamp: '3 days ago',
    unreadCount: 0,
    isGroup: false,
  },
  {
    id: '6',
    name: 'Food Suppliers Network',
    lastMessage: 'Meera: Check out the new regulations posted on the portal',
    timestamp: '5 days ago',
    unreadCount: 0,
    isGroup: true,
  },
];

export default function ChatsScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleChatPress = (id: string) => {
    console.log(`Chat ${id} pressed`);
    // In a full implementation, navigate to chat screen
  };

  const handleNewChat = () => {
    console.log('Create new chat');
    // In a full implementation, navigate to create chat screen
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Business Chats</Text>
        <TouchableOpacity style={styles.newChatButton} onPress={handleNewChat}>
          <Edit size={20} color={Colors.primary[600]} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search
            size={20}
            color={Colors.gray[500]}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search conversations..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <FlatList
        data={mockChats}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ChatItem
            id={item.id}
            name={item.name}
            lastMessage={item.lastMessage}
            timestamp={item.timestamp}
            unreadCount={item.unreadCount}
            isGroup={item.isGroup}
            onPress={handleChatPress}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.md,
  },
  title: {
    fontSize: Typography.size.xl,
    fontWeight: Typography.weight.bold as any,
    color: Colors.gray[800],
  },
  newChatButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray[100],
    borderRadius: 8,
    paddingHorizontal: Spacing.sm,
    height: 40,
  },
  searchIcon: {
    marginRight: Spacing.xs,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: Typography.size.md,
    color: Colors.gray[800],
  },
});
