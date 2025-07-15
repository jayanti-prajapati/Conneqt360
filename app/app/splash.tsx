import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  Text,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Typography from '@/constants/Typography';
import Colors from '@/constants/Colors';

const { width } = Dimensions.get('window');

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.logoWrapper}>
          <Image
            source={require('@/assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <Image
          source={require('@/assets/images/splash-image.png')}
          style={styles.splashImage}
          resizeMode="contain"
        />

        <Text style={styles.subtitle}>
          Trusted by millions, empowering your business network
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary[600],
  },
  logoWrapper: {
    alignItems: 'center',
    height: 100,
  },
  splashImage: {
    width: width * 0.85,
    height: 220,
  },
  card: {
    width: width * 0.85,
    backgroundColor: '#fff',
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 20,
    paddingHorizontal: 24,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 20,
    elevation: 16,
    marginTop: width * 0.18,
  },

  subtitle: {
    fontSize: 20,
    color: '#555',
    textAlign: 'center',
    marginVertical: 12,
  },
  logo: {
    width: 200,
    marginTop: -30,
    backgroundColor: 'transparent',
  },
});
