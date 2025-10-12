import { homeStyles } from '@/components/styles/homeStyles';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    RefreshControl,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function HomeScreen() {
    const [query, setQuery] = useState('');
    const [musicData, setMusicData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const router = useRouter();

    // ✅ Fetch Deezer API (20 recommended songs)
    const fetchDeezerData = async (searchText: string = 'Coke Studio') => {
        setLoading(true);
        try {
            const res = await fetch(`https://api.deezer.com/search?q=${searchText}`);
            const data = await res.json();
            setMusicData(data.data.slice(0, 20)); // only 20 songs
        } catch (error) {
            console.error('Deezer API Error:', error);
        } finally {
            setLoading(false);
        }
    };

    // ✅ Load default recommended songs on mount
    useEffect(() => {
        fetchDeezerData();
    }, []);

    // ✅ Pull-to-refresh
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchDeezerData(query || 'Coke Studio').then(() => setRefreshing(false));
    }, [query]);

    // ✅ Search Deezer songs (debounced)
    useEffect(() => {
        const timer = setTimeout(() => {
            if (query.length > 1) fetchDeezerData(query);
            else if (query.length === 0) fetchDeezerData(); // restore default
        }, 600);
        return () => clearTimeout(timer);
    }, [query]);

    // ✅ Handle song click → navigate to MusicPlayer
    const handleSongPress = (song: any) => {
        router.push({
            pathname: '/music',
            params: {
                song: JSON.stringify(song), // pass song data
            },
        });
    };

    return (
        <LinearGradient colors={['#0A043C', '#111132']} style={homeStyles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#00BFFF']} />
                }
            >
                {/* Header */}
                <View style={homeStyles.header}>
                    <View style={homeStyles.profile}>
                        <Image source={require('@/assets/images/singer.jpg')} style={homeStyles.avatar} />
                        <View>
                            <Text style={homeStyles.name}>Ashraf Mahmud</Text>
                            <Text style={homeStyles.role}>Diamond Member</Text>
                        </View>
                    </View>
                    <Icon name="notifications-outline" size={24} color="#9BA3AF" />
                </View>

                {/* Search Bar */}
                <View style={homeStyles.searchBar}>
                    <Icon name="search-outline" size={20} color="#9BA3AF" />
                    <TextInput
                        placeholder="Search Music"
                        placeholderTextColor="#9BA3AF"
                        style={homeStyles.searchInput}
                        value={query}
                        onChangeText={setQuery}
                    />
                </View>

                {/* Loader */}
                {loading && (
                    <ActivityIndicator size="large" color="#00BFFF" style={{ marginVertical: 20 }} />
                )}

                {/* Recommended / Search Results */}
                {!loading && (
                    <>
                        <Text style={[homeStyles.sectionTitle, { marginTop: 10 }]}>
                            {query ? 'Search Results' : 'Recommend for You'}
                        </Text>

                        <FlatList
                            data={musicData}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity onPress={() => handleSongPress(item)} style={homeStyles.recommendCard}>
                                    <Image source={{ uri: item.album.cover_medium }} style={homeStyles.recommendImage} />
                                    <View style={{ flex: 1 }}>
                                        <Text style={homeStyles.songTitle} numberOfLines={1}>
                                            {item.title}
                                        </Text>
                                        <Text style={homeStyles.artist}>{item.artist.name}</Text>
                                        <Text style={homeStyles.streams}>{item.album.title}</Text>
                                    </View>
                                </TouchableOpacity>
                            )}
                        />
                    </>
                )}
            </ScrollView>
        </LinearGradient>
    );
}
