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

/** Default body styling used across showcases: a card sliding up over the
 *  header, with rounded top corners + a soft shadow (the classic look). */
export const bodySheetStyle = {
  backgroundColor: "#ffffff",
  borderTopLeftRadius: 28,
  borderTopRightRadius: 28,
  shadowColor: "#000",
  shadowOpacity: 0.12,
  shadowRadius: 12,
  shadowOffset: { width: 0, height: -4 },
  elevation: 8,
} as const;

/** A block of filler paragraphs so there's always something to scroll. */
export function Filler({ count = 8 }: { count?: number }) {
  return (
    <View style={styles.filler}>
      {Array.from({ length: count }).map((_, i) => (
        <View key={i} style={styles.para}>
          <Text style={styles.paraTitle}>Section {i + 1}</Text>
          <Text style={styles.paraBody}>
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
  filler: { padding: 20, gap: 18 },
  para: { gap: 6 },
  paraTitle: { fontSize: 16, fontWeight: "700", color: "#111827" },
  paraBody: { fontSize: 14, lineHeight: 21, color: "#4b5563" },
  bodyHeading: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
    paddingHorizontal: 20,
    paddingTop: 24,
  },
});
