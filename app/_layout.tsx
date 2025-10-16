import { useColorScheme } from '@/hooks/use-color-scheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

async function tryInitTrackPlayer() {
  try {
    const TrackPlayer: any = require('react-native-track-player');
    if (!TrackPlayer) return;

    await TrackPlayer.setupPlayer();

    try {
      TrackPlayer.registerPlaybackService(() => require('./service'));
    } catch (e) {
      // ignore silently.
      // console.warn('registerPlaybackService not available', e);
    }

    // Update options/capabilities if available
    try {
      await TrackPlayer.updateOptions({
        stopWithApp: false,
        capabilities: [
          TrackPlayer.Capability?.Play || TrackPlayer.CAPABILITY_PLAY,
          TrackPlayer.Capability?.Pause || TrackPlayer.CAPABILITY_PAUSE,
          TrackPlayer.Capability?.SkipToNext || TrackPlayer.CAPABILITY_NEXT,
          TrackPlayer.Capability?.SkipToPrevious || TrackPlayer.CAPABILITY_PREVIOUS,
          TrackPlayer.Capability?.Stop || TrackPlayer.CAPABILITY_STOP,
        ].filter(Boolean),
        compactCapabilities: [
          TrackPlayer.Capability?.Play || TrackPlayer.CAPABILITY_PLAY,
          TrackPlayer.Capability?.Pause || TrackPlayer.CAPABILITY_PAUSE,
        ].filter(Boolean),
      });
    } catch (e) {
      // ignore updateOptions problems
    }
  } catch (e) {
    // TrackPlayer isn't installed or can't be initialized yet. That's fine —
    // we leave playback to expo-av until a native build with the package is available.
    // console.warn('TrackPlayer not initialized', e);
  }
}

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    // Initialize TrackPlayer if available. This is non-blocking.
    tryInitTrackPlayer();
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffffff' }}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
        <StatusBar style="auto" />
      </SafeAreaView>
    </ThemeProvider>
  );
}
