import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

const MusicWaveLoader = () => {
    const animations = Array.from({ length: 5 }, () => useRef(new Animated.Value(0)).current);

    useEffect(() => {
        const animate = (bar: Animated.Value, delay: number) => {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(bar, {
                        toValue: 1,
                        duration: 400,
                        easing: Easing.linear,
                        useNativeDriver: true,
                        delay,
                    }),
                    Animated.timing(bar, {
                        toValue: 0,
                        duration: 400,
                        easing: Easing.linear,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        };

        animations.forEach((bar, i) => animate(bar, i * 150));
    }, []);
    

    return (
        <View style={styles.container}>
            {animations.map((bar, i) => {
                // const height = bar.interpolate({
                //     inputRange: [0, 1],
                //     outputRange: [10, 50],
                // });
                return <Animated.View key={i} style={[styles.bar]} />;
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'center',
        height: 60,
    },
    bar: {
        width: 8,
        marginHorizontal: 4,
        backgroundColor: '#ff3366',
        borderRadius: 4,
    },
});

export default MusicWaveLoader;
