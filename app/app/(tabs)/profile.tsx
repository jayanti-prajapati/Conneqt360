import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity, ImageStyle, ViewStyle, TextStyle, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Check, Cross, LogOut, Mail, Phone, Edit, MapIcon, MapPin } from 'lucide-react-native';
import Button from '@/components/common/Button';
import { clearAuthData, getAuthData } from '@/services/secureStore';
import Colors from '@/constants/Colors';
import Spacing from '@/constants/Spacing';
import { useModal } from '@/hooks/useModal';
import Form from '@/components/profile/Form';
import useUsersStore from '@/store/useUsersStore';
import CustomLoader from '@/components/loader/CustomLoader';
import About from '@/components/profile/About';

// Mock user data


export default function ProfileScreen() {
  const router = useRouter();
  const [isPresent, setIsPresent] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isAbout, setIsAbout] = useState(false);


  const { loading, getUserById } = useUsersStore();

  useEffect(() => {

    fetchUserById();
  }, []);
  const fetchUserById = async () => {
    const data = await getAuthData();
    const response = await getUserById(data?.userData?._id);
    if (response?.data?.statusCode == 200) {
      setUser(response?.data?.data);
    } else {
      clearAuthData();
      router.replace('/(auth)/login');
    }
  }


  const handleBack = () => {
    router.back();
  };
  const close = () => {
    setIsPresent(false);
    setIsAbout(false);
    fetchUserById();
  }
  const handleEditProfile = () => {
    setIsPresent(true);
    console.log('Edit profile');
  };

  const handleEditAbout = () => {
    setIsAbout(true);
    console.log('Edit about');
  };

  const handleShareCard = () => {
    console.log('Share card');
  };

  const handleViewBusiness = () => {
    console.log('View business');
  };

  const handleLogout = () => {
    clearAuthData();
    router.replace('/(auth)/login');
  };

  // Calculate profile completion percentage based on filled fields
  const calculateProfileCompletion = (userData: any) => {
    if (!userData) return 0;

    const fields = [
      'name',
      'jobTitle',
      'email',
      'username',
      'businessName',
      'businessType',
      'gstNumber',
      'udyamNumber',
      'location',
      'aboutUs'
    ];

    const totalFields = fields.length;
    let completedFields = 0;

    fields.forEach(field => {
      if (userData[field]) {
        completedFields++;
      }
    });

    // Calculate percentage (rounded to nearest integer)
    return Math.round((completedFields / totalFields) * 100);
  };

  const profileCompletion = calculateProfileCompletion(user);
  // console.log('Profile completion:', isPresent);
  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
      <Form isPresent={isPresent} onClose={close} closeText="Close" users={user} />
      <CustomLoader visible={loading} />
      <About isAbout={isAbout} onClose={close} userId={user?._id} />
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          {/* <ArrowLeft size={24} color={Colors.gray[700]} /> */}
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          <Image
            source={require('@/assets/images/logo.png')} // <-- Your local logo image
            style={styles.logoImage}
            resizeMode="contain"
          />
        </Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>
              <LogOut />

            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{ uri: 'https://randomuser.me/api/portraits/men/1.jpg' }}
              style={styles.profileImage}
            />
          </View>

          <View style={styles.nameContainer}>
            <Text style={styles.name}>{user?.name}</Text>
            <View style={styles.verifiedBadge}>
              {user?.verified && (

                <Check size={16} color={Colors.white} />

              )}
            </View>
          </View>
          <Text style={styles.username}>{user?.username}</Text>
          <Text style={styles.title}>{user?.jobTitle}</Text>


          <View style={styles.buttonRow}>
            <Button
              title="Edit Profile"
              variant="outline"
              size="small"
              onPress={handleEditProfile}
              style={styles.button}
            />
            <Button
              title="Share Card"
              variant="outline"
              size="small"
              onPress={handleShareCard}
              style={styles.button}
            />
            <Button
              title="View Business"
              variant="primary"
              size="small"
              onPress={handleViewBusiness}
              style={styles.button}
            />
          </View>
        </View>

        {/* Profile Completion Progress */}
        <View style={[styles.card, { marginTop: Spacing.md, marginHorizontal: Spacing.lg }]}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Profile Completion</Text>
            <Text style={profileCompletion == 100 ? styles.progressPercentSuccess : styles.progressPercent}>{profileCompletion}%</Text>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[
                profileCompletion == 100 ? styles.progressSuccess : styles.progressFill,
                { width: `${profileCompletion}%` }
              ]}
            />
          </View>
        </View>

        <View style={styles.section}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.sectionTitle}>About</Text>
            <TouchableOpacity onPress={handleEditAbout}>
              <Edit size={18} color={Colors.primary[900]} style={{ marginLeft: 8 }} />
            </TouchableOpacity>
          </View>
          <View style={styles.card}>
            <Text style={styles.aboutText}>{user?.aboutUs}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Business Details</Text>
          <View style={styles.card}>
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { width: '30%' }]}>Business</Text>
              <Text style={styles.detailValue}>{user?.businessName}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { width: '30%' }]}>Type</Text>
              <Text
                style={styles.detailValue}
              >
                {user?.businessType}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { width: '30%' }]}>GST Number</Text>
              <Text
                style={styles.detailValue}
              >
                {user?.gstNumber}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { width: '40%' }]}>Udyam Number</Text>
              <Text
                style={styles.detailValue}
              >
                {user?.udyamNumber}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Referrals Programs</Text>
              <Text style={styles.detailValue}>{5} </Text>
            </View>
          </View>
        </View>

        {/* <View style={styles.section}>
          <Text style={styles.sectionTitle}>Referral Program</Text>
          <View style={styles.card}>
            <Text style={styles.referralText}>{mockUser.referrals} referrals</Text>
            <Text style={styles.contactText}>{mockUser.phone}</Text>
            <Text style={styles.contactText}>{mockUser.email}</Text>
          </View>
        </View> */}

        <View style={styles.contactSection}>
          <View style={styles.contactInfo}>
            <View style={styles.contactItem}>
              <Phone size={20} color={Colors.primary[900]} />
              <Text style={styles.contactText}>{user?.phone}</Text>
            </View>
            <View style={styles.contactItem}>
              <Mail size={20} color={Colors.primary[900]} />
              <Text style={styles.contactText}>{user?.email}</Text>
            </View>
            <View style={styles.contactItem}>
              <MapPin size={20} color={Colors.primary[900]} />
              <Text style={styles.contactText}>{user?.location}</Text>
            </View>
          </View>
          <Button
            title={user?.businessName}
            variant="primary"
            size="small"
            onPress={handleViewBusiness}
            style={styles.businessButton}
          />
        </View>
      </ScrollView>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  backButton: {
    padding: Spacing.xs,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.gray[800],
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutText: {
    color: Colors.primary[900],
    fontSize: 14,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.xl,
    paddingTop: Spacing.md,
  },
  profileSection: {
    alignItems: 'center',
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[100],
  },
  logoImage: {
    width: 150,
    height: 30,
    marginBottom: 12,
  },
  profileImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.gray[200],
    overflow: 'hidden' as const,
    marginBottom: Spacing.md,
    alignSelf: 'center',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs / 2, // Using xs/2 instead of undefined xxs
  },
  name: {
    fontSize: 24,
    fontWeight: '600',
    marginRight: Spacing.xs,
  },
  verifiedBadge: {
    backgroundColor: Colors.primary[500],
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unverifiedText: {
    color: Colors.gray[600],
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 2,
    textAlign: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    color: Colors.gray[600],
    marginBottom: Spacing.lg,
  },
  username: {
    fontSize: 16,
    color: Colors.gray[600],

  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginHorizontal: -Spacing.xs,
  },
  button: {
    margin: Spacing.xs,
    flex: 1,
    minWidth: 100,
  },
  section: {
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[100],
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: Spacing.sm,
    color: Colors.gray[800],
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    // marginHorizontal: Spacing.lg,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.gray[800],
  },
  progressPercent: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary[600],
  },
  progressPercentSuccess: {
    fontSize: 16,
    fontWeight: '600',
    color: 'green',
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.gray[200],
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: Spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary[500],
    borderRadius: 4,
  },
  progressSuccess: {
    height: '100%',
    backgroundColor: "green",
    borderRadius: 4,
  },
  aboutText: {
    fontSize: 14,
    color: Colors.gray[700],
    lineHeight: 22,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,

    color: Colors.gray[600],
    flexShrink: 1,
  },
  detailValue: {
    textAlign: 'right',
    fontSize: 14,
    fontWeight: '500',
    color: Colors.gray[900],
    flex: 1,
    marginLeft: Spacing.md,
    flexShrink: 1,
    flexWrap: 'wrap',
  },
  referralText: {
    fontSize: 14,
    color: Colors.primary[900],
  },
  contactSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    borderBottomWidth: 2,
    borderBottomColor: Colors.gray[100],
  },
  contactInfo: {
    flex: 1,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  contactText: {
    fontSize: 14,
    marginLeft: Spacing.sm,
    color: Colors.gray[800],
  },
  businessButton: {
    marginLeft: Spacing.md,
    width: 150,
  },
  iconButton: {
    padding: Spacing.xs,
  },

  // button: {
  //   flex: 1,
  //   marginHorizontal: Spacing.xs,
  // },
});