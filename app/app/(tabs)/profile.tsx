import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, Share } from 'react-native';

import { useRouter } from 'expo-router';

import { Check, LogOut, Mail, Phone, MapPin, Globe, Users, Settings, Briefcase, Building, Hash, AtSign } from 'lucide-react-native';
import { pickImage } from '@/utils/imageUtils';
import { clearAuthData, getAuthData } from '@/services/secureStore';
import Colors from '@/constants/Colors';
import Spacing from '@/constants/Spacing';
import Form from '@/components/profile/Form';
import useUsersStore from '@/store/useUsersStore';
import CustomLoader from '@/components/loader/CustomLoader';
import About from '@/components/profile/About';
import { Ionicons } from '@expo/vector-icons';
import Typography from '@/constants/Typography';
import LogoutModal from '@/components/profile/LogoutModal';
import { BusinessCard } from '@/components/profile/BusinessCard';
import { useThemeStore } from '@/store/themeStore';
import { EditProfileModal } from '@/components/profile/EditProfileModal';
import { User } from '@/types';
import { ProfileImageModal } from '@/components/modal/ProfileImageModal';
import { HARDCODED_USER } from '@/components/mock/UserData';
import { SocialMediaModal } from '@/components/profile/SocialMediaModal';

// Mock user data



export default function ProfileScreen() {
  const router = useRouter();
  const { theme, isDark, toggleTheme } = useThemeStore();
  const [isPresent, setIsPresent] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isAbout, setIsAbout] = useState(false);
  const [isLogout, setIsLogout] = useState(false);
  const [showBusinessCard, setShowBusinessCard] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showProfileImage, setShowProfileImage] = useState(false);
  const [showCatalogModal, setShowCatalogModal] = useState(false);
  const [showServicesModal, setShowServicesModal] = useState(false);
  const [showClientsModal, setShowClientsModal] = useState(false);
  const [showSocialModal, setShowSocialModal] = useState(false);

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
      'businessEmail',
      'gstNumber',
      'address',
      'city',
      'state',
      "website",
      'aboutUs',
      'profileUrl',
    ];
    const completed = fields?.filter((field) => !!userData[field]).length;
    if (completed === 0) return 0; // Avoid division by zero
    return Math.round((completed / fields?.length) * 100);
  };


  const handleSubmit = async (updatedData: Partial<User>) => {


    try {
      if (user) {
        const updatedUser = { ...user, ...updatedData };

        const resp = await updateUser(user?._id, { ...updatedUser, isSkip: true });
        if (resp?.data?.statusCode === 201 || resp?.data?.statusCode === 200) {
          setUser(resp.data.data);


        } else {
          throw new Error(resp.data?.message || "Failed to update user");
        }
      }
    } catch (error: any) {
      console.error("Error updating user:", error);
    }
  };
  const handleShare = async () => {
    console.log("Share");

    try {
      await Share.share({
        message: `Connect with ${user.name} - ${user.businessName || 'Business Professional'}\n\nEmail: ${user.email}\nPhone: ${user.phone || 'Not provided'}\n\nShared via Business Network App`,
        title: `${user.name}'s Business Card`,
      });
    } catch (error) {
      console.error('Error sharing business card:', error);
    }
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
    setIsLogout(true);

  };

  const close = () => {
    setIsPresent(false);
    setIsAbout(false);
    fetchUserById();
    setIsLogout(false);
  };

  const openCatalog = () => {
    router.push({
      pathname: '/business-catalog',
      params: {
        catalog: JSON.stringify(HARDCODED_USER.catalog || []),
        owner: 'true'

      },
    });
  };
  const openClients = () => {
    router.push({
      pathname: '/business-clients',
      params: { clients: JSON.stringify(HARDCODED_USER.clients || []), owner: 'true' },
    });
  };
  const openServices = () => {
    router.push({
      pathname: '/business-services',
      params: { services: JSON.stringify(HARDCODED_USER.services || []), owner: 'true' },
    });
  };
  return (

    // <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Form isPresent={isPresent} onClose={close} closeText="Close" users={user} />
      <About isAbout={isAbout} onClose={close} userId={user?._id} />
      {/* Replace LogOut icon with a custom Logout modal/component if needed */}
      <LogoutModal isLogout={isLogout} onClose={close} />
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
              <TouchableOpacity onPress={() => setShowProfileImage(true)}>
                <Image
                  source={{
                    uri: user?.profileUrl,
                  }}
                  style={styles.profileImage}
                />
              </TouchableOpacity> :
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

          <View style={[styles.buttonRow, { width: "100%" }]}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: theme.primary, width: "45%" }]}
              onPress={() => setShowEditModal(true)}
            >
              <Text style={styles.actionButtonText}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: theme.primary, width: "45%" }]}
              onPress={() => handleShare()}
            >
              <Text style={styles.actionButtonText}>Share Card</Text>
            </TouchableOpacity>
            {/* <Button title="Edit Profile" variant="outline" size="small" onPress={() => setShowEditModal(true)} style={styles.button} />
            <Button title="Share Card" variant="outline" size="small" onPress={() => handleShare()} style={styles.button} /> */}



            {/* <Button title="View Business" variant="primary" size="small" onPress={() => setShowBusinessCard(true)} style={styles.button} /> */}
          </View>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.primary, width: "100%" }]}
            onPress={() => setShowBusinessCard(true)}
          >
            <Text style={styles.actionButtonText}>View Business</Text>
          </TouchableOpacity>
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
        {/* <View style={styles.section}>
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
        </View> */}
        {/* catalogue */}
        <View style={styles.businessFeaturesSection}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Business Features</Text>

          <View style={styles.featuresGrid}>
            <TouchableOpacity
              style={[styles.featureCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
              onPress={() => openCatalog()}
            >
              <Briefcase size={24} color={theme.primary} />
              <Text style={[styles.featureTitle, { color: theme.text }]}>Catalog</Text>
              <Text style={[styles.featureSubtitle, { color: theme.textSecondary }]}>
                {user?.catalog?.length || 0} items
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.featureCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
              onPress={() => openServices()}
            >
              <Settings size={24} color={theme.primary} />
              <Text style={[styles.featureTitle, { color: theme.text }]}>Services</Text>
              <Text style={[styles.featureSubtitle, { color: theme.textSecondary }]}>
                {user?.services?.length || 0} services
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.featureCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
              onPress={() => openClients()}
            >
              <Users size={24} color={theme.primary} />
              <Text style={[styles.featureTitle, { color: theme.text }]}>Clients</Text>
              <Text style={[styles.featureSubtitle, { color: theme.textSecondary }]}>
                {user?.clients?.length || 0} clients
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.featureCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
              onPress={() => setShowSocialModal(true)}
            >
              <Globe size={24} color={theme.primary} />
              <Text style={[styles.featureTitle, { color: theme.text }]}>Connect</Text>
              <Text style={[styles.featureSubtitle, { color: theme.textSecondary }]}>
                Social & Web
              </Text>
            </TouchableOpacity>
          </View>
        </View>


        {/* Business Information */}
        {(user?.businessName || user?.businessType) && (
          <View style={[styles.infoSection, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Business Information</Text>

            {user?.businessName && (
              <View style={styles.infoItem}>
                <Building size={20} color={theme.textSecondary} />
                <View style={styles.infoContent}>
                  <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Business Name</Text>
                  <Text style={[styles.infoValue, { color: theme.text }]}>{user.businessName}</Text>
                </View>
              </View>
            )}

            {user?.businessType && (
              <View style={styles.infoItem}>
                <Hash size={20} color={theme.textSecondary} />
                <View style={styles.infoContent}>
                  <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Business Type</Text>
                  <Text style={[styles.infoValue, { color: theme.text }]}>{user.businessType}</Text>
                </View>
              </View>
            )}

            {user?.businessEmail && (
              <View style={styles.infoItem}>
                <AtSign size={20} color={theme.textSecondary} />
                <View style={styles.infoContent}>
                  <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Business Email</Text>
                  <Text style={[styles.infoValue, { color: theme.text }]}>{user.businessEmail}</Text>
                </View>
              </View>
            )}

            {user?.website && (
              <View style={styles.infoItem}>
                <Globe size={20} color={theme.textSecondary} />
                <View style={styles.infoContent}>
                  <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Website</Text>
                  <Text style={[styles.infoValue, { color: theme.text }]}>{user.website}</Text>
                </View>
              </View>
            )}

            {user?.gstNumber && (
              <View style={styles.infoItem}>
                <Hash size={20} color={theme.textSecondary} />
                <View style={styles.infoContent}>
                  <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>GST Number</Text>
                  <Text style={[styles.infoValue, { color: theme.text }]}>{user.gstNumber}</Text>
                </View>
              </View>
            )}

            {user?.udyamNumber && (
              <View style={styles.infoItem}>
                <Hash size={20} color={theme.textSecondary} />
                <View style={styles.infoContent}>
                  <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Udyam Number</Text>
                  <Text style={[styles.infoValue, { color: theme.text }]}>{user.udyamNumber}</Text>
                </View>
              </View>
            )}
          </View>
        )}

        {/* Contact Information */}
        <View style={[styles.infoSection, { backgroundColor: theme.surface, borderColor: theme.border, marginBottom: 100 }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Contact Information</Text>

          {user?.email && <View style={styles.infoItem}>
            <Mail size={20} color={theme.textSecondary} />
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Email</Text>
              <Text style={[styles.infoValue, { color: theme.text }]}>{user?.email}</Text>
            </View>
          </View>}

          {user?.phone && (
            <View style={styles.infoItem}>
              <Phone size={20} color={theme.textSecondary} />
              <View style={styles.infoContent}>
                <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Phone</Text>
                <Text style={[styles.infoValue, { color: theme.text }]}>{user?.phone}</Text>
              </View>
            </View>
          )}

          {(user?.address || user?.city || user?.state || user?.country) && (
            <View style={styles.infoItem}>
              <MapPin size={20} color={theme.textSecondary} />
              <View style={styles.infoContent}>
                <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Address</Text>
                <Text style={[styles.infoValue, { color: theme.text }]}>
                  {[user.address, user.city, user.state, user.postalCode, user.country]
                    .filter(Boolean)
                    .join(', ')}
                </Text>
              </View>
            </View>
          )}
        </View>

      </ScrollView>
      {showBusinessCard && (
        <View style={styles.businessCardModal}>
          <TouchableOpacity
            style={styles.businessCardOverlay}
            onPress={() => setShowBusinessCard(false)}
          />
          <View style={styles.businessCardContainer}>
            <BusinessCard user={user} />
            <TouchableOpacity
              style={[styles.closeBusinessCardButton, { backgroundColor: theme.surface }]}
              onPress={() => setShowBusinessCard(false)}
            >
              <Text style={[styles.closeBusinessCardText, { color: theme.text }]}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {showEditModal && <EditProfileModal
        visible={showEditModal}
        onClose={() => setShowEditModal(false)}
        user={user}
        onSave={handleSubmit}
      />}

      {showProfileImage && <ProfileImageModal
        visible={showProfileImage}
        imageUri={user.profileUrl || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2'}
        onClose={() => setShowProfileImage(false)}
      />}

      {showSocialModal &&
        <SocialMediaModal
          visible={showSocialModal}
          onClose={() => setShowSocialModal(false)}
          socialMedia={user.socialMedia || {}}
          website={user.website}
          businessEmail={user.businessEmail}
        />}


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
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    gap: 6,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
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
  businessFeaturesSection: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  featureCard: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    gap: 8,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  featureSubtitle: {
    fontSize: 12,
    textAlign: 'center',
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
    gap: 4,

    justifyContent: 'space-between',
    marginHorizontal: -Spacing.xs,
    marginBottom: Spacing.sm
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
  // sectionTitle: {
  //   fontSize: 16,
  //   fontWeight: '600',
  //   marginBottom: Spacing.sm,
  //   color: Colors.gray[800],
  // },
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

  businessCardModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  businessCardOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  businessCardContainer: {
    margin: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  closeBusinessCardButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  closeBusinessCardText: {
    fontSize: 16,
    fontWeight: '600',
  },
  infoSection: {
    marginHorizontal: 16,
    marginVertical: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    lineHeight: 22,
  },
});