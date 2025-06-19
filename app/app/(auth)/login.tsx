import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Platform, KeyboardAvoidingView, BackHandler } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign, Feather, FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';


import Spacing from '@/constants/Spacing';
import useAuthStore from '@/store/useAuthStore';
export default function LoginScreen() {
  const recaptchaVerifier = useRef(null);
  const [isEmailLogin, setIsEmailLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const router = useRouter();
  const [phone, setPhone] = useState('');
  const { login, loading, error, response, reset, sendOtp } = useAuthStore();
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
        //@ts-ignore
        if (data?.status === 200 || data?.status === 201) {
          console.log('Login successful:', data);
          router.push('/(tabs)');
        }


      } else {
        console.error('Email and password are required for email login');
      }
    } else {
      if (phone) {
        const data = await sendOtp({ phone });
        //@ts-ignore
        if (data?.status === 200 || data?.status === 201) {
          router.push({
            pathname: '/(auth)/otp',
            params: { rotp: data.data.otp, phone: phone },
          });

        }


      } else {
        console.error('Phone Number is required for login');
      }

    }
    // In a real app, implement actual authentication

  };

  const handleSignUp = () => {
    router.push('/(auth)/signup');
  };

  const toggleLoginMethod = () => {
    setIsEmailLogin(!isEmailLogin);
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

        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}> Login to your business account</Text>
        {isEmailLogin ?
          <>
            <View style={styles.inputContainer}>
              <Feather name="mail" size={20} color="#aaa" style={styles.inputIcon} />
              <TextInput
                placeholder="Email address"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Feather name="lock" size={20} color="#aaa" style={styles.inputIcon} />
              <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                style={styles.input}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                <Feather name={showPassword ? "eye-off" : "eye"} size={20} color="#aaa" />
              </TouchableOpacity>
            </View>
          </> :
          <>
            <View style={styles.inputContainer}>
              <Feather name="phone" size={20} color="#aaa" style={styles.inputIcon} />
              <TextInput
                placeholder="Phone Number"
                value={phone}
                onChangeText={setPhone}
                style={styles.input}
                keyboardType="phone-pad"
                autoCapitalize="none"
              />
            </View>


          </>
        }

        {/* <TouchableOpacity style={styles.forgotPassword}>
          <Text style={styles.forgotText}>Forgot password?</Text>
        </TouchableOpacity> */}

        <TouchableOpacity style={styles.button} onPress={handleLogin} >
          <LinearGradient colors={['#1F73C6', '#F7941E']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }} style={styles.button}>

            <Text style={styles.buttonText}>{isEmailLogin ? "Login" : "Send OTP"}</Text>
          </LinearGradient>
        </TouchableOpacity>

        {error && (
          <Text style={{ color: 'red', textAlign: 'center' }}>{error}</Text>
        )}

        <TouchableOpacity style={styles.toggleMethodButton} onPress={toggleLoginMethod}>
          <Text style={styles.forgotText}>  {isEmailLogin
            ? "Login with Phone Number"
            : "Login with Email & Password"}</Text>
        </TouchableOpacity>

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

        <View style={styles.footer}>
          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={handleSignUp}>
              <Text style={styles.linkText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
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
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginVertical: 10,
    width: '100%',
  },
  toggleMethodButton: {
    alignSelf: 'center',
    padding: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 44,
  },
  eyeIcon: {
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