import { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, TextInput, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { useAppDispatch } from '../../redux/store';
import { setCredentials } from '../../redux/slices/authSlice';
import { apiClient } from '../../api/client';
import { Colors, FontSize, FontWeight, Spacing, Radius, Shadow } from '../../theme/tokens';

export default function LoginScreen({ navigation }: any) {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(30);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  // Handle OTP countdown timer
  useEffect(() => {
    let timer: any;
    if (step === 'otp' && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  const handleContinue = () => {
    if (tab === 'register' && !name.trim()) {
      setError('Please enter your name');
      return;
    }
    if (phone.length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    setError('');
    setLoading(true);
    
    // Simulate sending OTP
    setTimeout(() => {
      setLoading(false);
      setStep('otp');
      setCountdown(30);
    }, 800);
  };

  const handleKeyPress = (num: string) => {
    if (step === 'otp') {
      const firstEmptyIndex = otp.findIndex((val) => val === '');
      if (firstEmptyIndex !== -1) {
        const newOtp = [...otp];
        newOtp[firstEmptyIndex] = num;
        setOtp(newOtp);
        
        // Auto-verify if all 6 digits entered
        if (firstEmptyIndex === 5) {
          verifyOtp(newOtp.join(''));
        }
      }
    }
  };

  const handleBackspace = () => {
    if (step === 'otp') {
      // Find the last filled index
      const filledIndices = otp.map((val, idx) => val !== '' ? idx : -1).filter(idx => idx !== -1);
      if (filledIndices.length > 0) {
        const lastFilledIndex = filledIndices[filledIndices.length - 1];
        const newOtp = [...otp];
        newOtp[lastFilledIndex] = '';
        setOtp(newOtp);
      }
    }
  };

  const verifyOtp = async (code: string) => {
    setError('');
    setLoading(true);

    const emailMock = `phone_${phone}@smartqueue.com`;
    const passwordMock = 'Password@123';
    const nameMock = name || `User ${phone.slice(-4)}`;

    try {
      // 1. Try to register
      try {
        const { data } = await apiClient.post('/auth/register', {
          name: nameMock,
          email: emailMock,
          phone: phone,
          password: passwordMock,
        });
        dispatch(setCredentials({
          user: data.data.user,
          accessToken: data.data.accessToken,
          refreshToken: data.data.refreshToken,
        }));
        return;
      } catch (regErr: any) {
        // If user already exists, register will fail. Then we login instead.
        if (regErr.response?.status === 400 || regErr.response?.data?.message?.includes('exists')) {
          const { data } = await apiClient.post('/auth/login/customer', {
            email: emailMock,
            password: passwordMock,
          });
          dispatch(setCredentials({
            user: data.data.user,
            accessToken: data.data.accessToken,
            refreshToken: data.data.refreshToken,
          }));
          return;
        }
        throw regErr;
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Verification failed. Try again.');
      setOtp(['', '', '', '', '', '']); // Reset on error
    } finally {
      setLoading(false);
    }
  };

  const formattedCountdown = `00:${countdown.toString().padStart(2, '0')}`;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        
        {/* Top App Bar Header */}
        <View style={styles.header}>
          <Text style={styles.logoIcon}>🛒</Text>
          <Text style={styles.logoTitle}>SmartQueue</Text>
          <Text style={styles.logoSubtitle}>Smart Shopping. No Waiting.</Text>
        </View>

        {step === 'form' ? (
          <View style={styles.formCard}>
            {/* Login / Register Tab Switcher */}
            <View style={styles.tabContainer}>
              <TouchableOpacity 
                style={[styles.tabButton, tab === 'login' && styles.tabActive]}
                onPress={() => { setTab('login'); setError(''); }}
              >
                <Text style={[styles.tabText, tab === 'login' && styles.tabTextActive]}>Login</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.tabButton, tab === 'register' && styles.tabActive]}
                onPress={() => { setTab('register'); setError(''); }}
              >
                <Text style={[styles.tabText, tab === 'register' && styles.tabTextActive]}>Register</Text>
              </TouchableOpacity>
            </View>

            {/* Inputs */}
            {tab === 'register' && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Name</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your name"
                  placeholderTextColor={Colors.textLight}
                  value={name}
                  onChangeText={setName}
                />
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Mobile Number</Text>
              <View style={styles.phoneInputRow}>
                <Text style={styles.countryCode}>+91</Text>
                <View style={styles.divider} />
                <TextInput
                  style={styles.phoneInput}
                  placeholder="Enter mobile number"
                  placeholderTextColor={Colors.textLight}
                  keyboardType="phone-pad"
                  maxLength={10}
                  value={phone}
                  onChangeText={setPhone}
                />
              </View>
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TouchableOpacity 
              style={[styles.btnContinue, phone.length === 10 ? styles.btnActive : styles.btnInactive]}
              onPress={handleContinue}
              disabled={loading || phone.length < 10}
            >
              {loading ? (
                <ActivityIndicator color={Colors.white} size="small" />
              ) : (
                <Text style={styles.btnContinueText}>Continue</Text>
              )}
            </TouchableOpacity>

            <View style={styles.orRow}>
              <View style={styles.line} />
              <Text style={styles.orText}>OR</Text>
              <View style={styles.line} />
            </View>

            {/* Social Buttons */}
            <TouchableOpacity style={styles.btnSocial}>
              <Text style={styles.socialIcon}>🌐</Text>
              <Text style={styles.socialText}>Continue with Google</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btnSocial}>
              <Text style={styles.socialIcon}>🍎</Text>
              <Text style={styles.socialText}>Continue with Apple</Text>
            </TouchableOpacity>

            <Text style={styles.termsText}>
              By continuing, you agree to our{"\n"}
              <Text style={styles.termsBold}>Terms & Conditions</Text>
            </Text>
          </View>
        ) : (
          <View style={styles.otpCard}>
            <TouchableOpacity 
              style={styles.backBtn}
              onPress={() => { setStep('form'); setError(''); setOtp(['', '', '', '', '', '']); }}
            >
              <Text style={styles.backBtnText}>← Enter OTP</Text>
            </TouchableOpacity>

            <Text style={styles.otpSubtitle}>
              We've sent a 6-digit OTP to{"\n"}
              <Text style={styles.otpPhoneText}>+91 {phone.slice(0,5)} {phone.slice(5)}</Text>
            </Text>

            {/* 6 OTP boxes */}
            <View style={styles.otpBoxesRow}>
              {otp.map((val, index) => (
                <View key={index} style={[styles.otpBox, val !== '' && styles.otpBoxFilled]}>
                  <Text style={styles.otpBoxValue}>{val}</Text>
                </View>
              ))}
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <View style={styles.resendRow}>
              {countdown > 0 ? (
                <Text style={styles.resendText}>Resend OTP in <Text style={styles.timerBold}>{formattedCountdown}</Text></Text>
              ) : (
                <TouchableOpacity onPress={() => { setCountdown(30); setError(''); setOtp(['', '', '', '', '', '']); }}>
                  <Text style={styles.resendActiveText}>Resend OTP</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Custom On-screen Numeric Keyboard */}
            <View style={styles.keyboard}>
              <View style={styles.keyboardRow}>
                {['1', '2', '3'].map((n) => (
                  <TouchableOpacity key={n} style={styles.key} onPress={() => handleKeyPress(n)}>
                    <Text style={styles.keyText}>{n}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.keyboardRow}>
                {['4', '5', '6'].map((n) => (
                  <TouchableOpacity key={n} style={styles.key} onPress={() => handleKeyPress(n)}>
                    <Text style={styles.keyText}>{n}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.keyboardRow}>
                {['7', '8', '9'].map((n) => (
                  <TouchableOpacity key={n} style={styles.key} onPress={() => handleKeyPress(n)}>
                    <Text style={styles.keyText}>{n}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.keyboardRow}>
                <View style={styles.keyEmpty} />
                <TouchableOpacity style={styles.key} onPress={() => handleKeyPress('0')}>
                  <Text style={styles.keyText}>0</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.key} onPress={handleBackspace}>
                  <Text style={styles.keyText}>⌫</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  header: { alignItems: 'center', marginVertical: Spacing.xl },
  logoIcon: { fontSize: 44, marginBottom: Spacing.xs },
  logoTitle: { fontSize: FontSize.xl, fontWeight: FontWeight.extrabold, color: Colors.primary },
  logoSubtitle: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: Spacing.xs, fontWeight: FontWeight.semibold },

  formCard: { flex: 1, paddingHorizontal: Spacing.xl },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceAlt,
    borderRadius: Radius.md,
    padding: 4,
    marginBottom: Spacing.xl,
  },
  tabButton: { flex: 1, height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: Radius.sm },
  tabActive: { backgroundColor: Colors.white, ...Shadow.sm },
  tabText: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.textMuted },
  tabTextActive: { color: Colors.text },

  inputGroup: { marginBottom: Spacing.lg },
  label: { fontSize: FontSize.xs, fontWeight: FontWeight.bold, color: Colors.textMuted, marginBottom: Spacing.sm },
  textInput: {
    height: 52,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.base,
    fontSize: FontSize.base,
    color: Colors.text,
    backgroundColor: Colors.white,
  },
  phoneInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.base,
    height: 52,
    backgroundColor: Colors.white,
  },
  countryCode: { fontSize: FontSize.base, fontWeight: FontWeight.bold, color: Colors.text },
  divider: { width: 1, height: 20, backgroundColor: Colors.border, marginHorizontal: Spacing.md },
  phoneInput: { flex: 1, fontSize: FontSize.base, color: Colors.text },

  errorText: { color: Colors.danger, fontSize: FontSize.xs, fontWeight: FontWeight.semibold, marginBottom: Spacing.md, textAlign: 'center' },
  btnContinue: {
    height: 52,
    borderRadius: Radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  btnActive: {
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  btnInactive: { backgroundColor: Colors.border },
  btnContinueText: { color: Colors.white, fontSize: FontSize.base, fontWeight: FontWeight.bold },

  orRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.lg },
  line: { flex: 1, height: 1, backgroundColor: Colors.border },
  orText: { marginHorizontal: Spacing.md, fontSize: FontSize.xs, color: Colors.textLight, fontWeight: FontWeight.bold },

  btnSocial: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    marginBottom: Spacing.md,
    backgroundColor: Colors.white,
  },
  socialIcon: { fontSize: 20, marginRight: Spacing.md },
  socialText: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.text },
  termsText: { textAlign: 'center', color: Colors.textMuted, fontSize: FontSize.xs, marginTop: Spacing.xl, lineHeight: 18 },
  termsBold: { color: Colors.text, fontWeight: FontWeight.bold },

  // OTP Verification Card
  otpCard: { flex: 1, paddingHorizontal: Spacing.xl },
  backBtn: { alignSelf: 'flex-start', marginBottom: Spacing.lg },
  backBtnText: { fontSize: FontSize.lg, fontWeight: FontWeight.extrabold, color: Colors.text },
  otpSubtitle: { fontSize: FontSize.sm, color: Colors.textMuted, lineHeight: 20, marginBottom: Spacing.xl },
  otpPhoneText: { color: Colors.text, fontWeight: FontWeight.bold },

  otpBoxesRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.xl },
  otpBox: {
    width: 48,
    height: 48,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.surfaceAlt,
  },
  otpBoxFilled: { borderColor: Colors.primary, backgroundColor: Colors.white },
  otpBoxValue: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.text },

  resendRow: { alignItems: 'center', marginBottom: Spacing.xl },
  resendText: { fontSize: FontSize.sm, color: Colors.textMuted },
  timerBold: { color: Colors.text, fontWeight: FontWeight.bold },
  resendActiveText: { color: Colors.secondary, fontWeight: FontWeight.bold, fontSize: FontSize.sm },

  // Numeric keyboard style
  keyboard: { marginTop: 'auto', marginBottom: Spacing.md },
  keyboardRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.sm },
  key: { flex: 1, height: 50, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.surfaceAlt, marginHorizontal: 4, borderRadius: Radius.sm },
  keyEmpty: { flex: 1, marginHorizontal: 4 },
  keyText: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.text },
});
