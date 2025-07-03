import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AppModal from '../modal/AppModal';
import useUsersStore from '@/store/useUsersStore';

type Props = {
    isAbout: boolean;
    onClose?: () => void;
    userId?: string;
};

const About = ({ isAbout, onClose, userId }: Props) => {
    const { updateUser } = useUsersStore();
    const [about, setAbout] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // Close modal and reset state
    const handleClose = () => {
        setAbout('');
        setError('');
        onClose?.();
    };

    // Handle save/update
    const handleSubmit = async () => {
        if (!about.trim()) {
            setError('About is required');
            return;
        }

        if (!userId) {
            setError('Invalid user ID');
            return;
        }

        try {
            setSubmitting(true);
            const resp = await updateUser(userId, { aboutUs: about });

            if (resp?.data?.statusCode === 200 || resp?.data?.statusCode === 201) {
                console.log('About updated:', resp?.data);
                handleClose();
            } else {
                setError(resp?.data?.message || 'Something went wrong. Please try again.');
            }
        } catch (err) {
            console.error('Error updating about:', err);
            setError('Unexpected error occurred. Please try again later.');
        } finally {
            setSubmitting(false);
        }
    };

    // Reset form when modal opens
    useEffect(() => {
        if (!isAbout) {
            setAbout('');
            setError('');
        }
    }, [isAbout]);

    return (
        <AppModal visible={isAbout} onClose={handleClose}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <Text style={styles.title}>Update About</Text>

                <View style={styles.inputContainer}>
                    <TextInput
                        placeholder="Write something about yourself..."
                        value={about}
                        multiline
                        numberOfLines={6}
                        onChangeText={(text) => setAbout(text)}
                        style={styles.input}
                        autoCapitalize="none"
                    />
                </View>

                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                <View style={styles.buttonRow}>
                    <GradientButton title="Close" onPress={handleClose} />
                    <GradientButton title={submitting ? 'Saving...' : 'Save'} onPress={handleSubmit} disabled={submitting} />
                </View>
            </KeyboardAvoidingView>
        </AppModal>
    );
};

export default About;

// ------------------ Gradient Button Component ------------------
type ButtonProps = {
    title: string;
    onPress: () => void;
    disabled?: boolean;
};

const GradientButton = ({ title, onPress, disabled }: ButtonProps) => (
    <TouchableOpacity onPress={onPress} style={styles.button} disabled={disabled}>
        <LinearGradient
            colors={['#1F73C6', '#F7941E']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradient}
        >
            <Text style={styles.buttonText}>{title}</Text>
        </LinearGradient>
    </TouchableOpacity>
);

// ------------------ Styles ------------------
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 18,
        marginBottom: 15,
        fontWeight: '600',
        color: '#333',
    },
    inputContainer: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 6,
        marginVertical: 10,
        backgroundColor: '#fff',
    },
    input: {
        minHeight: 120,
        fontSize: 14,
        textAlignVertical: 'top',
        color: '#333',
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: 5,
        textAlign: 'center',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 20,
    },
    button: {
        flex: 1,
        marginHorizontal: 5,
    },
    gradient: {
        paddingVertical: 10,
        borderRadius: 8,
    },
    buttonText: {
        color: '#fff',
        fontSize: 13,
        textAlign: 'center',
        fontWeight: '500',
    },
});
