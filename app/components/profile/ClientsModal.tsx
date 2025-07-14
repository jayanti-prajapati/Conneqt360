import React from 'react';
import { View, Text, StyleSheet, Modal, ScrollView, TouchableOpacity, Image } from 'react-native';
import { X, Star, Calendar, Award } from 'lucide-react-native';
import { Client } from '@/types';
import { useThemeStore } from '@/store/themeStore';


interface ClientsModalProps {
    visible: boolean;
    onClose: () => void;
    clients: Client[];
}

export const ClientsModal: React.FC<ClientsModalProps> = ({
    visible,
    onClose,
    clients,
}) => {
    const { theme } = useThemeStore();

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, index) => (
            <Star
                key={index}
                size={16}
                color="#FFD700"
                fill={index < rating ? "#FFD700" : "none"}
            />
        ));
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long'
        });
    };

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
                    <Text style={[styles.title, { color: theme.text }]}>Our Clients</Text>
                    <View style={{ width: 24 }} />
                </View>

                <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                    <View style={styles.statsSection}>
                        <View style={[styles.statCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                            <Award size={24} color={theme.primary} />
                            <Text style={[styles.statNumber, { color: theme.text }]}>{clients.length}+</Text>
                            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Happy Clients</Text>
                        </View>

                        <View style={[styles.statCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                            <Star size={24} color="#FFD700" />
                            <Text style={[styles.statNumber, { color: theme.text }]}>
                                {(clients.reduce((sum, client) => sum + (client.rating || 0), 0) / clients.length).toFixed(1)}
                            </Text>
                            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Average Rating</Text>
                        </View>
                    </View>

                    <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                        Trusted by leading companies worldwide
                    </Text>

                    <View style={styles.clientsList}>
                        {clients.map((client) => (
                            <View
                                key={client._id}
                                style={[styles.clientCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
                            >
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
                                            <View style={styles.rating}>
                                                {renderStars(client.rating || 0)}
                                            </View>
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
                            <View style={styles.trustPoint}>
                                <Text style={[styles.trustBullet, { color: theme.primary }]}>✓</Text>
                                <Text style={[styles.trustText, { color: theme.textSecondary }]}>
                                    On-time delivery with quality assurance
                                </Text>
                            </View>
                            <View style={styles.trustPoint}>
                                <Text style={[styles.trustBullet, { color: theme.primary }]}>✓</Text>
                                <Text style={[styles.trustText, { color: theme.textSecondary }]}>
                                    24/7 support and maintenance
                                </Text>
                            </View>
                            <View style={styles.trustPoint}>
                                <Text style={[styles.trustBullet, { color: theme.primary }]}>✓</Text>
                                <Text style={[styles.trustText, { color: theme.textSecondary }]}>
                                    Transparent communication throughout
                                </Text>
                            </View>
                            <View style={styles.trustPoint}>
                                <Text style={[styles.trustBullet, { color: theme.primary }]}>✓</Text>
                                <Text style={[styles.trustText, { color: theme.textSecondary }]}>
                                    Competitive pricing with no hidden costs
                                </Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </Modal>
    );
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
    statsSection: {
        flexDirection: 'row',
        gap: 12,
        marginVertical: 16,
    },
    statCard: {
        flex: 1,
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
    },
    statNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        marginVertical: 4,
    },
    statLabel: {
        fontSize: 12,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
        lineHeight: 22,
    },
    clientsList: {
        gap: 16,
        marginBottom: 20,
    },
    clientCard: {
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
    },
    clientHeader: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    clientLogo: {
        width: 60,
        height: 60,
        borderRadius: 8,
        marginRight: 12,
    },
    clientInfo: {
        flex: 1,
    },
    clientName: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 4,
    },
    projectType: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 8,
    },
    clientMeta: {
        gap: 6,
    },
    rating: {
        flexDirection: 'row',
        gap: 2,
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    completedDate: {
        fontSize: 12,
    },
    testimonialSection: {
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    testimonialQuote: {
        fontSize: 14,
        fontStyle: 'italic',
        lineHeight: 20,
    },
    trustSection: {
        padding: 20,
        borderRadius: 16,
        borderWidth: 1,
        marginBottom: 20,
    },
    trustTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    trustPoints: {
        gap: 12,
    },
    trustPoint: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
    },
    trustBullet: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    trustText: {
        flex: 1,
        fontSize: 14,
        lineHeight: 20,
    },
});