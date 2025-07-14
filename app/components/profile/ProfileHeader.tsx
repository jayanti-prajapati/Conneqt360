import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import Button from '@/components/ui-components/Button';
import { MapPin, Phone, Mail, Edit2 } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import Spacing from '@/constants/Spacing';

interface ProfileHeaderProps {
  name: string;
  avatar?: string;
  coverImage?: string;
  verified: boolean;
  businessType: string;
  location: string;
  phone: string;
  email: string;
  isOwnProfile: boolean;
  onEditProfile: () => void;
  onConnect: () => void;
}

export default function ProfileHeader({
  name,
  avatar,
  coverImage,
  verified,
  businessType,
  location,
  phone,
  email,
  isOwnProfile,
  onEditProfile,
  onConnect,
}: ProfileHeaderProps) {
  return (
    <View style={styles.container}>
      <Image
        source={{
          uri:
            coverImage ||
            'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg',
        }}
        style={styles.coverImage}
      />

      <View style={styles.profileContent}>
        <View style={styles.avatarContainer}>
          {avatar ? (
            <Image source={{ uri: avatar }} style={styles.avatar} />
          ) : (
            <View style={styles.defaultAvatar}>
              <Text style={styles.avatarText}>{name.charAt(0)}</Text>
            </View>
          )}

          {verified && (
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedBadgeText}>✓</Text>
            </View>
          )}
        </View>

        <View style={styles.nameContainer}>
          <Text style={styles.name}>{name}</Text>
          <View style={styles.businessTypeContainer}>
            <Text style={styles.businessType}>{businessType}</Text>
          </View>
        </View>

        <View style={styles.actionButtons}>
          {isOwnProfile ? (
            <Button
              title="Edit Profile"
              variant="outline"
              size="medium"
              onPress={onEditProfile}
              icon={<Edit2 size={20} color={Colors.primary[600]} />}
              iconPosition="left"
            />
          ) : (
            <Button
              title="Connect"
              variant="primary"
              size="medium"
              onPress={onConnect}
            />
          )}
        </View>

        <View style={styles.contactInfo}>
          <View style={styles.contactItem}>
            <MapPin size={16} color={Colors.gray[600]} />
            <Text style={styles.contactText}>{location}</Text>
          </View>

          <View style={styles.contactItem}>
            <Phone size={16} color={Colors.gray[600]} />
            <Text style={styles.contactText}>{phone}</Text>
          </View>

          <View style={styles.contactItem}>
            <Mail size={16} color={Colors.gray[600]} />
            <Text style={styles.contactText}>{email}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.lg,
  },
  coverImage: {
    height: 150,
    width: '100%',
  },
  profileContent: {
    marginTop: -40,
    paddingHorizontal: Spacing.md,
  },
  avatarContainer: {
    position: 'relative',
    alignSelf: 'flex-start',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: Colors.white,
  },
  defaultAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.white,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: Typography.weight.bold as any,
    color: Colors.primary[700],
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.primary[600],
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
  },
  verifiedBadgeText: {
    color: Colors.white,
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.bold as any,
  },
  nameContainer: {
    marginTop: Spacing.sm,
  },
  name: {
    fontSize: Typography.size.xl,
    fontWeight: Typography.weight.bold as any,
    color: Colors.gray[800],
  },
  businessTypeContainer: {
    marginTop: 4,
  },
  businessType: {
    fontSize: Typography.size.sm,
    color: Colors.gray[600],
  },
  actionButtons: {
    marginTop: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  contactInfo: {
    marginTop: Spacing.md,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  contactText: {
    marginLeft: Spacing.xs,
    fontSize: Typography.size.sm,
    color: Colors.gray[700],
  },
});
