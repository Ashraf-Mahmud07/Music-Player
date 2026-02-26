import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
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
    View,
} from 'react-native';
import { signUpWithEmail, uploadProfilePhoto } from '../utils/firebase';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [photo, setPhoto] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return Alert.alert('Permission required');
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.8 });
    // Handle both legacy ({ cancelled, uri }) and new ({ canceled, assets: [{ uri }] }) shapes
    if ((res as any).canceled === false && (res as any).assets && (res as any).assets.length > 0) {
      setPhoto((res as any).assets[0]);
    } else if ((res as any).cancelled === false && (res as any).uri) {
      setPhoto(res as any);
    }
  };

  const onSignup = async () => {
    setError(null);
    if (!email || !password) return setError('Provide email and password');
    if (password !== confirm) return setError('Passwords do not match');
    setLoading(true);
    try {
      const user = await signUpWithEmail({ name, email, password });
      if (photo) {
        await uploadProfilePhoto({ uri: photo.uri, name: `${user.uid}_photo` });
      }
      router.replace('/');
    } catch (e: any) {
      setError(e?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.select({ ios: 'padding', android: undefined })} style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Create your account</Text>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Pressable onPress={pickImage} style={styles.photoBox} accessibilityRole="button">
            {photo ? <Image source={{ uri: photo.uri }} style={styles.photo} /> : <Text style={{ color: '#888' }}>Tap to pick a photo</Text>}
          </Pressable>

          <TextInput placeholder="Name" placeholderTextColor="#666" value={name} onChangeText={setName} style={styles.input} />
          <TextInput placeholder="Email" placeholderTextColor="#666" value={email} onChangeText={setEmail} style={styles.input} keyboardType="email-address" autoCapitalize="none" />
          <TextInput placeholder="Password" placeholderTextColor="#666" value={password} onChangeText={setPassword} style={styles.input} secureTextEntry />
          <TextInput placeholder="Confirm password" placeholderTextColor="#666" value={confirm} onChangeText={setConfirm} style={styles.input} secureTextEntry />

          <Pressable style={styles.primaryButton} onPress={onSignup} disabled={loading} accessibilityRole="button">
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryButtonText}>Sign up</Text>}
          </Pressable>

          <Pressable style={styles.ghostButton} onPress={() => router.push('./login')} accessibilityRole="button">
            <Text style={styles.ghostText}>Already have an account? Login</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0A043C' },
  container: { flex: 1, padding: 16, justifyContent: 'center' },
  card: { backgroundColor: '#071039', borderRadius: 12, padding: 20, shadowColor: '#000', shadowOpacity: 0.2 },
  title: { color: '#fff', fontSize: 20, fontWeight: '700', marginBottom: 12 },
  input: { backgroundColor: '#fff', padding: 12, borderRadius: 8, marginBottom: 10 },
  photoBox: { height: 96, width: 96, borderRadius: 12, backgroundColor: '#0f1230', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  photo: { width: 96, height: 96, borderRadius: 12 },
  primaryButton: { backgroundColor: '#4F46E5', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 6 },
  primaryButtonText: { color: '#fff', fontWeight: '700' },
  ghostButton: { marginTop: 10, alignItems: 'center' },
  ghostText: { color: '#9BA3AF' },
  error: { color: '#FF6B6B', marginBottom: 8 },
});
