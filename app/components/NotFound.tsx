import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing } from '@/constants/theme';

interface NotFoundProps {
  message?: string;
}

export const NotFound: React.FC<NotFoundProps> = ({ message = 'No content found' }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.md,
  },
  message: {
    fontSize: Typography.size.lg,
    color: Colors.gray[600],
    textAlign: 'center',
  },
});
