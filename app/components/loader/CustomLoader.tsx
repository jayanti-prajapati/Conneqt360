import React from 'react';
import { View, Modal, ActivityIndicator, StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';

interface LoaderProps {
    visible: boolean;
}

export default function CustomLoader({ visible }: LoaderProps) {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
        >
            <View style={styles.overlay}>
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color={Colors.primary[500]} />
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loaderContainer: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 12,
        elevation: 4,
    },
});
