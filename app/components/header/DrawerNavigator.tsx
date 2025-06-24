// navigation/DrawerNavigator.tsx
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

import HomeScreen from '@/app/(tabs)';
import ProfileScreen from '@/app/(tabs)/profile';
import ChatsScreen from '@/app/(tabs)/chats';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
    return (
        <Drawer.Navigator screenOptions={{ headerShown: false }}>
            <Drawer.Screen name="Home" component={HomeScreen} />
            <Drawer.Screen name="Profile" component={ProfileScreen} />
            <Drawer.Screen name="Settings" component={ChatsScreen} />
        </Drawer.Navigator>
    );
}
