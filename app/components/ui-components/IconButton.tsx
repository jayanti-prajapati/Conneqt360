import { TouchableOpacity, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  button: {
    padding: 10,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    color: '#ffffff',
  },
});

export default function IconButton({
  variant = 'primary',
  icon,
  onPress,
}: {
  variant?: 'primary' | 'secondary';
  icon: React.ReactNode;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.button,
        { backgroundColor: variant === 'primary' ? '#007AFF' : '#ffffff' },
      ]}
    >
      {icon}
    </TouchableOpacity>
  );
}
