import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Modal, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { X, Save } from 'lucide-react-native';
import { User } from '@/types';
import { useThemeStore } from '@/store/themeStore';


interface EditProfileModalProps {
    visible: boolean;
    onClose: () => void;
    user: User;
    onSave: (updatedUser: Partial<User>) => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
    visible,
    onClose,
    user,
    onSave,
}) => {
    const { theme } = useThemeStore();

    // console.log(user.postalCode);

    const [formData, setFormData] = useState({
        name: user.name || '',
        email: user.email || '',
        username: user.username || '',
        jobTitle: user.jobTitle || '',
        aboutUs: user.aboutUs || '',
        businessName: user.businessName || '',
        businessType: user.businessType || '',
        businessEmail: user.businessEmail || '',
        website: user.website || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        postalCode: JSON.stringify(user.postalCode) || '',
        country: user.country || '',
        gstNumber: user.gstNumber || '',
        udyamNumber: user.udyamNumber || '',
        linkedin: user.socialMedia?.linkedin || '',
        twitter: user.socialMedia?.twitter || '',
        instagram: user.socialMedia?.instagram || '',
        facebook: user.socialMedia?.facebook || '',
        youtube: user.socialMedia?.youtube || '',
    });

    const handleSave = () => {
        if (!formData.name.trim() || !formData.email.trim()) {
            Alert.alert('Error', 'Name and email are required fields.');
            return;
        }
        if (!formData.jobTitle.trim()) {
            Alert.alert('Error', 'Job Title are required fields.');
            return;
        }
        if (!formData.businessName.trim()) {
            Alert.alert('Error', 'Business Name are required fields.');
            return;
        }
        if (!formData.businessEmail.trim()) {
            Alert.alert('Error', 'Business Email are required fields.');
            return;
        }
        if (!formData.businessType.trim()) {
            Alert.alert('Error', 'Business Type are required fields.');
            return;
        }
        if (!formData.gstNumber.trim()) {
            Alert.alert('Error', 'Gst Number are required fields.');
            return;
        }

        const updatedUser: Partial<User> = {
            name: formData.name,
            email: formData.email,
            aboutUs: formData.aboutUs,
            username: formData.username,
            jobTitle: formData.jobTitle,
            businessName: formData.businessName,
            businessType: formData.businessType,
            businessEmail: formData.businessEmail,
            website: formData.website,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            postalCode: formData.postalCode,
            country: formData.country,
            gstNumber: formData.gstNumber,
            udyamNumber: formData.udyamNumber,
            socialMedia: {
                linkedin: formData.linkedin,
                twitter: formData.twitter,
                instagram: formData.instagram,
                facebook: formData.facebook,
                youtube: formData.youtube,
            },
        };

        onSave(updatedUser);
        onClose();
        Alert.alert('Success', 'Profile updated successfully!');
    };

    const updateField = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
            <View style={[styles.container, { backgroundColor: theme.background }]}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={onClose}>
                        <X size={24} color={theme.text} />
                    </TouchableOpacity>
                    <Text style={[styles.title, { color: theme.text }]}>Edit Profile</Text>
                    <TouchableOpacity onPress={handleSave}>
                        <Save size={24} color={theme.primary} />
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: theme.text }]}>Personal Information</Text>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: theme.textSecondary }]}>
                                <Text >Full Name </Text>
                                <Text style={{ color: 'red' }}>*</Text>
                            </Text>
                            <TextInput
                                style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
                                value={formData.name}
                                onChangeText={(value) => updateField('name', value)}
                                placeholder="Enter your full name"
                                placeholderTextColor={theme.textSecondary}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: theme.textSecondary }]}>
                                <Text >Email </Text>
                                <Text style={{ color: 'red' }}>*</Text>
                            </Text>
                            <TextInput
                                style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
                                value={formData.email}
                                onChangeText={(value) => updateField('email', value)}
                                placeholder="Enter your email"
                                placeholderTextColor={theme.textSecondary}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: theme.textSecondary }]}>
                                <Text >Username </Text>
                                <Text style={{ color: 'red' }}>*</Text>
                            </Text>
                            <TextInput
                                style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
                                value={formData.username}
                                onChangeText={(value) => updateField('username', value)}
                                placeholder="Enter username"
                                placeholderTextColor={theme.textSecondary}
                            />
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: theme.textSecondary }]}>
                                <Text >Job Title </Text>
                                <Text style={{ color: 'red' }}>*</Text>
                            </Text>
                            <TextInput
                                style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
                                value={formData.jobTitle}
                                onChangeText={(value) => updateField('jobTitle', value)}
                                placeholder="Enter your Job Title"
                                placeholderTextColor={theme.textSecondary}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: theme.textSecondary }]}>Phone</Text>
                            <TextInput
                                style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
                                value={formData.phone}
                                onChangeText={(value) => updateField('phone', value)}
                                placeholder="Enter your phone number"
                                placeholderTextColor={theme.textSecondary}
                                keyboardType="phone-pad"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: theme.textSecondary }]}>About</Text>
                            <TextInput
                                style={[styles.textArea, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
                                value={formData.aboutUs}
                                onChangeText={(value) => updateField('aboutUs', value)}
                                placeholder="Tell us about yourself"
                                placeholderTextColor={theme.textSecondary}
                                multiline
                                numberOfLines={3}
                                textAlignVertical="top"
                            />
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: theme.text }]}>Business Information</Text>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: theme.textSecondary }]}>
                                <Text >Business Name </Text>
                                <Text style={{ color: 'red' }}>*</Text>
                            </Text>
                            <TextInput
                                style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
                                value={formData.businessName}
                                onChangeText={(value) => updateField('businessName', value)}
                                placeholder="Enter your business name"
                                placeholderTextColor={theme.textSecondary}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: theme.textSecondary }]}>
                                <Text >Business Type </Text>
                                <Text style={{ color: 'red' }}>*</Text>
                            </Text>
                            <TextInput
                                style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
                                value={formData.businessType}
                                onChangeText={(value) => updateField('businessType', value)}
                                placeholder="e.g., Technology, Retail, Services"
                                placeholderTextColor={theme.textSecondary}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: theme.textSecondary }]}>
                                <Text >Business Email </Text>
                                <Text style={{ color: 'red' }}>*</Text>
                            </Text>
                            <TextInput
                                style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
                                value={formData.businessEmail}
                                onChangeText={(value) => updateField('businessEmail', value)}
                                placeholder="Enter business email"
                                placeholderTextColor={theme.textSecondary}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: theme.textSecondary }]}>Website</Text>
                            <TextInput
                                style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
                                value={formData.website}
                                onChangeText={(value) => updateField('website', value)}
                                placeholder="https://yourwebsite.com"
                                placeholderTextColor={theme.textSecondary}
                                autoCapitalize="none"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: theme.textSecondary }]}>
                                <Text >GST Number </Text>
                                <Text style={{ color: 'red' }}>*</Text>
                            </Text>
                            <TextInput
                                style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
                                value={formData.gstNumber}
                                onChangeText={(value) => updateField('gstNumber', value)}
                                placeholder="Enter GST number"
                                placeholderTextColor={theme.textSecondary}
                                autoCapitalize="characters"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: theme.textSecondary }]}>Udyam Number</Text>
                            <TextInput
                                style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
                                value={formData.udyamNumber}
                                onChangeText={(value) => updateField('udyamNumber', value)}
                                placeholder="Enter Udyam registration number"
                                placeholderTextColor={theme.textSecondary}
                                autoCapitalize="characters"
                            />
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: theme.text }]}>Social Media Links</Text>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: theme.textSecondary }]}>LinkedIn</Text>
                            <TextInput
                                style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
                                value={formData.linkedin}
                                onChangeText={(value) => updateField('linkedin', value)}
                                placeholder="https://linkedin.com/in/yourprofile"
                                placeholderTextColor={theme.textSecondary}
                                autoCapitalize="none"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: theme.textSecondary }]}>Twitter</Text>
                            <TextInput
                                style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
                                value={formData.twitter}
                                onChangeText={(value) => updateField('twitter', value)}
                                placeholder="https://twitter.com/yourhandle"
                                placeholderTextColor={theme.textSecondary}
                                autoCapitalize="none"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: theme.textSecondary }]}>Instagram</Text>
                            <TextInput
                                style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
                                value={formData.instagram}
                                onChangeText={(value) => updateField('instagram', value)}
                                placeholder="https://instagram.com/yourhandle"
                                placeholderTextColor={theme.textSecondary}
                                autoCapitalize="none"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: theme.textSecondary }]}>Facebook</Text>
                            <TextInput
                                style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
                                value={formData.facebook}
                                onChangeText={(value) => updateField('facebook', value)}
                                placeholder="https://facebook.com/yourpage"
                                placeholderTextColor={theme.textSecondary}
                                autoCapitalize="none"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: theme.textSecondary }]}>YouTube</Text>
                            <TextInput
                                style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
                                value={formData.youtube}
                                onChangeText={(value) => updateField('youtube', value)}
                                placeholder="https://youtube.com/@yourchannel"
                                placeholderTextColor={theme.textSecondary}
                                autoCapitalize="none"
                            />
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: theme.text }]}>Address Information</Text>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: theme.textSecondary }]}>Address</Text>
                            <TextInput
                                style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
                                value={formData.address}
                                onChangeText={(value) => updateField('address', value)}
                                placeholder="Enter your address"
                                placeholderTextColor={theme.textSecondary}
                            />
                        </View>

                        <View style={styles.row}>
                            <View style={[styles.inputGroup, styles.halfWidth]}>
                                <Text style={[styles.label, { color: theme.textSecondary }]}>City</Text>
                                <TextInput
                                    style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
                                    value={formData.city}
                                    onChangeText={(value) => updateField('city', value)}
                                    placeholder="City"
                                    placeholderTextColor={theme.textSecondary}
                                />
                            </View>

                            <View style={[styles.inputGroup, styles.halfWidth]}>
                                <Text style={[styles.label, { color: theme.textSecondary }]}>State</Text>
                                <TextInput
                                    style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
                                    value={formData.state}
                                    onChangeText={(value) => updateField('state', value)}
                                    placeholder="State"
                                    placeholderTextColor={theme.textSecondary}
                                />
                            </View>
                        </View>

                        <View style={styles.row}>
                            <View style={[styles.inputGroup, styles.halfWidth]}>
                                <Text style={[styles.label, { color: theme.textSecondary }]}>Postal Code</Text>
                                <TextInput
                                    style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
                                    value={formData.postalCode}
                                    onChangeText={(value) => updateField('postalCode', value)}
                                    placeholder="Postal Code"
                                    placeholderTextColor={theme.textSecondary}
                                    keyboardType="numeric"
                                />
                            </View>

                            <View style={[styles.inputGroup, styles.halfWidth]}>
                                <Text style={[styles.label, { color: theme.textSecondary }]}>Country</Text>
                                <TextInput
                                    style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
                                    value={formData.country}
                                    onChangeText={(value) => updateField('country', value)}
                                    placeholder="Country"
                                    placeholderTextColor={theme.textSecondary}
                                />
                            </View>
                        </View>
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
        borderBottomColor: '#E5E7EB',
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
    },
    content: {
        flex: 1,
        paddingHorizontal: 16,
    },
    section: {
        marginTop: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 16,
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
    },
    textArea: {
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        minHeight: 80,
    },
    row: {
        flexDirection: 'row',
        gap: 12,
    },
    halfWidth: {
        flex: 1,
    },
    bottomPadding: {
        height: 40,
    },
});