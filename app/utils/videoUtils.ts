import * as ImagePicker from 'expo-image-picker';
import { Alert, Platform } from 'react-native';

export const pickVideo = async (): Promise<string | null> => {
    // Request permissions
    if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission required', 'Sorry, we need media library permissions to select a video.');
            return null;
        }
    }

    try {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
            allowsEditing: true,
            quality: 1,
            base64: true,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            const asset = result.assets[0];
            // If base64 is available, use it, otherwise fall back to URI
            if (asset.base64) {
                return `data:video/mp4;base64,${asset.base64}`;
            } else if (asset.uri) {
                // For iOS/Android, we'll need to handle the URI differently
                // You might want to upload the file from the URI directly to your server
                return await getVideoBase64(asset.uri);
            }
        }
        return null;
    } catch (error) {
        console.error('Error picking video:', error);
        Alert.alert('Error', 'Failed to pick video. Please try again.');
        return null;
    }
};

// Helper function to convert URI to base64 if needed
export const getVideoBase64 = async (uri: string): Promise<string> => {
    try {
        if (uri.startsWith('data:video/')) {
            return uri; // Already base64
        }

        const response = await fetch(uri);
        const blob = await response.blob();

        return await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                resolve(reader.result as string);
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob); // Converts to base64 string
        });
    } catch (error) {
        console.error('Error converting video to base64:', error);
        throw error;
    }
};
