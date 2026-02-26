import { useRouter } from 'expo-router';
import { Alert, Image, Pressable, SafeAreaView, StyleSheet, Text } from 'react-native';
import { getCurrentUser, signOut } from '../utils/firebase';

export default function Profile() {
  const router = useRouter();
  const user = getCurrentUser();

  const onSignOut = async () => {
    try {
      await signOut();
      router.replace('/');
    } catch (e: any) {
      Alert.alert('Sign out failed', e?.message || String(e));
    }
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.notSigned}>Not signed in</Text>
        <Pressable style={styles.primaryButton} onPress={() => router.push('./login')}>
          <Text style={styles.primaryButtonText}>Login</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Image source={{ uri: user.photoURL || undefined }} style={styles.photo} />
      <Text style={styles.name}>{user.displayName || user.email}</Text>
      <Text style={styles.email}>{user.email}</Text>
      <Pressable style={styles.primaryButton} onPress={onSignOut}>
        <Text style={styles.primaryButtonText}>Sign out</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#0A043C', alignItems: 'center', justifyContent: 'center' },
  notSigned: { color: '#fff', marginBottom: 12 },
  photo: { width: 120, height: 120, borderRadius: 60, marginBottom: 12, backgroundColor: '#071039' },
  name: { color: '#fff', fontSize: 18, fontWeight: '600' },
  email: { color: '#9BA3AF', marginBottom: 20 },
  primaryButton: { backgroundColor: '#4F46E5', padding: 12, borderRadius: 8, alignItems: 'center', width: '60%' },
  primaryButtonText: { color: '#fff', fontWeight: '700' },
});
