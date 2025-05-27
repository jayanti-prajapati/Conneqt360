import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Search, Filter, Plus } from 'lucide-react-native';
import CircleCard from '@/components/circles/CircleCard';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import Spacing from '@/constants/Spacing';
import { Circle } from '@/types';

// Mock data for circles
const mockCircles: Circle[] = [
  {
    id: '1',
    name: 'Textile Manufacturers Gujarat',
    members: 142,
    description:
      'A network of textile manufacturers in Gujarat region sharing industry updates and collaboration opportunities.',
    type: 'sector',
    unreadMessages: 5,
  },
  {
    id: '2',
    name: 'Surat Business Hub',
    members: 287,
    description:
      'Connect with businesses in Surat city for local partnerships, events, and networking.',
    type: 'location',
    unreadMessages: 0,
  },
  {
    id: '3',
    name: 'Silver Tower Business Park',
    members: 56,
    description:
      'Exclusive group for businesses operating in Silver Tower Business Park. Share facilities, resources, and connect with neighbors.',
    type: 'building',
    unreadMessages: 12,
  },
  {
    id: '4',
    name: 'Food & Beverage Network India',
    members: 324,
    description:
      'Industry professionals from the F&B sector connecting to discuss trends, regulations, and business opportunities.',
    type: 'sector',
    unreadMessages: 0,
  },
];

export default function CirclesScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleCirclePress = (id: string) => {
    console.log(`Circle ${id} pressed`);
    // In a full implementation, navigate to circle details
  };

  const handleCreateCircle = () => {
    console.log('Create new circle');
    // In a full implementation, navigate to create circle screen
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Business Circles</Text>
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
            placeholder="Search circles..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color={Colors.gray[700]} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {mockCircles.map((circle) => (
          <CircleCard
            key={circle.id}
            id={circle.id}
            name={circle.name}
            members={circle.members}
            description={circle.description}
            type={circle.type}
            unreadMessages={circle.unreadMessages}
            onPress={handleCirclePress}
          />
        ))}
      </ScrollView>

      <TouchableOpacity
        style={styles.floatingButton}
        onPress={handleCreateCircle}
      >
        <Plus size={24} color={Colors.white} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray[100],
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.white,
  },
  title: {
    fontSize: Typography.size.xl,
    fontWeight: Typography.weight.bold as any,
    color: Colors.gray[800],
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  searchBar: {
    flex: 1,
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
  filterButton: {
    marginLeft: Spacing.md,
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: Colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
  },
  floatingButton: {
    position: 'absolute',
    bottom: Spacing.lg,
    right: Spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary[600],
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
