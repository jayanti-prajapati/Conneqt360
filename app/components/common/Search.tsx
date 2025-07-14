import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Colors from '@/constants/Colors';
import { Search as SearchIcon, Filter } from 'lucide-react-native';
import { TextInput } from 'react-native';
import Spacing from '@/constants/Spacing';
import { useState } from 'react';

export default function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  const [feedData, setFeedData] = useState<any>(null);
  return (
    <View style={styles.searchContainer}>
      <View style={styles.searchBar}>
        <SearchIcon color={Colors.gray[500]} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search businesses, products..."
          value={searchQuery}
          onChangeText={(text) => {
            setSearchQuery(text);
            // Filter the list of businesses and products
            const filteredData = feedData.filter((item: any) =>
              item?.user?.businessName
                ?.toLowerCase()
                .includes(text.toLowerCase())
            );
            setFeedData(filteredData);
          }}
        />
      </View>
      <TouchableOpacity style={styles.notificationButton}>
        {/* <Bell size={24} color={Colors.gray[700]} />
                 <View style={styles.notificationBadge}>
                   <Text style={styles.notificationBadgeText}>3</Text>
                 </View> */}

        <Filter color={Colors.gray[700]} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    backgroundColor: Colors.white,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray[100],
    borderRadius: 24,
    padding: Spacing.md,
    minHeight: 48,
    minWidth: 100,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.gray[600],
    paddingLeft: Spacing.md,
  },
  notificationButton: {
    marginLeft: Spacing.md,
  },
  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: Colors.primary[600],
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
});
