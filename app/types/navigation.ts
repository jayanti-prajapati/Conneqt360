import { NavigatorScreenParams } from '@react-navigation/native';

// Auth screens
type AuthStackParamList = {
  'login': { redirect?: string; [key: string]: any } | undefined;
  'register': undefined;
  'forgot-password': undefined;
};

// Tab screens
type TabParamList = {
  'index': undefined;
  'circles': undefined;
  'marketplace': undefined;
  'chats': undefined;
  'profile': undefined;
};

// Drawer screens
type DrawerParamList = {
  'home': undefined;
  'settings': undefined;
};

// Modal/Overlay screens
type ModalParamList = {
  'post-details': { postId: string };
  'user-profile': { userId: string };
};

// Root stack param list
export type RootStackParamList = {
  // Auth flow
  '(auth)': NavigatorScreenParams<AuthStackParamList>;
  
  // Main app
  '(tabs)': NavigatorScreenParams<TabParamList>;
  '(drawer)': NavigatorScreenParams<DrawerParamList>;
  
  // Standalone screens
  'index': undefined;
  'communityfeed': { postId?: string };
  
  // Modals
  '(modals)': NavigatorScreenParams<ModalParamList>;

  // Business screens
  'business-catalog': { catalog: string; owner: string };
  'business-clients': { clients: string; owner: string };
  'business-services': { services: string; owner: string };
};

// Type for route names
export type RootStackScreenName = keyof RootStackParamList;

// Type for navigation props
export type NavigationProps<T extends RootStackScreenName> = {
  navigation: {
    navigate: (screen: T, params?: RootStackParamList[T]) => void;
    goBack: () => void;
    // Add other navigation methods as needed
  };
  route: {
    params: RootStackParamList[T];
  };
};

// Type for navigation props
export type ScreenProps<T extends RootStackScreenName> = {
  navigation: {
    navigate: (screen: T, params?: RootStackParamList[T]) => void;
    goBack: () => void;
    // Add other navigation methods as needed
  };
  route: {
    params: RootStackParamList[T];
  };
};
