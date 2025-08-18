import React from 'react';
import {
    View,
    StyleSheet,
    Text
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Layout from '@/components/common/Layout';
import { Colors, Spacing, Typography } from '@/constants/theme';

export default function NotificationsScreen() {
    return (
        <Layout
            title="Notifications"
            showBackButton
            headerRight={
                <View style={{ width: 24 }} />
            }>
            <View style={styles.container}>
                <View style={styles.content}>
                    <View style={styles.iconContainer}>
                        <MaterialIcons
                            name="notifications-none"
                            size={64}
                            color={Colors.primary[600]}
                        />
                    </View>
                    <Text style={styles.title}>No New Notifications</Text>
                    <Text style={styles.subtitle}>
                        We'll let you know when something new arrives
                    </Text>
                </View>
            </View>
        </Layout>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: Spacing.md,
    },
    content: {
        alignItems: 'center',
        width: '100%',
        maxWidth: 300,
    },
    iconContainer: {
        backgroundColor: 'rgba(0, 122, 255, 0.1)',
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Spacing.md,
    },
    title: {
        // ...Typography.size.lg,
        textAlign: 'center',
        marginBottom: Spacing.md,
        color: Colors.gray[800],
        fontWeight: '600',
    },
    subtitle: {
        // ...Typography.size.md,
        textAlign: 'center',
        color: Colors.gray[600],
        lineHeight: 22,
    },
});