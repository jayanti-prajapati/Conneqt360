import React, { ReactNode } from 'react';
import { Platform, StyleSheet, View, Text, ViewStyle } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Power } from 'lucide-react-native';
import Button from '../ui-components/Button';
import { Spacing } from '@/constants/Spacing';
import { Typography } from '@/constants/Typography';

const styles = StyleSheet.create({
  header: {
    zIndex: 1000,
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: Spacing.sm,
  },
  title: {
    fontSize: Typography.size.xl,
    fontWeight: '700',
    textAlign: 'center',
  },
  leftContainer: {
    width: 40, // Fixed width for alignment
  },
  rightContainer: {
    width: 40, // Fixed width for alignment
    alignItems: 'flex-end',
  },
  backButton: {
    paddingHorizontal: Spacing.xs,
    paddingVertical: Spacing.xs,
  },
  rightComponent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

type HeaderProps = {
  title: string;
  showBackButton?: boolean;
  rightComponent?: ReactNode;
  onBackPress?: () => void;
  onLogoutPress?: () => void;
  style?: ViewStyle;
};

export default function Header({
  title,
  showBackButton = false,
  rightComponent,
  onBackPress,
  onLogoutPress,
  style,
}: HeaderProps) {
  const router = useRouter();
  const { colors } = useTheme();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  const handleLogout = () => {
    if (onLogoutPress) {
      onLogoutPress();
    }
  };

  return (
    <View style={[styles.header, { backgroundColor: colors.card }, style]}>
      <View style={styles.headerContent}>
        <View style={styles.leftContainer}>
          {showBackButton && (
            <Button
              variant="ghost"
              size="small"
              onPress={handleBackPress}
              isIconOnly
              style={styles.backButton}
              icon={
                <Ionicons name="arrow-back" size={24} color={colors.primary} />
              }
            />
          )}
        </View>

        <View style={styles.titleContainer}>
          <Text
            style={[styles.title, { color: colors.text }]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {title}
          </Text>
        </View>

        <View style={styles.rightContainer}>
          {rightComponent ? (
            <View style={styles.rightComponent}>{rightComponent}</View>
          ) : onLogoutPress ? (
            <Button
              variant="ghost"
              //   size="small"
              onPress={handleLogout}
              isIconOnly
              icon={<Power size={20} color={colors.primary} />}
            />
          ) : (
            <View style={{ width: 40 }} />
          )}
        </View>
      </View>
    </View>
  );
}
