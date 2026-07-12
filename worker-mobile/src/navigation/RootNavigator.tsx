import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppSelector } from '../redux/store';
import LandingScreen from '../screens/Landing/LandingScreen';
import LoginScreen from '../screens/Login/LoginScreen';
import DashboardScreen from '../screens/Dashboard/DashboardScreen';
import QRScannerScreen from '../screens/QRScanner/QRScannerScreen';
import VerificationScreen from '../screens/Verification/VerificationScreen';
import HistoryScreen from '../screens/History/HistoryScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false, tabBarActiveTintColor: '#16A34A' }}>
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="view-dashboard" color={color} size={size} /> }}
      />
      <Tab.Screen
        name="Scan"
        component={QRScannerScreen}
        options={{ tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="qrcode-scan" color={color} size={size} /> }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{ tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="history" color={color} size={size} /> }}
      />
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);

  if (!isAuthenticated) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Landing" component={LandingScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
      </Stack.Navigator>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen
        name="Verification"
        component={VerificationScreen}
        options={{ headerShown: true, title: 'Verify Order' }}
      />
    </Stack.Navigator>
  );
}
