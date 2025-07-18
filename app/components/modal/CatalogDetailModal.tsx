import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, ScrollView, TouchableOpacity, Image, Dimensions, Alert } from 'react-native';
import { X, Tag, Calendar, ExternalLink, Plus, CreditCard as Edit, Trash2 } from 'lucide-react-native';
import { CatalogItem } from '@/types';
import { useThemeStore } from '@/store/themeStore';

const { width } = Dimensions.get('window');

interface CatalogDetailModalProps {
    visible: boolean;
    onClose: () => void;
    selectedItem: any;
    isOwner?: boolean;
}

export const CatalogDetailModal: React.FC<CatalogDetailModalProps> = ({
    selectedItem,
    visible,

    onClose,
    isOwner = false
}) => {
    const { theme } = useThemeStore();



    if (!selectedItem) return null;

    return (
        <Modal
            visible={!!selectedItem}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={() => onClose()}
        >
            <View style={[styles.detailContainer, { backgroundColor: theme.background }]}>
                <View style={[styles.detailHeader, { borderBottomColor: theme.border }]}>
                    <TouchableOpacity onPress={() => onClose()}>
                        <X size={24} color={theme.text} />
                    </TouchableOpacity>
                    <Text style={[styles.detailTitle, { color: theme.text }]}>Service Details</Text>
                    <TouchableOpacity>
                        <ExternalLink size={24} color={theme.primary} />
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.detailContent} showsVerticalScrollIndicator={false}>
                    {selectedItem.images.length > 0 &&
                        < ScrollView
                            horizontal
                            pagingEnabled
                            showsHorizontalScrollIndicator={false}
                            style={styles.imageGallery}
                        >
                            {selectedItem.images.map((image: any, index: any) => (
                                <Image
                                    key={index}
                                    source={{ uri: image }}
                                    style={styles.detailImage}
                                    resizeMode="cover"
                                />
                            ))}
                        </ScrollView>
                    }
                    <View style={styles.detailInfo}>
                        <Text style={[styles.detailItemTitle, { color: theme.text }]}>
                            {selectedItem.title}
                        </Text>

                        <View style={styles.detailPriceRow}>
                            <Text style={[styles.detailPrice, { color: theme.primary }]}>
                                {selectedItem.price}
                            </Text>
                            <View style={[styles.categoryBadge, { backgroundColor: theme.primary + '20' }]}>
                                <Text style={[styles.categoryBadgeText, { color: theme.primary }]}>
                                    {selectedItem.category}
                                </Text>
                            </View>
                        </View>

                        <Text style={[styles.detailDescription, { color: theme.text }]}>
                            {selectedItem.description}
                        </Text>

                        <View style={styles.detailTagsContainer}>
                            <Text style={[styles.detailTagsTitle, { color: theme.textSecondary }]}>Tags</Text>
                            <View style={styles.detailTags}>
                                {selectedItem.tags?.map((tag: string, index: number) => (
                                    <View key={index} style={[styles.detailTag, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                                        <Tag size={14} color={theme.primary} />
                                        <Text style={[styles.detailTagText, { color: theme.text }]}>{tag}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>

                        <View style={styles.detailMeta}>
                            <View style={styles.detailMetaItem}>
                                <Calendar size={16} color={theme.textSecondary} />
                                <Text style={[styles.detailMetaText, { color: theme.textSecondary }]}>
                                    Added {new Date(selectedItem.createdAt).toLocaleDateString()}
                                </Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </Modal >
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
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        marginVertical: 16,
    },
    catalogGrid: {
        gap: 16,
        paddingBottom: 20,
    },
    catalogItem: {
        borderRadius: 16,
        borderWidth: 1,
        overflow: 'hidden',
        position: 'relative',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    itemActions: {
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
    catalogImage: {
        width: '100%',
        height: 200,
    },
    catalogContent: {
        padding: 16,
    },
    catalogTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 8,
    },
    catalogDescription: {
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 12,
    },
    catalogMeta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    catalogPrice: {
        fontSize: 16,
        fontWeight: '600',
    },
    catalogCategory: {
        fontSize: 12,
        fontWeight: '500',
    },
    catalogTags: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
    },
    tag: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    tagText: {
        fontSize: 12,
        fontWeight: '500',
    },
    // Detail Modal Styles
    detailContainer: {
        flex: 1,
    },
    detailHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderBottomWidth: 1,
    },
    detailTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    detailContent: {
        flex: 1,
    },
    imageGallery: {
        height: 250,
    },
    detailImage: {
        width: width,
        height: 250,
    },
    detailInfo: {
        padding: 16,
    },
    detailItemTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    detailPriceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    detailPrice: {
        fontSize: 20,
        fontWeight: '600',
    },
    categoryBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    categoryBadgeText: {
        fontSize: 14,
        fontWeight: '600',
    },
    detailDescription: {
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 24,
    },
    detailTagsContainer: {
        marginBottom: 24,
    },
    detailTagsTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
    },
    detailTags: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    detailTag: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        gap: 6,
    },
    detailTagText: {
        fontSize: 14,
        fontWeight: '500',
    },
    detailMeta: {
        gap: 8,
    },
    detailMetaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    detailMetaText: {
        fontSize: 14,
    },
});