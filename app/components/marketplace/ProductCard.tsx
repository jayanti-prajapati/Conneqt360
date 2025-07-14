import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import Card from '@/components/ui-components/Card';
import Button from '@/components/ui-components/Button';
import { Star } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import Spacing from '@/constants/Spacing';

interface ProductCardProps {
  id: string;
  title: string;
  price: string;
  description: string;
  imageUrl: string;
  sellerName: string;
  rating: number;
  location: string;
  onPress: (id: string) => void;
  onInquiry: (id: string) => void;
  verified?: boolean;
}

export default function ProductCard({
  id,
  title,
  price,
  description,
  imageUrl,
  sellerName,
  rating,
  location,
  onPress,
  onInquiry,
  verified = false,
}: ProductCardProps) {
  return (
    <TouchableOpacity activeOpacity={0.9} onPress={() => onPress(id)}>
      <Card style={styles.card}>
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />

        <View style={styles.content}>
          <View style={styles.priceRow}>
            <Text style={styles.price}>{price}</Text>
            {verified && (
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedText}>Verified</Text>
              </View>
            )}
          </View>

          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.description} numberOfLines={2}>
            {description}
          </Text>

          <View style={styles.sellerInfo}>
            <View style={styles.ratingContainer}>
              {[...Array(5)].map((_, index) => (
                <Star
                  key={index}
                  size={14}
                  color={
                    index < rating ? Colors.warning[500] : Colors.gray[300]
                  }
                  fill={
                    index < rating ? Colors.warning[500] : Colors.transparent
                  }
                />
              ))}
              <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
            </View>

            <Text style={styles.location}>{location}</Text>
          </View>

          <View style={styles.footer}>
            <Text style={styles.sellerName}>{sellerName}</Text>
            <Button
              title="Inquire"
              variant="primary"
              size="small"
              onPress={() => onInquiry(id)}
              style={styles.inquireButton}
            />
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: Spacing.md,
    width: '100%',
    padding: 0,
  },
  image: {
    width: '100%',
    height: 140,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  content: {
    padding: Spacing.sm,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  price: {
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.bold as any,
    color: Colors.primary[700],
  },
  verifiedBadge: {
    backgroundColor: Colors.success[50],
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  verifiedText: {
    fontSize: Typography.size.xs,
    color: Colors.success[700],
    fontWeight: Typography.weight.medium as any,
  },
  title: {
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.semiBold as any,
    color: Colors.gray[800],
    marginBottom: 2,
  },
  description: {
    fontSize: Typography.size.sm,
    color: Colors.gray[600],
    marginBottom: Spacing.xs,
  },
  sellerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 4,
    fontSize: Typography.size.xs,
    color: Colors.gray[700],
  },
  location: {
    fontSize: Typography.size.xs,
    color: Colors.gray[500],
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  sellerName: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.medium as any,
    color: Colors.gray[700],
  },
  inquireButton: {
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
});
