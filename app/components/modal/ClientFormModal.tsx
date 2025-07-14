import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Modal, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { X, Save, Star } from 'lucide-react-native';
import { Client } from '@/types';
import { useThemeStore } from '@/store/themeStore';


interface ClientFormModalProps {
    visible: boolean;
    onClose: () => void;
    onSave: (client: Partial<Client>) => void;
    client?: Client | null;
    isEdit?: boolean;
}

export const ClientFormModal: React.FC<ClientFormModalProps> = ({
    visible,
    onClose,
    onSave,
    client,
    isEdit = false,
}) => {
    const { theme } = useThemeStore();
    const [formData, setFormData] = useState({
        name: client?.name || '',
        logo: client?.logo || '',
        testimonial: client?.testimonial || '',
        rating: client?.rating || "5",
        projectType: client?.projectType || '',
        completedDate: client?.completedDate ? new Date(client.completedDate).toISOString().split('T')[0] : '',
    });

    const handleSave = () => {
        if (!formData.name.trim()) {
            Alert.alert('Error', 'Client name is required.');
            return;
        }

        const clientData: Partial<Client> = {
            ...(isEdit && client ? { id: client._id } : {}),
            name: formData.name,
            logo: formData.logo || undefined,
            testimonial: formData.testimonial || undefined,
            rating: formData.rating as string,
            projectType: formData.projectType || undefined,
            completedDate: formData.completedDate ? (formData.completedDate) : undefined,
        };

        onSave(clientData);
        onClose();
        Alert.alert('Success', `Client ${isEdit ? 'updated' : 'added'} successfully!`);
    };

    const updateField = (field: string, value: string | number) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const renderStarRating = () => {
        return (
            <View style={styles.starRating}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity
                        key={star}
                        onPress={() => updateField('rating', star)}
                    >
                        <Star
                            size={24}
                            color="#FFD700"
                            fill={star <= Number(formData.rating) ? "#FFD700" : "none"}
                        />
                    </TouchableOpacity>
                ))}
            </View>
        );
    };

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
            <View style={[styles.container, { backgroundColor: theme.background }]}>
                <View style={[styles.header, { borderBottomColor: theme.border }]}>
                    <TouchableOpacity onPress={onClose}>
                        <X size={24} color={theme.text} />
                    </TouchableOpacity>
                    <Text style={[styles.title, { color: theme.text }]}>
                        {isEdit ? 'Edit Client' : 'Add Client'}
                    </Text>
                    <TouchableOpacity onPress={handleSave}>
                        <Save size={24} color={theme.primary} />
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: theme.text }]}>Client Information</Text>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: theme.textSecondary }]}>
                                <Text >Client Name </Text>
                                <Text style={{ color: 'red' }}>*</Text>
                            </Text>
                            <TextInput
                                style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
                                value={formData.name}
                                onChangeText={(value) => updateField('name', value)}
                                placeholder="Enter client company name"
                                placeholderTextColor={theme.textSecondary}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: theme.textSecondary }]}>
                                <Text >Logo URL</Text>
                                <Text style={{ color: 'red' }}>*</Text>
                            </Text>
                            <TextInput
                                style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
                                value={formData.logo}
                                onChangeText={(value) => updateField('logo', value)}
                                placeholder="Enter logo image URL"
                                placeholderTextColor={theme.textSecondary}
                            />
                        </View>
                        <View style={[styles.inputGroup, styles.halfWidth]}>
                            <Text style={[styles.label, { color: theme.textSecondary }]}>
                                <Text >Project Type</Text>
                                <Text style={{ color: 'red' }}>*</Text>
                            </Text>

                            <TextInput
                                style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
                                value={formData.projectType}
                                onChangeText={(value) => updateField('projectType', value)}
                                placeholder="e.g., E-commerce Platform"
                                placeholderTextColor={theme.textSecondary}
                            />
                        </View>



                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: theme.textSecondary }]}>
                                <Text >Testimonial </Text>
                                <Text style={{ color: 'red' }}>*</Text>
                            </Text>
                            <TextInput
                                style={[styles.textArea, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
                                value={formData.testimonial}
                                onChangeText={(value) => updateField('testimonial', value)}
                                placeholder="Enter client testimonial or feedback"
                                placeholderTextColor={theme.textSecondary}
                                multiline
                                numberOfLines={4}
                                textAlignVertical="top"
                            />
                        </View>
                        <View style={styles.row}>

                            <View style={styles.inputGroup}>
                                <Text style={[styles.label, { color: theme.textSecondary }]}>
                                    <Text >Rating</Text>
                                    <Text style={{ color: 'red' }}>*</Text>
                                </Text>
                                {renderStarRating()}
                            </View>


                            <View style={[styles.inputGroup, styles.halfWidth]}>
                                <Text style={[styles.label, { color: theme.textSecondary }]}>
                                    <Text >Completion Date </Text>
                                    <Text style={{ color: 'red' }}>*</Text>
                                </Text>

                                <TextInput
                                    style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
                                    value={formData.completedDate}
                                    onChangeText={(value) => updateField('completedDate', value)}
                                    placeholder="YYYY-MM-DD"
                                    placeholderTextColor={theme.textSecondary}
                                />
                            </View>
                        </View>
                    </View>

                    <View style={[styles.tipSection, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                        <Text style={[styles.tipTitle, { color: theme.text }]}>Tips for Great Client Entries</Text>
                        <Text style={[styles.tipText, { color: theme.textSecondary }]}>
                            • Use high-quality logo images for better presentation{'\n'}
                            • Keep testimonials concise but impactful{'\n'}
                            • Include specific project types to showcase expertise{'\n'}
                            • Accurate completion dates help build credibility
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
        paddingHorizontal: 16,
    },
    section: {
        marginTop: 24,
    },
    sectionTitle: {
        fontSize: 18,
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
        minHeight: 100,
    },
    row: {
        flexDirection: 'row',
        gap: 12,
    },
    halfWidth: {
        flex: 1,
    },
    starRating: {
        flexDirection: 'row',
        gap: 4,
    },
    tipSection: {
        marginTop: 24,
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
    },
    tipTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    tipText: {
        fontSize: 14,
        lineHeight: 20,
    },
    bottomPadding: {
        height: 40,
    },
});