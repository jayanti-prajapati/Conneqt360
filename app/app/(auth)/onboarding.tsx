import React from 'react';
import { StyleSheet, View, Text, Image, Dimensions, TouchableOpacity, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import Button from '@/components/common/Button';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import Spacing from '@/constants/Spacing';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function OnboardingScreen() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/(auth)/login');
  };

  return (

    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={{ uri: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg' }}
          style={styles.image}
        />
        <Image
          source={require('@/assets/images/logo.png')} // <-- Your local logo image
          style={styles.logoImage}
          resizeMode="contain"
        />
        {/* <Text style={styles.logoText}>Connect360</Text> */}
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.title}>Connect. Collaborate. Grow.</Text>
        <Text style={styles.subtitle}>
          Build your local business network, discover opportunities,
          and grow your business with Connect360.
        </Text>
      </View>

      <View style={styles.footer}>

        <TouchableOpacity style={styles.button} onPress={handleGetStarted} >
          <LinearGradient
            colors={['#1F73C6', '#F7941E']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.button}
          >

            <Text style={styles.buttonText}>Get Started</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* <Button
          title="Get Started"
          onPress={handleGetStarted}
          variant="primary"
          size="large"
          style={styles.button}
        /> */}
        <Text style={styles.termsText}>
          By continuing, you agree to our Terms of Service and Privacy Policy.
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
  logoContainer: {
    alignItems: 'center',
    marginTop: Spacing.xxl * 2,
    marginBottom: Spacing.xl,
  },
  background: {
    flex: 1,
    justifyContent: 'center',
  },
  image: {
    width: width * 0.4,
    height: width * 0.4,
    borderRadius: (width * 0.4) / 2,
  },
  logoText: {
    fontSize: Typography.size.xxxl,
    fontWeight: Typography.weight.bold as any,
    color: '#1F73C6',

    marginTop: Spacing.md,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: Typography.size.xxl,
    fontWeight: Typography.weight.bold as any,
    color: Colors.gray[800],
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  subtitle: {
    fontSize: Typography.size.md,
    color: Colors.gray[600],
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    marginBottom: Spacing.xxl,
  },
  button: {
    width: '100%',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    // marginBottom: 20,
  },
  logoImage: {
    width: 200,
    height: 100,
    marginBottom: 12,
  },
  termsText: {
    fontSize: Typography.size.sm,
    color: Colors.gray[500],
    textAlign: 'center',
  },
});