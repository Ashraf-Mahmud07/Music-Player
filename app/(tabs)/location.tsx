// screens/HomeScreen.tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function LocationScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Location Screen</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0B0B1E', justifyContent: 'center', alignItems: 'center' },
    text: { color: '#fff', fontSize: 20 },
});
