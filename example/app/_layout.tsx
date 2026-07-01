import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: '#0f1117' },
            headerTintColor: '#fafafa',
            headerTitleStyle: { fontWeight: '700' },
            contentStyle: { backgroundColor: '#0f1117' },
          }}
        >
          <Stack.Screen
            name="index"
            options={{ title: 'Parallax Flow', headerShown: false }}
          />
          <Stack.Screen
            name="artist"
            options={{ title: 'Artist page', headerShown: false }}
          />
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
            name="travel"
            options={{ title: 'Travel destination', headerShown: false }}
          />
          <Stack.Screen
            name="event"
            options={{ title: 'Event tickets', headerShown: false }}
          />
          <Stack.Screen
            name="restaurant"
            options={{ title: 'Restaurant menu', headerShown: false }}
          />
          <Stack.Screen
            name="space"
            options={{ title: 'Solar system', headerShown: false }}
          />
          <Stack.Screen
            name="magazine"
            options={{ title: 'Magazine cover', headerShown: false }}
          />
          <Stack.Screen
            name="boarding-pass"
            options={{ title: 'Boarding pass', headerShown: false }}
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
