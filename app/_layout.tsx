import { Stack } from 'expo-router';
import { AuthProvider } from '../contexts/AuthContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="forgot-password" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="guide-details" />
        <Stack.Screen name="first-aid-details" />
        <Stack.Screen name="preparedness-details" />
        <Stack.Screen name="emergency-contacts" />
        <Stack.Screen name="favorites" />
        <Stack.Screen name="notifications" />
        <Stack.Screen name="create-guide" />
        <Stack.Screen name="edit-guide" />
        <Stack.Screen name="edit-profile" />
      </Stack>
    </AuthProvider>
  );
}
