import { Platform } from 'react-native';

export const Colors = {
  white: '#FFFFFF',
  black: '#000000',
  gray: {
    100: '#F8F9FA',
    200: '#E9ECEF',
    300: '#DEE2E6',
    400: '#CED4DA',
    500: '#ADB5BD',
    600: '#868E96',
    700: '#6C757D',
    800: '#495057',
    900: '#343A40',
  },
  primary: {
    50: '#F0F9FF',
    100: '#E0F2FE',
    200: '#BAE6FD',
    300: '#93C5FD',
    400: '#60B5FC',
    500: '#3B82F6',
    600: '#2563EB',
    700: '#1D4ED8',
    800: '#1E40AF',
    900: '#1E3A8A',
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
  xxxl: 48,
};

export const Typography = {
  size: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
  },
  weight: {
    thin: Platform.select({ ios: '100', android: '100', default: '100' }),
    extraLight: Platform.select({ ios: '200', android: '200', default: '200' }),
    light: Platform.select({ ios: '300', android: '300', default: '300' }),
    regular: Platform.select({ ios: '400', android: '400', default: '400' }),
    medium: Platform.select({ ios: '500', android: '500', default: '500' }),
    semiBold: Platform.select({ ios: '600', android: '600', default: '600' }),
    bold: Platform.select({ ios: '700', android: '700', default: '700' }),
    extraBold: Platform.select({ ios: '800', android: '800', default: '800' }),
    black: Platform.select({ ios: '900', android: '900', default: '900' }),
  },
};
