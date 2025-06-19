import { getAuthData } from '@/services/secureStore';
import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';

export default function IndexScreen() {

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
  return <Redirect href="/(auth)/onboarding" />;
}