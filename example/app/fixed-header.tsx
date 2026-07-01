import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ParallaxScrollView } from 'react-native-parallax-flow';
import { BackButton, bodySheetStyle, Filler } from '../components/Showcase';

const HEADER_HEIGHT = 280;

export default function FixedHeader() {
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.root}>
      <BackButton />
      <ParallaxScrollView
        headerHeight={HEADER_HEIGHT}
        parallaxFactor={0.5}
        headerStyle={styles.header}
        bodyStyle={bodySheetStyle}
        header={
          <View style={[styles.center, { paddingTop: insets.top }]}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>PULL ME DOWN</Text>
            </View>
            <Text style={styles.title}>Fixed header</Text>
            <Text style={styles.subtitle}>
              headerHeight = {HEADER_HEIGHT}. Pull past the top to zoom the
              header in.
            </Text>
          </View>
        }
      >
        <Filler count={10} />
      </ParallaxScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0f766e' },
  header: { backgroundColor: '#0f766e' },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
    gap: 10,
  },
  badge: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
  },
  badgeText: { color: '#ccfbf1', fontSize: 11, fontWeight: '700', letterSpacing: 1.5 },
  title: { color: '#ffffff', fontSize: 32, fontWeight: '800' },
  subtitle: { color: '#99f6e4', fontSize: 14, textAlign: 'center', lineHeight: 21 },
});
