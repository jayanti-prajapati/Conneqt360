import React from 'react';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { View, Image, StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { Pressable } from 'react-native';

export default function CustomDrawerContent(props: any) {
  return (
    <DrawerContentScrollView
      contentContainerStyle={{ backgroundColor: Colors.white }}
      {...props}
    >
      <Pressable
        style={styles.closeButton}
        onPress={() => props.navigation.closeDrawer()}
        hitSlop={12}
      >
        <Ionicons name="close" size={28} color={Colors.gray[700] || '#333'} />
      </Pressable>
      <View style={styles.logoContainer}>
        <Image
          source={require('@/assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: -20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
    paddingBottom: 16,
  },
  logo: {
    width: '100%',
    height: 30,
  },
  closeButton: {
    position: 'absolute',
    top: 32,
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
