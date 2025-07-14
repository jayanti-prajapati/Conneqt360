import React from 'react';
import { View, Image, Modal, TouchableOpacity, StyleSheet, Dimensions, Text } from 'react-native';
import { X } from 'lucide-react-native';
import { useThemeStore } from '@/store/themeStore';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';


const { width, height } = Dimensions.get('window');

interface ProfileImageModalProps {
    visible: boolean;
    imageUri: string;
    userEmail?: string; // Optional, can be used for displaying user email or other info
    onClose: () => void;
}

export const ProfileImageModal: React.FC<ProfileImageModalProps> = ({
    visible,
    imageUri,
    userEmail,
    onClose,
}) => {
    const { theme } = useThemeStore();

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                    <X size={24} color="#FFFFFF" />
                </TouchableOpacity>

                <View style={styles.imageContainer}>
                    {imageUri ? (
                        <Image
                            source={{ uri: imageUri }}
                            style={styles.image}
                            resizeMode="contain"
                        />
                    ) : (
                        <Text style={styles.avatarText}>{userEmail?.charAt(0)?.toUpperCase() || "U"}</Text>
                    )}

                </View>

                <TouchableOpacity
                    style={styles.backgroundTouchable}
                    onPress={onClose}
                    activeOpacity={1}
                />
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButton: {
        position: 'absolute',
        top: 60,
        right: 20,
        zIndex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 20,
        padding: 8,
    },
    imageContainer: {
        width: width * 0.9,
        height: width * 0.9,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 12,
    },
    avatarText: {
        color: Colors.primary[700],
        fontSize: Typography.size.lg,
        fontWeight: Typography.weight.bold as any,
    },
    backgroundTouchable: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1,
    },
});