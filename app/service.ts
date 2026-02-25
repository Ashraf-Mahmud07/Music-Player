// Use a runtime require via eval to avoid Metro trying to resolve the native
// module at bundle time in environments where it's not installed (Expo Go / web).
// If `react-native-track-player` is present in a native build, this will load it.
async function service() {
  try {
    // eslint-disable-next-line no-eval
    const maybeRequire: any = eval("require");
    const TrackPlayer = maybeRequire("react-native-track-player");
    if (!TrackPlayer) return;

    TrackPlayer.addEventListener("remote-play" as any, () =>
      TrackPlayer.play(),
    );
    TrackPlayer.addEventListener("remote-pause" as any, () =>
      TrackPlayer.pause(),
    );
    TrackPlayer.addEventListener("remote-next" as any, () =>
      TrackPlayer.skipToNext(),
    );
    TrackPlayer.addEventListener("remote-previous" as any, () =>
      TrackPlayer.skipToPrevious(),
    );
    TrackPlayer.addEventListener("remote-stop" as any, () =>
      TrackPlayer.stop(),
    );
  } catch (e) {
    // TrackPlayer not available in this environment — ignore.
  }
}

module.exports = service;

export default service;
