import { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, TextInput, TouchableOpacity } from 'react-native';
import { Text, HelperText } from 'react-native-paper';
import { useAppDispatch } from '../../redux/store';
import { setCredentials } from '../../redux/slices/authSlice';
import { apiClient } from '../../api/client';
import { Colors, FontSize, FontWeight, Spacing, Radius, Shadow } from '../../theme/tokens';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const { data } = await apiClient.post('/auth/login/worker', { email, password });
      dispatch(setCredentials({
        worker: data.data.user,
        accessToken: data.data.accessToken,
        refreshToken: data.data.refreshToken,
      }));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
      {/* Header Block */}
      <View style={styles.header}>
        <Text style={styles.logo}>👷</Text>
        <Text style={styles.appName}>SmartQueue Worker</Text>
        <Text style={styles.appTagline}>Exit gate verification portal</Text>
      </View>

      {/* Main Form Card */}
      <View style={styles.card}>
        <Text style={styles.title}>Welcome back 🔐</Text>
        <Text style={styles.subtitle}>Sign in with worker credentials to scan customer QR passes</Text>

        <Text style={styles.label}>Email Address</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. worker@smartqueue.com"
          placeholderTextColor={Colors.textLight}
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={[styles.label, { marginTop: 12 }]}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter password"
          placeholderTextColor={Colors.textLight}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <HelperText type="error" visible={!!error}>{error}</HelperText>

        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Signing in...' : 'Sign In'}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.primary },
  header: {
    height: '35%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingTop: Platform.OS === 'ios' ? 44 : 20,
  },
  logo: { fontSize: 60, marginBottom: Spacing.sm },
  appName: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.white },
  appTagline: { fontSize: FontSize.sm, color: '#DCFCE7', marginTop: Spacing.xs },
  card: {
    flex: 1,
    backgroundColor: Colors.background,
    borderTopLeftRadius: Radius.xl * 1.5,
    borderTopRightRadius: Radius.xl * 1.5,
    padding: Spacing.xl,
    ...Shadow.md,
  },
  title: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.text, marginBottom: Spacing.xs },
  subtitle: { fontSize: FontSize.sm, color: Colors.textMuted, marginBottom: Spacing.xl },
  label: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.text, marginBottom: Spacing.xs },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.base,
    height: 56,
    fontSize: FontSize.base,
    color: Colors.text,
  },
  button: {
    height: 54,
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.sm,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: { color: Colors.white, fontSize: FontSize.base, fontWeight: FontWeight.bold },
});
