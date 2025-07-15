import { Drawer } from 'expo-router/drawer';
import CustomDrawerContent from './CustomDrawerContent';

export default function DrawerLayout() {
  return (
    <Drawer
      screenOptions={{ headerShown: false }}
      drawerContent={props => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="(tabs)" options={{ headerShown: false }} />
      {/* Add other Drawer screens here if needed */}
    </Drawer>
  );
}
