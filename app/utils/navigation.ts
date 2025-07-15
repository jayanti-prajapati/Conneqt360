import { router } from 'expo-router';
import { RootStackParamList, RootStackScreenName } from '@/types/navigation';
import { getAuthData } from '@/services/secureStore';

// Navigation helper with type safety
export const navigate = <T extends RootStackScreenName>(
  route: T,
  params?: RootStackParamList[T]
) => {
  // @ts-ignore - Expo Router's type definitions are not perfect
  router.navigate(route, params);
};

// Type for auth data
type AuthData = {
  token?: string;
  userData?: any;
};

// Check if user is authenticated
export const isAuthenticated = async (): Promise<boolean> => {
  const authData = await getAuthData() as AuthData | null;
  return !!(authData?.token);
};

// Protected route wrapper
export const withAuth = async <T extends RootStackScreenName>(
  route: T,
  params?: RootStackParamList[T]
): Promise<boolean> => {
  const authenticated = await isAuthenticated();
  
  if (!authenticated) {
    // Redirect to login with the intended route
    navigate('(auth)', { 
      screen: 'login', 
      params: { redirect: route, ...(params as object) }
    } as any);
    return false;
  }
  
  return true;
};

// Public route wrapper (for auth screens)
export const withoutAuth = async (redirectRoute: RootStackScreenName = '(tabs)') => {
  const authenticated = await isAuthenticated();
  
  if (authenticated) {
    // Redirect away from auth screens if already authenticated
    navigate(redirectRoute);
    return false;
  }
  
  return true;
};

// Helper to get route params
export const useRouteParams = <T extends RootStackScreenName>(
  route: any
): RootStackParamList[T] => {
  return route?.params || {};
};
