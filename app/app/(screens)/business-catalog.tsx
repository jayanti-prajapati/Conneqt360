import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { X, Tag, Calendar, ExternalLink, PlusCircle, Edit, Trash2, ArrowLeft } from 'lucide-react-native';
import { useThemeStore } from '@/store/themeStore';
import { CatalogItem } from '@/types';
import { CatalogFormModal } from '@/components/modal/CatalogFormModal';

const { width } = Dimensions.get('window');

export default function BusinessCatalogScreen() {
    const { theme } = useThemeStore();
    const router = useRouter();
    const params = useLocalSearchParams();
    const catalog = JSON.parse(params?.catalog as string) as CatalogItem[];
    const isOwner = (params?.owner == 'true') || "false"
    const [showCatalogModal, setShowCatalogModal] = useState(false);
    const [editingCatalogItem, setEditingCatalogItem] = useState<any>(null);
    const [selectedItem, setSelectedItem] = useState<CatalogItem | null>(null);



    const handleEditCatalogItem = (item: any) => {
        setEditingCatalogItem(item);
        setShowCatalogModal(true);
    };
    const handleAddCatalogItem = () => {
        setEditingCatalogItem(null);
        setShowCatalogModal(true);
    };

    const handleDeleteCatalogItem = (itemId: string) => {
        Alert.alert('Deleted', 'Catalog item deleted successfully');
    };

    const renderDetailView = () => {
        if (!selectedItem) return null;

        return (
            <View style={[styles.detailContainer, { backgroundColor: theme.background }]}>
                <View style={[styles.detailHeader, { borderBottomColor: theme.border }]}>
                    <TouchableOpacity onPress={() => setSelectedItem(null)}>
                        <X size={24} color={theme.text} />
                    </TouchableOpacity>
                    <Text style={[styles.detailTitle, { color: theme.text }]}>Service Details</Text>
                    <TouchableOpacity>
                        <ExternalLink size={24} color={theme.primary} />
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.detailContent} showsVerticalScrollIndicator={false}>
                    <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} style={styles.imageGallery}>
                        {selectedItem.images.map((image, index) => (
                            <Image key={index} source={{ uri: image }} style={styles.detailImage} resizeMode="cover" />
                        ))}
                    </ScrollView>

                    <View style={styles.detailInfo}>
                        <Text style={[styles.detailItemTitle, { color: theme.text }]}>{selectedItem.title}</Text>
                        <View style={styles.detailPriceRow}>
                            <Text style={[styles.detailPrice, { color: theme.primary }]}>{selectedItem.price}</Text>
                            <View style={[styles.categoryBadge, { backgroundColor: theme.primary + '20' }]}>
                                <Text style={[styles.categoryBadgeText, { color: theme.primary }]}>{selectedItem.category}</Text>
                            </View>
                        </View>

                        <Text style={[styles.detailDescription, { color: theme.text }]}>{selectedItem.description}</Text>

                        <View style={styles.detailTagsContainer}>
                            <Text style={[styles.detailTagsTitle, { color: theme.textSecondary }]}>Technologies & Skills</Text>
                            <View style={styles.detailTags}>
                                {selectedItem.tags?.map((tag, index) => (
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
                                <Text style={[styles.detailMetaText, { color: theme.textSecondary }]}>Added {new Date(selectedItem.createdAt).toLocaleDateString()}</Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    };
    const renderCatalogItem = (item: CatalogItem) => (
        <TouchableOpacity
            key={item.id}
            style={[styles.catalogItem, { backgroundColor: theme.surface, borderColor: theme.border }]}
            onPress={() => setSelectedItem(item)}
        >
            {isOwner && (
                <View style={styles.itemActions}>
                    <TouchableOpacity
                        style={[styles.actionButton, { backgroundColor: theme.primary + '20' }]}
                        onPress={(e) => {
                            e.stopPropagation();
                            handleEditCatalogItem(item)
                        }}
                    >
                        <Edit size={16} color={theme.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.actionButton, { backgroundColor: theme.error + '20' }]}
                        onPress={(e) => {
                            e.stopPropagation();
                            handleDeleteCatalogItem(item?.id);
                        }}
                    >
                        <Trash2 size={16} color={theme.error} />
                    </TouchableOpacity>
                </View>
            )}
            {item.images[0] && <Image
                source={{ uri: item.images[0] }}
                style={styles.catalogImage}
                resizeMode="cover"
            />}
            <View style={styles.catalogContent}>
                <Text style={[styles.catalogTitle, { color: theme.text }]} numberOfLines={2}>
                    {item.title}
                </Text>
                <Text style={[styles.catalogDescription, { color: theme.textSecondary }]} numberOfLines={3}>
                    {item.description}
                </Text>
                <View style={styles.catalogMeta}>
                    <Text style={[styles.catalogPrice, { color: theme.primary }]}>{item.price}</Text>
                    <Text style={[styles.catalogCategory, { color: theme.textSecondary }]}>{item.category}</Text>
                </View>
                <View style={styles.catalogTags}>
                    {item.tags?.slice(0, 3).map((tag, index) => (
                        <View key={index} style={[styles.tag, { backgroundColor: theme.primary + '20' }]}>
                            <Text style={[styles.tagText, { color: theme.primary }]}>{tag}</Text>
                        </View>
                    ))}
                </View>
            </View>
        </TouchableOpacity>
    );

    const handleSaveCatalogItem = (item: any) => {
        // In a real app, this would save to the backend
        Alert.alert('Success', 'Catalog item saved successfully!');
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={[styles.header, { borderBottomColor: theme.border }]}>
                <TouchableOpacity onPress={() => router.back()}>
                    <ArrowLeft size={24} color={theme.text} />
                </TouchableOpacity>


                <Text style={[styles.title, { color: theme.text }]}>Business Catalog</Text>

                {isOwner ? (
                    <TouchableOpacity onPress={() => handleAddCatalogItem()}>
                        <PlusCircle size={24} color={theme.primary} />
                    </TouchableOpacity>
                ) : (
                    <View style={{ width: 24 }} />
                )}

            </View>

            {!selectedItem ? (
                <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                    <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Explore our services and solutions</Text>
                    <View style={styles.catalogGrid}>{catalog.map(renderCatalogItem)}</View>
                </ScrollView>
            ) : (
                renderDetailView()
            )}

            {showCatalogModal &&
                <CatalogFormModal
                    visible={showCatalogModal}
                    onClose={() => setShowCatalogModal(false)}
                    onSave={handleSaveCatalogItem}
                    item={editingCatalogItem}
                    isEdit={!!editingCatalogItem}
                />
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 40
    },
    header: {
        // width:
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
        // paddingHorizontal: 16,
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
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
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
        width: "80%",
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