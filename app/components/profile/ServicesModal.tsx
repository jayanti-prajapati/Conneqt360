import React from 'react';
import { View, Text, StyleSheet, Modal, ScrollView, TouchableOpacity } from 'react-native';
import { X, CircleCheck as CheckCircle, Star } from 'lucide-react-native';
import { useThemeStore } from '@/store/themeStore';


interface ServicesModalProps {
    visible: boolean;
    onClose: () => void;
    services: string[];
}

export const ServicesModal: React.FC<ServicesModalProps> = ({
    visible,
    onClose,
    services,
}) => {
    const { theme } = useThemeStore();

    const serviceCategories = {
        'Development': ['Web Development', 'Mobile App Development'],
        'Cloud & Infrastructure': ['Cloud Solutions'],
        'Design & Marketing': ['UI/UX Design', 'Digital Marketing'],
        'Consulting': ['Business Consulting'],
    };

    const getCategoryForService = (service: string) => {
        for (const [category, categoryServices] of Object.entries(serviceCategories)) {
            if (categoryServices.includes(service)) {
                return category;
            }
        }
        return 'Other Services';
    };

    const groupedServices = services.reduce((acc, service) => {
        const category = getCategoryForService(service);
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(service);
        return acc;
    }, {} as Record<string, string[]>);

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose}
        >
            <View style={[styles.container, { backgroundColor: theme.background }]}>
                <View style={[styles.header, { borderBottomColor: theme.border }]}>
                    <TouchableOpacity onPress={onClose}>
                        <X size={24} color={theme.text} />
                    </TouchableOpacity>
                    <Text style={[styles.title, { color: theme.text }]}>Our Services</Text>
                    <View style={{ width: 24 }} />
                </View>

                <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                    <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                        Professional services we offer to help grow your business
                    </Text>

                    {Object.entries(groupedServices).map(([category, categoryServices]) => (
                        <View key={category} style={styles.categorySection}>
                            <Text style={[styles.categoryTitle, { color: theme.text }]}>{category}</Text>

                            {categoryServices.map((service, index) => (
                                <View
                                    key={index}
                                    style={[styles.serviceItem, { backgroundColor: theme.surface, borderColor: theme.border }]}
                                >
                                    <View style={styles.serviceHeader}>
                                        <CheckCircle size={20} color={theme.success} />
                                        <Text style={[styles.serviceName, { color: theme.text }]}>{service}</Text>
                                        {/* <View style={styles.serviceRating}>
                                            <Star size={16} color="#FFD700" fill="#FFD700" />
                                            <Text style={[styles.ratingText, { color: theme.textSecondary }]}>4.9</Text>
                                        </View> */}
                                    </View>

                                    <Text style={[styles.serviceDescription, { color: theme.textSecondary }]}>
                                        {getServiceDescription(service)}
                                    </Text>

                                    <View style={styles.serviceFeatures}>
                                        {getServiceFeatures(service).map((feature, featureIndex) => (
                                            <Text key={featureIndex} style={[styles.feature, { color: theme.textSecondary }]}>
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
            </View>
        </Modal>
    );
};

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
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderBottomWidth: 1,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
    },
    content: {
        flex: 1,
        paddingHorizontal: 16,
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        marginVertical: 16,
        lineHeight: 22,
    },
    categorySection: {
        marginBottom: 24,
    },
    categoryTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    serviceItem: {
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        marginBottom: 12,
    },
    serviceHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        gap: 8,
    },
    serviceName: {
        flex: 1,
        fontSize: 16,
        fontWeight: '600',
    },
    serviceRating: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    ratingText: {
        fontSize: 14,
        fontWeight: '500',
    },
    serviceDescription: {
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 12,
    },
    serviceFeatures: {
        gap: 4,
    },
    feature: {
        fontSize: 13,
        lineHeight: 18,
    },
    contactSection: {
        padding: 20,
        borderRadius: 16,
        borderWidth: 1,
        marginBottom: 20,
        alignItems: 'center',
    },
    contactTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    contactDescription: {
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 16,
    },
    contactButton: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 25,
    },
    contactButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});