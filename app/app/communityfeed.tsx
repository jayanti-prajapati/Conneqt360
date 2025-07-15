import { StyleSheet, TouchableOpacity, View, Image, Alert } from 'react-native';
import { useState } from 'react';
import { Video, ResizeMode } from 'expo-av';
import { useRouter } from 'expo-router';
import { getAuthData } from '@/services/secureStore';
import useCommunityFeedsStore from '@/store/useCommunityFeeds';
import { pickImage, takePhoto } from '@/utils/imageUtils';
import { pickVideo } from '@/utils/videoUtils';
import useFilesStore from '@/store/useFilesStore';
import { useThemeStore } from '@/store/themeStore';
import { Camera, ImageIcon, VideoIcon, X } from 'lucide-react-native';
import Button from '@/components/ui-components/Button';
import Input from '@/components/ui-components/Input';
import Layout from '@/components/common/Layout';
import { Colors } from 'react-native/Libraries/NewAppScreen';

export default function CommunityFeedScreen() {
  const router = useRouter();
  const { theme } = useThemeStore();
  const { createFeed } = useCommunityFeedsStore();
  const [error, setError] = useState<string | null>(null);
  const [contentText, setContentText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const { loading } = useFilesStore();

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
    const userData = await getAuthData();
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
      user: userData?.userData?.data?._id,
    };

    // console.log("Submitting feed:", feedData);
    const resp = await createFeed(feedData);
    // console.log("Response:", resp);
    if (resp?.data?.statusCode == 201 || resp?.data?.statusCode == 200) {
      // console.log('Post upadted successfully:', resp.data.data);
      router.push('/(tabs)');
    } else {
      console.log('Error creating post:', resp);
      console.error('Error creating post:', resp.data.message);
      Alert.alert(
        'Error',
        resp.data.message || 'Something went wrong. Please try again.'
      );
    }
  };

  return (
    <Layout showBackButton title="Create Post">
      <Input
        value={contentText}
        onChangeText={setContentText}
        multiline
        numberOfLines={4}
        placeholder="What's happening in your business?"
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
        <Button
          variant="outline"
          size="medium"
          onPress={takePhotos}
          icon={<Camera size={20} color={theme.primary} />}
        />

        <Button
          variant="outline"
          size="medium"
          onPress={() => pickImages()}
          icon={<ImageIcon size={20} color={theme.primary} />}
        />

        <Button
          variant="outline"
          size="medium"
          onPress={() => pickVideos()}
          icon={<VideoIcon size={20} color={theme.primary} />}
        />
      </View>

      <View style={styles.footer}>
        <Button
          title="Publish Post"
          onPress={handleSubmit}
          disabled={loading}
          loading={loading}
          variant="primary"
          size="large"
          style={{
            flex: 1,
            marginRight: 8,
          }}
        />
        <Button
          title="Cancel"
          onPress={() => router.back()}
          variant="outline"
          size="large"
          style={{
            flex: 1,
            marginLeft: 8,
          }}
        />
      </View>
    </Layout>
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
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[500],
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    borderRadius: 24,
    minHeight: 56,
  },
  previewWrapper: {
    position: 'relative',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewVideo: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginTop: 8,
  },
});
