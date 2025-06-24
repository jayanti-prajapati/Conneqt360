// components/Header.tsx
import React from 'react';
import { View, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Search, MessageSquareMore } from 'lucide-react-native'; // or Ionicons if preferred
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { StatusBar, Platform } from 'react-native';

export default function Header() {
    const navigation = useNavigation();
    return (
        <View style={styles.container}>
            {/* Profile Logo */}
            <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
                <Image
                    source={{ uri: 'https://marketplace.canva.com/EAE1YLwH0S8/2/0/1600w/canva-gaming-logo-c6qf8DuVYaU.jpg' }} // Replace with your logo
                    style={styles.logo}
                />
            </TouchableOpacity>

            {/* Search Input */}
            <View style={styles.searchBox}>
                <Search color="#555" size={18} />
                <TextInput
                    placeholder="Search"
                    placeholderTextColor="#777"
                    style={styles.searchInput}
                />
            </View>

            {/* Chat Icon */}
            <TouchableOpacity>
                <MessageSquareMore size={24} color="#555" />
            </TouchableOpacity>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: Platform.OS === 'android' ? 44 : 44,
        backgroundColor: '#fff',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderColor: '#ddd',
    },
    logo: {
        width: 32,
        height: 32,
        borderRadius: 16,
    },
    searchBox: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f1f1f1',
        marginHorizontal: 12,
        paddingHorizontal: 10,
        borderRadius: 20,
        height: 36,
    },
    searchInput: {
        flex: 1,
        marginLeft: 6,
        fontSize: 14,
        color: '#333',
    },
});
