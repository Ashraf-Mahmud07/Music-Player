import { StyleSheet } from "react-native";

export const homeStyles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 10,
        paddingTop: 20,
        paddingBottom: 90,
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
