import { Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import AppModal from "../modal/AppModal";
import { useModal } from "@/hooks/useModal";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import useAuthStore from "@/store/useAuthStore";
import { getAuthData } from "@/services/secureStore";

export default function Form() {
    const modal = useModal();
    const { fetchUserByPhoneNumber } = useAuthStore();
    const [userData, setUserData] = useState<any>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        businessName: '',
        businessType: '',
        udyamNumber: '',
        gstNumber: '',
        address: '',
    });

    const [errors, setErrors] = useState({
        email: '',
        username: '',
        businessName: '',
        businessType: '',
        udyamNumber: '',
        gstNumber: '',
        address: '',
    });

    useEffect(() => {
        const fetchData = async () => {
            const authData = await getAuthData();



            const resp = await fetchUserByPhoneNumber(authData?.userData?.user?.phone)
            console.log('Authrr Data:', resp.data);
            if (resp?.data?.statusCode == 200) {
                setUserData(resp.data.data);
                console.log('User Data:', resp.data.data?.isSkip);

                setIsVisible(!(resp?.data?.data?.isSkip))
            }


        }
        fetchData();


    }, [fetchUserByPhoneNumber]);


    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setErrors(prev => ({ ...prev, [field]: '' })); // Clear error on change
    };




    const handleSkip = () => {
        setErrors({
            email: '',
            username: '',
            businessName: '',
            businessType: '',
            udyamNumber: '',
            gstNumber: '',
            address: '',
        })
        setIsVisible(false);
        modal.close();
    }
    const handleSubmit = () => {
        let valid = true;
        let newErrors: typeof errors = {
            email: '',
            username: '',
            businessName: '',
            businessType: '',
            udyamNumber: '',
            gstNumber: '',
            address: '',
        };

        if (!formData.email || !/^\S+@\S+\.\S+$/.test(formData.email)) {
            newErrors.email = 'Enter a valid email';
            valid = false;
        }

        if (!formData.businessName) {
            newErrors.businessName = 'Business name is required';
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
            console.log('Submitting:', formData);
            modal.close();
        }
    };

    return (


        <AppModal visible={isVisible} onClose={modal.close}>
            <Text style={{ fontSize: 18, marginBottom: 10 }}>Profile</Text>

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
                    value={formData.email}
                    onChangeText={text => handleChange('email', text)}
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

            <View style={{ flexDirection: 'row', justifyContent: "space-between", width: '95%' }}>
                <TouchableOpacity onPress={handleSkip} style={styles.button}>
                    <LinearGradient colors={['#1F73C6', '#F7941E']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }} style={styles.button}>
                        <Text style={styles.buttonText}>Skip</Text>
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
        </AppModal>

    );
}

const styles = StyleSheet.create({
    button: {
        padding: 10,
        borderRadius: 5,
        // margin: 10,
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