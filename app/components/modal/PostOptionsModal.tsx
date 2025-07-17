import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Dimensions } from 'react-native';
import { Share, Flag, Bookmark, Copy, UserX, TriangleAlert as AlertTriangle, User, X } from 'lucide-react-native';
import { useThemeStore } from '@/store/themeStore';


const { height } = Dimensions.get('window');

interface PostOptionsModalProps {
    visible: boolean;
    onClose: () => void;
    isOwnPost: boolean;
    onShare: () => void;
    onReport: () => void;
    onSave: () => void;
    onCopyLink: () => void;
    onBlock?: () => void;
    onDelete?: () => void;
    onViewProfile?: () => void
}

export const PostOptionsModal: React.FC<PostOptionsModalProps> = ({
    visible,
    onClose,
    isOwnPost,
    onShare,
    onReport,
    onSave,
    onCopyLink,
    onBlock,
    onDelete,
    onViewProfile
}) => {
    const { theme } = useThemeStore();

    const options = [
        {
            icon: Share,
            label: 'Share Post',
            onPress: onShare,
            color: theme.text,
        },
        // {
        //     icon: Copy,
        //     label: 'Copy Link',
        //     onPress: onCopyLink,
        //     color: theme.text,
        // },
        {
            icon: Bookmark,
            label: 'Save Post',
            onPress: onSave,
            color: theme.text,
        },

        ...(isOwnPost ? [
            {
                icon: AlertTriangle,
                label: 'Delete Post',
                onPress: onDelete || (() => { }),
                color: theme.error,
            }
        ] : [
            {
                icon: User,
                label: 'View Profile',
                onPress: onViewProfile,
                color: theme.text,
            },
            {
                icon: Flag,
                label: 'Report Post',
                onPress: onReport,
                color: theme.warning,
            },
            {
                icon: UserX,
                label: 'Block User',
                onPress: onBlock || (() => { }),
                color: theme.error,
            }
        ]),

        {
            icon: X,
            label: 'Close',
            onPress: onClose || (() => { }),
            color: theme.error,
        }
    ];

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <TouchableOpacity
                style={styles.overlay}
                activeOpacity={1}
                onPress={onClose}
            >
                <View style={[styles.container, { backgroundColor: theme.surface }]}>
                    <View style={[styles.handle, { backgroundColor: theme.border }]} />

                    <Text style={[styles.title, { color: theme.text }]}>Post Options</Text>

                    <View style={styles.optionsContainer}>
                        {options?.map((option, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[styles.option, { borderBottomColor: theme.border }]}
                                onPress={() => {
                                    //@ts-ignore
                                    option.onPress();
                                    onClose();
                                }}
                            >
                                <option.icon size={24} color={option.color} />
                                <Text style={[styles.optionText, { color: option.color }]}>
                                    {option.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* <TouchableOpacity
                        style={[styles.cancelButton, { backgroundColor: theme.background }]}
                        onPress={onClose}
                    >
                        <Text style={[styles.cancelText, { color: theme.text }]}>Cancel</Text>
                    </TouchableOpacity> */}
                </View>
            </TouchableOpacity>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    container: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingBottom: 34,
        // marginBottom: 40,
        maxHeight: height * 0.7,
    },
    handle: {
        width: 40,
        height: 4,
        borderRadius: 2,
        alignSelf: 'center',
        marginTop: 12,
        marginBottom: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 20,
    },
    optionsContainer: {
        paddingHorizontal: 20,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        gap: 16,
    },
    optionText: {
        fontSize: 16,
        fontWeight: '500',
    },
    // cancelButton: {
    //     marginHorizontal: 20,
    //     // marginTop: 20,
    //     paddingVertical: 16,
    //     borderRadius: 12,
    //     alignItems: 'center',
    // },
    cancelText: {
        fontSize: 16,
        fontWeight: '600',
    },
});