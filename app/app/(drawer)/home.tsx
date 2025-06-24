// app/(drawer)/home.tsx
import { View, Text } from 'react-native';
import Header from '@/components/header/Header';
import BottomView from '@/components/bottomViewExpo';

export default function MainPage() {
    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <Header />
            <BottomView />
        </View>
    );
}
