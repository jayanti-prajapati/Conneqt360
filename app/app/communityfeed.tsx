import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Image,
    SafeAreaView,
    ScrollView,
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
import { pickImage } from "@/utils/imageUtils";
import { pickVideo } from "@/utils/videoUtils";
import useFilesStore from "@/store/useFilesStore";

export default function CommunityFeedScreen() {
    const router = useRouter();
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

    const handleSubmit = async () => {

        if (!contentText.trim() && !imageUrl && !videoUrl) {
            setError('Please enter content, upload an image, or a video.');
            return;
        }
        const userData = await getAuthData()
        // const users= await 
        console.log("User Data:", userData);

        // console.log("User Data:", userData);
        const feedData = {
            content: contentText,
            imageUrl,
            videoUrl,
            user: userData?.userData?.data?._id
        };

        console.log("Submitting feed:", feedData);
        const resp = await createFeed(feedData)
        // console.log("Response:", resp);
        if (resp?.data?.statusCode == 201 || resp?.data?.statusCode == 200) {
            // console.log('Post upadted successfully:', resp.data.data);
            router.push('/(tabs)');

        } else {
            console.log("Error creating post:", resp);
            console.error('Error creating post:', resp.data.message);

        }

    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Top Close Icon */}
            <View style={styles.topBar}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="close" size={28} color="#333" />
                </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={{ flex: 1, padding: 20 }}>
                    <Text style={styles.title}>Add Feed</Text>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Content</Text>
                        <TextInput
                            style={styles.inputMultiline}
                            value={contentText}
                            onChangeText={setContentText}
                            placeholder="Write your post..."
                            multiline
                        />
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Image</Text>
                        {imageUrl ? (
                            <View style={styles.previewWrapper}>
                                <Image source={{ uri: imageUrl }} style={styles.previewImage} />
                                <TouchableOpacity
                                    style={styles.removeButton}
                                    onPress={() => setImageUrl("")}
                                >
                                    <Ionicons name="close-circle" size={24} color="#ff4444" />
                                </TouchableOpacity>
                            </View>
                        ) : null}
                        <TouchableOpacity onPress={pickImages} style={styles.uploadButton}>
                            <Text style={styles.uploadText}>Upload Image</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Video</Text>
                        {videoUrl ? (
                            <View style={styles.previewWrapper}>
                                <Video
                                    source={{ uri: videoUrl }}
                                    style={styles.previewVideo}
                                    useNativeControls
                                    resizeMode={ResizeMode.CONTAIN}
                                />
                                <TouchableOpacity
                                    style={styles.removeButton}
                                    onPress={() => setVideoUrl("")}
                                >
                                    <Ionicons name="close-circle" size={24} color="#ff4444" />
                                </TouchableOpacity>
                            </View>
                        ) : null}
                        <TouchableOpacity onPress={pickVideos} style={styles.uploadButton}>
                            <Text style={styles.uploadText}>Upload Video</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.buttonRow}>
                        <TouchableOpacity onPress={() => router.back()} style={styles.button}>
                            <LinearGradient
                                colors={["#1F73C6", "#F7941E"]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.button}
                            >
                                <Text style={styles.buttonText}>Close</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleSubmit} style={styles.button}>
                            <LinearGradient
                                colors={["#1F73C6", "#F7941E"]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.button}
                            >
                                <Text style={styles.buttonText}>Add Feed</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>
                {error && (
                    <Text style={{ color: 'red', textAlign: 'center' }}>{error}</Text>
                )}
                {loading && (
                    <Text style={{ color: 'greed', textAlign: 'center' }}>File uploading, Please wait</Text>
                )}
            </ScrollView>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: Spacing.xl || 32, // Replace with 32 if Spacing is undefined
        backgroundColor: "#fff",
    },
    topBar: {
        flexDirection: "row",
        justifyContent: "flex-end",
        padding: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 16,
        color: "#333",
    },
    formGroup: {
        marginBottom: 16,
        width: "100%",
    },
    label: {
        fontSize: 14,
        marginBottom: 6,
        color: "#555",
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    inputMultiline: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingTop: 12,
        height: 120,
        backgroundColor: "#fff",
        textAlignVertical: "top",
    },
    uploadButton: {
        backgroundColor: "#eee",
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 6,
        marginTop: 6,
        alignSelf: "flex-start",
    },
    uploadText: {
        color: "#333",
        fontSize: 13,
    },
    previewWrapper: {
        position: "relative",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    previewImage: {
        width: "100%",
        height: 180,
        borderRadius: 10,
        marginTop: 8,
    },
    previewVideo: {
        width: "100%",
        height: 200,
        borderRadius: 10,
        marginTop: 8,
    },
    removeButton: {
        position: "absolute",
        top: 8,
        right: 8,
        backgroundColor: "#fff",
        borderRadius: 12,
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20,
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    buttonText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "bold",
        textAlign: "center",
    },
});
