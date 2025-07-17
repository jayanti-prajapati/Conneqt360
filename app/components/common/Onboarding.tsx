import Spacing from '@/constants/Spacing';
import { View, Text, StyleSheet, Image } from 'react-native';

export default function Onboarding({
  imagePath,
  children,
}: {
  children: React.ReactNode;
  imagePath?: any;
}) {
  const fallbackImage = require('@/assets/images/networking-2.jpg');

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.headerImageContainer}>
          <Image
            source={imagePath || fallbackImage}
            style={styles.headerImage}
            resizeMode="contain"
          />
        </View>
        <View style={styles.logoContainer}>
          <Image
            source={require('@/assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7ff',
    justifyContent: 'center',
    width: '100%',
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
    width: '100%',
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
