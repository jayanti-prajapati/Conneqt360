import { getAuthData } from '@/services/secureStore';
import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';


export default function IndexScreen() {
  const [isLogin, setIsLogin] = useState(false);

  const checkAuth = async () => {
    try {
      const authData = await getAuthData();
      if (authData?.userData) {
        setIsLogin(true);
      }
    } catch (err) {
      console.error('Error checking auth:', err);
    }
  };



  if (isLogin) return <Redirect href="/(tabs)" />
  return <Redirect href="/(auth)/onboarding" />;
}
