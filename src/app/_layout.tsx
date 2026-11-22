import { QuotesProvider } from '@/context/quotes';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <QuotesProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#FFF8F0' },
        }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="quote/[id]"
          options={{ presentation: 'modal', gestureEnabled: true }}
        />
        <Stack.Screen
          name="quote/[id]/edit"
          options={{ presentation: 'modal', gestureEnabled: true }}
        />
      </Stack>
    </QuotesProvider>
  );
}
