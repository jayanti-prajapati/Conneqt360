import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Alert
} from 'react-native';
import { X, Star, Calendar, Award, Plus, PlusCircle, ArrowLeft, Edit, Trash2 } from 'lucide-react-native';
import { useThemeStore } from '@/store/themeStore';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Client } from '@/types';
import { ClientFormModal } from '@/components/modal/ClientFormModal';
import useUserServiceStore from '@/store/useUserBusinessServices';
import { clearAuthData, getAuthData } from '@/services/secureStore';
import useUsersStore from '@/store/useUsersStore';

export default function ClientsScreen() {
    const { theme } = useThemeStore();
    const router = useRouter();
    const { owner, userId } = useLocalSearchParams();
    const isOwner = (owner == 'true') || "false"

    // const parsedClients: Client[] = JSON.parse(clients as string);
    const [showClientForm, setShowClientForm] = useState(false);
    const [editingClient, setEditingClient] = useState<any>(null);

    const { response, getUserServicesByUserId, updateUserService, loading } = useUserServiceStore();
    const parsedClients: Client[] = response?.data?.data?.client || [];
    const [user, setUser] = useState<any>(null);
    const { getUserById } = useUsersStore();

    const fetchClientsByUserId = async () => {
        try {
            const data = await getUserById(userId as string)
            if (data?.data?.statusCode === 200) {
                setUser(data.data.data);
            }
            await getUserServicesByUserId(userId as string);

        } catch (error) {
            console.error('Error fetching user:', error);
            clearAuthData();
            router.replace('/(auth)/login');
        }
    };

    useEffect(() => {
        if (userId) {
            fetchClientsByUserId()
        }
    }, [])


    const handleAddClient = () => {
        setEditingClient(null);
        setShowClientForm(true);
    };

    const handleEditClient = (client: any) => {
        setEditingClient(client);
        setShowClientForm(true);
    };

    const handleDeleteClient = (id: string) => {
        Alert.alert('Confirm Delete', 'Are you sure?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: async () => {
                    try {
                        const updatedClients = parsedClients?.filter((item: Client) => item._id !== id);
                        await updateUserService(user?._id, {
                            "client": updatedClients,
                        });

                        Alert.alert('Deleted', 'Catalog item deleted');
                    } catch (err: any) {
                        Alert.alert('Error', err.message);
                    }
                },
            },
        ]);
    };

    const handleSaveClient = async (client: any) => {
        try {
            const existingClients = Array.isArray(parsedClients) ? parsedClients : [];
            let updatedCatalog: typeof existingClients;

            if (client?.id) {
                const index = existingClients?.findIndex((c) => c._id === client.id);

                if (index !== -1) {
                    // Replace existing client
                    updatedCatalog = [...existingClients];
                    updatedCatalog[index] = client;
                } else {
                    // Append if id is new
                    updatedCatalog = [...existingClients, client];
                }
            } else {
                // If no id present, treat as new
                updatedCatalog = [...existingClients, client];
            }

            // let updatedCatalog = existingClients.length > 0 ? [...existingClients, client] : [client];
            await updateUserService(user?._id, {
                client: updatedCatalog,
            });

            Alert.alert('Success', `Catalog item ${editingClient ? 'updated' : 'added'}!`);
            setShowClientForm(false);
            setEditingClient(null);
        } catch (err: any) {
            Alert.alert('Error', err.message);
        }
    };
    const renderStars = (rating: number) =>
        Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                size={16}
                color="#FFD700"
                fill={i < rating ? "#FFD700" : "none"}
            />
        ));


    const formatDate = (date: string | Date) => {
        const d = new Date(date); // always convert
        return d.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
        });
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={[styles.header, { borderBottomColor: theme.border }]}>
                <TouchableOpacity onPress={() => router.back()}>
                    <ArrowLeft size={24} color={theme.text} />
                </TouchableOpacity>
                <Text style={[styles.title, { color: theme.text }]}>Our Clients</Text>
                {(isOwner != 'false') ? (
                    <TouchableOpacity onPress={() => handleAddClient()}>
                        <PlusCircle size={24} color={theme.primary} />
                    </TouchableOpacity>
                ) : <View style={{ width: 24 }} />}
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.statsSection}>
                    <View style={[styles.statCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                        <Award size={24} color={theme.primary} />
                        <Text style={[styles.statNumber, { color: theme.text }]}>{parsedClients.length}+</Text>
                        <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Happy Clients</Text>
                    </View>

                    <View style={[styles.statCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                        <Star size={24} color="#FFD700" />
                        <Text style={[styles.statNumber, { color: theme.text }]}>
                            {(parsedClients.reduce((sum, client) => sum + (Number(client.rating) || 0), 0) / parsedClients.length).toFixed(1)}
                        </Text>
                        <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Average Rating</Text>
                    </View>
                </View>

                <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                    Trusted by leading companies worldwide
                </Text>

                <View style={styles.clientsList}>
                    {parsedClients.map((client) => (
                        <View
                            key={client._id}
                            style={[styles.clientCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
                        >
                            {(isOwner != 'false') && (
                                <View style={styles.clientActions}>
                                    <TouchableOpacity
                                        style={[styles.actionButton, { backgroundColor: theme.primary + '20' }]}
                                        onPress={() => handleEditClient(client)}
                                    >
                                        <Edit size={16} color={theme.primary} />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.actionButton, { backgroundColor: theme.error + '20' }]}
                                        onPress={() => handleDeleteClient(client._id)}
                                    >
                                        <Trash2 size={16} color={theme.error} />
                                    </TouchableOpacity>
                                </View>
                            )}
                            <View style={styles.clientHeader}>
                                <Image
                                    source={{ uri: client.logo || 'https://via.placeholder.com/60' }}
                                    style={styles.clientLogo}
                                    resizeMode="cover"
                                />
                                <View style={styles.clientInfo}>
                                    <Text style={[styles.clientName, { color: theme.text }]}>{client.name}</Text>
                                    <Text style={[styles.projectType, { color: theme.primary }]}>{client.projectType}</Text>
                                    <View style={styles.clientMeta}>
                                        <View style={styles.rating}>{renderStars(Number(client.rating) || 0)}</View>
                                        <View style={styles.dateContainer}>
                                            <Calendar size={14} color={theme.textSecondary} />
                                            <Text style={[styles.completedDate, { color: theme.textSecondary }]}>
                                                {client.completedDate ? formatDate(client.completedDate) : 'Ongoing'}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </View>

                            {client.testimonial && (
                                <View style={styles.testimonialSection}>
                                    <Text style={[styles.testimonialQuote, { color: theme.text }]}>
                                        "{client.testimonial}"
                                    </Text>
                                </View>
                            )}
                        </View>
                    ))}
                </View>

                <View style={[styles.trustSection, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                    <Text style={[styles.trustTitle, { color: theme.text }]}>Why Clients Choose Us</Text>
                    <View style={styles.trustPoints}>
                        {[
                            'On-time delivery with quality assurance',
                            '24/7 support and maintenance',
                            'Transparent communication throughout',
                            'Competitive pricing with no hidden costs',
                        ].map((point, i) => (
                            <View key={i} style={styles.trustPoint}>
                                <Text style={[styles.trustBullet, { color: theme.primary }]}>✓</Text>
                                <Text style={[styles.trustText, { color: theme.textSecondary }]}>{point}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>
            {
                showClientForm && <ClientFormModal
                    visible={showClientForm}
                    onClose={() => setShowClientForm(false)}
                    onSave={handleSaveClient}
                    client={editingClient}
                    isEdit={!!editingClient}
                />}
        </View>
    );
}

const styles = StyleSheet.create({
    // copy all styles from your modal — unchanged
    container: { flex: 1, paddingTop: 40 },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderBottomWidth: 1,
    },
    title: { fontSize: 18, fontWeight: '600' },
    content: { flex: 1, paddingHorizontal: 16 },
    statsSection: { flexDirection: 'row', gap: 12, marginVertical: 16 },
    statCard: {
        flex: 1, alignItems: 'center', padding: 16, borderRadius: 12, borderWidth: 1
    },
    statNumber: { fontSize: 24, fontWeight: 'bold', marginVertical: 4 },
    statLabel: { fontSize: 12, textAlign: 'center' },
    subtitle: { fontSize: 16, textAlign: 'center', marginBottom: 20, lineHeight: 22 },
    clientsList: { gap: 16, marginBottom: 20 },
    clientCard: { padding: 16, borderRadius: 12, borderWidth: 1 },
    clientHeader: { flexDirection: 'row', marginBottom: 12 },
    clientLogo: { width: 60, height: 60, borderRadius: 8, marginRight: 12 },
    clientInfo: { flex: 1 },
    clientName: { fontSize: 18, fontWeight: '600', marginBottom: 4 },
    projectType: { fontSize: 14, fontWeight: '500', marginBottom: 8 },
    clientMeta: { gap: 6 },
    rating: { flexDirection: 'row', gap: 2 },
    dateContainer: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    completedDate: { fontSize: 12 },
    testimonialSection: {
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    testimonialQuote: { fontSize: 14, fontStyle: 'italic', lineHeight: 20 },
    trustSection: {
        padding: 20, borderRadius: 16, borderWidth: 1, marginBottom: 20,
    },
    trustTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
    trustPoints: { gap: 12 },
    trustPoint: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
    trustBullet: { fontSize: 16, fontWeight: 'bold' },
    trustText: { flex: 1, fontSize: 14, lineHeight: 20 },
    clientActions: {
        position: 'absolute',
        top: 12,
        right: 12,
        flexDirection: 'row',
        gap: 8,
        zIndex: 1,
    },
    actionButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
});