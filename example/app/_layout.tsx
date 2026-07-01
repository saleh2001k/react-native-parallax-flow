import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: '#f9fafb' },
            headerTintColor: '#111827',
            headerTitleStyle: { fontWeight: '700' },
            contentStyle: { backgroundColor: '#f9fafb' },
          }}
        >
          <Stack.Screen name="index" options={{ title: 'Parallax Flow' }} />
          <Stack.Screen
            name="content-header"
            options={{ title: 'Auto-height header', headerShown: false }}
          />
          <Stack.Screen
            name="fixed-header"
            options={{ title: 'Fixed header + zoom', headerShown: false }}
          />
          <Stack.Screen
            name="image-header"
            options={{ title: 'Image hero', headerShown: false }}
          />
          <Stack.Screen
            name="layers"
            options={{ title: 'Multi-layer depth', headerShown: false }}
          />
          <Stack.Screen
            name="profile"
            options={{ title: 'Social profile', headerShown: false }}
          />
          <Stack.Screen
            name="product"
            options={{ title: 'Product detail', headerShown: false }}
          />
          <Stack.Screen
            name="playlist"
            options={{ title: 'Album playlist', headerShown: false }}
          />
          <Stack.Screen
            name="playground"
            options={{ title: 'Playground', headerShown: false }}
          />
          <Stack.Screen
            name="scroll-to-top"
            options={{ title: 'Programmatic scroll', headerShown: false }}
          />
          <Stack.Screen
            name="edge-cases"
            options={{ title: 'Edge cases', headerShown: false }}
          />
        </Stack>
      </SafeAreaProvider>
  );
}
