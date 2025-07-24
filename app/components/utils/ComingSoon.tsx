import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
// Replace with your actual Button import
import { useThemeStore } from '@/store/themeStore';
import Button from '../ui-components/Button';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

export const ComingSoon = () => {
    const { theme } = useThemeStore();
    const router = useRouter();

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <Image
                source={{ uri: 'https://img.freepik.com/free-vector/coming-soon-construction-illustration-design_1017-31446.jpg' }} // Replace with your image or animation
                style={styles.image}
                resizeMode="contain"
            />
            <Text style={[styles.title, { color: theme.text }]}>Coming Soon!</Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                We're working hard to bring you this feature. Stay tuned!
            </Text>

            <Button
                title="Back to Home"
                onPress={() => {
                    router.back();
                    // navigate to home or previous screen
                }}
                style={styles.button}
                variant="primary"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
        paddingHorizontal: 24,
        alignItems: 'center',
        borderRadius: 10,
        height: height * 0.9,
        justifyContent: 'center',
    },
    image: {
        width: width * 0.6,
        height: height * 0.3,
        borderRadius: 10,
        marginBottom: 30,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        marginBottom: 12,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 40,
    },
    button: {
        paddingHorizontal: 24,
        paddingVertical: 10,
        borderRadius: 8,
    },
});
