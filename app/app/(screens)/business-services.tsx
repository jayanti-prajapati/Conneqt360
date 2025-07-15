import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { X, CircleCheck as CheckCircle, PlusCircle, Edit, Trash2, ArrowLeft } from 'lucide-react-native';
import { useThemeStore } from '@/store/themeStore';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ServiceFormModal } from '@/components/modal/ServiceFormModal';

export default function ServicesScreen() {
    const { theme } = useThemeStore();
    const router = useRouter();
    const params = useLocalSearchParams();
    const [showServiceForm, setShowServiceForm] = useState(false);
    const [editingService, setEditingService] = useState<{ service: string; index: number } | null>(null);
    const services: string[] = JSON.parse(params.services as string);
    const isOwner = (params.owner == 'true') || "false"
    const serviceCategories = {
        'Development': ['Web Development', 'Mobile App Development'],
        'Cloud & Infrastructure': ['Cloud Solutions'],
        'Design & Marketing': ['UI/UX Design', 'Digital Marketing'],
        'Consulting': ['Business Consulting'],
    };

    const handleAddService = () => {
        setEditingService(null);
        setShowServiceForm(true);
    };

    const handleEditService = (service: string, index: number) => {
        setEditingService({ service, index });
        setShowServiceForm(true);
    };

    const handleDeleteService = (index: number) => {
        Alert.alert('Deleted', 'Service deleted successfully');
    };

    const handleSaveService = (service: string) => {
        // In a real app, this would save to the backend
        Alert.alert('Success', 'Service saved successfully!');
    };


    const getCategoryForService = (service: string) => {
        for (const [category, categoryServices] of Object.entries(serviceCategories)) {
            if (categoryServices.includes(service)) return category;
        }
        return 'Other Services';
    };

    const groupedServices = services.reduce((acc, service) => {
        const category = getCategoryForService(service);
        if (!acc[category]) acc[category] = [];
        acc[category].push(service);
        return acc;
    }, {} as Record<string, string[]>);

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
                    {isOwner ? 'Manage your services' : 'Professional services we offer to help grow your business'}
                </Text>

                {Object.entries(groupedServices).map(([category, categoryServices]) => (
                    <View key={category} style={styles.categorySection}>
                        <Text style={[styles.categoryTitle, { color: theme.text }]}>{category}</Text>

                        {categoryServices.map((service, index) => (
                            <View
                                key={index}
                                style={[styles.serviceItem, { backgroundColor: theme.surface, borderColor: theme.border }]}
                            >
                                {isOwner && (
                                    <View style={styles.serviceActions}>
                                        <TouchableOpacity
                                            style={[styles.actionButton, { backgroundColor: theme.primary + '20' }]}
                                            onPress={() => handleEditService?.(service, index)}
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
                                    <Text style={[styles.serviceName, { color: theme.text }]}>{service}</Text>
                                </View>

                                <Text style={[styles.serviceDescription, { color: theme.textSecondary }]}>
                                    {getServiceDescription(service)}
                                </Text>

                                <View style={styles.serviceFeatures}>
                                    {getServiceFeatures(service).map((feature, i) => (
                                        <Text key={i} style={[styles.feature, { color: theme.textSecondary }]}>
                                            • {feature}
                                        </Text>
                                    ))}
                                </View>
                            </View>
                        ))}
                    </View>
                ))}

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
            <ServiceFormModal
                visible={showServiceForm}
                onClose={() => setShowServiceForm(false)}
                onSave={handleSaveService}
                service={editingService?.service}
                isEdit={!!editingService}
            />

        </View>
    );
}

const getServiceDescription = (service: string): string => {
    const descriptions: Record<string, string> = {
        'Web Development': 'Custom websites and web applications built with modern technologies',
        'Mobile App Development': 'Native and cross-platform mobile applications for iOS and Android',
        'Cloud Solutions': 'Cloud infrastructure setup, migration, and optimization services',
        'Digital Marketing': 'SEO, social media marketing, and digital advertising campaigns',
        'Business Consulting': 'Strategic business advice and process optimization',
        'UI/UX Design': 'User-centered design for web and mobile applications',
    };
    return descriptions[service] || 'Professional service tailored to your business needs';
};

const getServiceFeatures = (service: string): string[] => {
    const features: Record<string, string[]> = {
        'Web Development': ['Responsive Design', 'SEO Optimized', 'Fast Loading', 'Secure'],
        'Mobile App Development': ['Cross-platform', 'Native Performance', 'App Store Ready', 'Push Notifications'],
        'Cloud Solutions': ['Scalable Infrastructure', '24/7 Monitoring', 'Cost Optimization', 'Security'],
        'Digital Marketing': ['SEO Strategy', 'Social Media', 'Analytics', 'ROI Tracking'],
        'Business Consulting': ['Process Analysis', 'Strategy Development', 'Implementation', 'Training'],
        'UI/UX Design': ['User Research', 'Wireframing', 'Prototyping', 'Testing'],
    };
    return features[service] || ['Professional Service', 'Quality Delivery', 'Support'];
};

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
