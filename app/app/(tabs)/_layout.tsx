import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { DrawerNavigationProp } from '@react-navigation/drawer';

export default function TabLayout() {
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerLeft: () => (
          <Pressable
            onPress={() => navigation.openDrawer()}
            style={{ marginLeft: 16 }}
          >
            <Ionicons name="menu" size={24} color="#222" />
          </Pressable>
        ),
        tabBarIcon: ({ color, size }) => {
          let iconName = 'ellipse-outline';
          switch (route.name) {
            case 'index':
              iconName = 'home-outline';
              break;
            case 'circles':
              iconName = 'people-outline';
              break;
            case 'marketplace':
              iconName = 'cart-outline';
              break;
            case 'chats':
              iconName = 'chatbox-ellipses-outline';
              break;
            case 'profile':
              iconName = 'person-outline';
              break;
          }
          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        headerTitleAlign: 'center',
      })}
    />
  );
}
