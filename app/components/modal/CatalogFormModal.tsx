import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Modal, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { X, Save, Plus, Trash2 } from 'lucide-react-native';
import { CatalogItem } from '@/types';
import { useThemeStore } from '@/store/themeStore';


interface CatalogFormModalProps {
    visible: boolean;
    onClose: () => void;
    onSave: (item: any) => void;
    item?: CatalogItem | null;
    isEdit?: boolean;

}

export const CatalogFormModal: React.FC<CatalogFormModalProps> = ({
    visible,
    onClose,
    onSave,
    item,
    isEdit = false,
}) => {
    const { theme } = useThemeStore();
    const [formData, setFormData] = useState({
        title: item?.title || '',
        description: item?.description || '',
        price: item?.price || '',
        category: item?.category || '',
        images: item?.images || [''],
        tags: item?.tags || [''],
    });

    const handleSave = () => {
        if (!formData.title.trim() || !formData.description.trim()) {
            Alert.alert('Error', 'Title and description are required fields.');
            return;
        }

        if (!formData.price.trim()) {
            Alert.alert('Error', 'Price are required fields.');
            return;
        }
        if (!formData.category.trim()) {
            Alert.alert('Error', 'Category are required fields.');
            return;
        }
        if (!formData.images.length) {
            Alert.alert('Error', 'Image are required fields.');
            return;
        }
        if (!formData.tags.length) {
            Alert.alert('Error', 'Category are required fields.');
            return;
        }
        const catalogItem: Partial<CatalogItem> = {
            ...(isEdit && item ? { id: item._id } : {}),
            title: formData.title,
            description: formData.description,
            price: formData.price,
            category: formData.category,
            images: formData.images.filter(img => img.trim() !== ''),
            tags: formData.tags.filter(tag => tag.trim() !== ''),
            createdAt: item?.createdAt || new Date(),
        };
        // console.log(catalogItem);

        onSave(catalogItem);
        onClose();
        Alert.alert('Success', `Catalog item ${isEdit ? 'updated' : 'created'} successfully!`);
    };

    const updateField = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const updateArrayField = (field: 'images' | 'tags', index: number, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].map((item, i) => i === index ? value : item)
        }));
    };

    const addArrayField = (field: 'images' | 'tags') => {
        setFormData(prev => ({
            ...prev,
            [field]: [...prev[field], '']
        }));
    };

    const removeArrayField = (field: 'images' | 'tags', index: number) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index)
        }));
    };

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
            <View style={[styles.container, { backgroundColor: theme.background }]}>
                <View style={[styles.header, { borderBottomColor: theme.border }]}>
                    <TouchableOpacity onPress={onClose}>
                        <X size={24} color={theme.text} />
                    </TouchableOpacity>
                    <Text style={[styles.title, { color: theme.text }]}>
                        {isEdit ? 'Edit Catalog Item' : 'Add Catalog Item'}
                    </Text>
                    <TouchableOpacity onPress={handleSave}>
                        <Save size={24} color={theme.primary} />
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: theme.text }]}>Basic Information</Text>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: theme.textSecondary }]}>
                                <Text >Title </Text>
                                <Text style={{ color: 'red' }}>*</Text>
                            </Text>
                            <TextInput
                                style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
                                value={formData.title}
                                onChangeText={(value) => updateField('title', value)}
                                placeholder="Enter item title"
                                placeholderTextColor={theme.textSecondary}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: theme.textSecondary }]}>
                                <Text >Description </Text>
                                <Text style={{ color: 'red' }}>*</Text>
                            </Text>
                            <TextInput
                                style={[styles.textArea, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
                                value={formData.description}
                                onChangeText={(value) => updateField('description', value)}
                                placeholder="Describe your item or service"
                                placeholderTextColor={theme.textSecondary}
                                multiline
                                numberOfLines={4}
                                textAlignVertical="top"
                            />
                        </View>

                        <View style={styles.row}>
                            <View style={[styles.inputGroup, styles.halfWidth]}>
                                <Text style={[styles.label, { color: theme.textSecondary }]}>
                                    <Text >Price </Text>
                                    <Text style={{ color: 'red' }}>*</Text>
                                </Text>

                                <TextInput
                                    style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
                                    value={formData.price}
                                    onChangeText={(value) => updateField('price', value)}
                                    placeholder="e.g., $500 or Starting from $1000"
                                    placeholderTextColor={theme.textSecondary}
                                />
                            </View>

                            <View style={[styles.inputGroup, styles.halfWidth]}>
                                <Text style={[styles.label, { color: theme.textSecondary }]}>
                                    <Text >Category </Text>
                                    <Text style={{ color: 'red' }}>*</Text>
                                </Text>

                                <TextInput
                                    style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
                                    value={formData.category}
                                    onChangeText={(value) => updateField('category', value)}
                                    placeholder="e.g., Web Development"
                                    placeholderTextColor={theme.textSecondary}
                                />
                            </View>
                        </View>
                    </View>

                    <View style={styles.section}>
                        <View style={styles.arrayHeader}>
                            <Text style={[styles.label, { color: theme.textSecondary }]}>
                                <Text >Image </Text>
                                <Text style={{ color: 'red' }}>*</Text>
                            </Text>

                            <TouchableOpacity
                                style={[styles.addButton, { backgroundColor: theme.primary }]}
                                onPress={() => addArrayField('images')}
                            >
                                <Plus size={16} color="#FFFFFF" />
                            </TouchableOpacity>
                        </View>

                        {formData?.images.map((image, index) => (
                            <View key={index} style={styles.arrayItem}>
                                <TextInput
                                    style={[styles.arrayInput, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
                                    value={image}
                                    onChangeText={(value) => updateArrayField('images', index, value)}
                                    placeholder="Enter image URL"
                                    placeholderTextColor={theme.textSecondary}
                                />
                                {formData.images.length > 1 && (
                                    <TouchableOpacity
                                        style={[styles.removeButton, { backgroundColor: theme.error }]}
                                        onPress={() => removeArrayField('images', index)}
                                    >
                                        <Trash2 size={16} color="#FFFFFF" />
                                    </TouchableOpacity>
                                )}
                            </View>
                        ))}
                    </View>

                    <View style={styles.section}>
                        <View style={styles.arrayHeader}>
                            <Text style={[styles.sectionTitle, { color: theme.text }]}>Tags</Text>
                            <TouchableOpacity
                                style={[styles.addButton, { backgroundColor: theme.primary }]}
                                onPress={() => addArrayField('tags')}
                            >
                                <Plus size={16} color="#FFFFFF" />
                            </TouchableOpacity>
                        </View>

                        {formData.tags.map((tag, index) => (
                            <View key={index} style={styles.arrayItem}>
                                <TextInput
                                    style={[styles.arrayInput, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
                                    value={tag}
                                    onChangeText={(value) => updateArrayField('tags', index, value)}
                                    placeholder="Enter tag (e.g., React, Node.js)"
                                    placeholderTextColor={theme.textSecondary}
                                />
                                {formData.tags.length > 1 && (
                                    <TouchableOpacity
                                        style={[styles.removeButton, { backgroundColor: theme.error }]}
                                        onPress={() => removeArrayField('tags', index)}
                                    >
                                        <Trash2 size={16} color="#FFFFFF" />
                                    </TouchableOpacity>
                                )}
                            </View>
                        ))}
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
    arrayHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    addButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    arrayItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 12,
    },
    arrayInput: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
    },
    removeButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bottomPadding: {
        height: 40,
    },
});