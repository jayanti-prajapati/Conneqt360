import { useState, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { Alert } from 'react-native';

export const useNetworkStatus = (showAlert = true) => {
  const [isConnected, setIsConnected] = useState<boolean | null>(true);

  useEffect(() => {
    // Check internet connection
    const unsubscribe = NetInfo.addEventListener(state => {
      const wasConnected = isConnected;
      const isNowConnected = state.isConnected;
      
      setIsConnected(isNowConnected);
      
      // Only show alert if the connection status changed and showAlert is true
      if (showAlert && wasConnected !== isNowConnected) {
        if (!isNowConnected) {
          Alert.alert(
            'No Internet Connection',
            'Please check your internet connection and try again.',
            [{ text: 'OK' }],
            { cancelable: false }
          );
        } else {
          console.log('Internet connection restored');
        }
      }
    });

    // Initial check
    NetInfo.fetch().then(state => {
      setIsConnected(state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, [showAlert]);

  return isConnected;
};

export default useNetworkStatus;
