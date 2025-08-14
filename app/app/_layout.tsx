import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { RootStackParamList } from '@/types/navigation';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from '@/context/ThemeContext';
import {
  ErrorBoundary,
  ErrorFallback,
} from '@/components/common/ErrorBoundary';
import { useAppStateOnlineStatus } from '../hooks/useAppStateOnlineStatus';
import { getAuthData } from '@/services/secureStore';
import useUsersStore from '@/store/useUsersStore';

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList { }
  }
}

// Main app container with all providers
export default function RootLayout() {
  useFrameworkReady();
  const { updateUser } = useUsersStore();

  useAppStateOnlineStatus(async (isOnline) => {
    // console.log('App is active:', isOnline);
    try {
      // Get user data from secure store
      const authData = await getAuthData();
      const userId = authData?.userData?.data?._id;

      if (userId) {
        // Update user's online status using the store
        await updateUser(userId, { isOnline });
        // console.log('User online status updated:', isOnline);
      } else {
        console.warn('User ID not found, skipping online status update');
      }
    } catch (error) {
      console.error('Failed to update online status:', error);
    }
  });
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ThemeProvider>
          <AppContent />
          <StatusBar style="auto" />
        </ThemeProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}

// Separate component for the actual navigation structure
function AppContent() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          animation: 'fade',
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="(drawer)"
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="(auth)"
        options={{
          headerShown: false,
          animation: 'fade_from_bottom',
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
    </Stack>
  );
}
