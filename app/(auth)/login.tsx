import * as Google from 'expo-auth-session/providers/google';
import Constants from 'expo-constants';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    View
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { signInWithEmail, signInWithGoogle } from '../utils/firebase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Decide whether Google auth is configured. If not, we'll render a helper instead
  const googleExpoClientId = Constants.manifest?.extra?.googleExpoClientId;
  const googleIosClientId = Constants.manifest?.extra?.googleIosClientId;
  const googleAndroidClientId = Constants.manifest?.extra?.googleAndroidClientId;
  const googleWebClientId = Constants.manifest?.extra?.googleWebClientId;
  const googleConfigured = Boolean(
    googleExpoClientId || googleIosClientId || googleAndroidClientId || googleWebClientId
  );

  const onLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      await signInWithEmail({ email, password });
      router.replace('/');
    } catch (e: any) {
      setError(e?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.select({ ios: 'padding', android: undefined })} style={styles.container}>
        <View style={styles.headerBox}>
          <LinearGradient colors={["#6D28D9", "#4F46E5"]} style={styles.logoCircle}>
            <Image source={require('../../assets/images/favicon.png')} style={styles.logo} />
          </LinearGradient>
          <Text style={styles.welcome}>Welcome back</Text>
          <Text style={styles.subtitle}>Sign in to continue to Music Player</Text>
        </View>

        <View style={styles.card}>
          {error ? <Text style={styles.error}>{error}</Text> : null}

          <View style={styles.inputRow}>
            <Icon name="mail-outline" size={18} color="#666" style={styles.inputIcon} />
            <TextInput
              placeholder="Email"
              placeholderTextColor="#666"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputRow}>
            <Icon name="lock-closed-outline" size={18} color="#666" style={styles.inputIcon} />
            <TextInput
              placeholder="Password"
              placeholderTextColor="#666"
              value={password}
              onChangeText={setPassword}
              style={styles.input}
              secureTextEntry
            />
          </View>

          <Pressable onPress={onLogin} disabled={loading} accessibilityRole="button">
            <LinearGradient colors={["#6D28D9", "#4F46E5"]} style={styles.primaryButton}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryButtonText}>Login</Text>}
            </LinearGradient>
          </Pressable>

          <Pressable style={styles.ghostButton} onPress={() => router.push('./signup')} accessibilityRole="button">
            <Text style={styles.ghostText}>Create account</Text>
          </Pressable>

          <View style={styles.divider} />

          {googleConfigured ? (
            <GoogleSignInButton
              clientIds={{
                expo: googleExpoClientId,
                ios: googleIosClientId,
                android: googleAndroidClientId,
                web: googleWebClientId,
              }}
              onStart={() => setLoading(true)}
              onFinish={() => setLoading(false)}
              onError={(msg: string) => setError(msg)}
            />
          ) : (
            <Pressable
              style={[styles.googleButton, { opacity: 0.9 }]}
              onPress={() =>
                Alert.alert(
                  'Google sign-in not configured',
                  'Set the Google client IDs in app.json (expo.extra) before using Google sign-in. See README or paste your Firebase web clientId into expo.extra.googleWebClientId.'
                )
              }
              accessibilityRole="button"
            >
              <Text style={styles.googleText}>Continue with Google</Text>
            </Pressable>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0A043C' },
  container: { flex: 1, padding: 16, justifyContent: 'center' },
  headerBox: { alignItems: 'center', marginBottom: 18 },
  logoCircle: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  logo: { width: 40, height: 40, resizeMode: 'contain' },
  welcome: { color: '#fff', fontSize: 20, fontWeight: '700' },
  subtitle: { color: '#9BA3AF', fontSize: 13, marginTop: 6 },
  card: { backgroundColor: '#071039', borderRadius: 12, padding: 20, shadowColor: '#000', shadowOpacity: 0.2 },
  inputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 8, marginBottom: 10, paddingHorizontal: 10 },
  inputIcon: { marginRight: 8 },
  title: { color: '#fff', fontSize: 20, fontWeight: '700', marginBottom: 12 },
  input: { backgroundColor: '#fff', padding: 12, borderRadius: 8, marginBottom: 10 },
  primaryButton: { backgroundColor: '#4F46E5', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 6 },
  primaryButtonText: { color: '#fff', fontWeight: '700' },
  ghostButton: { marginTop: 10, alignItems: 'center' },
  ghostText: { color: '#9BA3AF' },
  divider: { height: 1, backgroundColor: '#0f1230', marginVertical: 12 },
  googleButton: { backgroundColor: '#fff', padding: 12, borderRadius: 8, alignItems: 'center' },
  googleText: { color: '#000', fontWeight: '600' },
  error: { color: '#FF6B6B', marginBottom: 8 },
});

function GoogleSignInButton({ clientIds, onStart, onFinish, onError }: any) {
  const router = useRouter();

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: clientIds.expo || undefined,
    iosClientId: clientIds.ios || undefined,
    androidClientId: clientIds.android || undefined,
    webClientId: clientIds.web || undefined,
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const idToken = response.authentication?.idToken;
      const accessToken = response.authentication?.accessToken;
      if (idToken || accessToken) {
        (async () => {
          try {
            onStart?.();
            await signInWithGoogle(idToken ?? null, accessToken ?? null);
            router.replace('/');
          } catch (e: any) {
            onError?.(e?.message || String(e));
          } finally {
            onFinish?.();
          }
        })();
      }
    }
  }, [response]);

  return (
    <Pressable style={styles.googleButton} onPress={() => promptAsync()} accessibilityRole="button">
      <Text style={styles.googleText}>Continue with Google</Text>
    </Pressable>
  );
}
