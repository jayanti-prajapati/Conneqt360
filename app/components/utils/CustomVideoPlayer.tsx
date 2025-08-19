import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus, VideoFullscreenUpdate } from 'expo-av';
import Slider from '@react-native-community/slider';
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize } from 'lucide-react-native';
import { useIsFocused } from '@react-navigation/native';
import Spacing from '@/constants/Spacing';

const { width } = Dimensions.get('window');

export default function CustomVideoPlayer({
    videoUrl,
    isVisible,
}: {
    videoUrl: string;
    isVisible: boolean;
}) {
    const videoRef = useRef<Video>(null);
    const isFocused = useIsFocused();

    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [position, setPosition] = useState(0);
    const [duration, setDuration] = useState(1);
    const [isFullScreen, setIsFullScreen] = useState(false);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.setOnPlaybackStatusUpdate((status) => {
                if (!status.isLoaded) return;

                setIsPlaying(status.isPlaying);
                setPosition(status.positionMillis);
                setDuration(status.durationMillis || 1);
            });
        }
    }, []);


    // Pause when leaving the screen
    useEffect(() => {
        if (!isFocused && videoRef.current) {
            videoRef.current.pauseAsync();
        }
    }, [isFocused]);
    const handleFullscreenUpdate = ({ fullscreenUpdate }: { fullscreenUpdate: VideoFullscreenUpdate }) => {
        if (fullscreenUpdate === VideoFullscreenUpdate.PLAYER_DID_PRESENT) {
            setIsFullScreen(true);
        }
        if (fullscreenUpdate === VideoFullscreenUpdate.PLAYER_DID_DISMISS) {
            setIsFullScreen(false);
        }
    };
    // Play/pause when modal visible changes
    useEffect(() => {
        if (!videoRef.current) return;

        const controlPlayback = async () => {
            if (!videoRef.current) return;
            if (isVisible) {
                await videoRef.current.playAsync();
            } else {
                await videoRef.current.pauseAsync();
            }
        };

        controlPlayback();
    }, [isVisible]);

    const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
        if (!status.isLoaded) return;
        setIsPlaying(status.isPlaying);
        setPosition(status.positionMillis);
        setDuration(status.durationMillis || 1);
    };

    const togglePlayPause = async () => {
        if (!videoRef.current) return;
        isPlaying ? await videoRef.current.pauseAsync() : await videoRef.current.playAsync();
    };

    const toggleMute = async () => {
        setIsMuted((prev) => !prev);
        await videoRef.current?.setIsMutedAsync(!isMuted);
    };

    const onSeek = async (value: number) => {
        await videoRef.current?.setPositionAsync(value);
    };

    const toggleFullScreen = async () => {
        if (!videoRef.current) return;

        if (isFullScreen) {
            // exiting fullscreen → resume inline playback
            await videoRef.current.dismissFullscreenPlayer();
            setIsFullScreen(false);
            await videoRef.current.playAsync();
        } else {
            // entering fullscreen → pause inline
            await videoRef.current.pauseAsync();
            await videoRef.current.presentFullscreenPlayer();
            setIsFullScreen(true);
        }
    };

    return (
        <View style={[styles.container]}>
            <Video
                ref={videoRef}
                source={{ uri: videoUrl }}
                style={styles.video}
                resizeMode={ResizeMode.CONTAIN}
                isLooping
                isMuted={isMuted}
                shouldPlay={isPlaying}

                onFullscreenUpdate={handleFullscreenUpdate}
            />

            <View style={styles.controls}>
                {/* Mute button */}
                <TouchableOpacity onPress={toggleMute}>
                    {isMuted ? <VolumeX size={24} color="#fff" /> : <Volume2 size={24} color="#fff" />}
                </TouchableOpacity>

                {/* Play/Pause */}
                <TouchableOpacity onPress={togglePlayPause}>
                    {isPlaying ? <Pause size={28} color="#fff" /> : <Play size={28} color="#fff" />}
                </TouchableOpacity>

                {/* Slider */}
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

                {/* Fullscreen toggle */}
                <TouchableOpacity onPress={toggleFullScreen}>
                    {isFullScreen ? <Minimize size={24} color="#fff" /> : <Maximize size={24} color="#fff" />}
                </TouchableOpacity>
            </View>
        </View>
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
    video: {
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
});
