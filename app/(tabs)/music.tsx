import MusicWaveLoader from '@/components/common/MusicWaveLoader';
import { musicStyles } from '@/components/styles/musicStyles';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { Audio, AVPlaybackStatus } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    AppState,
    AppStateStatus,
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

    const soundRef = useRef<Audio.Sound | null>(null);
    const finishRef = useRef<boolean>(false);
    const playlistRef = useRef<any[]>([]);
    const currentIndexRef = useRef<number>(0);
    const navigation = useNavigation();

    // Update refs when state changes
    useEffect(() => {
        playlistRef.current = playlist;
    }, [playlist]);
    useEffect(() => {
        currentIndexRef.current = currentIndex;
    }, [currentIndex]);

    // Fetch Deezer API (top 20 songs)
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

    // Load audio and play
    const loadAudio = async (index: number, list = playlistRef.current) => {
        try {
            if (soundRef.current) {
                try {
                    await soundRef.current.unloadAsync();
                } catch (e) {
                    // ignore unload errors
                }
            }

            const previewUrl = list[index]?.preview;
            if (!previewUrl) return;

            const { sound: created } = await Audio.Sound.createAsync(
                { uri: previewUrl },
                { shouldPlay: true },
                onPlaybackStatusUpdate
            );

            soundRef.current = created;
            setSound(created);
            setIsPlaying(true);
            setCurrentIndex(index);
        } catch (error) {
            console.error('Error loading audio', error);
        }
    };

    // Playback status updates
    const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
        if (!status.isLoaded) return;
        const positionMillis = (status as any).positionMillis ?? 0;
        const durationMillis = (status as any).durationMillis ?? 1;
        setPosition(positionMillis);
        setDuration(durationMillis);
        setIsPlaying(status.isPlaying ?? false);

        // If the track just finished playing, advance to the next track.
        if ((status as any).didJustFinish && !finishRef.current) {
            finishRef.current = true;
            setTimeout(() => {
                finishRef.current = false;
                // use refs to avoid stale closure
                const list = playlistRef.current;
                if (!list || !list.length) return;
                const nextIndex = (currentIndexRef.current + 1) % list.length;
                loadAudio(nextIndex, list);
            }, 100);
        }
    };

    // Play / Pause toggle
    const togglePlayPause = async () => {
        if (!soundRef.current) return;
        if (isPlaying) {
            await soundRef.current.pauseAsync();
        } else {
            await soundRef.current.playAsync();
        }
    };

    // Next / Previous control
    const playNext = () => {
        const list = playlistRef.current;
        if (!list || !list.length) return;
        const nextIndex = (currentIndexRef.current + 1) % list.length;
        finishRef.current = false;
        loadAudio(nextIndex, list);
    };

    const playPrevious = () => {
        const list = playlistRef.current;
        if (!list || !list.length) return;
        const prevIndex = (currentIndexRef.current - 1 + list.length) % list.length;
        finishRef.current = false;
        loadAudio(prevIndex, list);
    };

    // Format time (MM:SS)
    const formatTime = (millis: number) => {
        const totalSeconds = Math.floor(millis / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    };

    // Seek audio
    const seekAudio = async (value: number) => {
        if (soundRef.current) {
            const seekPosition = Math.floor(value * duration);
            await soundRef.current.setPositionAsync(seekPosition);
        }
    };

    // Refresh functionality
    const onRefresh = async () => {
        setRefreshing(true);
        await fetchDeezerSongs();
        setRefreshing(false);
    };

    useEffect(() => {
        const loadPassedSong = async () => {
            if (params?.song) {
                try {
                    const newSong = JSON.parse(params.song as string);
                    setPlaylist([newSong]);
                    playlistRef.current = [newSong];
                    setCurrentIndex(0);
                    currentIndexRef.current = 0;
                    await loadAudio(0, [newSong]);
                    setLoading(false);
                } catch (error) {
                    console.error('Error loading passed song:', error);
                }
            } else {
                await fetchDeezerSongs();
            }
        };

        loadPassedSong();
    }, [params.song]);

    // Auto update position every 500ms
    useEffect(() => {
        const interval = setInterval(async () => {
            if (soundRef.current) {
                const status = await soundRef.current.getStatusAsync();
                    if (status.isLoaded) {
                    setPosition((status as any).positionMillis);
                    setDuration((status as any).durationMillis ?? 1);
                    setIsPlaying(status.isPlaying ?? false);
                }
            }
        }, 500);
        return () => clearInterval(interval);
    }, []);
        useEffect(() => {
            let mounted = true;
            const handleAppState = async (nextAppState: AppStateStatus) => {
                try {
                    const TrackPlayer: any = require('react-native-track-player');
                    if (!TrackPlayer) return;

                    if (nextAppState === 'background' || nextAppState === 'inactive') {
                        if (soundRef.current && isPlaying) {
                            const status = await soundRef.current.getStatusAsync();
                            const positionMillis = (status as any).positionMillis ?? 0;
                            const current = playlistRef.current[currentIndexRef.current];
                            if (!current) return;

                            const track = {
                                id: current.id?.toString() || String(Date.now()),
                                url: current.preview,
                                title: current.title || current.title_short || 'Unknown',
                                artist: current.artist?.name || '',
                                artwork: current.album?.cover_big || undefined,
                            };

                            try {
                                await TrackPlayer.reset();
                                await TrackPlayer.add([track]);
                                await TrackPlayer.play();
                                try {
                                    await TrackPlayer.seekTo(positionMillis / 1000);
                                } catch (e) {
                                    // ignore if seek not supported
                                }
                                try {
                                    await soundRef.current.stopAsync();
                                } catch (e) {
                                    // ignore
                                }
                            } catch (e) {
                                // console.warn('Failed to transfer to TrackPlayer', e);
                            }
                        }
                    } else if (nextAppState === 'active') {
                        try {
                            const state = await TrackPlayer.getState?.();
                            if (state === TrackPlayer.STATE_PLAYING || state === TrackPlayer.STATE_BUFFERING) {
                                try {
                                    await TrackPlayer.pause();
                                } catch (e) {}
                                const current = playlistRef.current[currentIndexRef.current];
                                if (current) {
                                    await loadAudio(currentIndexRef.current, playlistRef.current);
                                }
                            }
                        } catch (e) {
                            // ignore
                        }
                    }
                } catch (e) {
                    // TrackPlayer isn't installed — nothing to do
                }
            };

            const sub = AppState.addEventListener ? AppState.addEventListener('change', handleAppState) : undefined;
            // For older RN versions fallback
            if (!sub) {
                const listener = AppState.addEventListener('change', handleAppState as any);
                return () => listener.remove();
            }

            return () => {
                if (sub && typeof (sub as any).remove === 'function') (sub as any).remove();
                mounted = false;
            };
        }, [isPlaying]);

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
                    <Text style={musicStyles.title} numberOfLines={1} ellipsizeMode="tail">
                        {currentSong?.title_short || 'Music Player'}
                    </Text>
                    <Ionicons name="heart-outline" size={24} color="white" />
                </View>

                {/* Album Art */}
                <Image source={{ uri: currentSong?.album?.cover_big }} style={musicStyles.albumArt} />

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
                            <Ionicons name={isPlaying ? 'pause' : 'play'} size={32} color="white" />
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
