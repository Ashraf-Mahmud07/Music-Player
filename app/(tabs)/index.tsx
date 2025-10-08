import { homeStyles } from '@/components/styles/homeStyles';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { FlatList, Image, ScrollView, Text, TextInput, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const recentlyPlayed = [
    { id: '1', title: 'The triangle', image: require('@/assets/images/music-image.jpg') },
    { id: '2', title: 'Dune Of Visa', image: require('@/assets/images/music-image.jpg') },
    { id: '3', title: 'RiskItAll', image: require('@/assets/images/music-image.jpg') },
    { id: '4', title: 'RiskItAll', image: require('@/assets/images/music-image.jpg') },
    { id: '5', title: 'RiskItAll', image: require('@/assets/images/music-image.jpg') },
];

const recommend = [
    { id: '1', title: 'Take care of you', artist: 'Admina Thembi', streams: '114k', image: require('@/assets/images/music-image.jpg') },
    { id: '2', title: 'The stranger inside you', artist: 'Jeane Lebras', streams: '60.5k', image: require('@/assets/images/music-image.jpg') },
    { id: '3', title: 'Edwall of beauty mind', artist: 'Jacob Givson', streams: '44.3k', image: require('@/assets/images/music-image.jpg') },
    { id: '4', title: 'Edwall of beauty mind', artist: 'Jacob Givson', streams: '44.3k', image: require('@/assets/images/music-image.jpg') },
    { id: '5', title: 'Edwall of beauty mind', artist: 'Jacob Givson', streams: '44.3k', image: require('@/assets/images/music-image.jpg') },
    { id: '6', title: 'Edwall of beauty mind', artist: 'Jacob Givson', streams: '44.3k', image: require('@/assets/images/music-image.jpg') },
    { id: '7', title: 'Edwall of beauty mind', artist: 'Jacob Givson', streams: '44.3k', image: require('@/assets/images/music-image.jpg') },
    { id: '8', title: 'Edwall of beauty mind', artist: 'Jacob Givson', streams: '44.3k', image: require('@/assets/images/music-image.jpg') },
];

export default function HomeScreen() {
    return (
        <LinearGradient colors={['#0A043C', '#111132']} style={homeStyles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>

                {/* Header */}
                <View style={homeStyles.header}>
                    <View style={homeStyles.profile}>
                        <Image
                            source={require('@/assets/images/singer.jpg')}
                            style={homeStyles.avatar}
                        />
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
                    />
                </View>

                {/* Recently Played */}
                <Text style={homeStyles.sectionTitle}>Recently Played</Text>
                <FlatList
                    data={recentlyPlayed}
                    horizontal
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={homeStyles.card}>
                            <Image source={item.image} style={homeStyles.cardImage} />
                            <Text style={homeStyles.cardTitle}>{item.title}</Text>
                        </View>
                    )}
                    showsHorizontalScrollIndicator={false}
                />

                {/* Recommended */}
                <Text style={[homeStyles.sectionTitle, { marginTop: 20 }]}>Recommend for you</Text>
                {recommend.map((item) => (
                    <View key={item.id} style={homeStyles.recommendCard}>
                        <Image source={item.image} style={homeStyles.recommendImage} />
                        <View style={{ flex: 1 }}>
                            <Text style={homeStyles.songTitle}>{item.title}</Text>
                            <Text style={homeStyles.artist}>{item.artist}</Text>
                            <Text style={homeStyles.streams}>{item.streams} / steams</Text>
                        </View>
                    </View>
                ))}

            </ScrollView>
        </LinearGradient>
    );
}
