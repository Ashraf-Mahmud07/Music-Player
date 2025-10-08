import MusicWaveLoader from '@/components/common/MusicWaveLoader';
import { musicStyles } from '@/components/styles/musicStyles';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { Audio, AVPlaybackStatus } from 'expo-av';
import { useNavigation } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Image,
    StyleProp,
    Text,
    TouchableOpacity,
    View,
    ViewStyle
} from 'react-native';

export default function MusicPlayer() {
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [position, setPosition] = useState<number>(0);
    const [duration, setDuration] = useState<number>(1);
    const [playlist, setPlaylist] = useState<any[]>([]);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);

    const soundRef = useRef<Audio.Sound | null>(null);
    const navigation = useNavigation();

    // 🎧 Fetch Deezer API (top 30 songs for an artist or query)
    const fetchDeezerSongs = async (query: string = "Coke Studio") => {
        try {
            setLoading(true);
            const res = await fetch(`https://api.deezer.com/search?q=${query}`);
            const data = await res.json();
            // Only 30 songs
            const songs = data.data.slice(0, 30);
            setPlaylist(songs);
            setLoading(false);
            if (songs.length > 0) loadAudio(0, songs);
        } catch (err) {
            console.error("Error fetching songs:", err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDeezerSongs();
        return () => {
            if (soundRef.current) soundRef.current.unloadAsync();
        };
    }, []);

    const loadAudio = async (index: number, list = playlist) => {
        try {
            if (soundRef.current) {
                await soundRef.current.unloadAsync();
            }

            const previewUrl = list[index]?.preview;
            if (!previewUrl) return;

            const { sound } = await Audio.Sound.createAsync(
                { uri: previewUrl },
                { shouldPlay: false },
                onPlaybackStatusUpdate
            );

            soundRef.current = sound;
            setSound(sound);
            setIsPlaying(true);
        } catch (error) {
            console.error("Error loading audio", error);
        }
    };

    const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
        if (!status.isLoaded) return;
        const positionMillis = status.positionMillis ?? 0;
        const durationMillis = status.durationMillis ?? 1;
        setPosition(positionMillis);
        setDuration(durationMillis);
        setIsPlaying(status.isPlaying ?? false);
    };

    const togglePlayPause = async () => {
        if (!soundRef.current) return;
        if (isPlaying) {
            await soundRef.current.pauseAsync();
        } else {
            await soundRef.current.playAsync();
        }
    };

    const playNext = () => {
        const nextIndex = (currentIndex + 1) % playlist.length;
        setCurrentIndex(nextIndex);
        loadAudio(nextIndex);
    };

    const playPrevious = () => {
        const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
        setCurrentIndex(prevIndex);
        loadAudio(prevIndex);
    };


    const formatDecimalTime = (millis: number) => {
        const totalSeconds = Math.floor(millis / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        const decimalSeconds = Math.floor((seconds * 60) / 60)
            .toString()
            .padStart(2, '0');
        return `${minutes}.${decimalSeconds}`;
    };

    const seekAudio = async (value: number) => {
        if (soundRef.current) {
            const seekPosition = Math.floor(value * duration);
            await soundRef.current.setPositionAsync(seekPosition);
        }
    };

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
        <View style={musicStyles.container}>
            {/* Header */}
            <View style={musicStyles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text style={musicStyles.title}>
                    {currentSong?.title_short || "Music Player"}
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
                style={musicStyles.slider as StyleProp<ViewStyle>}
                minimumValue={0}
                maximumValue={1}
                value={duration ? position / duration : 0}
                minimumTrackTintColor="#ffffff"
                maximumTrackTintColor="#888"
                onSlidingComplete={seekAudio}
            />

            {/* Time Display */}
            <View style={musicStyles.timeRow}>
                <Text style={musicStyles.time}>{formatDecimalTime(position)}</Text>
                <Text style={musicStyles.time}>{formatDecimalTime(duration)}</Text>
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
        </View>
    );
}
