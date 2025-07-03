import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRef, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import useAuthStore from '@/store/useAuthStore';
import ResendOtp from '@/components/ResendOtp';

export default function OTPScreen() {
    const inputRefs = useRef<Array<TextInput | null>>([]);
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [otp, setOtp] = useState(['', '', '', '', '', '']);

    // const { phone } = useLocalSearchParams();
    const { verifyOtp, otpNumber, phone } = useAuthStore();


    console.log('Received data:', otpNumber, phone);
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
        if (code === otpNumber) {
            const response = await verifyOtp({ phone: phone as string, otp: code });
            if (response?.status === 200 || response?.status === 201) {
                console.log('OTP verified successfully');
                setError(null);

                router.push('/(tabs)');
            } else {
                setError('Invalid OTP. Please Enter the correct OTP.');
            }

        }
        else {
            setError('Invalid OTP. Please Enter the correct OTP.');
        }



    };


    return (
        <View style={styles.container}>
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
                            onKeyPress={({ nativeEvent }) => {
                                if (nativeEvent.key === 'Backspace') {
                                    if (otp[idx] === '') {
                                        if (idx > 0) {
                                            inputRefs.current[idx - 1]?.focus();
                                        }
                                    } else {
                                        const updatedOtp = [...otp];
                                        updatedOtp[idx] = '';
                                        setOtp(updatedOtp);
                                    }
                                }
                            }}
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
                {error && (
                    <Text style={{ color: 'red', textAlign: 'center' }}>{error}</Text>
                )}
                {/* <TouchableOpacity onPress={Keyboard.dismiss}>
                    <Text style={styles.resendText}>Resend OTP</Text>
                </TouchableOpacity> */}
                <ResendOtp
                    setOtp={setOtp}
                    inputRefs={inputRefs} />
                {/* <TouchableOpacity onPress={handleResend} disabled={isActive}>
                    <Text style={[styles.resendText, isActive && styles.disabledText]}>
                        {isActive ? `Resend OTP in ${timer}s` : 'Resend OTP'}
                    </Text>
                </TouchableOpacity>

                <Text style={styles.testText}>
                    Your OTP - <Text style={{ fontWeight: 'bold' }}>{otpNumber}</Text>
                </Text> */}
            </View>
        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f7ff',
        justifyContent: 'center',
        // padding: 16,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 24,
        flex: 1,
        justifyContent: 'center',

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