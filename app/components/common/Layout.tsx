import React, { ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
  ScrollView,
  StatusBar,
  StyleProp,
  ViewStyle,
  ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@react-navigation/native';
import { router } from 'expo-router';
import { clearAuthData } from '@/services/secureStore';
import { Colors, Spacing } from '@/constants/theme';
import { Header } from './Header';

type LayoutProps = {
  children: ReactNode;
  title: string;
  showHeader?: boolean;
  showBackButton?: boolean;
  headerRight?: ReactNode;
  scrollable?: boolean;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  safeAreaEdges?: Array<'top' | 'right' | 'bottom' | 'left'>;
  statusBarStyle?: 'light-content' | 'dark-content' | 'default';
  statusBarColor?: string;
};

export default function Layout({
  children,
  title,
  showHeader = true,
  showBackButton = false,
  headerRight,
  scrollable = false,
  style,
  contentContainerStyle,
  safeAreaEdges = ['top', 'left', 'right'],
}: LayoutProps) {
  const { colors } = useTheme();

  const renderContent = () => {
    if (scrollable) {
      return (
        <ScrollView
          style={[styles.scrollView, style]}
          contentContainerStyle={[
            styles.scrollContentContainer,
            contentContainerStyle,
          ]}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {children}
        </ScrollView>
      );
    }
    return (
      <View style={[styles.contentContainer, contentContainerStyle, style]}>
        {children}
      </View>
    );
  };

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <StatusBar />

      {/* <ImageBackground
        source={{
          uri: 'https://www.canva.com/design/DAGtZyiGzk0/QCdqf0HSIIdYHc-xbABiWw/watch?utm_content=DAGtZyiGzk0&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h1a41331a5f',
        }}
        style={styles.imageBackground}
      > */}
      <SafeAreaView style={styles.safeArea} edges={safeAreaEdges}>
        {showHeader && (
          <Header
            title={title}
            showBackButton={showBackButton}
            rightComponent={headerRight}
            onBackPress={() => router.back()}
          />
        )}
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 25}
        >
          {renderContent()}
        </KeyboardAvoidingView>
      </SafeAreaView>
      {/* </ImageBackground> */}
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContentContainer: {
    flexGrow: 1,
    padding: Spacing.xs,
  },
  contentContainer: {
    flex: 1,
    padding: Spacing.xs,
  },
  imageBackground: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
});
