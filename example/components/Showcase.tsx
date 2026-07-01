import React, { type ReactNode } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useParallaxScroll } from "react-native-parallax-flow";

/** Floating translucent back button — showcases hide the native header so the
 *  parallax header can run full-bleed under the status bar. */
export function BackButton({ tint = "#ffffff" }: { tint?: string }) {
  const insets = useSafeAreaInsets();
  return (
    <Pressable
      onPress={() => router.back()}
      hitSlop={12}
      style={({ pressed }) => [
        styles.back,
        { top: insets.top + 8 },
        pressed && { opacity: 0.6 },
      ]}
    >
      <Text style={[styles.backText, { color: tint }]}>‹ Back</Text>
    </Pressable>
  );
}

/** Centered grab bar for bottom-sheet-style bodies. */
export function SheetHandle({ color = "#d1d5db" }: { color?: string }) {
  return (
    <View style={styles.handleWrap}>
      <View style={[styles.handle, { backgroundColor: color }]} />
    </View>
  );
}

/** A block of filler paragraphs so there's always something to scroll.
 *  `dark` flips the text palette for dark bodies. */
export function Filler({ count = 8, dark = false }: { count?: number; dark?: boolean }) {
  return (
    <View style={styles.filler}>
      {Array.from({ length: count }).map((_, i) => (
        <View key={i} style={styles.para}>
          <Text style={[styles.paraTitle, dark && styles.paraTitleDark]}>
            Section {i + 1}
          </Text>
          <Text style={[styles.paraBody, dark && styles.paraBodyDark]}>
            Scroll up and down to feel the parallax. The body slides over the
            header while the header eases away more slowly. Pull past the top to
            see fixed headers zoom.
          </Text>
        </View>
      ))}
    </View>
  );
}

export function BodyHeading({ children }: { children: ReactNode }) {
  return <Text style={styles.bodyHeading}>{children}</Text>;
}

/**
 * A top bar that fades + slides in as the scroll passes `start` and is fully
 * visible by `end`. Render it through the `overlay` prop of
 * `ParallaxScrollView` so it can read the scroll offset from context — this is
 * the classic "navbar appears once the hero scrolls away" pattern.
 */
export function FadeInBar({
  start,
  end,
  style,
  children,
}: {
  /** Scroll offset (px) where the bar starts appearing. */
  start: number;
  /** Scroll offset (px) where the bar is fully visible. */
  end: number;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
}) {
  const scrollY = useParallaxScroll();
  const animatedStyle = useAnimatedStyle(() => {
    "worklet";
    const t = interpolate(
      scrollY.value,
      [start, end],
      [0, 1],
      Extrapolation.CLAMP,
    );
    return {
      opacity: t,
      transform: [{ translateY: (1 - t) * -10 }],
      // Let touches through while the bar is (mostly) hidden.
      pointerEvents: t > 0.5 ? ("auto" as const) : ("none" as const),
    };
  });
  return <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>;
}

const styles = StyleSheet.create({
  back: {
    position: "absolute",
    left: 14,
    zIndex: 10,
    backgroundColor: "rgba(0,0,0,0.28)",
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
  },
  backText: { fontSize: 15, fontWeight: "700" },
  handleWrap: { alignItems: "center", paddingTop: 10 },
  handle: { width: 40, height: 4.5, borderRadius: 3 },
  filler: { padding: 20, gap: 18 },
  para: { gap: 6 },
  paraTitle: { fontSize: 16, fontWeight: "700", color: "#111827" },
  paraTitleDark: { color: "#f4f4f5" },
  paraBody: { fontSize: 14, lineHeight: 21, color: "#4b5563" },
  paraBodyDark: { color: "#a1a1aa" },
  bodyHeading: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
    paddingHorizontal: 20,
    paddingTop: 24,
  },
});
