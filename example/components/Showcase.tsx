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
import { BlurView, type BlurTint } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useParallaxScroll } from "react-native-parallax-flow";

export type BackVariant = "chip" | "blur" | "solid" | "minimal";

/** Floating back button — showcases hide the native header so the parallax
 *  header can run full-bleed under the status bar. Four looks:
 *  - `chip`    dark translucent pill with "‹ Back" (the classic)
 *  - `blur`    frosted-glass circle (expo-blur)
 *  - `solid`   opaque circle with a shadow
 *  - `minimal` bare glyph with a soft text shadow
 */
export function BackButton({
  variant = "chip",
  tint = "#ffffff",
  blurTint = "light",
}: {
  variant?: BackVariant;
  tint?: string;
  blurTint?: BlurTint;
}) {
  const insets = useSafeAreaInsets();
  const position = { top: insets.top + 8 } as const;

  if (variant === "chip") {
    return (
      <Pressable
        onPress={() => router.back()}
        hitSlop={12}
        style={({ pressed }) => [
          styles.back,
          styles.backChip,
          position,
          pressed && { opacity: 0.6 },
        ]}
      >
        <Text style={[styles.backChipText, { color: tint }]}>‹ Back</Text>
      </Pressable>
    );
  }

  if (variant === "blur") {
    return (
      <Pressable
        onPress={() => router.back()}
        hitSlop={12}
        style={({ pressed }) => [
          styles.back,
          styles.backCircle,
          position,
          pressed && { opacity: 0.6 },
        ]}
      >
        <BlurView intensity={45} tint={blurTint} style={StyleSheet.absoluteFill} />
        <Text style={[styles.backGlyph, { color: tint }]}>‹</Text>
      </Pressable>
    );
  }

  if (variant === "solid") {
    return (
      <Pressable
        onPress={() => router.back()}
        hitSlop={12}
        style={({ pressed }) => [
          styles.back,
          styles.backCircle,
          styles.backSolid,
          position,
          pressed && { opacity: 0.7 },
        ]}
      >
        <Text style={[styles.backGlyph, { color: "#111827" }]}>‹</Text>
      </Pressable>
    );
  }

  // minimal
  return (
    <Pressable
      onPress={() => router.back()}
      hitSlop={16}
      style={({ pressed }) => [
        styles.back,
        position,
        pressed && { opacity: 0.5 },
      ]}
    >
      <Text style={[styles.backMinimal, { color: tint }]}>‹</Text>
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

/**
 * Inverse of `FadeInBar`: fully visible at rest, fades + releases touches as
 * the scroll passes `start`→`end`. Pair the two through the `overlay` prop to
 * crossfade an over-the-hero control row into a solid navbar.
 */
export function FadeOutView({
  start,
  end,
  style,
  children,
}: {
  /** Scroll offset (px) where the view starts disappearing. */
  start: number;
  /** Scroll offset (px) where the view is fully hidden. */
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
      [1, 0],
      Extrapolation.CLAMP,
    );
    return {
      opacity: t,
      pointerEvents: t > 0.5 ? ("auto" as const) : ("none" as const),
    };
  });
  return <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>;
}

/**
 * `FadeInBar` with a frosted-glass background (expo-blur) instead of a solid
 * fill — the content behind it stays faintly visible through the blur.
 */
export function BlurFadeBar({
  start,
  end,
  tint = "light",
  style,
  children,
}: {
  start: number;
  end: number;
  tint?: BlurTint;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
}) {
  return (
    <FadeInBar start={start} end={end} style={style}>
      <BlurView intensity={55} tint={tint} style={StyleSheet.absoluteFill} />
      {children}
    </FadeInBar>
  );
}

const styles = StyleSheet.create({
  back: {
    position: "absolute",
    left: 14,
    zIndex: 10,
  },
  backChip: {
    backgroundColor: "rgba(0,0,0,0.28)",
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
  },
  backChipText: { fontSize: 15, fontWeight: "700" },
  backCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  backSolid: {
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  backGlyph: {
    fontSize: 26,
    fontWeight: "700",
    lineHeight: 30,
    marginTop: -3,
  },
  backMinimal: {
    fontSize: 34,
    fontWeight: "700",
    lineHeight: 38,
    textShadowColor: "rgba(0,0,0,0.45)",
    textShadowRadius: 8,
    textShadowOffset: { width: 0, height: 1 },
  },
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
