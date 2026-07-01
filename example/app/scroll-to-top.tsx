import React, { useRef, type ComponentRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ParallaxScrollView } from 'react-native-parallax-flow';
import { BackButton, Filler } from '../components/Showcase';

export default function ScrollToTop() {
  const insets = useSafeAreaInsets();
  // The ref is forwarded straight to the inner Animated.ScrollView. Deriving
  // the type from the component keeps it correct regardless of how the
  // reanimated copy is resolved.
  const scrollRef = useRef<ComponentRef<typeof ParallaxScrollView>>(null);

  return (
    <View style={styles.root}>
      <BackButton />
      <ParallaxScrollView
        ref={scrollRef}
        headerHeight={240}
        headerStyle={styles.header}
        // Warm paper body with a heavy single-side accent border.
        bodyStyle={styles.body}
        header={
          <View style={[styles.center, { paddingTop: insets.top }]}>
            <Text style={styles.title}>forwardRef</Text>
            <Text style={styles.subtitle}>
              Scroll down, then tap the button to scrollTo top.
            </Text>
          </View>
        }
      >
        <Filler count={14} />
      </ParallaxScrollView>

      <Pressable
        style={[styles.fab, { bottom: insets.bottom + 24 }]}
        onPress={() => scrollRef.current?.scrollTo({ y: 0, animated: true })}
      >
        <Text style={styles.fabText}>↑ Top</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#b45309' },
  header: { backgroundColor: '#b45309' },
  body: {
    backgroundColor: '#fffbeb',
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    borderTopWidth: 4,
    borderTopColor: '#f59e0b',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
    gap: 8,
  },
  title: { color: '#ffffff', fontSize: 30, fontWeight: '800' },
  subtitle: { color: '#fde68a', fontSize: 14, textAlign: 'center' },
  fab: {
    position: 'absolute',
    right: 24,
    backgroundColor: '#111827',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 28,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 6,
  },
  fabText: { color: '#ffffff', fontWeight: '700', fontSize: 15 },
});
