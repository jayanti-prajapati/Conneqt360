import { useEffect, useState } from 'react';
import SplashScreen from './splash';
import { Redirect } from 'expo-router';
import { getAuthData } from '@/services/secureStore';

export default function IndexScreen() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setShowSplash(false), 5000);
    return () => clearTimeout(timeout);
  }, []);

  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authData = await getAuthData();
        if (authData?.userData) {
          setIsLogin(true);
          // router.replace('/(tabs)');
        }
      } catch (err) {
        console.error('Error checking auth:', err);
      }
    };

    checkAuth();
  }, []);
  if (isLogin) return <Redirect href="/(tabs)" />
  if (showSplash) return <SplashScreen />;
  return <Redirect href="/(auth)/login" />;
}