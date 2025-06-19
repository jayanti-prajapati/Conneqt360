import * as SecureStore from 'expo-secure-store';


const USER_DATA_KEY = 'user_data';

export const saveAuthData = async (userData: any) => {
  try {
    await SecureStore.setItemAsync(USER_DATA_KEY, JSON.stringify(userData));
  } catch (error) {
    console.error('Error saving auth data:', error);
    throw error;
  }
};

export const getAuthData = async () => {
  try {
    const [userDataStr] = await Promise.all([

      SecureStore.getItemAsync(USER_DATA_KEY)
    ]);

    if (!userDataStr) {
      return null;
    }

    const userData = JSON.parse(userDataStr);
    return { userData };
  } catch (error) {
    console.error('Error getting auth data:', error);
    return null;
  }
};

export const clearAuthData = async () => {
  try {
    await Promise.all([
      SecureStore.deleteItemAsync(USER_DATA_KEY)
    ]);
  } catch (error) {
    console.error('Error clearing auth data:', error);
    throw error;
  }
};
