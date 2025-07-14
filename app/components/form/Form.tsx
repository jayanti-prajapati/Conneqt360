import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, Typography } from '@/constants/theme';

interface FormProps {
  closeText: string;
  onClose?: () => void;
}

export const Form: React.FC<FormProps> = ({ closeText, onClose }) => {
  return <View></View>;
};
