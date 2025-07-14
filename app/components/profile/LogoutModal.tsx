import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AppModal from '../modal/AppModal';
import useUsersStore from '@/store/useUsersStore';
import { useRouter } from 'expo-router';
import { clearAuthData } from '@/services/secureStore';

type Props = {
  isLogout: boolean;
  onClose?: () => void;
};

const LogoutModal = ({ isLogout, onClose }: Props) => {
  const router = useRouter();
  const handleClose = () => {
    onClose?.();
  };

  // Handle save/update
  const handleSubmit = async () => {
    clearAuthData();
    router.replace('/(auth)/login');
    onClose?.();
  };

  // Reset form when modal opens

  return (
    <AppModal visible={isLogout} onClose={handleClose}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Text style={styles.title}>Confirm</Text>

        <Text style={styles.message}>
          Are you sure you want to log out of your account?
        </Text>

        <View style={styles.buttonRow}>
          <GradientButton title="Close" onPress={handleClose} />
          <GradientButton title={'Logout'} onPress={handleSubmit} />
        </View>
      </KeyboardAvoidingView>
    </AppModal>
  );
};

export default LogoutModal;

// ------------------ Gradient Button Component ------------------
type ButtonProps = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
};

const GradientButton = ({ title, onPress, disabled }: ButtonProps) => (
  <TouchableOpacity onPress={onPress} style={styles.button} disabled={disabled}>
    <LinearGradient
      colors={['#1F73C6', '#F7941E']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.gradient}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </LinearGradient>
  </TouchableOpacity>
);

// ------------------ Styles ------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 18,
    marginBottom: 15,
    fontWeight: '600',
    color: '#333',
    textAlign: 'left',
    alignSelf: 'flex-start', // ✅ this ensures the title aligns left in its parent
  },

  message: {
    fontSize: 14,
    color: '#555',
    textAlign: 'left',
    alignSelf: 'flex-start',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  button: {
    flex: 2,
    marginHorizontal: 4,
  },
  gradient: {
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 13,
    textAlign: 'center',
    fontWeight: '500',
  },
});
