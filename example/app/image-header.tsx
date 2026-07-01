import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import {
  ParallaxScrollView,
  useParallaxScroll,
} from "react-native-parallax-flow";
import { BackButton, Filler } from "../components/Showcase";

const HEADER_HEIGHT = 340;
const IMAGE =
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200&q=80";

/** Caption that fades + slides away faster than the header itself — a small
 *  scroll-linked flourish read straight from the parallax context. */
function HeroCaption() {
  const insets = useSafeAreaInsets();
  const scrollY = useParallaxScroll();
  const animatedStyle = useAnimatedStyle(() => {
    "worklet";
    const t = interpolate(
      scrollY.value,
      [0, HEADER_HEIGHT * 0.45],
      [1, 0],
      Extrapolation.CLAMP,
    );
    return { opacity: t, transform: [{ translateY: (1 - t) * 24 }] };
  });
  return (
    <Animated.View
      style={[styles.caption, { paddingTop: insets.top }, animatedStyle]}
    >
      <Text style={styles.title}>Lakeside</Text>
      <Text style={styles.subtitle}>A full-bleed image hero</Text>
    </Animated.View>
  );
}

export default function ImageHeader() {
  return (
    <View style={styles.root}>
      <BackButton />
      <ParallaxScrollView
        headerHeight={HEADER_HEIGHT}
        // Transparent body wrapper + an inset card inside → the content
        // floats over the image instead of sealing it off edge-to-edge.
        bodyStyle={styles.body}
        header={
          <View style={styles.headerWrap}>
            <Image
              source={IMAGE}
              style={StyleSheet.absoluteFill}
              contentFit="cover"
              transition={300}
            />
            <View style={styles.scrim} />
            <HeroCaption />
          </View>
        }
      >
        <View style={styles.card}>
          <Filler count={12} />
        </View>
      </ParallaxScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#1f2937" },
  headerWrap: { flex: 1, justifyContent: "flex-end" },
  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.28)",
  },
  caption: { padding: 24, gap: 4 },
  title: { color: "#ffffff", fontSize: 34, fontWeight: "800" },
  subtitle: { color: "#e5e7eb", fontSize: 15 },
  body: { backgroundColor: "transparent", paddingTop: 12 },
  card: {
    flex: 1,
    marginHorizontal: 12,
    backgroundColor: "#ffffff",
    borderRadius: 24,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 10,
    overflow: "hidden",
  },
});
