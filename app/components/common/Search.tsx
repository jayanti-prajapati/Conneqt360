import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Colors from '@/constants/Colors';
import { Search as SearchIcon, Filter } from 'lucide-react-native';
import { TextInput } from 'react-native';
import Spacing from '@/constants/Spacing';
import { useEffect, useState } from 'react';
import Typography from '@/constants/Typography';
import { useCommunityFeedsStore } from '@/store/communityFeedsStore';

type SearchProps = {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function Search({ searchQuery, setSearchQuery }: SearchProps) {
  // const [searchQuery, setSearchQuery] = useState('');
  // const { feeds } = useCommunityFeedsStore();
  // const [feedData, setFeedData] = useState<any>([]);

  // const handleSearch = (text: string) => {
  // setSearchQuery(text);
  // Filter the list of businesses and products
  //   const filteredData = feeds.filter((item: any) =>
  //     item?.user?.businessName?.toLowerCase().includes(text.toLowerCase())
  //   );
  //   setFeedData(filteredData);
  // };
  // useEffect(() => {
  //   handleSearch(searchQuery);
  // }, [searchQuery]);

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
          }}
        />
      </View>
      <TouchableOpacity style={styles.filterButton}>
        <Filter color={Colors.gray[500]} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
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
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderColor: Colors.gray[200],
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: Typography.size.md,
    color: Colors.gray[600],
    paddingLeft: Spacing.md,
  },
  filterButton: {
    marginLeft: 10,
    backgroundColor: Colors.gray[100],
    borderRadius: 24,
    padding: 10,
    borderColor: Colors.gray[200],
    borderWidth: 1,
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
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.bold as any,
  },
});
