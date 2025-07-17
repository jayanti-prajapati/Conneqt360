import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import {
  DrawerActions,
  useTheme,
  useNavigation,
} from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import Spacing from '@/constants/Spacing';
import Typography from '@/constants/Typography';
import Colors from '@/constants/Colors';

const styles = StyleSheet.create({
  header: {
    zIndex: 1000,
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[300],
    paddingHorizontal: Spacing.md,
    width: '100%',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  middleSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.semiBold as 'medium',
    color: '#000',
    textAlign: 'center',
  },
  menuButton: {
    marginRight: Spacing.sm,
  },
  profileButton: {
    marginLeft: Spacing.sm,
  },
  alertButton: {
    marginLeft: Spacing.sm,
  },
  alertBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary[600],
  },
});

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  rightComponent?: React.ReactNode;
  onBackPress?: () => void;
  style?: ViewStyle;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showBackButton = false,
  rightComponent,
  onBackPress,
  style,
}) => {
  const { colors } = useTheme();
  const params = useLocalSearchParams();
  const navigation = useNavigation<any>();
  const onMenuPress = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };
  const onProfilePress = () => {
    router.replace('/(tabs)/profile');
  };
  return (
    <View style={styles.header}>
      <View style={styles.leftSection}>
        {showBackButton && (
          <TouchableOpacity style={styles.menuButton} onPress={onBackPress}>
            <Ionicons name="chevron-back" size={24} color={colors.text} />
          </TouchableOpacity>
        )}
        {!showBackButton && (
          <TouchableOpacity style={styles.menuButton} onPress={onMenuPress}>
            <Ionicons name="menu" size={24} color={colors.text} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.middleSection}>
        <Text style={styles.title}>{title}</Text>
      </View>

      <View style={styles.rightSection}>
        {rightComponent || (
          <TouchableOpacity style={styles.alertButton} onPress={onProfilePress}>
            <Ionicons
              name="notifications-outline"
              size={24}
              color={colors.text}
            />
            <View style={styles.alertBadge} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
