
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';
import * as ImagePicker from 'expo-image-picker';
import { useRef, useState } from "react";


export default function CommunityFeedScreen() {

    const richText = useRef<RichEditor>(null);
    const [contentHtml, setContentHtml] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [videoUrl, setVideoUrl] = useState('');


    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setImageUrl(result.assets[0].uri);
        }
    };

    const pickVideo = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
            allowsEditing: false,
            quality: 1,
        });

        if (!result.canceled) {
            setVideoUrl(result.assets[0].uri);
        }
    };


    const handleclose = async () => {

    }
    const handleSubmit = async () => {
        const feedData = {
            content: contentHtml,
            imageUrl,
            videoUrl,
        };

        console.log('Submitting feed:', feedData);

    };



    return (
        <View style={{ flex: 1, backgroundColor: '#fff', padding: 20 }}>

            <Text style={styles.title}>Add Feed</Text>

            <View style={styles.formGroup}>
                <Text style={styles.label}>Content (Rich Text)</Text>
                <RichEditor
                    ref={richText}
                    onChange={(html) => {
                        console.log("RichEditor content:", html);
                        setContentHtml(html);
                    }}
                    placeholder="Start writing your post..."
                    style={styles.richEditor}
                    initialContentHTML=""
                    initialHeight={200}
                />

                <RichToolbar
                    editor={richText}
                    actions={[
                        actions.setBold,
                        actions.setItalic,
                        actions.setUnderline,
                        actions.insertBulletsList,
                        actions.insertOrderedList,
                        actions.insertLink,
                    ]}
                    // iconMap={{
                    //     [actions.setBold]: () => <Ionicons name="md-bold" size={20} color="black" />,
                    //     [actions.setItalic]: () => <Ionicons name="md-italic" size={20} color="black" />,
                    //     [actions.setUnderline]: () => <Ionicons name="md-underline" size={20} color="black" />,
                    // }}
                    style={styles.richToolbar}
                />
            </View>

            <View style={styles.formGroup}>
                <Text style={styles.label}>Image</Text>
                <TextInput
                    style={styles.input}
                    value={imageUrl}
                    onChangeText={setImageUrl}
                    placeholder="Paste image URL or upload below"
                />
                <TouchableOpacity onPress={pickImage} style={styles.uploadButton}>
                    <Text style={styles.uploadText}>Upload Image</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
                <Text style={styles.label}>Video</Text>
                <TextInput
                    style={styles.input}
                    value={videoUrl}
                    onChangeText={setVideoUrl}
                    placeholder="Paste video URL or upload below"
                />
                <TouchableOpacity onPress={pickVideo} style={styles.uploadButton}>
                    <Text style={styles.uploadText}>Upload Video</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.buttonRow}>
                <TouchableOpacity onPress={handleclose} style={styles.button}>
                    <LinearGradient colors={['#1F73C6', '#F7941E']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.button}>
                        <Text style={styles.buttonText}>Close</Text>
                    </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSubmit} style={styles.button}>
                    <LinearGradient colors={['#1F73C6', '#F7941E']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.button}>
                        <Text style={styles.buttonText}>Add Feed</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </View>



    );
}

const styles = StyleSheet.create({
    richEditor: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        marginBottom: 10,
        backgroundColor: '#fafafa',
    },
    richToolbar: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        marginBottom: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#333',
    },
    formGroup: {
        marginBottom: 12,
        width: '90%',
    },

    label: {
        fontSize: 14,
        marginBottom: 4,
        color: '#555',
    },


    inputMultiline: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingTop: 12,
        height: 100,
        backgroundColor: '#fff',
    },

    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 20,
    },

    button: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },

    buttonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    inputContainer: {
        maxWidth: "90%",
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 12,
        paddingHorizontal: 12,
        marginVertical: 5,
        width: '100%',

    },
    inputIcon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        height: 44,
    },


    uploadButton: {
        backgroundColor: '#eee',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 6,
        marginTop: 6,
        alignSelf: 'flex-start',
    },

    uploadText: {
        color: '#333',
        fontSize: 13,
    },

});