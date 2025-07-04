import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { Check, LogOut, Mail, Phone, Edit, MapPin, Camera } from 'lucide-react-native';
import { pickImage } from '@/utils/imageUtils';
import Button from '@/components/common/Button';
import { clearAuthData, getAuthData } from '@/services/secureStore';
import Colors from '@/constants/Colors';
import Spacing from '@/constants/Spacing';
import Form from '@/components/profile/Form';
import useUsersStore from '@/store/useUsersStore';
import CustomLoader from '@/components/loader/CustomLoader';
import About from '@/components/profile/About';
import { Ionicons } from '@expo/vector-icons';
import Typography from '@/constants/Typography';

// Mock user data



export default function ProfileScreen() {
  const router = useRouter();

  const [isPresent, setIsPresent] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isAbout, setIsAbout] = useState(false);

  const { loading, getUserById, updateUser } = useUsersStore();

  // Fetch user data
  const fetchUserById = async () => {
    try {
      const data = await getAuthData();
      const userId = data?.userData?.data?._id;

      if (!userId) {
        clearAuthData();
        router.replace('/(auth)/login');
        return;
      }

      const response = await getUserById(userId);
      if (response?.data?.statusCode === 200) {
        setUser(response.data.data);
      } else {
        clearAuthData();
        router.replace('/(auth)/login');
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      clearAuthData();
      router.replace('/(auth)/login');
    }
  };

  useEffect(() => {
    fetchUserById();
  }, []);

  // Profile completion calculation
  const calculateProfileCompletion = (userData: any = {}) => {
    const fields = [
      'name',
      'jobTitle',
      'email',
      'phone',
      'username',
      'businessName',
      'businessType',
      'gstNumber',
      'udyamNumber',
      'location',
      'aboutUs',
      'profileUrl',
    ];
    const completed = fields?.filter((field) => !!userData[field]).length;
    if (completed === 0) return 0; // Avoid division by zero
    return Math.round((completed / fields?.length) * 100);
  };

  const profileCompletion = user ? calculateProfileCompletion(user) : 0;

  const handleProfileImageUpload = async () => {
    try {
      const image = await pickImage();
      if (image && user?._id) {
        const resp = await updateUser(user._id, { profileUrl: image });
        if ([200, 201].includes(resp?.data?.statusCode)) {
          fetchUserById();
        }
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const handleLogout = () => {
    clearAuthData();
    router.replace('/(auth)/login');
  };

  const close = () => {
    setIsPresent(false);
    setIsAbout(false);
    fetchUserById();
  };

  return (

    // <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Form isPresent={isPresent} onClose={close} closeText="Close" users={user} />
      <About isAbout={isAbout} onClose={close} userId={user?._id} />
      {loading && <CustomLoader visible={loading} />}

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={router.back} style={styles.backButton} />
        <Text style={styles.headerTitle}>
          <Image source={require('../../assets/images/logo.png')} style={styles.logoImage} resizeMode="contain" />
        </Text>
        <TouchableOpacity onPress={handleLogout} style={styles.iconButton}>
          <LogOut />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            {user?.profileUrl ?
              <Image
                source={{
                  uri: user?.profileUrl,
                }}
                style={styles.profileImage}
              /> :
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{user?.username?.charAt(0) ? user?.username?.charAt(0)?.toUpperCase() : "U"}</Text>
              </View>
            }

            <View style={styles.imageUploadOverlay}>
              <TouchableOpacity style={styles.uploadButton} onPress={handleProfileImageUpload}>
                <Ionicons name="camera" size={15} color="black" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.nameContainer}>
            <Text style={styles.name}>{user?.name || 'Unknown User'}</Text>
            {user?.verified && (
              <View style={styles.verifiedBadge}>
                <Check size={16} color={Colors.white} />
              </View>
            )}
          </View>
          <Text style={styles.username}>{user?.username || '-'}</Text>
          <Text style={styles.title}>{user?.jobTitle || '-'}</Text>

          <View style={styles.buttonRow}>
            <Button title="Edit Profile" variant="outline" size="small" onPress={() => setIsPresent(true)} style={styles.button} />
            <Button title="Share Card" variant="outline" size="small" onPress={() => console.log('Share card')} style={styles.button} />
            <Button title="View Business" variant="primary" size="small" onPress={() => console.log('View business')} style={styles.button} />
          </View>
        </View>

        {/* Profile Completion */}
        <View style={[styles.card, { marginTop: Spacing.md, marginHorizontal: Spacing.lg }]}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Profile Completion</Text>
            <Text style={profileCompletion === 100 ? styles.progressPercentSuccess : styles.progressPercent}>
              {profileCompletion}%
            </Text>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[
                profileCompletion === 100 ? styles.progressSuccess : styles.progressFill,
                { width: `${profileCompletion}%` },
              ]}
            />
          </View>
        </View>

        {/* About */}
        <View style={styles.section}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.sectionTitle}>About</Text>
            <TouchableOpacity onPress={() => setIsAbout(true)}>
              <Edit size={18} color={Colors.primary[900]} style={{ marginLeft: 8 }} />
            </TouchableOpacity>
          </View>
          {user?.aboutUs ? (
            <View style={styles.card}>
              <Text style={styles.aboutText}>{user.aboutUs}</Text>
            </View>
          ) : (
            <Text style={{ color: Colors.gray[400] }}>No description available.</Text>
          )}
        </View>

        {/* Business Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Business Details</Text>
          <View style={styles.card}>
            {[
              ['Business', user?.businessName],
              ['Type', user?.businessType],
              ['GST Number', user?.gstNumber],
              ['Udyam Number', user?.udyamNumber],
              ['Referrals Programs', '5'], // Hardcoded as in your code
            ].map(([label, value]) => (
              <View key={label} style={styles.detailRow}>
                <Text style={[styles.detailLabel, { width: '40%' }]}>{label}</Text>
                <Text style={styles.detailValue}>{value || '-'}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Contact Info */}
        <View style={styles.contactSection}>
          <View style={styles.contactInfo}>
            {[
              [<Phone size={20} color={Colors.primary[900]} />, user?.phone],
              [<Mail size={20} color={Colors.primary[900]} />, user?.email],
              [<MapPin size={20} color={Colors.primary[900]} />, user?.location],
            ].map(([Icon, info], idx) => (
              <View key={idx} style={styles.contactItem}>
                {Icon}
                <Text style={styles.contactText}>{info || '-'}</Text>
              </View>
            ))}
          </View>
          <Button
            title={user?.businessName || 'Business'}
            variant="primary"
            size="small"
            onPress={() => console.log('View business')}
            style={styles.businessButton}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
    // </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Spacing.md,
    backgroundColor: Colors.white,
  },
  avatarText: {
    // width: '100%',
    // height: '100%',
    color: Colors.primary[700],
    fontSize: 40,
    fontWeight: Typography.weight.bold as any,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: Colors.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
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
    position: 'relative',
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  imageUploadOverlay: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: Colors.gray[200],
    borderRadius: 20,
    padding: 8,
    zIndex: 1,
  },
  uploadButton: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.gray[200],
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'white',
  },
  profileImageContainerActive: {
    opacity: 1,
  },
  // profileImage: {
  //   width: '100%',
  //   height: '100%',
  // },
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
    marginBottom: Spacing.md,
    // paddingBottom: Spacing.md,
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