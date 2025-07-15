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
import Button from '../ui-components/Button';

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
          <Button
            style={{ width: '48%' }}
            title={'Logout'}
            onPress={handleSubmit}
          />
          <Button
            style={{ width: '48%' }}
            title="Close"
            variant="secondary"
            onPress={handleClose}
          />
        </View>
      </KeyboardAvoidingView>
    </AppModal>
  );
};

export default LogoutModal;

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
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 20,
  },
});
