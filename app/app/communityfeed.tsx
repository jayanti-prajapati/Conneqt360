import { StyleSheet, TouchableOpacity, View, Image, Alert, TextInput, Text } from 'react-native';
import { useState } from 'react';
import { Video, ResizeMode } from 'expo-av';
import { useRouter } from 'expo-router';
import { getAuthData } from '@/services/secureStore';
import useCommunityFeedsStore from '@/store/useCommunityFeeds';
import { pickImage, takePhoto } from '@/utils/imageUtils';
import { pickVideo } from '@/utils/videoUtils';
import useFilesStore from '@/store/useFilesStore';
import { useThemeStore } from '@/store/themeStore';
import { Camera, ImageIcon, VideoIcon, X, XCircle } from 'lucide-react-native';
import Button from '@/components/ui-components/Button';
import Input from '@/components/ui-components/Input';
import Layout from '@/components/common/Layout';

export default function CommunityFeedScreen() {
    const router = useRouter();
    const { theme } = useThemeStore();
    const { createFeed } = useCommunityFeedsStore();
    const { loading } = useFilesStore();

    const [contentText, setContentText] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [location, setLocation] = useState<string | null>('');
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState('');

    const pickImages = async () => {
        const image = await pickImage();
        //@ts-ignore
        if (image) setImageUrl(image);
    };
    const pickVideos = async () => {
        const video = await pickVideo();
        //@ts-ignore
        if (video) setVideoUrl(video);
    };
    const takePhotos = async () => {
        const phots = await takePhoto();
        //@ts-ignore
        if (phots) setImageUrl(phots);
    };

    const removeMedia = () => {
        setImageUrl('');
        setVideoUrl('');
    };

    const handleSubmit = async () => {
        if (!contentText.trim() && !imageUrl && !videoUrl) {
            Alert.alert('Error', 'Please add some content or media to your post');
            return;
        }
        const userData = await getAuthData();
        if (!userData) {
            Alert.alert('Error', 'You must be logged in to create a post');
            return;
        }
        const feedData = {
            content: contentText,
            imageUrl,
            videoUrl,
            location,
            tags,
            user: userData?.userData?.data?._id,
        };
        const resp = await createFeed(feedData);
        if (resp?.data?.statusCode == 201 || resp?.data?.statusCode == 200) {
            router.push('/(tabs)');
            setContentText('');
            setImageUrl('');
            setVideoUrl('');
            setLocation('');
            setTags([]);
            setTagInput('');
        } else {
            Alert.alert('Error', resp?.data?.message || 'Something went wrong. Please try again.');
        }
    };

    return (
        <Layout showBackButton title="Create Post" scrollable>
            <Input
                value={contentText}
                onChangeText={setContentText}
                multiline
                numberOfLines={4}
                placeholder="What's happening in your business?"
            />

            {/* Location Input */}
            <Input
                value={location || ''}
                onChangeText={setLocation}
                placeholder="Add location (optional)"
                containerStyle={{ marginTop: 16 }}
            />

            {/* Tags Input */}
            <View style={{ marginTop: 16 }}>

                <View style={[styles.tagsContainer, { borderColor: theme.border, backgroundColor: theme.surface }]}>
                    {tags.map((tag, index) => (
                        <View key={index} style={[styles.tag, { backgroundColor: theme.primary + '20' }]}>
                            <Text style={[styles.tagText, { color: theme.primary }]}>{tag}</Text>
                            <TouchableOpacity
                                onPress={() => {
                                    const newTags = [...tags];
                                    newTags.splice(index, 1);
                                    setTags(newTags);
                                }}
                                style={styles.removeTag}
                            >
                                <XCircle size={16} color={theme.primary} />
                            </TouchableOpacity>
                        </View>
                    ))}
                    <TextInput
                        style={[styles.tagInput, { color: theme.text }]}
                        placeholder={tags.length === 0 ? 'e.g., travel, food, adventure' : ''}
                        placeholderTextColor={theme.textSecondary}
                        value={tagInput}
                        onChangeText={setTagInput}
                        onSubmitEditing={() => {
                            if (tagInput.trim()) {
                                setTags([...tags, tagInput.trim()]);
                                setTagInput('');
                            }
                        }}
                        onKeyPress={({ nativeEvent }) => {
                            if ((nativeEvent.key === ',' || nativeEvent.key === ' ') && tagInput.trim()) {
                                setTags([...tags, tagInput.trim()]);
                                setTagInput('');
                            }
                        }}
                        maxLength={20}
                    />
                </View>
                <Text style={{ color: theme.textSecondary, fontSize: 12, marginBottom: 8 }}>
                    **Tags (Press enter or comma to add)
                </Text>
                {/* <Text style={{ color: theme.textSecondary, fontSize: 12, marginTop: 4 }}>{tags.length}/5 tags</Text> */}
            </View>

            {/* Media preview */}
            {imageUrl && (
                <View style={styles.mediaContainer}>
                    <Image source={{ uri: imageUrl }} style={styles.mediaPreview} />
                    <TouchableOpacity style={styles.removeButton} onPress={removeMedia}>
                        <X size={20} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>
            )}
            {videoUrl ? (
                <View style={styles.mediaContainer}>
                    <Video source={{ uri: videoUrl }} style={styles.mediaPreview} useNativeControls resizeMode={ResizeMode.CONTAIN} />
                    <TouchableOpacity style={styles.removeButton} onPress={removeMedia}>
                        <X size={20} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>
            ) : null}

            {/* Media pickers */}
            <View style={styles.mediaButtons}>
                <Button variant="ghost" size="medium" onPress={takePhotos} icon={<Camera size={20} color={theme.primary} />} />
                <Button variant="ghost" size="medium" onPress={pickImages} icon={<ImageIcon size={20} color={theme.primary} />} />
                <Button variant="ghost" size="medium" onPress={pickVideos} icon={<VideoIcon size={20} color={theme.primary} />} />
            </View>

            {/* Footer Buttons */}
            <View style={styles.footer}>
                <Button
                    title="Cancel"
                    onPress={() => router.back()}
                    variant="outline"
                    size="large"
                    style={{ flex: 1, marginRight: 8 }}

                />
                <Button
                    title="Publish Post"
                    onPress={handleSubmit}
                    disabled={loading}
                    loading={loading}
                    variant="primary"
                    size="large"
                    style={{ flex: 1, marginLeft: 8 }}
                />

            </View>
        </Layout>
    );
}

const styles = StyleSheet.create({
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 12,
        padding: 8,
        minHeight: 50,
    },
    tag: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        margin: 4,
    },
    tagText: {
        fontSize: 14,
        marginRight: 4,
    },
    removeTag: {
        marginLeft: 4,
    },
    tagInput: {
        flex: 1,
        minWidth: 100,
        height: 40,
        paddingHorizontal: 8,
        fontSize: 16,
    },
    mediaContainer: {
        position: 'relative',
        marginVertical: 16,
    },
    mediaPreview: {
        width: '100%',
        height: 200,
        borderRadius: 12,
    },
    removeButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 15,
        padding: 5,
    },
    mediaButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        gap: 8,
        marginTop: 24,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 45,
    },
});
