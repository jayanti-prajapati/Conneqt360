import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, BackHandler } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Button from '@/components/ui-components/Button';
import Input from '@/components/ui-components/Input';

import Spacing from '@/constants/Spacing';
import useAuthStore from '@/store/useAuthStore';
import Onboarding from '@/components/common/Onboarding';

export default function LoginScreen() {
  const [isEmailLogin, setIsEmailLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const [phone, setPhone] = useState('');
  const { login, loading, reset, sendOtp } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    reset(); // clear Zustand store on mount
    const backAction = () => {
      reset(); // clear Zustand store
      setEmail('');
      setPassword('');
      setPhone('');
      return false; // allow default back behavior (exit screen)
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, [reset]);

  const handleLogin = async () => {
    if (isEmailLogin) {
      if (email && password) {
        const data = await login({ email, password });
        console.log('Login data:', data);

        //@ts-ignore
        if (data?.status === 200 || data?.status === 201) {
          setError(null);
          router.push('/(tabs)');
        } else {
          setError('User not found or invalid credentials');
        }
      } else {
        setError('Email and password are required for email login');
      }
    } else {
      if (phone) {
        const data = await sendOtp({ phone });
        //@ts-ignore
        if (data?.status === 200 || data?.status === 201) {
          setError(null);
          router.push('/(auth)/otp');
          // Clear any previous error
        } else {
          setError('Something went wrong Please try again later.');
        }
      } else {
        setError('Phone Number is required for login');
      }
    }
    // In a real app, implement actual authentication
  };

  const handleSignUp = () => {
    router.push('/(auth)/signup');
  };

  const toggleLoginMethod = () => {
    setIsEmailLogin(!isEmailLogin);
    setError('');
    setEmail('');
    setPassword('');
  };
  const imagePath = require('@/assets/images/networking-2.jpg');

  return (
    <Onboarding imagePath={imagePath}>
      {isEmailLogin ? (
        <>
          <Input
            value={email}
            onChangeText={setEmail}
            placeholder="Email address"
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon={<Feather name="mail" size={20} color="#aaa" />}
            style={styles.input}
          />

          <Input
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            secureTextEntry={!showPassword}
            leftIcon={<Feather name="lock" size={20} color="#aaa" />}
            rightIcon={
              <Feather
                name={showPassword ? 'eye' : 'eye-off'}
                size={20}
                color="#aaa"
              />
            }
            onRightIconPress={() => setShowPassword(!showPassword)}
            style={styles.input}
          />
        </>
      ) : (
        <>
          <Input
            value={phone}
            onChangeText={setPhone}
            placeholder="Phone Number"
            keyboardType="phone-pad"
            autoCapitalize="none"
            leftIcon={<Feather name="phone" size={20} color="#aaa" />}
            style={styles.input}
          />
        </>
      )}

      <Button
        title={isEmailLogin ? 'Login' : 'Send OTP'}
        variant="primary"
        onPress={handleLogin}
        style={{ width: '100%' }}
      />

      {error && (
        <Text style={{ color: 'red', textAlign: 'center' }}>{error}</Text>
      )}
    </Onboarding>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7ff',
    justifyContent: 'center',
    // padding: 16,
  },
  headerImageContainer: {
    alignItems: 'center',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 10,
  },
  headerImage: {
    height: 220,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
    paddingBottom: 16,
  },
  logo: {
    height: 32,
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
  iconContainer: {
    marginBottom: 20,
  },
  iconGradient: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  subtitle: {
    color: '#555',
    marginVertical: 8,
  },
  input: {
    marginBottom: Spacing.md,
    padding: 4,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 16,
  },
  forgotText: {
    color: '#1F73C6',
    fontSize: 14,
  },
  button: {
    width: '100%',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  orText: {
    color: '#999',
    marginVertical: 10,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12,
  },
  socialButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  socialText: {
    fontWeight: '500',
  },
  footerText: {
    color: '#444',
  },
  linkText: {
    color: '#1F73C6',
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',

    flexDirection: 'row',
    justifyContent: 'center',
  },
});
