import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { FlatList, Image, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const recentlyPlayed = [
    { id: '1', title: 'The triangle', image: require('@/assets/images/music-image.avif') },
    { id: '2', title: 'Dune Of Visa', image: require('@/assets/images/music-image.avif') },
    { id: '3', title: 'RiskItAll', image: require('@/assets/images/music-image.avif') },
];

const recommend = [
    { id: '1', title: 'Take care of you', artist: 'Admina Thembi', streams: '114k', image: require('@/assets/images/music-image.avif') },
    { id: '2', title: 'The stranger inside you', artist: 'Jeane Lebras', streams: '60.5k', image: require('@/assets/images/music-image.avif') },
    { id: '3', title: 'Edwall of beauty mind', artist: 'Jacob Givson', streams: '44.3k', image: require('@/assets/images/music-image.avif') },
];

export default function HomeScreen() {
    return (
        <LinearGradient colors={['#0A043C', '#111132']} style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>

                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.profile}>
                        <Image
                            source={require('@/assets/images/music-image.avif')}
                            style={styles.avatar}
                        />
                        <View>
                            <Text style={styles.name}>Sarwar Jahan</Text>
                            <Text style={styles.role}>Gold Member</Text>
                        </View>
                    </View>
                    <Icon name="notifications-outline" size={24} color="#9BA3AF" />
                </View>

                {/* Search Bar */}
                <View style={styles.searchBar}>
                    <Icon name="search-outline" size={20} color="#9BA3AF" />
                    <TextInput
                        placeholder="Search Music"
                        placeholderTextColor="#9BA3AF"
                        style={styles.searchInput}
                    />
                </View>

                {/* Recently Played */}
                <Text style={styles.sectionTitle}>Recently Played</Text>
                <FlatList
                    data={recentlyPlayed}
                    horizontal
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <Image source={item.image} style={styles.cardImage} />
                            <Text style={styles.cardTitle}>{item.title}</Text>
                        </View>
                    )}
                    showsHorizontalScrollIndicator={false}
                />

                {/* Recommended */}
                <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Recommend for you</Text>
                {recommend.map((item) => (
                    <View key={item.id} style={styles.recommendCard}>
                        <Image source={item.image} style={styles.recommendImage} />
                        <View style={{ flex: 1 }}>
                            <Text style={styles.songTitle}>{item.title}</Text>
                            <Text style={styles.artist}>{item.artist}</Text>
                            <Text style={styles.streams}>{item.streams} / steams</Text>
                        </View>
                    </View>
                ))}

            </ScrollView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 50,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    profile: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    avatar: {
        width: 45,
        height: 45,
        borderRadius: 25,
    },
    name: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
    role: {
        color: '#9BA3AF',
        fontSize: 12,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1A1B4B',
        borderRadius: 15,
        paddingHorizontal: 15,
        paddingVertical: 8,
        marginTop: 20,
    },
    searchInput: {
        marginLeft: 10,
        color: '#fff',
        flex: 1,
    },
    sectionTitle: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 18,
        marginTop: 25,
        marginBottom: 10,
    },
    card: {
        marginRight: 15,
        alignItems: 'center',
    },
    cardImage: {
        width: 120,
        height: 120,
        borderRadius: 15,
    },
    cardTitle: {
        color: '#fff',
        marginTop: 8,
        fontSize: 13,
    },
    recommendCard: {
        flexDirection: 'row',
        backgroundColor: '#1A1B4B',
        borderRadius: 15,
        padding: 10,
        alignItems: 'center',
        marginBottom: 12,
    },
    recommendImage: {
        width: 70,
        height: 70,
        borderRadius: 12,
        marginRight: 12,
    },
    songTitle: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '600',
    },
    artist: {
        color: '#9BA3AF',
        fontSize: 13,
    },
    streams: {
        color: '#6D6D8E',
        fontSize: 12,
    },
});
