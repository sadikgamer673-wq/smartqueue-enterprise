import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAppSelector } from '../redux/store';
import AuthNavigator from './AuthNavigator';
import MainTabNavigator from './MainTabNavigator';
import BarcodeScannerScreen from '../screens/BarcodeScanner/BarcodeScannerScreen';
import CartScreen from '../screens/Cart/CartScreen';
import CheckoutScreen from '../screens/Checkout/CheckoutScreen';
import PaymentScreen from '../screens/Payment/PaymentScreen';
import QRCodeScreen from '../screens/QRCode/QRCodeScreen';
import ProductDetailScreen from '../screens/Product/ProductDetailScreen';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);

  if (!isAuthenticated) {
    return <AuthNavigator />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />
      <Stack.Screen name="Scanner" component={BarcodeScannerScreen} options={{ headerShown: true, title: 'Scan Product' }} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} options={{ headerShown: true }} />
      <Stack.Screen name="Cart" component={CartScreen} options={{ headerShown: true, title: 'My Cart' }} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} options={{ headerShown: true, title: 'Checkout' }} />
      <Stack.Screen name="Payment" component={PaymentScreen} options={{ headerShown: true, title: 'Payment' }} />
      <Stack.Screen name="QRCode" component={QRCodeScreen} options={{ headerShown: true, title: 'Exit QR Code' }} />
    </Stack.Navigator>
  );
}
