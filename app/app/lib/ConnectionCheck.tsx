import { useEffect } from "react";
import { View, Text, Alert, StyleSheet } from "react-native";
import NetInfo from '@react-native-community/netinfo';
type Props = {
    isConnected: boolean | null;
    setIsConnected: (isConnected: boolean | null) => void;
}


const ConnectionCheck = ({ isConnected, setIsConnected }: Props) => {
    useEffect(() => {
        // Check internet connection
        const unsubscribe = NetInfo.addEventListener(state => {
            setIsConnected(state?.isConnected);
            if (!state?.isConnected) {
                Alert.alert(
                    'No Internet Connection',
                    'Please check your internet connection and try again.',
                    [{ text: 'OK' }],
                    { cancelable: false }
                );
            }
        });

        // Initial check
        NetInfo.fetch().then(state => {
            setIsConnected(state?.isConnected);
            if (state?.isConnected) {
                console.log('Internet connection is available');
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.text}>No Internet Connection</Text>
            <Text style={styles.subText}>Please check your connection and try again</Text>
        </View>
    );

};

export default ConnectionCheck


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    subText: {
        fontSize: 18,
        color: '#666',
    },
});