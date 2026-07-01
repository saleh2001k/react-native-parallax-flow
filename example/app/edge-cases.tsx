import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ParallaxScrollView } from 'react-native-parallax-flow';
import { BackButton } from '../components/Showcase';

type Case = 'factor0' | 'factor1' | 'short' | 'emptyHeader';

const CASES: { id: Case; label: string }[] = [
  { id: 'factor0', label: 'factor 0' },
  { id: 'factor1', label: 'factor 1' },
  { id: 'short', label: 'short body' },
  { id: 'emptyHeader', label: 'no header' },
];

export default function EdgeCases() {
  const insets = useSafeAreaInsets();
  const [active, setActive] = useState<Case>('factor0');

  const factor = active === 'factor1' ? 1 : active === 'factor0' ? 0 : 0.5;
  const header =
    active === 'emptyHeader' ? null : (
      <View style={[styles.headerInner, { paddingTop: insets.top + 52 }]}>
        <Text style={styles.title}>Edge cases</Text>
        <Text style={styles.subtitle}>{describe(active)}</Text>
      </View>
    );

  return (
    <View style={styles.root}>
      <BackButton />

      <ParallaxScrollView
        key={active}
        headerHeight={active === 'emptyHeader' ? 0 : 200}
        parallaxFactor={factor}
        headerStyle={styles.header}
        bodyStyle={styles.body}
        header={header}
      >
        <View style={styles.bodyContent}>
          <View style={styles.switcher}>
            {CASES.map(c => (
              <Pressable
                key={c.id}
                onPress={() => setActive(c.id)}
                style={[styles.pill, active === c.id && styles.pillActive]}
              >
                <Text
                  style={[styles.pillText, active === c.id && styles.pillTextActive]}
                >
                  {c.label}
                </Text>
              </Pressable>
            ))}
          </View>

          {active === 'short' ? (
            <Text style={styles.note}>
              Only one short paragraph here. The body still fills the viewport
              because the ScrollView content uses flexGrow: 1 — no awkward gap
              under the body.
            </Text>
          ) : (
            Array.from({ length: 8 }).map((_, i) => (
              <Text key={i} style={styles.note}>
                Row {i + 1}. {describe(active)}
              </Text>
            ))
          )}
        </View>
      </ParallaxScrollView>
    </View>
  );
}

function describe(c: Case): string {
  switch (c) {
    case 'factor0':
      return 'parallaxFactor 0 → header scrolls away at full speed (no parallax).';
    case 'factor1':
      return 'parallaxFactor 1 → header fully pinned, body slides over it.';
    case 'short':
      return 'Body shorter than the screen still fills it.';
    case 'emptyHeader':
      return 'headerHeight 0 + null header → degrades to a plain scroll.';
  }
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#be123c' },
  header: { backgroundColor: '#be123c' },
  body: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  headerInner: { paddingHorizontal: 24, paddingBottom: 24, gap: 6 },
  title: { color: '#ffffff', fontSize: 28, fontWeight: '800' },
  subtitle: { color: '#fecdd3', fontSize: 14, lineHeight: 20 },
  bodyContent: { padding: 20, gap: 14 },
  switcher: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  pill: {
    backgroundColor: '#fee2e2',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 16,
  },
  pillActive: { backgroundColor: '#be123c' },
  pillText: { color: '#be123c', fontWeight: '700', fontSize: 13 },
  pillTextActive: { color: '#ffffff' },
  note: { fontSize: 14, lineHeight: 21, color: '#4b5563' },
});
