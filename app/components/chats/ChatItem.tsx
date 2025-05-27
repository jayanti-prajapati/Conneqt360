import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { MessageSquare } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import Spacing from '@/constants/Spacing';

interface ChatItemProps {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isGroup: boolean;
  onPress: (id: string) => void;
}

export default function ChatItem({
  id,
  name,
  lastMessage,
  timestamp,
  unreadCount,
  isGroup,
  onPress,
}: ChatItemProps) {
  const initials = name
    .split(' ')
    .map(word => word[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <TouchableOpacity 
      style={styles.container} 
      activeOpacity={0.7}
      onPress={() => onPress(id)}
    >
      <View style={styles.avatarContainer}>
        {isGroup ? (
          <View style={[styles.avatar, styles.groupAvatar]}>
            <MessageSquare size={20} color={Colors.white} />
          </View>
        ) : (
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
        )}
        {unreadCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{unreadCount}</Text>
          </View>
        )}
      </View>
      
      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={1}>{name}</Text>
          <Text style={styles.timestamp}>{timestamp}</Text>
        </View>
        <Text style={[
          styles.message, 
          unreadCount > 0 && styles.unreadMessage
        ]} numberOfLines={1}>
          {lastMessage}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  avatarContainer: {
    position: 'relative',
    marginRight: Spacing.md,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  groupAvatar: {
    backgroundColor: Colors.primary[600],
  },
  avatarText: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.bold as any,
    color: Colors.primary[700],
  },
  badge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.primary[600],
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    fontSize: 10,
    color: Colors.white,
    fontWeight: Typography.weight.bold as any,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.semiBold as any,
    color: Colors.gray[800],
    flex: 1,
    marginRight: Spacing.sm,
  },
  timestamp: {
    fontSize: Typography.size.xs,
    color: Colors.gray[500],
  },
  message: {
    fontSize: Typography.size.sm,
    color: Colors.gray[600],
  },
  unreadMessage: {
    fontWeight: Typography.weight.semiBold as any,
    color: Colors.gray[800],
  },
});