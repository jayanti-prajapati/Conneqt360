import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Keyboard,
} from 'react-native';
import { useEffect, useState } from 'react';
import useAuthStore from '@/store/useAuthStore';

export default function ResendOtp({ setOtp, inputRefs }: {
    setOtp: React.Dispatch<React.SetStateAction<string[]>>;
    inputRefs: React.MutableRefObject<Array<TextInput | null>>;
}) {


    const { sendOtp, otpNumber, phone } = useAuthStore();
    const [timer, setTimer] = useState(60);
    const [error, setError] = useState<string | null>(null);
    const [isActive, setIsActive] = useState(true); // prevent initial send

    useEffect(() => {
        let interval: NodeJS.Timeout | any;

        if (isActive && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }

        if (timer === 0) {
            setIsActive(false);
            clearInterval(interval);
        }

        return () => clearInterval(interval);
    }, [timer, isActive]);

    const handleResend = async () => {
        if (!isActive) {
            const resendOtp = await sendOtp({ phone: phone as string });
            if (resendOtp.status === 200 || resendOtp.status === 201) {
                console.log('OTP resent successfully');
                setTimer(60);
                setIsActive(true);
                setOtp(['', '', '', '', '', '']); // Reset OTP input
                inputRefs.current[0]?.focus(); // Focus the first input{
                Keyboard.dismiss();
            } else {
                setError('Failed to resend OTP');

            }
        };
    }





    return (


        <View>
            <TouchableOpacity onPress={handleResend} disabled={isActive}>
                <Text style={[styles.resendText, isActive && styles.disabledText]}>
                    {isActive ? `Resend OTP in ${timer}s` : 'Resend OTP'}
                </Text>
            </TouchableOpacity>

            <Text style={styles.testText}>
                Your OTP - <Text style={{ fontWeight: 'bold' }}>{otpNumber}</Text>
            </Text>

            {error && (
                <Text style={{ color: 'red', textAlign: 'center' }}>{error}</Text>
            )}
        </View>

    );
}

const styles = StyleSheet.create({

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