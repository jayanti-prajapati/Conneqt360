import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Modal,
    ScrollView,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { X, Save, Plus } from 'lucide-react-native';
import { useThemeStore } from '@/store/themeStore';
import TagsInput from '../Input/TagsInput';

interface ServiceFormModalProps {
    visible: boolean;
    onClose: () => void;
    onSave: (service: any) => void;
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
    const [description, setDescription] = useState('');
    const [tags, setTags] = useState<string[]>(['']);




    const handleSave = () => {
        if (!serviceName.trim()) {
            Alert.alert('Error', 'Service name is required.');
            return;
        }

        onSave({
            name: serviceName.trim(),
            description: description.trim(),
            tags,
        });

        onClose();
        setServiceName('');
        setDescription('');
        setTags(['']);
        Alert.alert('Success', `Service ${isEdit ? 'updated' : 'added'} successfully!`);
    };

    const handleClose = () => {
        setServiceName('');
        setDescription('');
        setTags(['']);
        onClose();
    };

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
            <View style={[styles.container, { backgroundColor: theme.background }]}>
                {/* Header */}
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
                        <Text style={[styles.sectionTitle, { color: theme.text }]}>Service Details</Text>

                        {/* Name */}
                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: theme.textSecondary }]}>Service Name *</Text>
                            <TextInput
                                style={[
                                    styles.input,
                                    { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border },
                                ]}
                                value={serviceName}
                                onChangeText={setServiceName}
                                placeholder="e.g., Web Development"
                                placeholderTextColor={theme.textSecondary}
                            />
                        </View>

                        {/* Description */}
                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: theme.textSecondary }]}>Description</Text>
                            <TextInput
                                style={[
                                    styles.textArea,
                                    { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border },
                                ]}
                                multiline
                                numberOfLines={4}
                                value={description}
                                onChangeText={setDescription}
                                placeholder="Describe your service..."
                                placeholderTextColor={theme.textSecondary}
                            />
                        </View>

                        {/* Features */}
                        <TagsInput title='Add Features' tags={tags} setTags={setTags} />
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
    textArea: {
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        height: 100,
        textAlignVertical: 'top',
    },
    featureInputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    featureInput: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 14,
    },
    addButton: {
        backgroundColor: '#1E88E5',
        borderRadius: 999,
        padding: 10,
    },
    featureList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 12,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        gap: 6,
    },
    featureText: {
        fontSize: 14,
        fontWeight: '500',
    },
    bottomPadding: {
        height: 40,
    },
});
