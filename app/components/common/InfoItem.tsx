import React, { ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Spacing from '@/constants/Spacing';
import Colors from '@/constants/Colors';

export interface InfoItemProps {
  label: string;
  value: string | ReactNode;
  icon?: ReactNode;
  style?: any;
}

const InfoItem = ({ label, value, icon, style }: InfoItemProps) => {
  return (
    <View style={[styles.container, style]}>
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <View style={styles.content}>
        <Text style={[styles.label]}>{label}</Text>
        {typeof value === 'string' ? (
          <Text style={[styles.value]}>{value}</Text>
        ) : (
          value
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
    gap: Spacing.md,
  },
  iconContainer: {
    marginTop: 2, // Better alignment with text
  },
  content: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 2,
    color: Colors.gray[600],
  },
  value: {
    fontSize: 16,
    lineHeight: 22,
  },
});

export default InfoItem;
