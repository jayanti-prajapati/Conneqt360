import React, { ReactNode } from 'react';
import InfoItem from './InfoItem';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import Spacing from '@/constants/Spacing';
import Typography from '@/constants/Typography';
import Colors from '@/constants/Colors';

export interface InfoItem {
  label: string;
  value: any;
  icon: ReactNode;
}

interface InfoCardProps {
  title: string;
  items?: InfoItem[];
  children?: ReactNode;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
}

const InfoCard = ({
  title,
  items,
  children,
  style,
  contentStyle,
}: InfoCardProps) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.title]}>{title}</Text>
      <View style={[styles.content, contentStyle]}>
        {items?.map((item, index) => (
          <InfoItem key={index} {...item} />
        ))}
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.sm,
    padding: Spacing.md,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    backgroundColor: Colors.white,
  },
  title: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.bold as any,
    marginBottom: Spacing.md,
    color: Colors.gray[700],
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
    paddingBottom: Spacing.md,
  },
  content: {
    gap: Spacing.md,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  iconContainer: {
    width: 24,
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: Typography.size.sm,
    color: Colors.gray[600],
    marginBottom: Spacing.sm,
  },
  value: {
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.medium as any,
    color: Colors.gray[700],
  },
});

export default InfoCard;
