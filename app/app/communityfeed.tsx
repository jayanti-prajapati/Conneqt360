import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Image,
    SafeAreaView,
    ScrollView,
    Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Video, ResizeMode } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Spacing from "@/constants/Spacing"; // or replace with a number like 32
import { getAuthData } from "@/services/secureStore";
import useCommunityFeedsStore from "@/store/useCommunityFeeds";
import { pickImage, takePhoto } from "@/utils/imageUtils";
import { pickVideo } from "@/utils/videoUtils";
import useFilesStore from "@/store/useFilesStore";
import { useThemeStore } from "@/store/themeStore";
import { Camera, X, Image as ImageIcon, Video as VideoIcon, XCircle } from 'lucide-react-native';
import { ThemedButton } from "@/components/themeButton/ThemedButton";

export default function CommunityFeedScreen() {
    const router = useRouter();
    const { theme } = useThemeStore();
    const { createFeed } = useCommunityFeedsStore();
    const [error, setError] = useState<string | null>(null);
    const [contentText, setContentText] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [videoUrl, setVideoUrl] = useState("");
    const [location, setLocation] = useState<string | null>("");
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState('');
    const { loading } = useFilesStore()



    const pickImages = async () => {
        const image = await pickImage();
        //@ts-ignore
        if (image) {
            setImageUrl(image);
        }
    };
    const pickVideos = async () => {
        const video = await pickVideo();
        //@ts-ignore
        if (video) {
            setVideoUrl(video);
        }


    };
    const takePhotos = async () => {
        const phots = await takePhoto();
        //@ts-ignore
        if (phots) {
            setImageUrl(phots);
        }
    };

    const removeMedia = () => {
        setContentText('');
        setImageUrl('');
        setVideoUrl('');
        setLocation('');
        setTags([]);
        setError(null);
    };


    const handleSubmit = async () => {

        if (!contentText.trim() && !imageUrl && !videoUrl) {
            Alert.alert('Error', 'Please add some content or media to your post');
            return;
        }
        const userData = await getAuthData()
        // const users= await 
        if (!userData) {
            Alert.alert('Error', 'You must be logged in to create a post');
            return;
        }
        // console.log("User Data:", userData);
        const feedData = {
            content: contentText,
            imageUrl,
            videoUrl,
            location,
            tags,
            user: userData?.userData?.data?._id
        };

        // console.log("Submitting feed:", feedData);
        const resp = await createFeed(feedData)
        // console.log("Response:", resp);
        if (resp?.data?.statusCode == 201 || resp?.data?.statusCode == 200) {
            // console.log('Post upadted successfully:', resp.data.data);
            router.push('/(tabs)');
            setContentText('');
            setImageUrl('');
            setVideoUrl('');
            setLocation('');
            setTags([]);
            setError(null);

        } else {
            console.log("Error creating post:", resp);
            console.error('Error creating post:', resp.data.message);
            Alert.alert('Error', resp.data.message || 'Something went wrong. Please try again.');

        }

    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <ScrollView style={styles.scrollView}>
                <View style={styles.header}>
                    <Text style={[styles.title, { color: theme.text }]}>Create Post</Text>


                    <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                        Share your business updates with the community
                    </Text>
                </View>

                <View style={styles.content}>
                    <TextInput
                        style={[styles.textInput, { 
                            backgroundColor: theme.surface, 
                            color: theme.text, 
                            borderColor: theme.border,
                            minHeight: 100,
                            maxHeight: 100,
                            textAlignVertical: 'top',
                            paddingTop: 12
                        }]}
                        placeholder="What's happening in your business?"
                        placeholderTextColor={theme.textSecondary}
                        value={contentText}
                        onChangeText={setContentText}
                        multiline
                        numberOfLines={4}
                    />

                    {/* Location Input */}
                    <View style={[styles.inputContainer, { marginBottom: 16 }]}>
                        <Text style={[styles.label, { color: theme.textSecondary, marginBottom: 8 }]}>
                            Location (Optional)
                        </Text>
                        <TextInput
                            style={[
                                styles.textInput,
                                {
                                    minHeight: 50,
                                    backgroundColor: theme.surface,
                                    borderColor: theme.border,
                                    color: theme.text
                                }
                            ]}
                            placeholder="Add location"
                            placeholderTextColor={theme.textSecondary}
                            value={location || ''}
                            onChangeText={setLocation}
                        />
                    </View>

                    {/* Tags Input */}
                    <View style={styles.inputContainer}>
                        <Text style={[styles.label, { color: theme.textSecondary, marginBottom: 8 }]}>
                            Tags (Press enter or comma to add)
                        </Text>
                        <View style={[styles.tagsContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
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
                                placeholder={tags.length === 0 ? "e.g., travel, food, adventure" : ""}
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
                        <Text style={[styles.hint, { color: theme.textSecondary }]}>
                            {tags.length}/5 tags (Press enter or comma to add)
                        </Text>
                    </View>

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
                            <Video
                                source={{ uri: videoUrl }}
                                style={styles.mediaPreview}
                                useNativeControls
                                resizeMode={ResizeMode.CONTAIN}
                            />
                            <TouchableOpacity style={styles.removeButton} onPress={removeMedia}>
                                <X size={20} color="#FFFFFF" />
                            </TouchableOpacity>
                        </View>
                    ) : null}

                    <View style={styles.mediaButtons}>
                        <TouchableOpacity
                            style={[styles.mediaButton, { backgroundColor: theme.surface, borderColor: theme.border }]}
                            onPress={takePhotos}
                        >
                            <Camera size={24} color={theme.primary} />
                            <Text style={[styles.mediaButtonText, { color: theme.textSecondary }]}>Camera</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.mediaButton, { backgroundColor: theme.surface, borderColor: theme.border }]}
                            onPress={() => pickImages()}
                        >
                            <ImageIcon size={24} color={theme.primary} />
                            <Text style={[styles.mediaButtonText, { color: theme.textSecondary }]}>Photo</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.mediaButton, { backgroundColor: theme.surface, borderColor: theme.border }]}
                            onPress={() => pickVideos()}
                        >
                            <VideoIcon size={24} color={theme.primary} />
                            <Text style={[styles.mediaButtonText, { color: theme.textSecondary }]}>Video</Text>
                        </TouchableOpacity>
                    </View>


                </View>
            </ScrollView>

            <View style={styles.footer}>
                <ThemedButton
                    title={loading ? 'Publishing...' : 'Publish Post'}
                    onPress={handleSubmit}
                    disabled={loading}
                    variant="gradient"
                    style={styles.publishButton}
                />
                <ThemedButton
                    title={'Cancel'}
                    onPress={() => router.back()}
                    // disabled={loading}
                    variant="gradient"
                    style={styles.publishButton}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
        paddingBottom: 20,
    },
    scrollView: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 16,
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',

    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 16,
    },
    content: {
        padding: 16,
    },
    textInput: {
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        minHeight: 50,
        marginBottom: 16,
    },
    inputContainer: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 8,
    },
    hint: {
        fontSize: 12,
        marginTop: 4,
        marginBottom: 8,
        marginLeft: 4,
    },
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
        marginBottom: 16,
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
        justifyContent: 'space-around',
        marginBottom: 20,
    },
    mediaButton: {
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        borderWidth: 1,
        minWidth: 80,
    },
    mediaButtonText: {
        fontSize: 12,
        marginTop: 4,
        fontWeight: '500',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 20,
        borderTopWidth: 1,

        borderTopColor: '#E5E7EB',
    },
    publishButton: {
        borderRadius: 12,
        paddingVertical: 16,
    },
    previewWrapper: {
        position: "relative",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    previewVideo: {
        width: "100%",
        height: 200,
        borderRadius: 12,
        marginTop: 8,
    },
});
