import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView,
  TouchableOpacity,
  SafeAreaView 
} from 'react-native';
import { useRouter } from 'expo-router';
import { Settings, Share2 } from 'lucide-react-native';
import ProfileHeader from '@/components/profile/ProfileHeader';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import Spacing from '@/constants/Spacing';
import { User } from '@/types';

// Mock user data
const mockUser: User = {
  id: '1',
  name: 'TextileCraft Industries',
  businessName: 'TextileCraft Industries',
  email: 'contact@textilecraft.com',
  phone: '+91 98765 43210',
  location: 'Surat, Gujarat',
  businessType: 'Textile Manufacturing & Export',
  verified: true,
};

export default function ProfileScreen() {
  const router = useRouter();

  const handleEditProfile = () => {
    console.log('Edit profile');
    // In a full implementation, navigate to edit profile screen
  };

  const handleConnect = () => {
    console.log('Connect with business');
    // In a full implementation, send connection request
  };

  const handleSettings = () => {
    console.log('Settings');
    // In a full implementation, navigate to settings screen
  };

  const handleShare = () => {
    console.log('Share profile');
    // In a full implementation, open share dialog
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerActions}>
        <TouchableOpacity style={styles.iconButton} onPress={handleSettings}>
          <Settings size={24} color={Colors.gray[700]} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={handleShare}>
          <Share2 size={24} color={Colors.gray[700]} />
        </TouchableOpacity>
      </View>

      <ScrollView>
        <ProfileHeader
          name={mockUser.name}
          verified={mockUser.verified}
          businessType={mockUser.businessType}
          location={mockUser.location}
          phone={mockUser.phone}
          email={mockUser.email}
          isOwnProfile={true}
          onEditProfile={handleEditProfile}
          onConnect={handleConnect}
        />

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>158</Text>
            <Text style={styles.statLabel}>Connections</Text>
          </View>
          <View style={[styles.statItem, styles.statBorder]}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Products</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>4.8</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About Us</Text>
          <Card padding="medium">
            <Text style={styles.aboutText}>
              TextileCraft Industries is a leading manufacturer and exporter of high-quality textile products. 
              Established in 2005, we specialize in cotton fabrics, synthetic blends, and eco-friendly textiles 
              for fashion and home decor industries.
            </Text>
          </Card>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Business Documents</Text>
          <Card padding="medium">
            <View style={styles.documentItem}>
              <Text style={styles.documentName}>GST Certificate</Text>
              <Text style={styles.documentVerified}>Verified ✓</Text>
            </View>
            <View style={styles.documentItem}>
              <Text style={styles.documentName}>Udyam Registration</Text>
              <Text style={styles.documentVerified}>Verified ✓</Text>
            </View>
            <View style={styles.documentItem}>
              <Text style={styles.documentName}>IEC Code</Text>
              <Text style={styles.documentVerified}>Verified ✓</Text>
            </View>
          </Card>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured Products</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.productsList}
          >
            <View style={styles.productCard}>
              <View style={styles.productImage} />
              <Text style={styles.productName}>Organic Cotton</Text>
              <Text style={styles.productPrice}>₹250/meter</Text>
            </View>
            <View style={styles.productCard}>
              <View style={styles.productImage} />
              <Text style={styles.productName}>Printed Fabric</Text>
              <Text style={styles.productPrice}>₹180/meter</Text>
            </View>
            <View style={styles.productCard}>
              <View style={styles.productImage} />
              <Text style={styles.productName}>Linen Blend</Text>
              <Text style={styles.productPrice}>₹320/meter</Text>
            </View>
          </ScrollView>
        </View>

        <View style={styles.actionButtons}>
          <Button 
            title="Download Business Card" 
            variant="outline"
            size="medium"
            onPress={() => console.log('Download business card')}
            style={styles.button}
          />
          <Button 
            title="View Trust Score" 
            variant="primary"
            size="medium"
            onPress={() => console.log('View trust score')}
            style={styles.button}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray[100],
  },
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 10,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Spacing.sm,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    paddingVertical: Spacing.md,
    marginBottom: Spacing.md,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statBorder: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: Colors.gray[200],
  },
  statValue: {
    fontSize: Typography.size.xl,
    fontWeight: Typography.weight.bold as any,
    color: Colors.gray[800],
  },
  statLabel: {
    fontSize: Typography.size.sm,
    color: Colors.gray[600],
    marginTop: 2,
  },
  section: {
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.semiBold as any,
    color: Colors.gray[800],
    marginBottom: Spacing.sm,
  },
  aboutText: {
    fontSize: Typography.size.md,
    color: Colors.gray[700],
    lineHeight: 22,
  },
  documentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  documentName: {
    fontSize: Typography.size.md,
    color: Colors.gray[800],
  },
  documentVerified: {
    fontSize: Typography.size.sm,
    color: Colors.success[500],
    fontWeight: Typography.weight.medium as any,
  },
  productsList: {
    paddingVertical: Spacing.sm,
  },
  productCard: {
    width: 120,
    marginRight: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: Spacing.sm,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  productImage: {
    height: 80,
    backgroundColor: Colors.gray[200],
    borderRadius: 4,
    marginBottom: Spacing.xs,
  },
  productName: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.medium as any,
    color: Colors.gray[800],
  },
  productPrice: {
    fontSize: Typography.size.sm,
    color: Colors.primary[600],
    marginTop: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  button: {
    flex: 1,
    marginHorizontal: Spacing.xs,
  },
});