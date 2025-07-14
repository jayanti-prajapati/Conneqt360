import React from 'react';
import { View, Text, StyleSheet, Modal, ScrollView, TouchableOpacity, Image } from 'react-native';
import { X, MapPin, Phone, Mail, Building, Hash, Globe, AtSign, Users, Award, Briefcase } from 'lucide-react-native';
import { useThemeStore } from '@/store/themeStore';
import { User } from '@/types';

interface UserProfileModalProps {
    visible: boolean;
    onClose: () => void;
    user: User;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
    visible,
    onClose,
    user,
}) => {
    const { theme } = useThemeStore();

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long'
        });
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose}
        >
            <View style={[styles.container, { backgroundColor: theme.background }]}>
                <View style={[styles.header, { borderBottomColor: theme.border }]}>
                    <TouchableOpacity onPress={onClose}>
                        <X size={24} color={theme.text} />
                    </TouchableOpacity>
                    <Text style={[styles.title, { color: theme.text }]}>Profile</Text>
                    <View style={{ width: 24 }} />
                </View>

                <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                    {/* Profile Section */}
                    <View style={styles.profileSection}>
                        <Image
                            source={{ uri: user.profileUrl || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=2' }}
                            style={styles.profileImage}
                        />
                        <Text style={[styles.profileName, { color: theme.text }]}>{user.name}</Text>
                        <Text style={[styles.profileEmail, { color: theme.textSecondary }]}>{user.email}</Text>
                        {user.aboutUs && (
                            <Text style={[styles.profileBio, { color: theme.text }]}>{user.aboutUs}</Text>
                        )}
                    </View>

                    {/* Stats Section */}
                    <View style={styles.statsSection}>
                        <View style={styles.statItem}>
                            <Text style={[styles.statNumber, { color: theme.text }]}>{user.postsCount || 0}</Text>
                            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Posts</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={[styles.statNumber, { color: theme.text }]}>{user.followersCount || 0}</Text>
                            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Followers</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={[styles.statNumber, { color: theme.text }]}>{user.followingCount || 0}</Text>
                            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Following</Text>
                        </View>
                    </View>

                    {/* Business Information */}
                    {(user.businessName || user.businessType) && (
                        <View style={[styles.infoSection, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                            <Text style={[styles.sectionTitle, { color: theme.text }]}>Business Information</Text>

                            {user.businessName && (
                                <View style={styles.infoItem}>
                                    <Building size={20} color={theme.textSecondary} />
                                    <View style={styles.infoContent}>
                                        <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Business Name</Text>
                                        <Text style={[styles.infoValue, { color: theme.text }]}>{user.businessName}</Text>
                                    </View>
                                </View>
                            )}

                            {user.businessType && (
                                <View style={styles.infoItem}>
                                    <Hash size={20} color={theme.textSecondary} />
                                    <View style={styles.infoContent}>
                                        <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Business Type</Text>
                                        <Text style={[styles.infoValue, { color: theme.text }]}>{user.businessType}</Text>
                                    </View>
                                </View>
                            )}

                            {user.businessEmail && (
                                <View style={styles.infoItem}>
                                    <AtSign size={20} color={theme.textSecondary} />
                                    <View style={styles.infoContent}>
                                        <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Business Email</Text>
                                        <Text style={[styles.infoValue, { color: theme.text }]}>{user.businessEmail}</Text>
                                    </View>
                                </View>
                            )}

                            {user.website && (
                                <View style={styles.infoItem}>
                                    <Globe size={20} color={theme.textSecondary} />
                                    <View style={styles.infoContent}>
                                        <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Website</Text>
                                        <Text style={[styles.infoValue, { color: theme.text }]}>{user.website}</Text>
                                    </View>
                                </View>
                            )}
                        </View>
                    )}

                    {/* Contact Information */}
                    <View style={[styles.infoSection, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                        <Text style={[styles.sectionTitle, { color: theme.text }]}>Contact Information</Text>

                        <View style={styles.infoItem}>
                            <Mail size={20} color={theme.textSecondary} />
                            <View style={styles.infoContent}>
                                <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Email</Text>
                                <Text style={[styles.infoValue, { color: theme.text }]}>{user.email}</Text>
                            </View>
                        </View>

                        {user.phone && (
                            <View style={styles.infoItem}>
                                <Phone size={20} color={theme.textSecondary} />
                                <View style={styles.infoContent}>
                                    <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Phone</Text>
                                    <Text style={[styles.infoValue, { color: theme.text }]}>{user.phone}</Text>
                                </View>
                            </View>
                        )}

                        {(user.address || user.city || user.state || user.country) && (
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

                    {/* Services Preview */}
                    {user.services && user.services.length > 0 && (
                        <View style={[styles.infoSection, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                            <View style={styles.sectionHeader}>
                                <Briefcase size={20} color={theme.primary} />
                                <Text style={[styles.sectionTitle, { color: theme.text }]}>Services</Text>
                            </View>
                            <View style={styles.servicesList}>
                                {user.services.slice(0, 6).map((service: any, index: any) => (
                                    <View key={index} style={[styles.serviceTag, { backgroundColor: theme.primary + '20' }]}>
                                        <Text style={[styles.serviceTagText, { color: theme.primary }]}>{service}</Text>
                                    </View>
                                ))}
                                {user.services.length > 6 && (
                                    <Text style={[styles.moreText, { color: theme.textSecondary }]}>
                                        +{user.services.length - 6} more
                                    </Text>
                                )}
                            </View>
                        </View>
                    )}

                    {/* Quick Stats */}
                    <View style={[styles.infoSection, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                        <Text style={[styles.sectionTitle, { color: theme.text }]}>Quick Stats</Text>

                        <View style={styles.quickStats}>
                            <View style={styles.quickStatItem}>
                                <Users size={24} color={theme.primary} />
                                <Text style={[styles.quickStatNumber, { color: theme.text }]}>{user.clients?.length || 0}</Text>
                                <Text style={[styles.quickStatLabel, { color: theme.textSecondary }]}>Clients</Text>
                            </View>

                            <View style={styles.quickStatItem}>
                                <Award size={24} color={theme.success} />
                                <Text style={[styles.quickStatNumber, { color: theme.text }]}>{user.catalog?.length || 0}</Text>
                                <Text style={[styles.quickStatLabel, { color: theme.textSecondary }]}>Projects</Text>
                            </View>

                            <View style={styles.quickStatItem}>
                                <Briefcase size={24} color={theme.warning} />
                                <Text style={[styles.quickStatNumber, { color: theme.text }]}>{user.services?.length || 0}</Text>
                                <Text style={[styles.quickStatLabel, { color: theme.textSecondary }]}>Services</Text>
                            </View>
                        </View>
                    </View>

                    {/* Member Since */}
                    <View style={[styles.memberSection, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                        <Text style={[styles.memberText, { color: theme.textSecondary }]}>
                            Member since {formatDate(user.createdAt)}
                        </Text>
                    </View>

                    <View style={styles.bottomPadding} />
                </ScrollView>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderBottomWidth: 1,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
    },
    content: {
        flex: 1,
    },
    profileSection: {
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 24,
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 16,
    },
    profileName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    profileEmail: {
        fontSize: 16,
        marginBottom: 8,
    },
    profileBio: {
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 20,
    },
    statsSection: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 16,
        paddingVertical: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    statItem: {
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 14,
    },
    infoSection: {
        marginHorizontal: 16,
        marginVertical: 12,
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        gap: 8,
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
    servicesList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        alignItems: 'center',
    },
    serviceTag: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    serviceTagText: {
        fontSize: 12,
        fontWeight: '500',
    },
    moreText: {
        fontSize: 12,
        fontStyle: 'italic',
    },
    quickStats: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    quickStatItem: {
        alignItems: 'center',
        gap: 8,
    },
    quickStatNumber: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    quickStatLabel: {
        fontSize: 12,
    },
    memberSection: {
        marginHorizontal: 16,
        marginVertical: 12,
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        alignItems: 'center',
    },
    memberText: {
        fontSize: 14,
        fontStyle: 'italic',
    },
    bottomPadding: {
        height: 40,
    },
});