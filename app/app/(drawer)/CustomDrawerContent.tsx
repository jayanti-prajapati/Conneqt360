import React, { useEffect } from 'react';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { View, Image, StyleSheet, Text, Pressable, TouchableOpacity } from 'react-native';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { getAuthData } from '@/services/secureStore';
import Typography from '@/constants/Typography';

export default function CustomDrawerContent(props: any) {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getAuthData();
      if (userData?.userData?.data) {
        setUser(userData?.userData?.data);
      }
    }
    fetchUser();
  }, [props])

  return (
    <DrawerContentScrollView
      contentContainerStyle={{ backgroundColor: Colors.white, flexGrow: 1 }}
      {...props}
      style={{ flex: 1 }}
    >
      <Pressable
        style={styles.closeButton}
        onPress={() => props.navigation.closeDrawer()}
        hitSlop={12}
      >
        <Ionicons name="close" size={28} color={Colors.gray[700] || '#333'} />
      </Pressable>
      <TouchableOpacity
        style={styles.profileContainer}
        onPress={() => router.push('/(tabs)/profile')}
      >
        <View style={[styles.avatarContainer, { marginRight: 12 }]}>
          {user?.profileUrl ? <Image
            source={{ uri: user?.profileUrl }} // Replace with actual user image
            style={styles.avatar}
          /> :
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{user?.name?.charAt(0) ? user?.name?.charAt(0)?.toUpperCase() : "U"}</Text>
            </View>
          }
        </View>

        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{user?.name}</Text>
          <Text style={styles.profileTitle} numberOfLines={2}>
            {user?.jobTitle}{"@ "}{user?.businessName}
          </Text>
          <Text style={styles.profileLocation}>
            <Ionicons name="location-outline" size={14} color={Colors.gray[500]} />
            {user?.city || user?.state ? <>
              {' '}{user?.city}{' '}{user?.state}
            </> :
              <>
                {"Not Available"}</>
            }
          </Text>
        </View>
      </TouchableOpacity>
      <View style={styles.menuContainer}>
        {/* <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            props.navigation.navigate('Home');
          }}
        >
          <Ionicons name="home-outline" size={20} color={Colors.gray[700]} />
          <Text style={styles.menuText}>Home</Text>
        </TouchableOpacity> */}

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            router.push('/(tabs)/profile');
          }}
        >
          <Ionicons name="person-outline" size={20} color={Colors.gray[700]} />
          <Text style={styles.menuText}>My Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            // Handle settings
          }}
        >
          <Ionicons name="settings-outline" size={15} color={Colors.gray[700]} />
          <Text style={[styles.menuText, { fontSize: 15, color: Colors.gray[700] }]}>v1.0.0</Text>
        </TouchableOpacity>
        <View style={styles.logoContainer}>
          <Image
            source={require('@/assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

      </View>

    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  profileContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatarContainer: {
    // marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: Colors.primary[700],
    fontSize: 40,
    fontWeight: Typography.weight.bold as any,
  },
  avatar: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 32,
    borderWidth: 2,
    borderColor: Colors.primary[100],
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.gray[900],
    marginBottom: 2,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    // borderTopWidth: 1,
    // borderRadius: 90,
    borderTopColor: Colors.gray[200],
    zIndex: 1000,
    elevation: 5, // for Android shadow
  },

  profileTitle: {
    fontSize: 12,
    color: Colors.gray[700],
    marginBottom: 4,
    lineHeight: 18,
  },
  profileLocation: {
    fontSize: 12,
    color: Colors.gray[500],
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuContainer: {
    flex: 1,
    padding: 16,
    paddingBottom: 80, // Add padding to prevent content from being hidden behind the logo
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    // marginBottom: 8,
  },
  menuText: {
    fontSize: 16,
    marginLeft: 16,
    color: Colors.gray[800],
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.gray[200],
    backgroundColor: Colors.white,
  },
  versionText: {
    fontSize: 14,
    color: Colors.gray[500],
  },
  profileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    backgroundColor: Colors.primary[50],
  },
  profileButtonText: {
    marginLeft: 8,
    color: Colors.primary[600],
    fontWeight: '500',
  },
  logoText: {
    fontSize: 16,
    marginLeft: 10,
    fontWeight: 'bold',
    color: Colors.gray[700],
  },
  logo: {
    width: '100%',
    height: 30,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 12,
    zIndex: 10,
    backgroundColor: Colors.white,
    padding: 4,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
});
