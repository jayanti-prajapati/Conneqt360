import useFilesStore from '@/store/useFilesStore';
import * as ImagePicker from 'expo-image-picker';
import { use } from 'react';
import { Alert, Platform } from 'react-native';

export const pickImage = async (): Promise<string | null> => {
  // Request permissions
  if (Platform.OS !== 'web') {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Sorry, we need camera roll permissions to select an image.');
      return null;
    }
  }

  try {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true,
    });
    // console.log('ImagePicker result:', result.assets[0]);

    if (!result.canceled && result.assets && result.assets.length > 0) {
      // const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
      const { uploadFile } = useFilesStore.getState();
      const file = {
        uri: result.assets[0].uri,
        name: result.assets[0].fileName,
        type: result.assets[0].mimeType,
      };
      // console.log('File upload response:', result.assets[0]);
      const data = await uploadFile(file);


      return "http://84.247.177.87/api/custom-file/fetch-doc?fileName=" + data?.data?.data?.fileName;
    }
    return null;
  } catch (error) {
    console.error('Error picking image:', error);
    Alert.alert('Error', 'Failed to pick image. Please try again.');
    return null;
  }
};

export const takePhoto = async (): Promise<string | null> => {
  // Request camera permissions
  // const { status } = await ImagePicker.requestCameraPermissionsAsync();
  // if (status !== 'granted') {
  //   Alert.alert('Permission required', 'Sorry, we need camera permissions to take a photo.');
  //   return null;
  // }



  const result = await ImagePicker.launchCameraAsync({
    allowsEditing: true,
    // aspect: [16, 9],
    quality: 0.8,
  });

  if (!result.canceled && result.assets[0]) {
    // const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
    const { uploadFile } = useFilesStore.getState();
    const file = {
      uri: result.assets[0].uri,
      name: result.assets[0].fileName,
      type: result.assets[0].mimeType,
    };
    // console.log('File upload response:', result.assets[0]);
    const data = await uploadFile(file);


    return "http://84.247.177.87/api/custom-file/fetch-doc?fileName=" + data?.data?.data?.fileName;
  }
  return null;

};
