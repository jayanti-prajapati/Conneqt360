import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Modal, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { X, Save } from 'lucide-react-native';
import { useThemeStore } from '@/store/themeStore';


interface ServiceFormModalProps {
    visible: boolean;
    onClose: () => void;
    onSave: (service: string) => void;
    service?: string;
    isEdit?: boolean;
}

export const ServiceFormModal: React.FC<ServiceFormModalProps> = ({
    visible,
    onClose,
    onSave,
    service,
    isEdit = false,
}) => {
    const { theme } = useThemeStore();
    const [serviceName, setServiceName] = useState(service || '');

    const handleSave = () => {
        if (!serviceName.trim()) {
            Alert.alert('Error', 'Service name is required.');
            return;
        }

        onSave(serviceName.trim());
        onClose();
        setServiceName('');
        Alert.alert('Success', `Service ${isEdit ? 'updated' : 'added'} successfully!`);
    };

    const handleClose = () => {
        setServiceName('');
        onClose();
    };

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
            <View style={[styles.container, { backgroundColor: theme.background }]}>
                <View style={[styles.header, { borderBottomColor: theme.border }]}>
                    <TouchableOpacity onPress={handleClose}>
                        <X size={24} color={theme.text} />
                    </TouchableOpacity>
                    <Text style={[styles.title, { color: theme.text }]}>
                        {isEdit ? 'Edit Service' : 'Add Service'}
                    </Text>
                    <TouchableOpacity onPress={handleSave}>
                        <Save size={24} color={theme.primary} />
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: theme.text }]}>Service Information</Text>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: theme.textSecondary }]}>Service Name *</Text>
                            <TextInput
                                style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
                                value={serviceName}
                                onChangeText={setServiceName}
                                placeholder="e.g., Web Development, Mobile App Development"
                                placeholderTextColor={theme.textSecondary}
                                autoFocus
                            />
                        </View>

                        <View style={[styles.examplesSection, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                            <Text style={[styles.examplesTitle, { color: theme.text }]}>Popular Services</Text>
                            <View style={styles.examplesList}>
                                {[
                                    'Web Development',
                                    'Mobile App Development',
                                    'UI/UX Design',
                                    'Digital Marketing',
                                    'Cloud Solutions',
                                    'Business Consulting',
                                    'Data Analytics',
                                    'E-commerce Solutions'
                                ].map((example, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={[styles.exampleItem, { backgroundColor: theme.primary + '20' }]}
                                        onPress={() => setServiceName(example)}
                                    >
                                        <Text style={[styles.exampleText, { color: theme.primary }]}>{example}</Text>
                                    </TouchableOpacity>
                                ))}
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
        marginBottom: 24,
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
    examplesSection: {
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
    },
    examplesTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
    },
    examplesList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    exampleItem: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 16,
    },
    exampleText: {
        fontSize: 14,
        fontWeight: '500',
    },
    bottomPadding: {
        height: 40,
    },
});