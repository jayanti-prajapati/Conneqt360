import { FileWarning } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";

export default function NotFound() {
    return (
        <View style={styles.container}>
            {/* Optional Icon */}
            <FileWarning size={64} color="#ccc" />

            {/* Optional Image */}
            {/* <Image source={require('@/assets/no-data.png')} style={styles.image} /> */}

            <Text style={styles.title}>No Records Found</Text>
            <Text style={styles.subtitle}>Try refreshing or check back later.</Text>
        </View>

    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,

        // justifyContent: 'center',
        alignItems: 'center',
    },

    title: {
        fontSize: 20,
        fontWeight: '600',
        color: '#555',
        marginTop: 16,
    },
    subtitle: {
        fontSize: 14,
        color: '#888',
        marginTop: 6,
        textAlign: 'center',
    },
})