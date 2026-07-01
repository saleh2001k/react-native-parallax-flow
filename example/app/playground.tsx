import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ParallaxScrollView } from 'react-native-parallax-flow';
import { BackButton, Filler } from '../components/Showcase';

const FACTORS = [0, 0.25, 0.5, 0.75, 1];

export default function Playground() {
  const insets = useSafeAreaInsets();
  const [factor, setFactor] = useState(0.5);
  const [fixed, setFixed] = useState(true);

  return (
    <View style={styles.root}>
      <BackButton />
      <ParallaxScrollView
        // key forces a remount when switching header mode so layout is clean
        key={fixed ? 'fixed' : 'auto'}
        headerHeight={fixed ? 260 : undefined}
        parallaxFactor={factor}
        headerStyle={styles.header}
        // Asymmetric radius — one swept corner, editorial look.
        bodyStyle={styles.body}
        header={
          <View style={[styles.headerInner, { paddingTop: insets.top + 52 }]}>
            <Text style={styles.title}>Playground</Text>
            <Text style={styles.subtitle}>
              factor {factor} · {fixed ? 'fixed' : 'auto'} header
            </Text>

            <View style={styles.controls}>
              <Text style={styles.label}>parallaxFactor</Text>
              <View style={styles.pillRow}>
                {FACTORS.map(f => (
                  <Pressable
                    key={f}
                    onPress={() => setFactor(f)}
                    style={[styles.pill, factor === f && styles.pillActive]}
                  >
                    <Text
                      style={[
                        styles.pillText,
                        factor === f && styles.pillTextActive,
                      ]}
                    >
                      {f}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <Text style={styles.label}>header mode</Text>
              <View style={styles.pillRow}>
                <Pressable
                  onPress={() => setFixed(true)}
                  style={[styles.pill, fixed && styles.pillActive]}
                >
                  <Text style={[styles.pillText, fixed && styles.pillTextActive]}>
                    fixed
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => setFixed(false)}
                  style={[styles.pill, !fixed && styles.pillActive]}
                >
                  <Text style={[styles.pillText, !fixed && styles.pillTextActive]}>
                    auto
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        }
      >
        <Filler count={10} />
      </ParallaxScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#7c3aed' },
  header: { backgroundColor: '#7c3aed' },
  body: {
    backgroundColor: '#faf5ff',
    borderTopLeftRadius: 48,
    borderTopRightRadius: 0,
  },
  headerInner: { paddingHorizontal: 24, paddingBottom: 28, gap: 6 },
  title: { color: '#ffffff', fontSize: 28, fontWeight: '800' },
  subtitle: { color: '#ddd6fe', fontSize: 14 },
  controls: { marginTop: 16, gap: 8 },
  label: {
    color: '#ede9fe',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  pillRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 4 },
  pill: {
    backgroundColor: 'rgba(255,255,255,0.16)',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 16,
  },
  pillActive: { backgroundColor: '#ffffff' },
  pillText: { color: '#ffffff', fontWeight: '700', fontSize: 13 },
  pillTextActive: { color: '#7c3aed' },
});
