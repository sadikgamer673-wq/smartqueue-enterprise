import { View, StyleSheet, ScrollView, TouchableOpacity, Text, Alert, SafeAreaView, Platform } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { setCredentials } from '../../redux/slices/authSlice';
import { Colors, FontSize, FontWeight, Spacing, Radius, Shadow } from '../../theme/tokens';

export default function ProfileScreen({ navigation }: any) {
  const user = useAppSelector((s) => s.auth.user);
  const dispatch = useAppDispatch();

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out from SmartQueue?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: () => {
          // Clear credentials
          dispatch(setCredentials({ user: null, accessToken: null, refreshToken: null }));
        },
      },
    ]);
  };

  const menuSections = [
    {
      title: 'Shopping',
      items: [
        { icon: '📦', label: 'My Orders', target: 'Orders' },
        { icon: '🎟️', label: 'Coupons & Offers', target: 'Home' }, // links back to home section
        { icon: '⭐', label: 'Wishlist', target: 'Home' },
      ],
    },
    {
      title: 'Account Settings',
      items: [
        { icon: '🔔', label: 'Notifications', target: 'Home' },
        { icon: '🔒', label: 'Privacy & Security', target: 'Home' },
        { icon: 'ℹ️', label: 'Help & Support', target: 'Home' },
      ],
    },
  ];

  const firstLetter = user?.name ? user.name[0].toUpperCase() : 'G';

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Block */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Profile</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* User Card */}
        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{firstLetter}</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.name || 'Guest User'}</Text>
            <Text style={styles.userEmail}>{user?.email || 'guest@smartqueue.com'}</Text>
            <Text style={styles.userPhone}>+91 {user?.phone || '9999999999'}</Text>
          </View>
        </View>

        {/* Menu Cards */}
        {menuSections.map((section, idx) => (
          <View key={idx} style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.menuCard}>
              {section.items.map((item, itemIdx) => (
                <View key={itemIdx}>
                  <TouchableOpacity 
                    style={styles.menuItem}
                    onPress={() => navigation.navigate(item.target)}
                  >
                    <View style={styles.menuItemLeft}>
                      <Text style={styles.menuIcon}>{item.icon}</Text>
                      <Text style={styles.menuLabel}>{item.label}</Text>
                    </View>
                    <Text style={styles.chevron}>→</Text>
                  </TouchableOpacity>
                  {itemIdx < section.items.length - 1 && <View style={styles.divider} />}
                </View>
              ))}
            </View>
          </View>
        ))}

        {/* Sign Out Card */}
        <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
          <Text style={styles.signOutText}>Sign Out Account</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>SmartQueue Enterprise  ·  v1.0.0</Text>
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingTop: Platform.OS === 'ios' ? 44 : 20,
  },
  headerTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.text },
  
  scroll: { padding: Spacing.lg },
  
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.xl,
    ...Shadow.sm,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.primaryDark },
  userInfo: { flex: 1, paddingLeft: Spacing.lg },
  userName: { fontSize: FontSize.base, fontWeight: FontWeight.bold, color: Colors.text },
  userEmail: { fontSize: FontSize.sm, color: Colors.textMuted, marginTop: 2 },
  userPhone: { fontSize: FontSize.xs, color: Colors.textLight, marginTop: 2 },

  sectionContainer: { marginBottom: Spacing.xl },
  sectionTitle: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: Spacing.sm, paddingLeft: Spacing.xs },
  menuCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.sm,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.base,
  },
  menuItemLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  menuIcon: { fontSize: FontSize.base },
  menuLabel: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.text },
  chevron: { fontSize: FontSize.base, color: Colors.textLight, fontWeight: FontWeight.bold },
  divider: { height: 1, backgroundColor: Colors.border, marginHorizontal: Spacing.base },

  signOutBtn: {
    height: 52,
    borderWidth: 1.5,
    borderColor: Colors.danger,
    borderRadius: Radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
    marginBottom: Spacing.xl,
  },
  signOutText: { color: Colors.danger, fontWeight: FontWeight.bold, fontSize: FontSize.base },
  versionText: { fontSize: FontSize.xs, color: Colors.textLight, textAlign: 'center', marginTop: Spacing.sm },
});
