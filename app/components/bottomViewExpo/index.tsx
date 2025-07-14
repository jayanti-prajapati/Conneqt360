import React, { useEffect, useState } from 'react';
import {
  Alert,
  Animated,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { CurvedBottomBarExpo } from 'react-native-curved-bottom-bar';
import Ionicons from '@expo/vector-icons/Ionicons';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '@/app/(tabs)';
import ProfileScreen from '@/app/(tabs)/profile';
import MarketplaceScreen from '@/app/(tabs)/marketplace';
import ChatsScreen from '@/app/(tabs)/chats';
import CirclesScreen from '@/app/(tabs)/circles';
import TabBarBackground from '../tabs/TabBarBackground';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import { Redirect, router } from 'expo-router';
import Button from '../ui-components/Button';
import IconButton from '../ui-components/IconButton';
import { Plus } from 'lucide-react-native';

const BottomView: React.FC = () => {
  const [isFeedOpen, setIsFeedOpen] = useState(false);
  const insets = useSafeAreaInsets();

  // useEffect(() => {
  //     console.log('BottomView mounted', isFeedOpen);

  //     if (isFeedOpen) {
  //         router.push("/(tabs)/addfeed");
  //         // setIsFeedOpen(false); // reset state to avoid loops
  //     }
  // }, [isFeedOpen]);
  const renderIcon = (routeName: string, selectedTab: string) => {
    let icon = '';

    switch (routeName) {
      case 'home':
        icon = 'home-outline';
        break;
      case 'directory':
        icon = 'people-outline';
        break;
      case 'circles':
        icon = 'ellipse-outline';
        break;
      case 'marketplace':
        icon = 'cart-outline';
        break;
      case 'chats':
        icon = 'chatbox-ellipses-outline';
        break;
      case 'profile':
        icon = 'person-outline';
        break;
      default:
        icon = 'ellipse-outline';
    }

    return (
      <Ionicons
        name={icon as any}
        size={25}
        color={routeName === selectedTab ? '#007AFF' : 'gray'}
      />
    );
  };

  const renderTabBar = ({
    routeName,
    selectedTab,
    navigate,
  }: {
    routeName: string;
    selectedTab: string;
    navigate: (routeName: string) => void;
  }) => {
    return (
      <TouchableOpacity
        onPress={() => navigate(routeName)}
        style={styles.tabbarItem}
      >
        {renderIcon(routeName, selectedTab)}
      </TouchableOpacity>
    );
  };

  return (
    // <NavigationContainer >
    //@ts-ignore

    // </NavigationContainer >

    <View style={{ flex: 1 }}>
      <CurvedBottomBarExpo.Navigator
        id="main-bottom-bar"
        type="DOWN"
        style={styles.bottomBar}
        shadowStyle={styles.shadow}
        width={0}
        height={64} // ⬅️ Increase this value to make the bottom bar taller
        circleWidth={64} // ⬅️ Make this match the central button size / arc
        borderColor="#e0e0e0"
        borderWidth={1}
        bgColor="white"
        initialRouteName="directory"
        borderTopLeftRight
        backBehavior="initialRoute"
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#ffffff',
            borderTopWidth: 1,
            borderTopColor: '#f0f0f0',
            height: 90,
            // paddingBottom: 10,
            paddingTop: 20,
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: -2,
            },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 10,
          },
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: '#8E8E93',
          tabBarShowLabel: false,
          tabBarBackground: () => <TabBarBackground />,
        }}
        renderCircle={() => (
          <Animated.View style={[styles.btnCircleUp, { bottom: 25 }]}>
            <TouchableOpacity
              onPress={() => {
                console.log('Pressed FAB — navigating to /communityfeed');
                router.push('/communityfeed');
              }}
              activeOpacity={0.8}
            >
              <IconButton
                variant="primary"
                onPress={() => router.push('/communityfeed')}
                icon={<Plus size={28} strokeWidth={2.5} color="#ffffff" />}
              />
            </TouchableOpacity>
          </Animated.View>
        )}
        tabBar={renderTabBar}
        circlePosition="CENTER"
        screenListeners={{}}
        defaultScreenOptions={{}}
      >
        {/* <CurvedBottomBarExpo.Screen name="home" position="LEFT" component={HomeScreen} /> */}
        <CurvedBottomBarExpo.Screen
          name="directory"
          position="LEFT"
          component={HomeScreen}
        />
        {/* <CurvedBottomBarExpo.Screen name="circles" position="hide" component={CirclesScreen} /> */}
        <CurvedBottomBarExpo.Screen
          name="circles"
          position="LEFT"
          component={MarketplaceScreen}
        />
        <CurvedBottomBarExpo.Screen
          name="chats"
          position="RIGHT"
          component={ChatsScreen}
        />
        <CurvedBottomBarExpo.Screen
          name="profile"
          position="RIGHT"
          component={ProfileScreen}
        />
      </CurvedBottomBarExpo.Navigator>
    </View>
  );
};

export default BottomView;

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  bottomBar: {},
  btnCircleUp: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: '#007AFF',
    bottom: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradientButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  tabbarItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 8,
  },
});
