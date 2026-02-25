import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getFavorites, removeFavorite } from '../utils/favorites';

export default function FavoritesPage() {
    const [list, setList] = useState<any[]>([]);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const router = useRouter();

    const load = async () => {
        const fav = await getFavorites();
        setList(fav);
    };

    useEffect(() => {
        load();
    }, []);

        const onRefresh = async () => {
            setRefreshing(true);
            await load();
            setRefreshing(false);
        };

    const onPlay = (item: any) => {
        const encoded = encodeURIComponent(JSON.stringify(item));
        router.push(`./music?song=${encoded}`);
    };

    const onRemove = async (id: any) => {
        await removeFavorite(id);
        await load();
    };

    const renderItem = ({ item }: { item: any }) => (
        <View style={styles.row}>
            <Image source={{ uri: item.album?.cover_small || item.album?.cover_big }} style={styles.art} />
            <View style={styles.meta}>
                <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.artist} numberOfLines={1}>{item.artist?.name}</Text>
            </View>
            <TouchableOpacity onPress={() => onPlay(item)} style={styles.iconButton}>
                <Ionicons name="play" size={22} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onRemove(item.id)} style={styles.iconButton}>
                <Ionicons name="trash" size={20} color="#ff6666" />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={{ flex: 1, backgroundColor: '#0A043C', padding: 12 }}>
            <Text style={{ color: 'white', fontSize: 18, marginBottom: 8 }}>Favorites</Text>
            {list.length === 0 ? (
                <View style={{ padding: 20 }}>
                    <Text style={{ color: '#ccc' }}>No favorites yet. Tap the heart on a song to add it.</Text>
                </View>
                    ) : (
                        <FlatList
                            data={list}
                            keyExtractor={(i) => String(i.id)}
                            renderItem={renderItem}
                            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            contentContainerStyle={{ paddingBottom: 24 }}
                        />
                    )}
        </View>
    );
}

const styles = StyleSheet.create({
    row: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#071039', padding: 8, borderRadius: 8 },
    art: { width: 48, height: 48, borderRadius: 4, marginRight: 8 },
    meta: { flex: 1 },
    title: { color: '#fff', fontSize: 14 },
    artist: { color: '#bbb', fontSize: 12 },
    iconButton: { padding: 8 },
});
