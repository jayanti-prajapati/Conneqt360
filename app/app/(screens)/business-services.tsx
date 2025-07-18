import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { X, CircleCheck as CheckCircle, PlusCircle, Edit, Trash2, ArrowLeft } from 'lucide-react-native';
import { useThemeStore } from '@/store/themeStore';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ServiceFormModal } from '@/components/modal/ServiceFormModal';
import { Service } from '@/types';
import useUsersStore from '@/store/useUsersStore';
import useUserServiceStore from '@/store/useUserBusinessServices';
import { clearAuthData } from '@/services/secureStore';


export default function ServicesScreen() {
    const { theme } = useThemeStore();
    const router = useRouter();
    const params = useLocalSearchParams();
    const [showServiceForm, setShowServiceForm] = useState(false);
    const [editingService, setEditingService] = useState<any>();

    const isOwner = (params.owner == 'true') || "false"
    const userId = params?.userId
    const { response, getUserServicesByUserId, updateUserService, loading } = useUserServiceStore();
    const services: Service[] = response?.data?.data?.services || [];
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




    const handleAddService = () => {
        setEditingService(null);
        setShowServiceForm(true);
    };

    const handleEditService = (service: Service) => {
        setEditingService(service);
        setShowServiceForm(true);
    };

    const handleDeleteService = (id: string) => {
        Alert.alert('Confirm Delete', 'Are you sure?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: async () => {
                    try {
                        const updatedSerivces = services?.filter((item: Service) => item._id !== id);
                        await updateUserService(user?._id, {
                            "services": updatedSerivces,
                        });

                        Alert.alert('Deleted', 'Service item deleted');
                    } catch (err: any) {
                        Alert.alert('Error', err.message);
                    }
                },
            },
        ]);
    };

    const handleSaveService = async (item: Service) => {
        try {
            const existingServices = Array.isArray(services) ? services : [];
            let updatedCatalog: typeof existingServices;

            if (item?._id) {
                const index = existingServices?.findIndex((c) => c._id === item._id);

                if (index !== -1) {
                    // Replace existing client
                    updatedCatalog = [...existingServices];
                    updatedCatalog[index] = item;
                } else {
                    // Append if id is new
                    updatedCatalog = [...existingServices, item];
                }
            } else {
                // If no id present, treat as new
                updatedCatalog = [...existingServices, item];
            }

            // let updatedCatalog = existingClients.length > 0 ? [...existingClients, client] : [client];
            await updateUserService(user?._id, {
                services: updatedCatalog,
            });

            Alert.alert('Success', `Service item ${editingService ? 'updated' : 'added'}!`);
            setShowServiceForm(false);
            setEditingService(null);
        } catch (err: any) {
            Alert.alert('Error', err.message);
        }
    };



    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={[styles.header, { borderBottomColor: theme.border }]}>
                <TouchableOpacity onPress={() => router.back()}>
                    <ArrowLeft size={24} color={theme.text} />
                </TouchableOpacity>
                <Text style={[styles.title, { color: theme.text }]}>Our Services</Text>
                {(isOwner != 'false') ? (
                    <TouchableOpacity onPress={() => handleAddService()}>
                        <PlusCircle size={24} color={theme.primary} />
                    </TouchableOpacity>
                ) : <View style={{ width: 24 }} />


                }
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                    {(isOwner != 'false')
                        ? 'Manage your services'
                        : 'Professional services we offer to help grow your business'}
                </Text>

                {services.map((service, index) => (
                    <View
                        key={index}
                        style={[styles.serviceItem, { backgroundColor: theme.surface, borderColor: theme.border }]}
                    >
                        {(isOwner != 'false') && (
                            <View style={styles.serviceActions}>
                                <TouchableOpacity
                                    style={[styles.actionButton, { backgroundColor: theme.primary + '20' }]}
                                    onPress={() => handleEditService(service)}
                                >
                                    <Edit size={16} color={theme.primary} />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.actionButton, { backgroundColor: theme.error + '20' }]}
                                    onPress={() => handleDeleteService(service?._id as string)}
                                >
                                    <Trash2 size={16} color={theme.error} />
                                </TouchableOpacity>
                            </View>
                        )}
                        <View style={styles.serviceHeader}>
                            <CheckCircle size={20} color={theme.success} />
                            <Text style={[styles.serviceName, { color: theme.text }]}>{service.title}</Text>
                        </View>

                        <Text style={[styles.serviceDescription, { color: theme.textSecondary }]}>
                            {service.description}
                        </Text>

                        <View style={styles.serviceFeatures}>
                            {service.features.map((feature, i) => (
                                <Text key={i} style={[styles.feature, { color: theme.textSecondary }]}>
                                    • {feature}
                                </Text>
                            ))}
                        </View>
                    </View>
                ))}

                {/* Call to Action */}
                <View style={[styles.contactSection, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                    <Text style={[styles.contactTitle, { color: theme.text }]}>Ready to Get Started?</Text>
                    <Text style={[styles.contactDescription, { color: theme.textSecondary }]}>
                        Contact us to discuss your project requirements and get a custom quote.
                    </Text>
                    <TouchableOpacity style={[styles.contactButton, { backgroundColor: theme.primary }]}>
                        <Text style={styles.contactButtonText}>Get Free Consultation</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            {
                showServiceForm && <ServiceFormModal
                    visible={showServiceForm}
                    onClose={() => setShowServiceForm(false)}
                    onSave={handleSaveService}
                    service={editingService}
                    isEdit={!!editingService}
                />}

        </View>
    );
}



const styles = StyleSheet.create({
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
    subtitle: { fontSize: 16, textAlign: 'center', marginVertical: 16, lineHeight: 22 },
    categorySection: { marginBottom: 24 },
    categoryTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
    serviceItem: { padding: 16, borderRadius: 12, borderWidth: 1, marginBottom: 12 },
    serviceHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 8 },
    serviceName: { flex: 1, fontSize: 16, fontWeight: '600' },
    serviceDescription: { fontSize: 14, lineHeight: 20, marginBottom: 12 },
    serviceFeatures: { gap: 4 },
    feature: { fontSize: 13, lineHeight: 18 },
    contactSection: { padding: 20, borderRadius: 16, borderWidth: 1, marginBottom: 20, alignItems: 'center' },
    contactTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
    contactDescription: { fontSize: 14, textAlign: 'center', lineHeight: 20, marginBottom: 16 },
    contactButton: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 25 },
    contactButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
    serviceActions: {
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