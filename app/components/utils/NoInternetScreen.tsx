import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { WifiOff } from 'lucide-react-native'; // you can use any icon library
import { LinearGradient } from 'expo-linear-gradient';


export default function NoInternetScreen({ onRetry }: { onRetry?: () => void }) {
    return (
        <LinearGradient
            colors={['#f9f9f9', '#e3f2fd']}
            style={styles.container}
        >
            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <WifiOff size={80} color="#1976d2" />
                </View>
                <Text style={styles.title}>No Internet Connection</Text>
                <Text style={styles.subtitle}>
                    Oops! It looks like you're offline. Please check your network settings and try again.
                </Text>
                {/* <TouchableOpacity style={styles.button} onPress={onRetry}>
                    <Text style={styles.buttonText}>Try Again</Text>
                </TouchableOpacity> */}
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        paddingHorizontal: 24,
        alignItems: 'center',
    },
    iconContainer: {
        backgroundColor: '#e3f2fd',
        borderRadius: 60,
        padding: 24,
        marginBottom: 24,
        shadowColor: '#1976d2',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 4,
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        color: '#0d47a1',
        marginBottom: 12,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#455a64',
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 22,
    },
    button: {
        backgroundColor: '#1976d2',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 30,
        shadowColor: '#1976d2',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 3,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});