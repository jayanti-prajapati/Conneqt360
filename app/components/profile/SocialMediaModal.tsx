import React from 'react';
import { View, Text, StyleSheet, Modal, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { X, ExternalLink, Linkedin, Twitter, Instagram, Facebook, Youtube } from 'lucide-react-native';
import { useThemeStore } from '@/store/themeStore';


interface SocialMediaModalProps {
    visible: boolean;
    onClose: () => void;
    socialMedia: {
        linkedin?: string;
        twitter?: string;
        instagram?: string;
        facebook?: string;
        youtube?: string;
    };
    website?: string;
    businessEmail?: string;
}

export const SocialMediaModal: React.FC<SocialMediaModalProps> = ({
    visible,
    onClose,
    socialMedia,
    website,
    businessEmail,
}) => {
    const { theme } = useThemeStore();

    const handleLinkPress = async (url: string, platform: string) => {
        try {
            const supported = await Linking.canOpenURL(url);
            if (supported) {
                await Linking.openURL(url);
            } else {
                Alert.alert('Error', `Cannot open ${platform} link`);
            }
        } catch (error) {
            Alert.alert('Error', `Failed to open ${platform} link`);
        }
    };

    const socialPlatforms = [
        {
            name: 'LinkedIn',
            icon: Linkedin,
            url: socialMedia.linkedin,
            color: '#0077B5',
            description: 'Connect with us professionally',
        },
        {
            name: 'Twitter',
            icon: Twitter,
            url: socialMedia.twitter,
            color: '#1DA1F2',
            description: 'Follow for latest updates',
        },
        {
            name: 'Instagram',
            icon: Instagram,
            url: socialMedia.instagram,
            color: '#E4405F',
            description: 'See our work and culture',
        },
        {
            name: 'Facebook',
            icon: Facebook,
            url: socialMedia.facebook,
            color: '#1877F2',
            description: 'Join our community',
        },
        {
            name: 'YouTube',
            icon: Youtube,
            url: socialMedia.youtube,
            color: '#FF0000',
            description: 'Watch our tutorials and demos',
        },
    ];

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
                    <Text style={[styles.title, { color: theme.text }]}>Connect With Us</Text>
                    <View style={{ width: 24 }} />
                </View>

                <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                    <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                        Follow us on social media and visit our website
                    </Text>

                    {/* Website Section */}
                    {website && (
                        <View style={styles.section}>
                            <Text style={[styles.sectionTitle, { color: theme.text }]}>Website</Text>
                            <TouchableOpacity
                                style={[styles.linkItem, { backgroundColor: theme.surface, borderColor: theme.border }]}
                                onPress={() => handleLinkPress(website, 'Website')}
                            >
                                <View style={[styles.iconContainer, { backgroundColor: theme.primary + '20' }]}>
                                    <ExternalLink size={24} color={theme.primary} />
                                </View>
                                <View style={styles.linkContent}>
                                    <Text style={[styles.linkTitle, { color: theme.text }]}>Official Website</Text>
                                    <Text style={[styles.linkUrl, { color: theme.primary }]}>{website}</Text>
                                    <Text style={[styles.linkDescription, { color: theme.textSecondary }]}>
                                        Visit our website for more information
                                    </Text>
                                </View>
                                <ExternalLink size={20} color={theme.textSecondary} />
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* Business Email Section */}
                    {businessEmail && (
                        <View style={styles.section}>
                            <Text style={[styles.sectionTitle, { color: theme.text }]}>Business Contact</Text>
                            <TouchableOpacity
                                style={[styles.linkItem, { backgroundColor: theme.surface, borderColor: theme.border }]}
                                onPress={() => handleLinkPress(`mailto:${businessEmail}`, 'Email')}
                            >
                                <View style={[styles.iconContainer, { backgroundColor: theme.success + '20' }]}>
                                    <Text style={[styles.emailIcon, { color: theme.success }]}>@</Text>
                                </View>
                                <View style={styles.linkContent}>
                                    <Text style={[styles.linkTitle, { color: theme.text }]}>Business Email</Text>
                                    <Text style={[styles.linkUrl, { color: theme.success }]}>{businessEmail}</Text>
                                    <Text style={[styles.linkDescription, { color: theme.textSecondary }]}>
                                        Send us an email for business inquiries
                                    </Text>
                                </View>
                                <ExternalLink size={20} color={theme.textSecondary} />
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* Social Media Section */}
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: theme.text }]}>Social Media</Text>

                        {socialPlatforms.map((platform) => {
                            if (!platform.url) return null;

                            return (
                                <TouchableOpacity
                                    key={platform.name}
                                    style={[styles.linkItem, { backgroundColor: theme.surface, borderColor: theme.border }]}
                                    onPress={() => handleLinkPress(platform.url!, platform.name)}
                                >
                                    <View style={[styles.iconContainer, { backgroundColor: platform.color + '20' }]}>
                                        <platform.icon size={24} color={platform.color} />
                                    </View>
                                    <View style={styles.linkContent}>
                                        <Text style={[styles.linkTitle, { color: theme.text }]}>{platform.name}</Text>
                                        <Text style={[styles.linkUrl, { color: platform.color }]}>{platform.url}</Text>
                                        <Text style={[styles.linkDescription, { color: theme.textSecondary }]}>
                                            {platform.description}
                                        </Text>
                                    </View>
                                    <ExternalLink size={20} color={theme.textSecondary} />
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    {/* Call to Action */}
                    <View style={[styles.ctaSection, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                        <Text style={[styles.ctaTitle, { color: theme.text }]}>Stay Connected</Text>
                        <Text style={[styles.ctaDescription, { color: theme.textSecondary }]}>
                            Follow us on social media for the latest updates, insights, and behind-the-scenes content.
                        </Text>
                        <View style={styles.socialIcons}>
                            {socialPlatforms.map((platform) => {
                                if (!platform.url) return null;

                                return (
                                    <TouchableOpacity
                                        key={platform.name}
                                        style={[styles.socialIcon, { backgroundColor: platform.color + '20' }]}
                                        onPress={() => handleLinkPress(platform.url!, platform.name)}
                                    >
                                        <platform.icon size={20} color={platform.color} />
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>
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
        paddingHorizontal: 16,
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        marginVertical: 16,
        lineHeight: 22,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    linkItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        marginBottom: 12,
        gap: 12,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emailIcon: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    linkContent: {
        flex: 1,
    },
    linkTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 2,
    },
    linkUrl: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 4,
    },
    linkDescription: {
        fontSize: 12,
        lineHeight: 16,
    },
    ctaSection: {
        padding: 20,
        borderRadius: 16,
        borderWidth: 1,
        marginBottom: 20,
        alignItems: 'center',
    },
    ctaTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    ctaDescription: {
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 16,
    },
    socialIcons: {
        flexDirection: 'row',
        gap: 12,
    },
    socialIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
});