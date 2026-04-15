import { Stack } from 'expo-router';
// NativeWind setup implies importing the CSS, but natively Expo 51+ Nativewind v2 doesn't need global css imports.
// It just translates Tailwind to Stylesheet injected components.

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#faf9f6' } }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(volunteer)" />
      <Stack.Screen name="(coordinator)" />
    </Stack>
  );
}
