import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ParallaxScrollView } from 'react-native-parallax-flow';
import { BackButton, Filler } from '../components/Showcase';

export default function ContentHeader() {
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.root}>
      <BackButton variant="minimal" />
      <ParallaxScrollView
        parallaxFactor={0.5}
        headerStyle={styles.header}
        // Seamless flat body — no radius, the header color bleeds straight
        // into the page like an editorial layout.
        bodyStyle={styles.body}
        header={
          <View style={[styles.headerInner, { paddingTop: insets.top + 56 }]}>
            <Text style={styles.kicker}>AUTO-HEIGHT HEADER</Text>
            <Text style={styles.title}>The header sizes itself</Text>
            <Text style={styles.subtitle}>
              No headerHeight prop. The header is as tall as its content and
              eases away at half scroll speed as you scroll down.
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
  root: { flex: 1, backgroundColor: '#4f46e5' },
  header: { backgroundColor: '#4f46e5' },
  body: {
    backgroundColor: '#ffffff',
    borderTopWidth: 3,
    borderTopColor: '#c7d2fe',
  },
  headerInner: { paddingHorizontal: 24, paddingBottom: 44, gap: 8 },
  kicker: { color: '#c7d2fe', fontSize: 11, fontWeight: '700', letterSpacing: 1.5 },
  title: { color: '#ffffff', fontSize: 30, fontWeight: '800' },
  subtitle: { color: '#e0e7ff', fontSize: 15, lineHeight: 22 },
});
