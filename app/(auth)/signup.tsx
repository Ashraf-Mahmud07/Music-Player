// Image upload removed from signup; profile photo is managed on Profile page
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    ActivityIndicator,
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
import Icon from 'react-native-vector-icons/Ionicons';
import { signUpWithEmail } from '../utils/firebase';

export default function Signup() {
        const [name, setName] = useState('');
        const [email, setEmail] = useState('');
        const [password, setPassword] = useState('');
        const [confirm, setConfirm] = useState('');
        const [loading, setLoading] = useState(false);
        const [error, setError] = useState<string | null>(null);
        const [showPassword, setShowPassword] = useState(false);
        const [showConfirm, setShowConfirm] = useState(false);
        const router = useRouter();
        const passwordMismatch = password.length > 0 && confirm.length > 0 && password !== confirm;

        const onSignup = async () => {
            setError(null);
            if (!email || !password) return setError('Provide email and password');
            if (password !== confirm) return setError('Passwords do not match');
            setLoading(true);
            try {
                await signUpWithEmail({ name, email, password });
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
                    <View style={styles.headerBox}>
                        <LinearGradient colors={["#6D28D9", "#4F46E5"]} style={styles.logoCircle}>
                            <Image source={require('../../assets/images/favicon.png')} style={styles.logo} />
                        </LinearGradient>
                        <Text style={styles.welcome}>Create account</Text>
                        <Text style={styles.subtitle}>Join Music Player — it only takes a minute</Text>
                    </View>

                    <View style={styles.card}>
                        {error ? <Text style={styles.error}>{error}</Text> : null}

                        <View style={styles.inputRow}>
                            <Icon name="person-outline" size={18} color="#666" style={styles.inputIcon} />
                            <TextInput placeholder="Name" placeholderTextColor="#666" value={name} onChangeText={setName} style={styles.inputInner} />
                        </View>

                        <View style={styles.inputRow}>
                            <Icon name="mail-outline" size={18} color="#666" style={styles.inputIcon} />
                            <TextInput placeholder="Email" placeholderTextColor="#666" value={email} onChangeText={setEmail} style={styles.inputInner} keyboardType="email-address" autoCapitalize="none" />
                        </View>

                        <View style={styles.inputRow}>
                            <Icon name="lock-closed-outline" size={18} color="#666" style={styles.inputIcon} />
                            <TextInput
                                placeholder="Password"
                                placeholderTextColor="#666"
                                value={password}
                                onChangeText={setPassword}
                                style={styles.inputInner}
                                secureTextEntry={!showPassword}
                            />
                            <Pressable onPress={() => setShowPassword((s) => !s)} style={styles.eyeButton} accessibilityRole="button">
                                <Icon name={showPassword ? 'eye' : 'eye-off'} size={18} color="#666" />
                            </Pressable>
                        </View>

                        <View style={styles.inputRow}>
                            <Icon name="lock-closed" size={18} color="#666" style={styles.inputIcon} />
                            <TextInput
                                placeholder="Confirm password"
                                placeholderTextColor="#666"
                                value={confirm}
                                onChangeText={setConfirm}
                                style={styles.inputInner}
                                secureTextEntry={!showConfirm}
                            />
                            <Pressable onPress={() => setShowConfirm((s) => !s)} style={styles.eyeButton} accessibilityRole="button">
                                <Icon name={showConfirm ? 'eye' : 'eye-off'} size={18} color="#666" />
                            </Pressable>
                        </View>

                        {passwordMismatch ? (
                            <Text style={styles.fieldError}>Passwords do not match</Text>
                        ) : null}

                        <Pressable onPress={onSignup} disabled={loading || passwordMismatch} accessibilityRole="button">
                            <LinearGradient colors={["#6D28D9", "#4F46E5"]} style={[styles.primaryButton, (loading || passwordMismatch) && styles.primaryButtonDisabled]}>
                                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryButtonText}>Sign up</Text>}
                            </LinearGradient>
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
    headerBox: { alignItems: 'center', marginBottom: 18 },
    logoCircle: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
    logo: { width: 40, height: 40, resizeMode: 'contain' },
    welcome: { color: '#fff', fontSize: 20, fontWeight: '700' },
    subtitle: { color: '#9BA3AF', fontSize: 13, marginTop: 6 },
    card: { backgroundColor: '#071039', borderRadius: 12, padding: 20, shadowColor: '#000', shadowOpacity: 0.2 },
    inputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 8, marginBottom: 10, paddingHorizontal: 10 },
    inputIcon: { marginRight: 8 },
    inputInner: { flex: 1, paddingVertical: 12 },
    title: { color: '#fff', fontSize: 20, fontWeight: '700', marginBottom: 12 },
    input: { backgroundColor: '#fff', padding: 12, borderRadius: 8, marginBottom: 10 },
    eyeButton: { paddingHorizontal: 8, paddingVertical: 8 },
    primaryButton: { backgroundColor: '#4F46E5', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 6 },
    primaryButtonText: { color: '#fff', fontWeight: '700' },
    primaryButtonDisabled: { opacity: 0.6 },
    fieldError: { color: '#FF6B6B', marginTop: 6, marginBottom: 6, fontSize: 13 },
    ghostButton: { marginTop: 10, alignItems: 'center' },
    ghostText: { color: '#9BA3AF' },
    error: { color: '#FF6B6B', marginBottom: 8 },
});
