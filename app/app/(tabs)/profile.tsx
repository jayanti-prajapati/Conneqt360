import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  Share,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import Button from '@/components/ui-components/Button';

import { navigate } from '@/utils/navigation';
import Layout from '@/components/common/Layout';

import {
  Check,
  Mail,
  Phone,
  MapPin,
  Globe,
  Users,
  Settings,
  Briefcase,
  Building,
  Hash,
  AtSign,
} from 'lucide-react-native';
import { pickImage } from '@/utils/imageUtils';
import { clearAuthData, getAuthData } from '@/services/secureStore';
import Colors from '@/constants/Colors';
import Spacing from '@/constants/Spacing';
import Form from '@/components/profile/Form';
import useUsersStore from '@/store/useUsersStore';
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
import InfoItem from '@/components/common/InfoItem';
import InfoCard from '@/components/common/InfoCard';
// Remove any lingering useRouter variable declarations
// (If you see '' anywhere below, delete it)

const userMockData: User = {
  id: 'user123',
  email: 'demo@business.com',
  name: 'Demo User',
  profileUrl:
    'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
  aboutUs: 'Business professional passionate about networking and growth',
  businessName: 'TechSolutions Pro',
  businessType: 'Technology Consulting',
  businessEmail: 'contact@techsolutionspro.com',
  website: 'https://techsolutionspro.com',
  phone: '+1 (555) 123-4567',
  address: '123 Business Street',
  city: 'San Francisco',
  state: 'California',
  postalCode: '94105',
  country: 'United States',
  gstNumber: '29ABCDE1234F1Z5',
  udyamNumber: 'UDYAM-CA-12-1234567',
  socialMedia: {
    linkedin: 'https://linkedin.com/in/demouser',
    twitter: 'https://twitter.com/demouser',
    instagram: 'https://instagram.com/demouser',
    facebook: 'https://facebook.com/demouser',
    youtube: 'https://youtube.com/@demouser',
  },
  services: [
    'Web Development',
    'Mobile App Development',
    'Cloud Solutions',
    'Digital Marketing',
    'Business Consulting',
    'UI/UX Design',
  ],
  followersCount: 1250,
  followingCount: 890,
  postsCount: 45,
  isOnline: true,
  lastSeen: new Date(),
  createdAt: new Date('2023-01-15'),
};

export default function ProfileScreen() {
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
        navigate('(auth)');
        return;
      }

      const response = await getUserById(userId);
      console.log('response', response.data.data);
      if (response?.data?.statusCode === 200) {
        setUser(response.data.data);
      } else {
        clearAuthData();
        navigate('(auth)');
      }
      setUser(userMockData);
    } catch (error) {
      console.error('Error fetching user:', error);
      clearAuthData();
      router.replace('/(auth)/login');
    }
  };

  useEffect(() => {
    fetchUserById();
  }, []);

  const onLogoutPress = () => {
    clearAuthData();
    router.replace('/(auth)/login');
  };

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
      'website',
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
        console.log('updatedUser', updatedUser);
        const resp = await updateUser(user?._id, {
          ...updatedUser,
          isSkip: true,
        });
        if (resp?.data?.statusCode === 201 || resp?.data?.statusCode === 200) {
          setUser(resp.data.data);
        } else {
          throw new Error(resp.data?.message || 'Failed to update user');
        }
      }
    } catch (error: any) {
      console.error('Error updating user:', error);
    }
  };
  const handleShare = async () => {
    console.log('Share');

    try {
      await Share.share({
        message: `Connect with ${user.name} - ${
          user.businessName || 'Business Professional'
        }\n\nEmail: ${user.email}\nPhone: ${
          user.phone || 'Not provided'
        }\n\nShared via Business Network App`,
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
    navigate('business-catalog', {
      catalog: JSON.stringify(HARDCODED_USER.catalog || []),
      owner: 'true',
    });
  };
  const openClients = () => {
    navigate('business-clients', {
      clients: JSON.stringify(HARDCODED_USER.clients || []),
      owner: 'true',
    });
  };
  const openServices = () => {
    navigate('business-services', {
      services: JSON.stringify(HARDCODED_USER.services || []),
      owner: 'true',
    });
  };
  // if (loading) {
  //   return <CustomLoader visible={loading} />;
  // }
  return (
    <Layout showBackButton title={'Profile'} scrollable>
      <Form
        isPresent={isPresent}
        onClose={close}
        closeText="Close"
        users={user}
      />
      <About isAbout={isAbout} onClose={close} userId={user?._id} />
      <LogoutModal isLogout={isLogout} onClose={close} />

      <View style={styles.scrollContent}>
        {/* Profile Completion */}
        <View style={[styles.card]}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Profile Completion</Text>
            <Text
              style={
                profileCompletion === 100
                  ? styles.progressPercentSuccess
                  : styles.progressPercent
              }
            >
              {profileCompletion}%
            </Text>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[
                profileCompletion === 100
                  ? styles.progressSuccess
                  : styles.progressFill,
                { width: `${profileCompletion}%` },
              ]}
            />
          </View>
        </View>

        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            {user?.profileUrl ? (
              <Button
                onPress={() => setShowProfileImage(true)}
                variant="ghost"
                style={{ padding: 0 }}
              >
                <Image
                  source={{
                    uri: user?.profileUrl,
                  }}
                  style={styles.profileImage}
                />
              </Button>
            ) : (
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {user?.username?.charAt(0)
                    ? user?.username?.charAt(0)?.toUpperCase()
                    : 'U'}
                </Text>
              </View>
            )}

            <View style={styles.imageUploadOverlay}>
              <Button
                variant="ghost"
                size="small"
                onPress={handleProfileImageUpload}
                style={styles.uploadButton}
                isIconOnly
                icon={<Ionicons name="camera" size={15} color="black" />}
              />
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

          <View style={[styles.buttonRow, { width: '100%' }]}>
            <Button
              title="Edit Profile"
              variant="ghost"
              size="medium"
              onPress={() => setShowEditModal(true)}
              style={styles.actionButton}
            />

            <Button
              title="Share Card"
              variant="ghost"
              size="medium"
              onPress={handleShare}
              style={styles.actionButton}
            ></Button>
          </View>
          <Button
            title="View Business"
            variant="primary"
            size="medium"
            onPress={() => setShowBusinessCard(true)}
            style={{ ...styles.actionButton, width: '100%' }}
          />
        </View>

        {/* catalogue */}
        <View style={styles.businessFeaturesSection}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Business Features
          </Text>

          <View style={styles.featuresGrid}>
            <Button
              title="Catalog"
              variant="ghost"
              style={styles.featureCard}
              onPress={openCatalog}
            >
              <Briefcase size={32} color={theme.primary} />
              <Text style={[styles.featureTitle, { color: theme.text }]}>
                Catalog
              </Text>
              <Text
                style={[styles.featureSubtitle, { color: theme.textSecondary }]}
              >
                {user?.catalog?.length || 0} items
              </Text>
            </Button>

            <Button
              title="Services"
              variant="ghost"
              style={styles.featureCard}
              onPress={openServices}
            >
              <Settings size={32} color={theme.primary} />
              <Text>Services</Text>
              <Text
                style={[styles.featureSubtitle, { color: theme.textSecondary }]}
              >
                {user?.services?.length || 0} services
              </Text>
            </Button>

            <Button
              title="Clients"
              variant="ghost"
              style={styles.featureCard}
              onPress={openClients}
            >
              <Users size={32} color={theme.primary} />
              <Text>Clients</Text>
              <Text
                style={[styles.featureSubtitle, { color: theme.textSecondary }]}
              >
                {user?.clients?.length || 0} clients
              </Text>
            </Button>

            <Button
              title="Connect"
              variant="ghost"
              style={styles.featureCard}
              onPress={() => setShowSocialModal(true)}
            >
              <Globe size={32} color={theme.primary} />
              <Text>Connect</Text>
              <Text>Social & Web</Text>
            </Button>
          </View>
        </View>

        {/* Business Information */}
        {(user?.businessName || user?.businessType) && (
          <InfoCard
            title="Business Information"
            items={[
              {
                label: 'Business Name',
                value: user?.businessName,
                icon: <Building size={30} color={theme.textSecondary} />,
              },
              {
                label: 'Business Type',
                value: user?.businessType,
                icon: <Hash size={32} color={Colors.gray[400]} />,
              },
              {
                label: 'Business Email',
                value: user?.businessEmail,
                icon: <AtSign size={32} color={Colors.gray[400]} />,
              },
              {
                label: 'Website',
                value: user?.website,
                icon: <Globe size={32} color={Colors.gray[400]} />,
              },
              {
                label: 'GST Number',
                value: user?.gstNumber,
                icon: <Hash size={32} color={Colors.gray[400]} />,
              },
              {
                label: 'Udyam Number',
                value: user?.udyamNumber,
                icon: <Hash size={32} color={Colors.gray[400]} />,
              },
            ]}
          />
        )}

        <InfoCard
          title="Contact Information"
          items={[
            {
              label: 'Email',
              value: user?.email,
              icon: <Mail size={32} color={Colors.gray[400]} />,
            },
            {
              label: 'Phone',
              value: user?.phone,
              icon: <Phone size={32} color={Colors.gray[400]} />,
            },
            {
              label: 'Address',
              value: [
                user?.address,
                user?.city,
                user?.state,
                user?.postalCode,
                user?.country,
              ]
                .filter(Boolean)
                .join(', '),
              icon: <MapPin size={32} color={Colors.gray[400]} />,
            },
          ]}
        />

        {showBusinessCard && user && (
          <View style={styles.businessCardModal}>
            <Button
              variant="ghost"
              style={styles.businessCardOverlay as ViewStyle}
              onPress={() => setShowBusinessCard(false)}
            />
            <View style={styles.businessCardContainer}>
              <BusinessCard user={user} />
              <Button
                variant="outline"
                size="small"
                onPress={() => setShowBusinessCard(false)}
                style={styles.closeBusinessCardButton}
              >
                Close
              </Button>
            </View>
          </View>
        )}

        {showEditModal && user && (
          <EditProfileModal
            visible={showEditModal}
            onClose={() => setShowEditModal(false)}
            user={user}
            onSave={handleSubmit}
          />
        )}

        {showProfileImage && user?.profileUrl && (
          <ProfileImageModal
            visible={showProfileImage}
            imageUri={user.profileUrl}
            onClose={() => setShowProfileImage(false)}
          />
        )}

        {showSocialModal && user && (
          <SocialMediaModal
            visible={showSocialModal}
            onClose={() => setShowSocialModal(false)}
            socialMedia={user.socialMedia || {}}
            website={user.website}
            businessEmail={user.businessEmail}
          />
        )}
        <Button
          title="Logout"
          style={styles.logoutButton}
          variant="ghost"
          onPress={handleLogout}
        />
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  avatarText: {
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
    gap: 6,
  },
  actionButtonText: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.bold as any,
    color: '#FFFFFF',
  },
  header: {
    marginTop: Spacing.md,
    paddingVertical: Spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[100],
  },
  logoutButton: {
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },
  headerTitle: {
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.bold as any,
    color: Colors.gray[800],
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutText: {
    color: Colors.primary[900],
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.bold as any,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.sm,
    paddingTop: Spacing.sm,
    marginBottom: Spacing.xxl,
  },
  profileSection: {
    alignItems: 'center',
    padding: Spacing.md,
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
    width: 110,
    height: 110,
    borderRadius: '100%',
    alignSelf: 'center',
    marginTop: Spacing.xs,
    marginBottom: Spacing.md,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: '100%',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  imageUploadOverlay: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: Colors.gray[200],
    borderRadius: '100%',
    padding: 8,
    zIndex: 1,
  },
  uploadButton: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.gray[200],
    borderRadius: '100%',
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
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.bold as any,
    marginBottom: Spacing.md,
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
    backgroundColor: Colors.white,
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
    borderRadius: '100%',
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
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
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
    backgroundColor: Colors.primary[600],
    borderRadius: 12,
    padding: Spacing.md,
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.sm,
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
    color: Colors.white,
  },
  progressPercent: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
  },
  progressPercentSuccess: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
  },

  progressBar: {
    height: 16,
    backgroundColor: Colors.primary[200],
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: Spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.white,
    borderRadius: 8,
  },
  progressSuccess: {
    height: '100%',
    backgroundColor: 'green',
    borderRadius: 8,
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
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  businessCardContainer: {
    margin: 20,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: Colors.white,
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
    backgroundColor: Colors.white,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
    gap: Spacing.md,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: Spacing.xs,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 22,
  },
});
