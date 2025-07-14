import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';

import { useThemeStore } from '@/store/themeStore';
import { LinearGradient } from 'expo-linear-gradient';

interface ThemedButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'gradient';
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const ThemedButton: React.FC<ThemedButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  style,
  textStyle,
}) => {
  const { theme } = useThemeStore();

  const getTextColor = () => {
    switch (variant) {
      case 'outline':
        return theme.text;
      case 'gradient':
        return '#FFFFFF';
      default:
        return '#FFFFFF';
    }
  };

  const content = (
    <Text style={[styles.text, { color: getTextColor() }, textStyle]}>
      {title}
    </Text>
  );

  if (variant === 'gradient') {
    return (
      <TouchableOpacity onPress={onPress} disabled={disabled} style={[style, disabled && styles.disabled]}>
        <LinearGradient
          colors={['#1F73C6', '#F7941E']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.button, style]}
        >
          {content}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[
        styles.button,
        style,
        variant === 'primary' && { backgroundColor: theme.primary },
        variant === 'secondary' && { backgroundColor: theme.secondary },
        variant === 'outline' && {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: theme.border,
        },
        disabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      {content}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.5,
  },
});
