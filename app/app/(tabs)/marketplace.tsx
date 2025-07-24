import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  FlatList,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Filter, Plus } from 'lucide-react-native';
import ProductCard from '@/components/marketplace/ProductCard';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import Spacing from '@/constants/Spacing';
import { Product } from '@/types';
import Layout from '@/components/common/Layout';
import Search from '@/components/common/Search';
import Button from '@/components/ui-components/Button';
import { ComingSoon } from '@/components/utils/ComingSoon';

// Mock data for products
const mockProducts: Product[] = [
  {
    id: '1',
    title: 'Premium Cotton Fabric',
    price: '₹250/meter',
    description:
      'High quality cotton fabric suitable for garments, home decor and crafts.',
    imageUrl:
      'https://images.pexels.com/photos/4620769/pexels-photo-4620769.jpeg',
    sellerId: 'user1',
    sellerName: 'TextileCraft',
    rating: 4.5,
    location: 'Surat, Gujarat',
    verified: true,
  },
  {
    id: '2',
    title: 'Industrial Sewing Machine',
    price: '₹42,000',
    description:
      'Commercial grade sewing machine, perfect for small to medium businesses.',
    imageUrl:
      'https://images.pexels.com/photos/6975575/pexels-photo-6975575.jpeg',
    sellerId: 'user2',
    sellerName: 'MachineWorld',
    rating: 4.2,
    location: 'Ahmedabad, Gujarat',
    verified: false,
  },
  {
    id: '3',
    title: 'Organic Spice Mix',
    price: '₹180/kg',
    description:
      'Authentic blend of organic spices sourced directly from farms.',
    imageUrl:
      'https://images.pexels.com/photos/2802527/pexels-photo-2802527.jpeg',
    sellerId: 'user3',
    sellerName: 'SpiceHarvest',
    rating: 4.7,
    location: 'Rajkot, Gujarat',
    verified: true,
  },
  {
    id: '4',
    title: 'Solar Panel Kit',
    price: '₹18,500',
    description:
      'Complete solar panel kit for small businesses, reduces electricity costs.',
    imageUrl:
      'https://images.pexels.com/photos/9875441/pexels-photo-9875441.jpeg',
    sellerId: 'user4',
    sellerName: 'GreenEnergy',
    rating: 4.0,
    location: 'Vadodara, Gujarat',
    verified: true,
  },
  {
    id: '5',
    title: 'Accounting Software',
    price: '₹1,200/month',
    description:
      'Business accounting software tailored for Indian SMEs with GST support.',
    imageUrl: 'https://images.pexels.com/photos/95916/pexels-photo-95916.jpeg',
    sellerId: 'user5',
    sellerName: 'TechSolutions',
    rating: 4.3,
    location: 'Gandhinagar, Gujarat',
    verified: false,
  },
  {
    id: '6',
    title: 'Office Furniture Set',
    price: '₹36,000',
    description:
      'Complete office furniture set including desks, chairs and storage units.',
    imageUrl:
      'https://images.pexels.com/photos/1957478/pexels-photo-1957478.jpeg',
    sellerId: 'user6',
    sellerName: 'OfficeMart',
    rating: 3.9,
    location: 'Surat, Gujarat',
    verified: true,
  },
];
const { width, height } = Dimensions.get('window');


export default function MarketplaceScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleProductPress = (id: string) => {
    console.log(`Product ${id} pressed`);
    // In a full implementation, navigate to product details
  };

  const handleInquiry = (id: string) => {
    console.log(`Inquiry for product ${id}`);
    // In a full implementation, open chat with seller or inquiry form
  };

  const handleCreateListing = () => {
    console.log('Create new listing');
    // In a full implementation, navigate to create listing screen
  };

  return (
    <Layout title={'Business Marketplace'} scrollable>

      <ComingSoon />
      {/* <Search />

      <View style={styles.categoryTabs}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryTabsContent}
        >
          <TouchableOpacity
            style={[styles.categoryTab, styles.categoryTabActive]}
          >
            <Text
              style={[styles.categoryTabText, styles.categoryTabTextActive]}
            >
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryTab}>
            <Text style={styles.categoryTabText}>Materials</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryTab}>
            <Text style={styles.categoryTabText}>Equipment</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryTab}>
            <Text style={styles.categoryTabText}>Services</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryTab}>
            <Text style={styles.categoryTabText}>Digital</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <FlatList
        data={mockProducts}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.productGrid}
        columnWrapperStyle={styles.productRow}
        renderItem={({ item }) => (
          <ProductCard
            id={item.id}
            title={item.title}
            price={item.price}
            description={item.description}
            imageUrl={item.imageUrl}
            sellerName={item.sellerName}
            rating={item.rating}
            location={item.location}
            onPress={handleProductPress}
            onInquiry={handleInquiry}
            verified={item.verified}
          />
        )}
      />

      <TouchableOpacity
        style={styles.floatingButton}
        onPress={handleCreateListing}
      >
        <Plus size={24} color={Colors.white} />
      </TouchableOpacity> */}
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: width * 0.6,
    height: height * 0.3,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
});
