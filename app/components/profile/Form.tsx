import { Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import AppModal from "../modal/AppModal";
import { useModal } from "@/hooks/useModal";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { useEffect, useState, useCallback } from "react";

import useUsersStore from "@/store/useUsersStore";
import { getAuthData } from "@/services/secureStore";
type Props = {
    isPresent?: boolean;
    onClose?: () => void;
    closeText?: string;
    users?: any
}
export default function Form({ isPresent, onClose, closeText, users }: Props) {
    const modal = useModal();
    const { fetchUserByPhoneNumber, updateUser } = useUsersStore();
    const [userData, setUserData] = useState<any>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        jobTitle: '',
        email: '',
        username: '',
        businessName: '',
        businessType: '',
        udyamNumber: '',
        gstNumber: '',
        address: '',

    });

    const [errors, setErrors] = useState({
        name: '',
        jobTitle: '',
        email: '',
        username: '',
        businessName: '',
        businessType: '',
        udyamNumber: '',
        gstNumber: '',
        address: '',
        apiError: '',
    });

    useEffect(() => {
        // Update form data when users prop changes
        setFormData({
            name: users?.name || '',
            jobTitle: users?.jobTitle || '',
            email: users?.email || '',
            username: users?.username || '',
            businessName: users?.businessName || '',
            businessType: users?.businessType || '',
            udyamNumber: users?.udyamNumber || '',
            gstNumber: users?.gstNumber || '',
            address: users?.location || '',

        });
    }, [users]);

    useEffect(() => {

        const fetchData = async () => {
            const authData = await getAuthData();
            const resp = await fetchUserByPhoneNumber(authData?.userData?.phone)
            console.log('Authrr Data:', resp.data);
            if (resp?.data?.statusCode == 200) {
                setUserData(resp.data.data);
                console.log('User Data:', resp?.data?.data?.isSkip);

                setIsVisible(!(resp?.data?.data?.isSkip))
                return;
            }


        }
        fetchData();


    }, [fetchUserByPhoneNumber]);


    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setErrors(prev => ({ ...prev, [field]: '' })); // Clear error on change
    };




    const handleSkip = async () => {
        if (isPresent) {
            onClose?.();
            return;
        }
        setErrors({
            name: '',
            jobTitle: '',
            email: '',
            username: '',
            businessName: '',
            businessType: '',
            udyamNumber: '',
            gstNumber: '',
            address: '',
            apiError: '',
        })

        modal.close();
        const resp = await updateUser(userData?._id, { isSkip: true });

        if (resp?.data?.statusCode == 201 || resp?.data?.statusCode == 200) {

            setUserData(resp.data.data);
            setIsVisible(false);
        } else {
            console.error('Error creating user:', resp.data.message);
            setErrors({
                apiError: resp.data.error,
                name: "",
                jobTitle: "",
                email: "",
                username: "",
                businessName: "",
                businessType: "",
                udyamNumber: "",
                gstNumber: "",
                address: "",
            })

        }
    }
    const handleSubmit = async () => {
        let valid = true;
        let newErrors: typeof errors = {
            name: '',
            jobTitle: '',
            email: '',
            username: '',
            businessName: '',
            businessType: '',
            udyamNumber: '',
            gstNumber: '',
            address: '',
            apiError: '',
        };

        if (!formData.email || !/^\S+@\S+\.\S+$/.test(formData.email)) {
            newErrors.email = 'Enter a valid email';
            valid = false;
        }

        if (!formData.businessName) {
            newErrors.businessName = 'Business name is required';
            valid = false;
        }

        if (!formData.username) {
            newErrors.username = 'Username is required';
            valid = false;
        }

        if (!formData.name) {
            newErrors.name = 'Name is required';
            valid = false;
        }

        if (!formData.jobTitle) {
            newErrors.jobTitle = 'Job Title is required';
            valid = false;
        }
        if (!formData.businessType) {
            newErrors.businessType = 'Business type is required';
            valid = false;
        }

        if (!formData.udyamNumber) {
            newErrors.udyamNumber = 'Udyam number is required';
            valid = false;
        }

        if (!formData.gstNumber) {
            newErrors.gstNumber = 'GST number is required';
            valid = false;
        }

        if (!formData.address) {
            newErrors.address = 'Address is required';
            valid = false;
        }

        setErrors(newErrors);

        if (valid) {

            const resp = await updateUser(userData?._id, { ...formData, isSkip: true, location: formData.address });
            if (resp?.data?.statusCode == 201 || resp?.data?.statusCode == 200) {
                setUserData(resp.data.data);
                setIsVisible(false);
                onClose?.()
            } else {
                setErrors({
                    apiError: 'Something went wrong, Please try again',
                    name: "",
                    jobTitle: "",
                    email: "",
                    username: "",
                    businessName: "",
                    businessType: "",
                    udyamNumber: "",
                    gstNumber: "",
                    address: "",
                })
                console.error('Error creating user:', resp.data.message);

            }
            // modal.close();
        }
    };

    return (


        <AppModal visible={isPresent ? isPresent : isVisible} onClose={modal.close}>
            <View style={styles.container}>
                <Text style={{ fontSize: 18, marginBottom: 10 }}> Update Profile</Text>

                <View style={styles.inputContainer}>
                    <TextInput
                        placeholder="Name"
                        value={formData.name}
                        onChangeText={text => handleChange('name', text)}
                        style={[styles.input, errors.name && { borderColor: 'red' }]}

                        autoCapitalize="none"
                    />

                </View>
                {errors.name ? <Text style={{ color: 'red' }}>{errors.name}</Text> : null}


                <View style={styles.inputContainer}>
                    <TextInput
                        placeholder="Job Title"
                        value={formData.jobTitle}
                        onChangeText={text => handleChange('jobTitle', text)}
                        style={[styles.input, errors.jobTitle && { borderColor: 'red' }]}
                        autoCapitalize="none"
                    />

                </View>

                {errors.jobTitle ? <Text style={{ color: 'red' }}>{errors.jobTitle}</Text> : null}

                <View style={styles.inputContainer}>
                    <TextInput
                        placeholder="Email Address"
                        value={formData.email}
                        onChangeText={text => handleChange('email', text)}
                        style={[styles.input, errors.email && { borderColor: 'red' }]}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />

                </View>
                {errors.email ? <Text style={{ color: 'red' }}>{errors.email}</Text> : null}

                <View style={styles.inputContainer}>
                    <TextInput
                        placeholder="Username"
                        value={formData.username}
                        onChangeText={text => handleChange('username', text)}
                        style={[styles.input, errors.username && { borderColor: 'red' }]}

                        autoCapitalize="none"
                    />

                </View>
                {errors.username ? <Text style={{ color: 'red' }}>{errors.username}</Text> : null}


                <View style={styles.inputContainer}>
                    <TextInput
                        placeholder="Business Name"
                        value={formData.businessName}
                        onChangeText={text => handleChange('businessName', text)}
                        style={[styles.input, errors.businessName && { borderColor: 'red' }]}
                        autoCapitalize="none"
                    />

                </View>

                {errors.businessName ? <Text style={{ color: 'red' }}>{errors.businessName}</Text> : null}
                <View style={styles.inputContainer}>
                    <TextInput
                        placeholder="Business Type"
                        value={formData.businessType}
                        onChangeText={text => handleChange('businessType', text)}
                        style={[styles.input, errors.businessType && { borderColor: 'red' }]}
                        autoCapitalize="none"
                    />

                </View>
                {errors.businessType ? <Text style={{ color: 'red' }}>{errors.businessType}</Text> : null}
                <View style={styles.inputContainer}>
                    <TextInput
                        placeholder="Udyam Number"
                        value={formData.udyamNumber}
                        onChangeText={text => handleChange('udyamNumber', text)}
                        style={[styles.input, errors.udyamNumber && { borderColor: 'red' }]}
                        autoCapitalize="none"
                    />

                </View>
                {errors.udyamNumber ? <Text style={{ color: 'red' }}>{errors.udyamNumber}</Text> : null}

                <View style={styles.inputContainer}>
                    <TextInput
                        placeholder="GST Number"
                        value={formData.gstNumber}
                        onChangeText={text => handleChange('gstNumber', text)}
                        style={[styles.input, errors.gstNumber && { borderColor: 'red' }]}
                        autoCapitalize="none"
                    />

                </View>
                {errors.gstNumber ? <Text style={{ color: 'red' }}>{errors.gstNumber}</Text> : null}
                <View style={styles.inputContainer}>
                    <TextInput
                        placeholder="Address/Location"
                        value={formData.address}
                        onChangeText={text => handleChange('address', text)}
                        style={[styles.input, errors.address && { borderColor: 'red' }]}
                        autoCapitalize="none"
                    />

                </View>
                {errors.address ? <Text style={{ color: 'red' }}>{errors.address}</Text> : null}

                {errors.apiError ? <Text style={{ color: 'red' }}>{errors.apiError}</Text> : null}

                <View style={{ flexDirection: 'row', justifyContent: "space-between", width: '95%' }}>
                    <TouchableOpacity onPress={handleSkip} style={styles.button}>
                        <LinearGradient colors={['#1F73C6', '#F7941E']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }} style={styles.button}>
                            <Text style={styles.buttonText}>{closeText}</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleSubmit} style={styles.button}>
                        <LinearGradient colors={['#1F73C6', '#F7941E']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }} style={styles.button}>
                            <Text style={styles.buttonText}>Submit</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </View>
        </AppModal>

    );
}

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
        height: 44,
    },
});