import React from 'react';
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


const BottomView: React.FC = () => {
    const insets = useSafeAreaInsets();
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
        <CurvedBottomBarExpo.Navigator
            id="main-bottom-bar"
            type="DOWN"
            style={styles.bottomBar}
            shadowStyle={styles.shadow}
            width={0}
            // height={50 + insets.bottom}// ⬅️ Increase this value to make the bottom bar taller
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
                        style={styles.button}
                        onPress={() => Alert.alert('Add pressed')}
                    >
                        <Ionicons name="add" color="white" size={28} />
                    </TouchableOpacity>
                </Animated.View>
            )}
            tabBar={renderTabBar}
            circlePosition="CENTER"
            screenListeners={{}}
            defaultScreenOptions={{}}>
            {/* <CurvedBottomBarExpo.Screen name="home" position="LEFT" component={HomeScreen} /> */}
            <CurvedBottomBarExpo.Screen name="directory" position="LEFT" component={HomeScreen} />
            {/* <CurvedBottomBarExpo.Screen name="circles" position="LEFT" component={CirclesScreen} /> */}
            <CurvedBottomBarExpo.Screen name="circles" position="LEFT" component={MarketplaceScreen} />
            <CurvedBottomBarExpo.Screen name="chats" position="RIGHT" component={ChatsScreen} />
            <CurvedBottomBarExpo.Screen name="profile" position="RIGHT" component={ProfileScreen} />
        </CurvedBottomBarExpo.Navigator>
        // </NavigationContainer >
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
        backgroundColor: '#007AFF',
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
    tabbarItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 8,
    },
});
