import React, { useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  Dimensions,
  ImageBackground,
} from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import Spacing from '@/constants/Spacing';
import Button from '@/components/ui-components/Button';
import { getAuthData } from '@/services/secureStore';

const { width } = Dimensions.get('window');

export default function OnboardingScreen() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authData = await getAuthData();
        // console.log('Auth Data:', authData);

        if (authData?.userData) {
          router.replace('/(tabs)');
        }
      } catch (err) {
        console.error('Error checking auth:', err);
      }
    };

    checkAuth();
  }, []);

  const handleGetStarted = () => {
    router.push('/(auth)/login');
  };
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={{
            uri: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg',
          }}
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
          Build your local business network, discover opportunities, and grow
          your business with Connect360.
        </Text>
      </View>

      <View style={styles.footer}>
        <Button
          title="Get Started"
          onPress={handleGetStarted}
          variant="primary"
          size="large"
          style={styles.button}
        />

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
