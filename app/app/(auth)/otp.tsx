import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRef, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import ResendOtp from '@/components/ResendOtp';
import axios from 'axios';

export default function OTPScreen() {
    const inputRefs = useRef<Array<TextInput | null>>([]);
    const router = useRouter();
    const [otp, setOtp] = useState(['', '', '', '', '', '']);

    const handleChange = (text: string, index: number) => {
        if (/^\d$/.test(text)) {
            const updatedOtp = [...otp];
            updatedOtp[index] = text;
            setOtp(updatedOtp);
            if (index < 5) {
                inputRefs.current[index + 1]?.focus();
            }
        } else if (text === '') {
            const updatedOtp = [...otp];
            updatedOtp[index] = '';
            setOtp(updatedOtp);
        }
    };

    const handleVerify = async () => {
        const code = otp.join('');
        console.log('Verifying OTP:', code);
        if (code === "123456") {
            const response = await axios.post('http://84.247.177.87/api/auth/verify-otp', {
                phone: "7600751136",
                otp: code,
            });

            if (response.status === 200 || response.status === 201) {
                console.log('OTP verified successfully');
                router.push('/(tabs)');
            } else {
                Alert.alert('Invalid OTP', 'The OTP you entered is incorrect.');
            }

        }
        else {
            console.error('Invalid OTP');
        }



    };

    return (
        // <KeyboardAvoidingView
        //     behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        //     style={styles.container}
        //     keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
        // >
        <View style={styles.card}>
            <Ionicons name="shield-checkmark-outline" size={48} color="#1F73C6" />
            <Text style={styles.title}>Enter Verification Code</Text>
            <Text style={styles.subtitle}>
                We've sent a 6-digit code to your registered number.
            </Text>

            <View style={styles.otpContainer}>
                {otp.map((digit, idx) => (
                    <TextInput
                        key={idx}
                        ref={(ref) => {
                            inputRefs.current[idx] = ref;
                        }}
                        style={styles.otpInput}
                        maxLength={1}
                        keyboardType="numeric"
                        value={digit}
                        onChangeText={(text) => handleChange(text, idx)}
                        returnKeyType="done"
                    />
                ))}
            </View>

            <TouchableOpacity onPress={handleVerify} style={styles.button}>
                <LinearGradient colors={['#1F73C6', '#F7941E']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }} style={styles.button}>
                    <Text style={styles.buttonText}>Verify OTP</Text>
                </LinearGradient>
            </TouchableOpacity>

            {/* <TouchableOpacity onPress={Keyboard.dismiss}>
                    <Text style={styles.resendText}>Resend OTP</Text>
                </TouchableOpacity> */}
            {/* <ResendOtp */}
            {/* /> */}
            {/* <TouchableOpacity onPress={handleResend} disabled={isActive}>
                    <Text style={[styles.resendText, isActive && styles.disabledText]}>
                        {isActive ? `Resend OTP in ${timer}s` : 'Resend OTP'}
                    </Text>
                </TouchableOpacity>

                <Text style={styles.testText}>
                    Your OTP - <Text style={{ fontWeight: 'bold' }}>{otpNumber}</Text>
                </Text> */}
        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f7ff',
        justifyContent: 'center',
        padding: 16,
    },
    card: {
        justifyContent: 'center',
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        flex: 1,
        // padding: 24,
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        color: '#1a1a1a',
        marginTop: 12,
    },
    subtitle: {
        color: '#555',
        marginVertical: 8,
        textAlign: 'center',
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 8,
        marginVertical: 20,
    },
    otpInput: {
        width: 44,
        height: 50,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 12,
        textAlign: 'center',
        fontSize: 20,
        backgroundColor: '#f2f4f6',
    },
    button: {
        width: '100%',
        padding: 14,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 12,
    },
    buttonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 16,
    },
    resendText: {
        color: '#1F73C6',
        textDecorationLine: 'underline',
        marginTop: 6,
    },
    testText: {
        fontSize: 12,
        color: '#666',
        marginTop: 12,
        textAlign: 'center',
    },
    disabledText: {
        color: '#aaa',
    },
});
