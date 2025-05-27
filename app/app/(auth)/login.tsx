import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Mail, Eye, EyeOff, Phone } from 'lucide-react-native';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import Spacing from '@/constants/Spacing';

export default function LoginScreen() {
  const router = useRouter();
  const [isEmailLogin, setIsEmailLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    // In a real app, implement actual authentication
    router.push('/(tabs)');
  };

  const handleSignUp = () => {
    router.push('/(auth)/signup');
  };

  const toggleLoginMethod = () => {
    setIsEmailLogin(!isEmailLogin);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <ArrowLeft size={24} color={Colors.gray[800]} />
      </TouchableOpacity>

      <View style={styles.headerContainer}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>
          Login to your business account
        </Text>
      </View>

      <View style={styles.formContainer}>
        {isEmailLogin ? (
          <>
            <Input
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon={<Mail size={20} color={Colors.gray[500]} />}
            />
            <Input
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              secureTextEntry={!showPassword}
              leftIcon={<Eye size={20} color={Colors.gray[500]} />}
              rightIcon={showPassword ? <EyeOff size={20} color={Colors.gray[500]} /> : <Eye size={20} color={Colors.gray[500]} />}
              onRightIconPress={() => setShowPassword(!showPassword)}
            />
            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
          </>
        ) : (
          <Input
            label="Phone Number"
            value={phone}
            onChangeText={setPhone}
            placeholder="Enter your phone number"
            keyboardType="phone-pad"
            leftIcon={<Phone size={20} color={Colors.gray[500]} />}
          />
        )}

        <Button
          title={isEmailLogin ? "Login" : "Send OTP"}
          onPress={handleLogin}
          variant="primary"
          size="large"
          style={styles.button}
        />
        
        <TouchableOpacity 
          style={styles.toggleMethodButton}
          onPress={toggleLoginMethod}
        >
          <Text style={styles.toggleMethodText}>
            {isEmailLogin 
              ? "Login with Phone Number" 
              : "Login with Email & Password"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Don't have an account?{' '}
          <Text style={styles.signupText} onPress={handleSignUp}>
            Sign Up
          </Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.lg,
  },
  backButton: {
    marginTop: Spacing.xl,
    marginBottom: Spacing.md,
    alignSelf: 'flex-start',
  },
  headerContainer: {
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: Typography.size.xxl,
    fontWeight: Typography.weight.bold as any,
    color: Colors.gray[800],
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: Typography.size.md,
    color: Colors.gray[600],
  },
  formContainer: {
    marginBottom: Spacing.xl,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: Spacing.lg,
  },
  forgotPasswordText: {
    fontSize: Typography.size.sm,
    color: Colors.primary[600],
    fontWeight: Typography.weight.medium as any,
  },
  button: {
    width: '100%',
    marginBottom: Spacing.md,
  },
  toggleMethodButton: {
    alignSelf: 'center',
    padding: Spacing.sm,
  },
  toggleMethodText: {
    fontSize: Typography.size.sm,
    color: Colors.primary[600],
    fontWeight: Typography.weight.medium as any,
  },
  footer: {
    position: 'absolute',
    bottom: Spacing.xxl,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  footerText: {
    fontSize: Typography.size.sm,
    color: Colors.gray[600],
  },
  signupText: {
    color: Colors.primary[600],
    fontWeight: Typography.weight.semiBold as any,
  },
});