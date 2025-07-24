import React from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { Plus, Trash2 } from 'lucide-react-native';
import { useThemeStore } from '@/store/themeStore';
import Input from '../ui-components/Input';

interface TagsInputProps {
    title: string;
    tags: string[];
    setTags: React.Dispatch<React.SetStateAction<string[]>>;
}

const TagsInput: React.FC<TagsInputProps> = ({ title, tags, setTags }) => {
    const { theme } = useThemeStore();

    const handleAddTag = () => {
        setTags([...tags, '']);
    };

    const handleDeleteTag = (index: number) => {
        const updated = [...tags];
        updated.splice(index, 1);
        setTags(updated);
    };

    const handleChangeTag = (text: string, index: number) => {
        const updated = [...tags];
        updated[index] = text;
        setTags(updated);
    };

    return (
        <View >
            <View style={styles.tagsHeader}>
                <Text style={[styles.label, { color: theme.text }]}>{title}</Text>
                <TouchableOpacity onPress={handleAddTag} style={[styles.addButton, { backgroundColor: theme.primary }]}>
                    <Plus size={20} color="#fff" />
                </TouchableOpacity>
            </View>

            <ScrollView style={{ marginTop: 12 }}>
                {tags.map((tag, index) => (
                    <View key={index} style={styles.tagRow}>
                        <Input

                            placeholder="Enter tag (e.g., React, Node.js)"
                            // placeholderTextColor={theme.textSecondary}
                            value={tag}
                            onChangeText={(text) => handleChangeTag(text, index)}
                        />
                        <TouchableOpacity
                            style={styles.deleteButton}
                            onPress={() => handleDeleteTag(index)}
                        >
                            <Trash2 size={18} color="#fff" />
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

export default TagsInput;
const styles = StyleSheet.create({

    tagsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
    },
    addButton: {
        padding: 8,
        borderRadius: 999,
    },
    tagRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 8,
        width: '80%',
    },
    input: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        borderWidth: 1,
        fontSize: 14,
    },
    deleteButton: {
        backgroundColor: '#EF4444',
        padding: 10,
        borderRadius: 999,
    },
});