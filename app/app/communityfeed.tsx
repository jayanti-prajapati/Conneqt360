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
import { Camera, ImageIcon, VideoIcon, X } from "lucide-react-native";
import { ThemedButton } from "@/components/themeButton/ThemedButton";

export default function CommunityFeedScreen() {
    const router = useRouter();
    const { theme } = useThemeStore();
    const { createFeed } = useCommunityFeedsStore();
    const [error, setError] = useState<string | null>(null);
    const [contentText, setContentText] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [videoUrl, setVideoUrl] = useState("");
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
            user: userData?.userData?.data?._id
        };

        // console.log("Submitting feed:", feedData);
        const resp = await createFeed(feedData)
        // console.log("Response:", resp);
        if (resp?.data?.statusCode == 201 || resp?.data?.statusCode == 200) {
            // console.log('Post upadted successfully:', resp.data.data);
            router.push('/(tabs)');

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
                        style={[styles.textInput, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
                        placeholder="What's happening in your business?"
                        placeholderTextColor={theme.textSecondary}
                        value={contentText}
                        onChangeText={setContentText}
                        multiline
                        textAlignVertical="top"
                    />

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
        paddingVertical: 16,
        fontSize: 16,
        minHeight: 120,
        marginBottom: 16,
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
