import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Share, Dimensions } from 'react-native';
import { Building, Mail, Phone, MapPin, Share as ShareIcon, QrCode } from 'lucide-react-native';
import { useThemeStore } from '@/store/themeStore';
import { User } from '@/types';


const { width } = Dimensions.get('window');

interface BusinessCardProps {
    user: User;
    onShare?: () => void;
}

export const BusinessCard: React.FC<BusinessCardProps> = ({ user, onShare }) => {
    const { theme } = useThemeStore();

    const handleShare = async () => {
        try {
            await Share.share({
                message: `Connect with ${user.name} - ${user.businessName || 'Business Professional'}\n\nEmail: ${user.email}\nPhone: ${user.phone || 'Not provided'}\n\nShared via Business Network App`,
                title: `${user.name}'s Business Card`,
            });
        } catch (error) {
            console.error('Error sharing business card:', error);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            {/* Header with gradient background */}
            <View style={[styles.header, { backgroundColor: theme.primary }]}>
                <View style={styles.headerContent}>
                    <Image
                        source={{ uri: user.profileUrl || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2' }}
                        style={styles.profileImage}
                    />
                    <View style={styles.headerText}>
                        <Text style={styles.name} numberOfLines={2}>{user.name}</Text>
                        <Text style={styles.title} numberOfLines={2}>
                            {user.businessName || 'Business Professional'}
                        </Text>
                        {user.businessType && (
                            <Text style={styles.businessType} numberOfLines={1}>{user.businessType}</Text>
                        )}
                    </View>
                </View>
            </View>

            {/* Contact Information */}
            <View style={styles.content}>
                <View style={styles.contactSection}>
                    <View style={styles.contactItem}>
                        <Mail size={16} color={theme.primary} />
                        <Text style={[styles.contactText, { color: theme.text }]} numberOfLines={1}>{user.email}</Text>
                    </View>

                    {user.phone && (
                        <View style={styles.contactItem}>
                            <Phone size={16} color={theme.primary} />
                            <Text style={[styles.contactText, { color: theme.text }]} numberOfLines={1}>{user.phone}</Text>
                        </View>
                    )}

                    {(user.address || user.city) && (
                        <View style={styles.contactItem}>
                            <MapPin size={16} color={theme.primary} />
                            <Text style={[styles.contactText, { color: theme.text }]} numberOfLines={2}>
                                {[user.address, user.city, user.state, user.country]
                                    .filter(Boolean)
                                    .join(', ')}
                            </Text>
                        </View>
                    )}

                    {user.businessName && (
                        <View style={styles.contactItem}>
                            <Building size={16} color={theme.primary} />
                            <Text style={[styles.contactText, { color: theme.text }]} numberOfLines={2}>{user.businessName}</Text>
                        </View>
                    )}
                </View>

                {/* Business Details */}
                {(user?.gstNumber || user?.udyamNumber) && (
                    <View style={[styles.businessSection, { borderTopColor: theme.border }]}>
                        <Text style={[styles.sectionTitle, { color: theme.text }]}>Business Details</Text>
                        {user?.businessName && (
                            <View style={styles.businessItem}>
                                <Text style={[styles.businessLabel, { color: theme.textSecondary }]}>Business Name</Text>
                                <Text style={[styles.businessValue, { color: theme.text }]} numberOfLines={1}>{user.businessName}</Text>
                            </View>
                        )}
                        {user?.businessType && (
                            <View style={styles.businessItem}>
                                <Text style={[styles.businessLabel, { color: theme.textSecondary }]}>Business Type</Text>
                                <Text style={[styles.businessValue, { color: theme.text }]} numberOfLines={1}>{user.businessType}</Text>
                            </View>
                        )}
                        {user?.businessEmail && (
                            <View style={styles.businessItem}>
                                <Text style={[styles.businessLabel, { color: theme.textSecondary }]}>Business Email</Text>
                                <Text style={[styles.businessValue, { color: theme.text }]} numberOfLines={1}>{user.businessEmail}</Text>
                            </View>
                        )}

                        {user.gstNumber && (
                            <View style={styles.businessItem}>
                                <Text style={[styles.businessLabel, { color: theme.textSecondary }]}>GST Number</Text>
                                <Text style={[styles.businessValue, { color: theme.text }]} numberOfLines={1}>{user.gstNumber}</Text>
                            </View>
                        )}


                        {user.udyamNumber && (
                            <View style={styles.businessItem}>
                                <Text style={[styles.businessLabel, { color: theme.textSecondary }]}>Udyam Number</Text>
                                <Text style={[styles.businessValue, { color: theme.text }]} numberOfLines={1}>{user.udyamNumber}</Text>
                            </View>
                        )}
                        {user?.website && (
                            <View style={styles.businessItem}>
                                <Text style={[styles.businessLabel, { color: theme.textSecondary }]}>website</Text>
                                <Text style={[styles.businessValue, { color: theme.text }]} numberOfLines={1}>{user?.website}</Text>
                            </View>
                        )}
                    </View>
                )}

                {/* Action Buttons */}
                <View style={styles.actionButtons}>
                    <TouchableOpacity
                        style={[styles.actionButton, { backgroundColor: theme.primary }]}
                        onPress={handleShare}
                    >
                        <ShareIcon size={18} color="#FFFFFF" />
                        <Text style={styles.actionButtonText}>Share</Text>
                    </TouchableOpacity>

                    {/* <TouchableOpacity
                        style={[styles.actionButton, { backgroundColor: theme.surface, borderColor: theme.border, borderWidth: 1 }]}
                    >
                        <QrCode size={18} color={theme.primary} />
                        <Text style={[styles.actionButtonText, { color: theme.primary }]}>QR Code</Text>
                    </TouchableOpacity> */}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: Math.min(width - 40, 400),
        maxWidth: 400,
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
        alignSelf: 'center',
    },
    header: {
        padding: 16,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    profileImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 2,
        borderColor: '#FFFFFF',
        marginRight: 12,
    },
    headerText: {
        flex: 1,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 2,
    },
    title: {
        fontSize: 14,
        color: '#FFFFFF',
        opacity: 0.9,
        marginBottom: 2,
    },
    businessType: {
        fontSize: 12,
        color: '#FFFFFF',
        opacity: 0.8,
    },
    content: {
        padding: 16,
    },
    contactSection: {
        marginBottom: 16,
    },
    contactItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        gap: 10,
    },
    contactText: {
        fontSize: 14,
        flex: 1,
    },
    businessSection: {
        borderTopWidth: 1,
        paddingTop: 12,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 10,
    },
    businessItem: {
        marginBottom: 6,
    },
    businessLabel: {
        fontSize: 11,
        fontWeight: '500',
        marginBottom: 1,
    },
    businessValue: {
        fontSize: 14,
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 10,
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
});