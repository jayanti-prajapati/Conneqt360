import AsyncStorage from '@react-native-async-storage/async-storage';

export const getAuthData = async () => {
  try {
    const token = await AsyncStorage.getItem('auth_token');
    const user = await AsyncStorage.getItem('user');
    
    if (token && user) {
      return {
        token,
        user: JSON.parse(user),
      };
    }
    return null;
  } catch (error) {
    console.error('Error getting auth data:', error);
    return null;
  }
};

export const setAuthData = async (token: string, user: any) => {
  try {
    await AsyncStorage.setItem('auth_token', token);
    await AsyncStorage.setItem('user', JSON.stringify(user));
  } catch (error) {
    console.error('Error setting auth data:', error);
  }
};

export const clearAuthData = async () => {
  try {
    await AsyncStorage.removeItem('auth_token');
    await AsyncStorage.removeItem('user');
  } catch (error) {
    console.error('Error clearing auth data:', error);
  }
};
