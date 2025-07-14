import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { X, CircleCheck as CheckCircle, PlusCircle, Edit, Trash2, ArrowLeft } from 'lucide-react-native';
import { useThemeStore } from '@/store/themeStore';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ServiceFormModal } from '@/components/modal/ServiceFormModal';
import { Service } from '@/types';

const services = [
    {
        title: 'Web Development',
        description: 'We build responsive and fast-loading websites tailored to your business needs.',
        features: [
            'Responsive Design',
            'SEO Optimized',
            'Performance Tuning',
            'E-commerce Integration'
        ]
    },
    {
        title: 'Mobile App Development',
        description: 'Cross-platform mobile apps with a native feel for iOS and Android.',
        features: [
            'Flutter & React Native',
            'Push Notifications',
            'App Store Deployment',
            'Offline Support'
        ]
    },
    {
        title: 'UI/UX Design',
        description: 'Design experiences that are user-centered and visually stunning.',
        features: [
            'Wireframing',
            'Prototyping',
            'User Testing',
            'Design Systems'
        ]
    },
    {
        title: 'Cloud Solutions',
        description: 'We offer scalable cloud architecture and cost-optimized deployments.',
        features: [
            'AWS & Azure Integration',
            'Auto Scaling',
            'CI/CD Pipelines',
            'Monitoring & Alerts'
        ]
    },
    {
        title: 'Digital Marketing',
        description: 'Grow your brand online through data-driven marketing strategies.',
        features: [
            'SEO & SEM',
            'Social Media Campaigns',
            'Analytics & Reporting',
            'Email Marketing'
        ]
    }
];

export default function ServicesScreen() {
    const { theme } = useThemeStore();
    const router = useRouter();
    const params = useLocalSearchParams();
    const [showServiceForm, setShowServiceForm] = useState(false);
    const [editingService, setEditingService] = useState<any>();

    const isOwner = (params.owner == 'true') || "false"

    const handleAddService = () => {
        setEditingService(null);
        setShowServiceForm(true);
    };

    const handleEditService = (service: Service) => {
        setEditingService(service);
        setShowServiceForm(true);
    };

    const handleDeleteService = (index: number) => {
        Alert.alert('Deleted', 'Service deleted successfully');
    };

    const handleSaveService = (service: Service) => {
        // In a real app, this would save to the backend
        Alert.alert('Success', 'Service saved successfully!');
    };



    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={[styles.header, { borderBottomColor: theme.border }]}>
                <TouchableOpacity onPress={() => router.back()}>
                    <ArrowLeft size={24} color={theme.text} />
                </TouchableOpacity>
                <Text style={[styles.title, { color: theme.text }]}>Our Services</Text>
                {isOwner ? (
                    <TouchableOpacity onPress={() => handleAddService()}>
                        <PlusCircle size={24} color={theme.primary} />
                    </TouchableOpacity>
                ) : <View style={{ width: 24 }} />


                }
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                    {isOwner
                        ? 'Manage your services'
                        : 'Professional services we offer to help grow your business'}
                </Text>

                {services.map((service, index) => (
                    <View
                        key={index}
                        style={[styles.serviceItem, { backgroundColor: theme.surface, borderColor: theme.border }]}
                    >
                        {isOwner && (
                            <View style={styles.serviceActions}>
                                <TouchableOpacity
                                    style={[styles.actionButton, { backgroundColor: theme.primary + '20' }]}
                                    onPress={() => handleEditService(service)}
                                >
                                    <Edit size={16} color={theme.primary} />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.actionButton, { backgroundColor: theme.error + '20' }]}
                                    onPress={() => handleDeleteService(index)}
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
