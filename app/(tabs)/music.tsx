import MusicWaveLoader from '@/components/common/MusicWaveLoader';
import { musicStyles } from '@/components/styles/musicStyles';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { Audio, AVPlaybackStatus } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Image,
    RefreshControl,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function MusicPlayer() {
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [position, setPosition] = useState<number>(0);
    const [duration, setDuration] = useState<number>(1);
    const [playlist, setPlaylist] = useState<any[]>([]);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [refreshing, setRefreshing] = useState<boolean>(false);

    const params = useLocalSearchParams();
    const passedSong = params?.song ? JSON.parse(params.song as string) : null;

    const soundRef = useRef<Audio.Sound | null>(null);
    const navigation = useNavigation();

    // ✅ Fetch Deezer API (top 20 songs)
    const fetchDeezerSongs = async (query: string = 'Coke Studio') => {
        try {
            setLoading(true);
            const res = await fetch(`https://api.deezer.com/search?q=${query}`);
            const data = await res.json();

            const songs = data.data.slice(0, 20); // 20 recommended songs
            setPlaylist(songs);

            if (songs.length > 0) await loadAudio(0, songs);
        } catch (err) {
            console.error('Error fetching songs:', err);
        } finally {
            setLoading(false);
        }
    };

    // ✅ Load audio and play
    const loadAudio = async (index: number, list = playlist) => {
        try {
            if (soundRef.current) {
                await soundRef.current.unloadAsync();
            }

            const previewUrl = list[index]?.preview;
            if (!previewUrl) return;

            const { sound } = await Audio.Sound.createAsync(
                { uri: previewUrl },
                { shouldPlay: true },
                onPlaybackStatusUpdate
            );

            soundRef.current = sound;
            setSound(sound);
            setIsPlaying(true);
            setCurrentIndex(index);
        } catch (error) {
            console.error('Error loading audio', error);
        }
    };

    // ✅ Playback status updates
    const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
        if (!status.isLoaded) return;
        const positionMillis = status.positionMillis ?? 0;
        const durationMillis = status.durationMillis ?? 1;
        setPosition(positionMillis);
        setDuration(durationMillis);
        setIsPlaying(status.isPlaying ?? false);
    };

    // ✅ Play / Pause toggle
    const togglePlayPause = async () => {
        if (!soundRef.current) return;
        if (isPlaying) {
            await soundRef.current.pauseAsync();
        } else {
            await soundRef.current.playAsync();
        }
    };

    // ✅ Next / Previous control
    const playNext = () => {
        if (!playlist.length) return;
        const nextIndex = (currentIndex + 1) % playlist.length;
        loadAudio(nextIndex);
    };

    const playPrevious = () => {
        if (!playlist.length) return;
        const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
        loadAudio(prevIndex);
    };

    // ✅ Format time (MM:SS)
    const formatTime = (millis: number) => {
        const totalSeconds = Math.floor(millis / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    };

    // ✅ Seek audio
    const seekAudio = async (value: number) => {
        if (soundRef.current) {
            const seekPosition = Math.floor(value * duration);
            await soundRef.current.setPositionAsync(seekPosition);
        }
    };

    // ✅ Refresh functionality
    const onRefresh = async () => {
        setRefreshing(true);
        await fetchDeezerSongs();
        setRefreshing(false);
    };

    // ✅ Initialize on mount
    // useEffect(() => {
    //     const init = async () => {
    //         if (passedSong) {
    //             setPlaylist([passedSong]);
    //             await loadAudio(0, [passedSong]);
    //         } else {
    //             await fetchDeezerSongs();
    //         }
    //     };
    //     init();

    //     return () => {
    //         if (soundRef.current) soundRef.current.unloadAsync();
    //     };
    // }, []);

    useEffect(() => {
        const loadPassedSong = async () => {
            if (params?.song) {
                try {
                    const newSong = JSON.parse(params.song as string);
                    setPlaylist([newSong]);
                    setCurrentIndex(0);
                    await loadAudio(0, [newSong]);
                    setLoading(false);
                } catch (error) {
                    console.error('Error loading passed song:', error);
                }
            }
        };

        loadPassedSong();
    }, [params.song]);

    // ✅ Auto update position every 500ms
    useEffect(() => {
        const interval = setInterval(async () => {
            if (soundRef.current) {
                const status = await soundRef.current.getStatusAsync();
                if (status.isLoaded) {
                    setPosition(status.positionMillis);
                    setDuration(status.durationMillis ?? 1);
                    setIsPlaying(status.isPlaying ?? false);
                }
            }
        }, 500);
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
                <MusicWaveLoader />
            </View>
        );
    }

    const currentSong = playlist[currentIndex];

    return (
        <LinearGradient colors={['#0A043C', '#111132']} style={musicStyles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#00BFFF']} />}
            >
                {/* Header */}
                <View style={musicStyles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                    <Text style={musicStyles.title} numberOfLines={1}
                        ellipsizeMode="tail">
                        {currentSong?.title_short || 'Music Player'}
                    </Text>
                    <Ionicons name="heart-outline" size={24} color="white" />
                </View>

                {/* Album Art */}
                <Image
                    source={{ uri: currentSong?.album?.cover_big }}
                    style={musicStyles.albumArt}
                />

                {/* Song Info */}
                <Text style={musicStyles.songTitle}>{currentSong?.title}</Text>
                <Text style={musicStyles.artist}>{currentSong?.artist?.name}</Text>

                {/* Slider */}
                <Slider
                    style={musicStyles.slider}
                    minimumValue={0}
                    maximumValue={1}
                    value={duration ? position / duration : 0}
                    minimumTrackTintColor="#fff"
                    maximumTrackTintColor="#888"
                    onSlidingComplete={seekAudio}
                />

                {/* Time Display */}
                <View style={musicStyles.timeRow}>
                    <Text style={musicStyles.time}>{formatTime(position)}</Text>
                    <Text style={musicStyles.time}>{formatTime(duration)}</Text>
                </View>

                {/* Controls */}
                <View style={musicStyles.controls}>
                    <Ionicons name="shuffle" size={24} color="white" />
                    <TouchableOpacity onPress={playPrevious}>
                        <Ionicons name="play-skip-back" size={32} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={togglePlayPause}>
                        <View style={musicStyles.playButton}>
                            <Ionicons
                                name={isPlaying ? 'pause' : 'play'}
                                size={32}
                                color="white"
                            />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={playNext}>
                        <Ionicons name="play-skip-forward" size={32} color="white" />
                    </TouchableOpacity>
                    <Ionicons name="repeat" size={24} color="white" />
                </View>
            </ScrollView>
        </LinearGradient>
    );
}
