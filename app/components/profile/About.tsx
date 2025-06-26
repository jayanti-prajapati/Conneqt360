import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import AppModal from "../modal/AppModal";
import { useModal } from "@/hooks/useModal";
import { LinearGradient } from 'expo-linear-gradient';
import useUsersStore from "@/store/useUsersStore";

type Props = {
    isAbout: boolean;
    onClose?: () => void;
    userId: string;

}

const About = ({ isAbout, onClose, userId }: Props) => {
    const modal = useModal();
    const { updateUser } = useUsersStore();
    const [about, setAbout] = useState('');
    const [error, setError] = useState('');

    const handleClose = () => {
        modal.close();
        onClose?.();
    }

    const handleSubmit = async () => {
        if (!about) {
            setError('About is required');
            return;
        }

        const resp = await updateUser(userId, { aboutUs: about });
        if (resp?.data?.statusCode == 201 || resp?.data?.statusCode == 200) {
            console.log(resp?.data)
            modal.close();
            onClose?.();
        } else {
            setError("Something went wrong, Please try again")


        }
        // modal.close();
    }
    return (
        <AppModal visible={isAbout} onClose={modal.close}>
            <View style={styles.container}>
                <Text style={{ fontSize: 18, marginBottom: 10 }}> Update About</Text>




                <View style={styles.inputContainer}>
                    <TextInput
                        placeholder="About"
                        value={about}
                        multiline={true}
                        numberOfLines={4}
                        onChangeText={text => setAbout(text)}
                        style={[styles.input]}
                        autoCapitalize="none"
                    />

                </View>

                {error && <Text style={styles.errorText}>{error}</Text>}

                <View style={{ flexDirection: 'row', justifyContent: "space-between", width: '95%' }}>
                    <TouchableOpacity onPress={handleClose} style={styles.button}>
                        <LinearGradient colors={['#1F73C6', '#F7941E']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }} style={styles.button}>
                            <Text style={styles.buttonText}>Close</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleSubmit} style={styles.button}>
                        <LinearGradient colors={['#1F73C6', '#F7941E']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }} style={styles.button}>
                            <Text style={styles.buttonText}>Save</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </View>
        </AppModal>
    );
};

export default About;

const styles = StyleSheet.create({
    button: {
        padding: 10,
        borderRadius: 5,
        // margin: 10,
    },
    container: {
        // margin: 10,
        flexDirection: 'column',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 12,
        textAlign: 'center',
    },
    inputContainer: {
        maxWidth: "90%",
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,

        borderColor: '#ddd',
        borderRadius: 12,
        paddingHorizontal: 12,
        marginVertical: 5,
        width: '100%',

    },
    inputIcon: {
        marginRight: 8,
    },
    input: {
        flex: 1,

        height: 200,
        textAlignVertical: 'top',
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: 5,
    },
});