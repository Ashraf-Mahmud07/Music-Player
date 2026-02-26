import { Slot, useRouter, useSegments } from 'expo-router';
import { SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function AuthLayout() {
  const router = useRouter();
  const segments = useSegments();
  const current = segments[segments.length - 1] || 'account';

  const titleMap: Record<string, string> = {
    profile: 'Profile',
    login: 'Login',
    signup: 'Create account',
    account: 'Account',
  };

  const title = titleMap[current] || 'Account';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.replace('/')}
          accessibilityRole="button"
          style={styles.back}
        >
          <Icon name="chevron-back" size={22} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.title}>{title}</Text>

        <View style={styles.rightPlaceholder} />
      </View>

      <Slot />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A043C' },
  header: {
    height: 64,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#0f1230',
    backgroundColor: '#0A043C',
  },
  back: { width: 44, alignItems: 'flex-start', justifyContent: 'center' },
  title: { color: '#fff', fontSize: 18, fontWeight: '700' },
  rightPlaceholder: { width: 44 },
});
