import { useEffect, useState } from 'react';
import SplashScreen from './splash';
import { Redirect } from 'expo-router';

export default function IndexScreen() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setShowSplash(false), 5000);
    return () => clearTimeout(timeout);
  }, []);

  if (showSplash) return <SplashScreen />;
  return <Redirect href="/(auth)/login" />;
}