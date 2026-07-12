import { useState } from 'react';
import { View, StyleSheet, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Button, Text, HelperText } from 'react-native-paper';
import { useAppDispatch } from '../../redux/store';
import { setCredentials } from '../../redux/slices/authSlice';
import { apiClient } from '../../api/client';
import { Colors, FontSize, FontWeight, Spacing, Radius, Shadow } from '../../theme/tokens';

export default function RegisterScreen({ navigation }: any) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  const handleRegister = async () => {
    if (!form.name || !form.email || !form.phone || !form.password) {
      setError('Please fill in all fields');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const { data } = await apiClient.post('/auth/register', form);
      dispatch(setCredentials({
        user: data.data.user,
        accessToken: data.data.accessToken,
        refreshToken: data.data.refreshToken,
      }));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Header Block */}
        <View style={styles.header}>
          <Text style={styles.logo}>🛒</Text>
          <Text style={styles.appName}>SmartQueue</Text>
          <Text style={styles.appTagline}>Create an account to start shopping</Text>
        </View>

        {/* Form Panel */}
        <View style={styles.card}>
          <Text style={styles.title}>Get Started 🎉</Text>
          <Text style={styles.subtitle}>Fill in details to create your secure wallet & cart</Text>

          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Rahul Sharma"
            placeholderTextColor={Colors.textLight}
            value={form.name}
            onChangeText={(v) => setForm({ ...form, name: v })}
          />

          <Text style={[styles.label, { marginTop: 12 }]}>Email Address</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. rahul.sharma@gmail.com"
            placeholderTextColor={Colors.textLight}
            keyboardType="email-address"
            autoCapitalize="none"
            value={form.email}
            onChangeText={(v) => setForm({ ...form, email: v })}
          />

          <Text style={[styles.label, { marginTop: 12 }]}>Phone Number</Text>
          <View style={styles.phoneContainer}>
            <Text style={styles.countryCode}>+91</Text>
            <View style={styles.divider} />
            <TextInput
              style={styles.phoneInput}
              placeholder="e.g. 9876543210"
              placeholderTextColor={Colors.textLight}
              keyboardType="phone-pad"
              maxLength={10}
              value={form.phone}
              onChangeText={(v) => setForm({ ...form, phone: v })}
            />
          </View>

          <Text style={[styles.label, { marginTop: 12 }]}>Create Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Min 6 characters"
            placeholderTextColor={Colors.textLight}
            secureTextEntry
            value={form.password}
            onChangeText={(v) => setForm({ ...form, password: v })}
          />

          <HelperText type="error" visible={!!error}>{error}</HelperText>

          <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? 'Creating Account...' : 'Sign Up'}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.switchButton}>
            <Text style={styles.switchButtonText}>Already have an account? Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.primary },
  scroll: { flexGrow: 1 },
  header: {
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingTop: Platform.OS === 'ios' ? 44 : 20,
  },
  logo: { fontSize: 50, marginBottom: Spacing.xs },
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
  subtitle: { fontSize: FontSize.sm, color: Colors.textMuted, marginBottom: Spacing.lg },
  label: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.text, marginBottom: Spacing.xs },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.base,
    height: 54,
    fontSize: FontSize.base,
    color: Colors.text,
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.base,
    height: 54,
  },
  countryCode: { fontSize: FontSize.base, fontWeight: FontWeight.semibold, color: Colors.text },
  divider: { width: 1, height: 20, backgroundColor: Colors.border, marginHorizontal: Spacing.md },
  phoneInput: { flex: 1, fontSize: FontSize.base, color: Colors.text },
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
  switchButton: { alignSelf: 'center', marginTop: Spacing.lg, marginBottom: Spacing.xl },
  switchButtonText: { color: Colors.secondary, fontWeight: FontWeight.semibold, fontSize: FontSize.sm },
});
