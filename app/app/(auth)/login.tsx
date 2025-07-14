import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  BackHandler,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign, Feather, FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Button from '@/components/ui-components/Button';
import Input from '@/components/ui-components/Input';

import Spacing from '@/constants/Spacing';
import useAuthStore from '@/store/useAuthStore';

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

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.iconContainer}>
          <LinearGradient
            colors={['#1F73C6', '#F7941E']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.iconGradient}
          >
            <Feather name="user" size={32} color="white" />
          </LinearGradient>
        </View>

        <Text style={styles.title}>Welcome</Text>
        <Text style={styles.subtitle}> Login to your business account</Text>
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
          //  loading={loading}
        />

        {error && (
          <Text style={{ color: 'red', textAlign: 'center' }}>{error}</Text>
        )}

        <Button
          title={
            isEmailLogin
              ? 'Login with Phone Number'
              : 'Login with Email & Password'
          }
          variant="outline"
          onPress={toggleLoginMethod}
          style={{ marginTop: Spacing.sm, width: '100%' }}
        />

        {/* <Text style={styles.orText}>Or continue with</Text>

        <View style={styles.socialContainer}>
          <TouchableOpacity style={styles.socialButton}>
            <AntDesign name="google" size={20} color="black" />
            <Text style={styles.socialText}>Google</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.socialButton}>
            <AntDesign name="apple1" size={20} color="black" />
            <Text style={styles.socialText}>Apple</Text>
          </TouchableOpacity>
        </View> */}

        {/* <View style={styles.footer}>
          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={handleSignUp}>
              <Text style={styles.linkText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View> */}
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
