import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Modal, ScrollView, TouchableOpacity, Image } from 'react-native';
import { X, MapPin, Phone, Mail, Building, Hash, Globe, AtSign, Users, Briefcase, Check, Settings } from 'lucide-react-native';
import { useThemeStore } from '@/store/themeStore';
import { BusinessCard } from '../profile/BusinessCard';
import { ProfileImageModal } from './ProfileImageModal';
import { SocialMediaModal } from '../profile/SocialMediaModal';
import Colors from '@/constants/Colors';
import Spacing from '@/constants/Spacing';
import Typography from '@/constants/Typography';
import { useRouter } from 'expo-router';
;
import useUsersStore from '@/store/useUsersStore';
import useUserBusinessServices from '@/store/useUserBusinessServices';
import CustomLoader from '../loader/CustomLoader';
import InfoCard from '../common/InfoCard';

import { Ionicons } from '@expo/vector-icons';
import Button from '../ui-components/Button';

interface UserProfileModalProps {
    visible: boolean;
    onClose: () => void;
    userId?: string;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
    visible,
    onClose,
    userId,
}) => {
    const { theme } = useThemeStore();
    const router = useRouter();
    const [user, setUser] = useState<any>(null)
    const [showBusinessCard, setShowBusinessCard] = useState(false);
    const [showProfileImage, setShowProfileImage] = useState(false);
    const [showSocialModal, setShowSocialModal] = useState(false);
    const [isAboutExpanded, setIsAboutExpanded] = useState(false);
    const { getUserById } = useUsersStore();
    const [isLoading, setIsLoading] = useState(false)
    const { response, getUserServicesByUserId } = useUserBusinessServices();
    const businessService = response?.data?.data || [];

    useEffect(() => {
        setUser(null)
        if (userId) {
            getUserData()
            getUserServicesByUserId(userId)
        }

    }, [userId])

    const getUserData = async () => {
        setIsLoading(true)
        if (!userId) return;
        const data = await getUserById(userId)
        if (data?.data?.statusCode === 200) {
            setUser(data.data.data);
            setIsLoading(false)
        }
        setIsLoading(false)
    }
    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long'
        });
    };




    const openCatalog = () => {
        router.push({
            pathname: '/business-catalog',
            params: {
                userId: userId

            },
        });
    };
    const openClients = () => {
        router.push({
            pathname: '/business-clients',
            params: { userId: userId },
        });
    };
    const openServices = () => {
        router.push({
            pathname: '/business-services',
            params: { userId: userId },
        });
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose}
        >
            {isLoading && <CustomLoader visible={isLoading} />}
            <View style={[styles.container]}>
                <View style={styles.header}>
                    <Text style={[styles.name, { fontSize: 20, marginLeft: Spacing.sm }]}>{user?.businessName || 'Unknown User'}</Text>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <X size={24} color={theme.text} />
                    </TouchableOpacity>
                </View>
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Profile Section */}









                    {/* Profile Section */}
                    < View style={styles.profileSection} >
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
                                    <Text style={styles.avatarText}>{user?.name?.charAt(0) ? user?.name?.charAt(0)?.toUpperCase() : "U"}</Text>
                                </View>
                            }


                        </View>

                        <View style={styles.nameContainer}>
                            <Text style={styles.name}>{user?.businessName || 'Unknown User'}</Text>
                            {user?.verified && (
                                <View style={styles.verifiedBadge}>
                                    <Check size={16} color={Colors.white} />
                                </View>
                            )}
                        </View>
                        <Text style={styles.title}>{user?.name || '-'}</Text>
                        <Text style={styles.username}>{user?.jobTitle || '-'}</Text>

                        <View style={[styles.buttonRow, { width: '100%' }]}>

                        </View>
                        <Button
                            title="View Business"
                            variant="primary"
                            size="medium"
                            onPress={() => setShowBusinessCard(true)}
                            style={{ ...styles.actionButton, width: '100%' }}
                        />
                    </View >


                    {/* catalogue */}
                    < View style={styles.businessFeaturesSection} >
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
                                {/* <Briefcase size={32} color={theme.primary} />
                                <Text style={[styles.featureTitle, { color: theme.text }]}>
                                    Catalog
                                </Text>
                                <Text
                                    style={[styles.featureSubtitle, { color: theme.textSecondary }]}
                                >
                                    {businessService?.catalog?.length || 0} items
                                </Text> */}
                            </Button>

                            <Button
                                title="Services"
                                variant="ghost"
                                style={styles.featureCard}
                                onPress={openServices}
                            >
                                {/* <Settings size={32} color={theme.primary} />
                                <Text>Services</Text>
                                <Text
                                    style={[styles.featureSubtitle, { color: theme.textSecondary }]}
                                >
                                    {businessService?.services?.length || 0} services
                                </Text> */}
                            </Button>

                            <Button
                                title="Clients"
                                variant="ghost"
                                style={styles.featureCard}
                                onPress={openClients}
                            >
                                {/* <Users size={32} color={theme.primary} />
                                <Text>Clients</Text>
                                <Text
                                    style={[styles.featureSubtitle, { color: theme.textSecondary }]}
                                >
                                    {businessService?.client?.length || 0} clients
                                </Text> */}
                            </Button>

                            <Button
                                title="Connect"
                                variant="ghost"
                                style={styles.featureCard}
                                onPress={() => setShowSocialModal(true)}
                            >

                            </Button>
                        </View>
                    </View >

                    {/* Business Information */}
                    {
                        (user?.businessName || user?.businessType) && (
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
                        )
                    }

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
                    {/* Member Since */}
                    <View style={[styles.memberSection, { borderColor: theme.border }]}>
                        <Text style={[styles.memberText, { color: theme.textSecondary }]}>
                            Member since {user?.createdAt ? formatDate(new Date(user?.createdAt)) : '-'}
                        </Text>
                    </View>
                </ScrollView>
                {showBusinessCard && (

                    <View style={styles.businessCardModal}>
                        <TouchableOpacity
                            style={styles.businessCardOverlay}
                            onPress={() => setShowBusinessCard(false)}
                        />
                        <View style={styles.businessCardContainer}>
                            {user && <BusinessCard user={user} setShowBusinessCard={setShowBusinessCard} />}
                        </View>
                    </View>
                )}
                {showProfileImage && <ProfileImageModal
                    visible={showProfileImage}
                    imageUri={user?.profileUrl || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2'}
                    onClose={() => setShowProfileImage(false)}
                />}

                {showSocialModal &&
                    <SocialMediaModal
                        visible={showSocialModal}
                        onClose={() => setShowSocialModal(false)}
                        socialMedia={user?.socialMedia || {}}
                        website={user?.website}
                        businessEmail={user?.businessEmail}
                    />}
            </View>
        </Modal>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        // paddingTop: Spacing.md,
        backgroundColor: Colors.gray[100],
    },
    closeButton: {
        padding: Spacing.sm,
    },
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
        borderBottomColor: Colors.white,
    },
    logoutButton: {
        marginHorizontal: Spacing.md,
        marginBottom: Spacing.md,
    },
    headerTitle: {
        fontSize: Typography.size.md,
        fontWeight: Typography.weight.bold as any,
        color: Colors.white,
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
        paddingBottom: Spacing.lg,
        paddingTop: Spacing.sm,
        marginBottom: Spacing.xxl,
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
        // marginTop: 10,
        // marginBottom: 20,
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

    },
    username: {
        fontSize: 16,
        color: Colors.gray[600],
        marginBottom: Spacing.lg,
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
    memberSection: {
        marginHorizontal: 16,
        marginVertical: 12,
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        backgroundColor: Colors.white,
        alignItems: 'center',
    },
    memberText: {
        fontSize: 14,
        fontStyle: 'italic',
    },
    bottomPadding: {
        height: 40,
    },
    card: {
        backgroundColor: Colors.white,
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
        color: Colors.blue,
    },
    progressPercent: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.blue,
    },
    progressPercentSuccess: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.blue,
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
        zIndex: 1000,
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
