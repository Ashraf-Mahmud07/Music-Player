import { StyleSheet } from "react-native";

export const musicStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#12003B',
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 10,
        marginBottom: 30,
    },
    title: {
        color: 'white',
        fontSize: 18,
        flexShrink: 1,
        flexWrap: 'wrap',
        overflow: 'hidden',
    },
    albumArt: {
        marginTop: 40,
        width: '100%',
        height: 300,
        borderRadius: 20,
        marginBottom: 30,
        resizeMode: 'cover',
    },
    songTitle: {
        fontSize: 18,
        color: 'white',
        textAlign: 'center',
        flexShrink: 1,
        flexWrap: 'wrap',
        overflow: 'hidden',
    },
    artist: {
        fontSize: 16,
        color: 'gray',
        textAlign: 'center',
        marginBottom: 20,
    },
    slider: {
        width: '100%',
        height: 40,
    },
    timeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        marginBottom: 15,
        width: '100%',
    },
    time: {
        color: '#ccc',
        fontSize: 12,
        width: 36,
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginTop: 20,
    },
    playButton: {
        backgroundColor: '#8855FF',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
