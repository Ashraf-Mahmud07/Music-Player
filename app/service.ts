import TrackPlayer from 'react-native-track-player';

async function service() {
    TrackPlayer.addEventListener('remote-play' as any, () => TrackPlayer.play());
    TrackPlayer.addEventListener('remote-pause' as any, () => TrackPlayer.pause());
    TrackPlayer.addEventListener('remote-next' as any, () => TrackPlayer.skipToNext());
    TrackPlayer.addEventListener('remote-previous' as any, () => TrackPlayer.skipToPrevious());
    TrackPlayer.addEventListener('remote-stop' as any, () => TrackPlayer.stop());
}

module.exports = service;

export default service;
