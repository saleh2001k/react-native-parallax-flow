import React from 'react';
import { Link } from 'expo-router';
import type { Href } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Item {
  href: Href;
  tag: string;
  title: string;
  subtitle: string;
}

const ITEMS: Item[] = [
  {
    href: '/profile',
    tag: 'real app',
    title: 'Social profile',
    subtitle: 'Cover photo, fade-in navbar on scroll, stats + photo grid',
  },
  {
    href: '/product',
    tag: 'real app',
    title: 'Product detail',
    subtitle: 'E-commerce hero, fade-in title bar, sticky add-to-cart',
  },
  {
    href: '/playlist',
    tag: 'real app',
    title: 'Album playlist',
    subtitle: 'Spotify-style artwork header, fade-in bar, track list',
  },
  {
    href: '/content-header',
    tag: 'basics',
    title: 'Auto-height header',
    subtitle: 'Header sizes to content, parallax counter-scroll',
  },
  {
    href: '/fixed-header',
    tag: 'basics',
    title: 'Fixed header + pull-to-zoom',
    subtitle: 'headerHeight set; pull past top to zoom in',
  },
  {
    href: '/image-header',
    tag: 'recipe',
    title: 'Image hero',
    subtitle: 'Full-bleed image header over a long list',
  },
  {
    href: '/layers',
    tag: 'recipe',
    title: 'Multi-layer depth',
    subtitle: 'Stacked layers at different speeds (a mountain scene)',
  },
  {
    href: '/playground',
    tag: 'interactive',
    title: 'Playground',
    subtitle: 'Live-tweak parallaxFactor + header mode',
  },
  {
    href: '/scroll-to-top',
    tag: 'ref',
    title: 'Programmatic scroll',
    subtitle: 'forwardRef → scrollTo from a floating button',
  },
  {
    href: '/edge-cases',
    tag: 'edge',
    title: 'Edge cases',
    subtitle: 'factor 0 / 1, short content, empty header',
  },
];

export default function Home() {
  const insets = useSafeAreaInsets();
  return (
    <ScrollView
      contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 12 }]}
    >
      <Text style={styles.heading}>react-native-parallax-flow</Text>
      <Text style={styles.sub}>Parallax header · pull-to-zoom · body slides over</Text>

      <View style={styles.section}>
        {ITEMS.map(item => (
          <Link key={String(item.href)} href={item.href} asChild>
            <Pressable
              style={({ pressed }) => [styles.row, pressed && { opacity: 0.7 }]}
            >
              <View style={styles.rowMain}>
                <Text style={styles.rowTag}>{item.tag}</Text>
                <Text style={styles.rowTitle}>{item.title}</Text>
                <Text style={styles.rowSub}>{item.subtitle}</Text>
              </View>
              <Text style={styles.chev}>›</Text>
            </Pressable>
          </Link>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 20, gap: 20 },
  heading: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
    textAlign: 'center',
  },
  sub: {
    fontSize: 13,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 4,
  },
  section: { gap: 12 },
  row: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  rowMain: { flex: 1, gap: 2 },
  rowTag: {
    fontSize: 10,
    fontWeight: '600',
    color: '#6366f1',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  rowTitle: { fontSize: 15, fontWeight: '600', color: '#111827' },
  rowSub: { fontSize: 12, color: '#6b7280' },
  chev: { fontSize: 24, color: '#9ca3af', fontWeight: '300' },
});
