import React from 'react';
import { Modal, View, Text, Pressable, StyleSheet } from 'react-native';

type AppModalProps = {
    visible: boolean;
    onClose: () => void;
    children?: React.ReactNode;
};

export default function AppModal({ visible, onClose, children }: AppModalProps) {
    return (
        <Modal
            animationType="slide"
            transparent
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalView}>
                    {children}


                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        backgroundColor: 'white',
        borderRadius: 16,
        paddingTop: 24,
        paddingBottom: 24,
        alignItems: 'center',
        width: '80%',
        maxHeight: '90%',
    },

});
