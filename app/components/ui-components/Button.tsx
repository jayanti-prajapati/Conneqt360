import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  View,
} from 'react-native';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import Spacing from '@/constants/Spacing';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
  title?: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  children?: React.ReactNode;
  isIconOnly?: boolean;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon,
  iconPosition = 'left',
  children,
  isIconOnly = false,
}: ButtonProps) {
  const textStyles = [
    styles.text,
    styles[`${variant}Text`],
    styles[`${size}Text`],
    disabled && styles.disabledText,
    textStyle,
  ];

  const buttonContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <View
            style={[
              styles.loadingOverlay,
              {
                backgroundColor:
                  variant === 'primary'
                    ? Colors.primary[600]
                    : Colors.gray[100],
              },
            ]}
          />
          <ActivityIndicator
            color={variant === 'primary' ? Colors.white : Colors.primary[600]}
            size="large"
          />
        </View>
      );
    }

    if (isIconOnly) {
      return (
        <View style={styles.iconContainer}>
          <View style={styles.icon}>{icon}</View>
        </View>
      );
    }
    return (
      <View style={styles.buttonContent}>
        {icon && iconPosition === 'left' && (
          <View style={styles.icon}>{icon}</View>
        )}
        {title && <Text style={textStyles}>{title}</Text>}
        {icon && iconPosition === 'right' && (
          <View style={styles.icon}>{icon}</View>
        )}
      </View>
    );
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[
        styles.button,
        styles[`${variant}Button`],
        styles[`${size}Button`],
        disabled && styles.disabledButton,
        style,
      ]}
    >
      {buttonContent()}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 6,
  },
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '100%',
    backgroundColor: Colors.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    position: 'relative',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.8,
  },
  primaryButton: {
    backgroundColor: Colors.primary[600],
  },
  secondaryButton: {
    backgroundColor: Colors.primary[100],
  },
  outlineButton: {
    backgroundColor: Colors.transparent,
    borderWidth: 1,
    borderColor: Colors.primary[600],
  },
  ghostButton: {
    backgroundColor: Colors.white,
  },
  smallButton: {
    minHeight: 40,
    minWidth: 80,
    borderRadius: 20,
  },
  mediumButton: {
    minHeight: 48,
    minWidth: 100,
    borderRadius: 24,
  },
  largeButton: {
    minHeight: 56,
    minWidth: 120,
    borderRadius: 28,
  },
  disabledButton: {
    backgroundColor: Colors.gray[300],
    borderColor: Colors.gray[300],
  },
  text: {
    fontSize: 15,
    fontWeight: Typography.weight.medium as any,
    textAlign: 'center',
    letterSpacing: 0.5,
    lineHeight: 20,
  },
  primaryText: {
    color: Colors.white,
  },
  secondaryText: {
    color: Colors.primary[700],
  },
  outlineText: {
    color: Colors.primary[600],
  },
  ghostText: {
    color: Colors.primary[600],
  },
  smallText: {
    fontSize: 14,
    fontWeight: Typography.weight.medium as any,
  },
  mediumText: {
    fontSize: 15,
    fontWeight: Typography.weight.medium as any,
  },
  largeText: {
    fontSize: 16,
    fontWeight: Typography.weight.medium as any,
  },
  disabledText: {
    color: Colors.gray[500],
  },
});
