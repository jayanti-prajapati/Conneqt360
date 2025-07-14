import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Card from '@/components/ui-components/Card';
import { Users } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import Spacing from '@/constants/Spacing';

interface CircleCardProps {
  id: string;
  name: string;
  members: number;
  description: string;
  type: 'sector' | 'location' | 'building';
  unreadMessages?: number;
  onPress: (id: string) => void;
}

export default function CircleCard({
  id,
  name,
  members,
  description,
  type,
  unreadMessages = 0,
  onPress,
}: CircleCardProps) {
  
  const getCircleTypeColor = (type: 'sector' | 'location' | 'building') => {
    switch (type) {
      case 'sector': return Colors.primary[600];
      case 'location': return Colors.warning[500];
      case 'building': return Colors.success[500];
    }
  };

  const getCircleTypeLabel = (type: 'sector' | 'location' | 'building') => {
    switch (type) {
      case 'sector': return 'Industry';
      case 'location': return 'Location';
      case 'building': return 'Building';
    }
  };

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={() => onPress(id)}>
      <Card style={styles.card}>
        <View style={styles.header}>
          <View 
            style={[
              styles.iconContainer, 
              { backgroundColor: getCircleTypeColor(type) }
            ]}
          >
            <Users size={24} color={Colors.white} />
          </View>
          
          <View style={styles.titleContainer}>
            <Text style={styles.name}>{name}</Text>
            <View style={styles.infoRow}>
              <Text style={styles.memberCount}>{members} members</Text>
              <View 
                style={[
                  styles.typeTag, 
                  { backgroundColor: getCircleTypeColor(type) + '20' }
                ]}
              >
                <Text 
                  style={[
                    styles.typeText, 
                    { color: getCircleTypeColor(type) }
                  ]}
                >
                  {getCircleTypeLabel(type)}
                </Text>
              </View>
            </View>
          </View>
          
          {unreadMessages > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{unreadMessages}</Text>
            </View>
          )}
        </View>
        
        <Text style={styles.description} numberOfLines={2}>
          {description}
        </Text>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
    marginLeft: Spacing.sm,
  },
  name: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.semiBold as any,
    color: Colors.gray[800],
    marginBottom: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberCount: {
    fontSize: Typography.size.sm,
    color: Colors.gray[600],
    marginRight: Spacing.sm,
  },
  typeTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  typeText: {
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.medium as any,
  },
  unreadBadge: {
    backgroundColor: Colors.primary[600],
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadText: {
    fontSize: Typography.size.xs,
    color: Colors.white,
    fontWeight: Typography.weight.semiBold as any,
  },
  description: {
    fontSize: Typography.size.sm,
    color: Colors.gray[700],
    lineHeight: 20,
  },
});