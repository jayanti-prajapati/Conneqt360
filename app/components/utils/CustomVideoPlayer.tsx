import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Modal, Dimensions } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import Slider from '@react-native-community/slider';
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize } from 'lucide-react-native';
import Spacing from '@/constants/Spacing';

const { width, height } = Dimensions.get('window');

export default function CustomVideoPlayer({ videoUrl, isVisible }: { videoUrl: string; isVisible: boolean }) {
    const videoRef = useRef<Video>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [position, setPosition] = useState(0);
    const [duration, setDuration] = useState(1);
    const [isFullScreen, setIsFullScreen] = useState(false);

    useEffect(() => {
        return videoRef.current?.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
    }, []);

    useEffect(() => {
        // Play or pause when visibility changes
        if (!videoRef.current) return;

        const controlPlayback = async () => {
            if (isVisible) {
                //@ts-ignore
                await videoRef.current.playAsync();
            } else {
                //@ts-ignore
                await videoRef.current.pauseAsync();

            }
        };

        controlPlayback();
    }, [isVisible]);

    const onPlaybackStatusUpdate = (status: any) => {
        if (!status.isLoaded) return;
        setIsPlaying(status.isPlaying);
        setPosition(status.positionMillis);
        setDuration(status.durationMillis || 1);
    };

    const togglePlayPause = async () => {
        if (!videoRef.current) return;
        isPlaying ? await videoRef.current.pauseAsync() : await videoRef.current.playAsync();
    };

    const toggleMute = () => {
        setIsMuted(prev => !prev);
    };

    const onSeek = async (value: number) => {
        await videoRef.current?.setPositionAsync(value);
    };

    const toggleFullScreen = () => {
        setIsFullScreen(!isFullScreen);
    };

    const renderVideo = (fullScreen: boolean) => (
        <View style={[styles.container, fullScreen && styles.fullScreenContainer]}>
            <Video
                ref={videoRef}
                source={{ uri: videoUrl }}
                style={fullScreen ? styles.fullScreenVideo : styles.video}
                resizeMode={ResizeMode.CONTAIN}
                isLooping
                isMuted={isMuted}
            />
            <View style={styles.controls}>
                <TouchableOpacity onPress={toggleMute}>
                    {isMuted ? <VolumeX size={24} color="#fff" /> : <Volume2 size={24} color="#fff" />}
                </TouchableOpacity>

                <TouchableOpacity onPress={togglePlayPause}>
                    {isPlaying ? <Pause size={28} color="#fff" /> : <Play size={28} color="#fff" />}
                </TouchableOpacity>

                <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={duration}
                    value={position}
                    onSlidingComplete={onSeek}
                    minimumTrackTintColor="#fff"
                    maximumTrackTintColor="#888"
                    thumbTintColor="#fff"
                />

                <TouchableOpacity onPress={toggleFullScreen}>
                    {fullScreen ? <Minimize size={24} color="#fff" /> : <Maximize size={24} color="#fff" />}
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <>
            {renderVideo(false)}
            <Modal visible={isFullScreen} supportedOrientations={['portrait', 'landscape']} animationType="fade">
                <TouchableOpacity style={styles.modalBackground} activeOpacity={1} onPress={toggleFullScreen}>
                    {renderVideo(true)}
                </TouchableOpacity>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 200,
        borderRadius: 12,
        marginBottom: Spacing.md,
        backgroundColor: '#000',
    },
    fullScreenContainer: {
        width,
        height,
    },
    video: {
        width: '100%',
        height: '100%',
    },
    fullScreenVideo: {
        width: '100%',
        height: '100%',
    },
    controls: {
        position: 'absolute',
        bottom: 10,
        left: 10,
        right: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 10,
    },
    slider: {
        flex: 1,
        marginHorizontal: 10,
    },
    modalBackground: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
    },
});
