import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
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
import { BackButton, FadeInBar } from "../components/Showcase";

const HEADER_HEIGHT = 300;
const COVER =
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80";
const AVATAR =
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80";

const STATS = [
  { label: "Posts", value: "128" },
  { label: "Followers", value: "12.4k" },
  { label: "Following", value: "310" },
];

const GRID = Array.from({ length: 12 }).map(
  (_, i) => `https://picsum.photos/seed/pf${i}/400/400`,
);

/** Cover scrim that darkens as you scroll — keeps the header legible while
 *  the fade-in bar takes over. Reads the offset from the parallax context. */
function DarkeningScrim() {
  const scrollY = useParallaxScroll();
  const animatedStyle = useAnimatedStyle(() => {
    "worklet";
    const opacity = interpolate(
      scrollY.value,
      [0, HEADER_HEIGHT * 0.7],
      [0.25, 0.6],
      Extrapolation.CLAMP,
    );
    return { backgroundColor: `rgba(2,6,23,${opacity})` };
  });
  return (
    <Animated.View
      pointerEvents="none"
      style={[StyleSheet.absoluteFill, animatedStyle]}
    />
  );
}

export default function Profile() {
  const insets = useSafeAreaInsets();
  const barHeight = insets.top + 52;

  return (
    <View style={styles.root}>
      <ParallaxScrollView
        headerHeight={HEADER_HEIGHT}
        parallaxFactor={0.5}
        bodyStyle={styles.bodySheet}
        header={
          <View style={styles.headerWrap}>
            <Image
              source={COVER}
              style={StyleSheet.absoluteFill}
              contentFit="cover"
              transition={300}
            />
            <DarkeningScrim />
          </View>
        }
        overlay={
          <>
            {/* Fades in once the cover is mostly scrolled away. */}
            <FadeInBar
              start={HEADER_HEIGHT - barHeight - 90}
              end={HEADER_HEIGHT - barHeight}
              style={[styles.bar, { height: barHeight, paddingTop: insets.top }]}
            >
              <Image source={AVATAR} style={styles.barAvatar} contentFit="cover" />
              <Text style={styles.barName}>Maya Chen</Text>
            </FadeInBar>
            <BackButton variant="blur" blurTint="dark" />
          </>
        }
      >
        <View style={styles.profileTop}>
          <Image source={AVATAR} style={styles.avatar} contentFit="cover" />
          <Text style={styles.name}>Maya Chen</Text>
          <Text style={styles.handle}>@maya.shoots · Landscape photographer</Text>
          <Text style={styles.bio}>
            Chasing light across mountains and coastlines. Prints available —
            DM for collabs.
          </Text>

          <View style={styles.statsRow}>
            {STATS.map(s => (
              <View key={s.label} style={styles.stat}>
                <Text style={styles.statValue}>{s.value}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            ))}
          </View>

          <View style={styles.actions}>
            <Pressable style={[styles.btn, styles.btnPrimary]}>
              <Text style={styles.btnPrimaryText}>Follow</Text>
            </Pressable>
            <Pressable style={[styles.btn, styles.btnGhost]}>
              <Text style={styles.btnGhostText}>Message</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.grid}>
          {GRID.map(uri => (
            <View key={uri} style={styles.cell}>
              <Image source={uri} style={styles.cellImage} contentFit="cover" />
            </View>
          ))}
        </View>
      </ParallaxScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#0f172a" },
  headerWrap: { flex: 1 },
  bodySheet: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },

  // Fade-in top bar
  bar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "rgba(255,255,255,0.97)",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#e5e7eb",
  },
  barAvatar: { width: 28, height: 28, borderRadius: 14 },
  barName: { fontSize: 16, fontWeight: "700", color: "#111827" },

  // Profile card
  profileTop: { alignItems: "center", paddingHorizontal: 24, gap: 6 },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 4,
    borderColor: "#ffffff",
    marginTop: -48,
    marginBottom: 4,
  },
  name: { fontSize: 22, fontWeight: "800", color: "#111827" },
  handle: { fontSize: 13, color: "#6b7280" },
  bio: {
    fontSize: 14,
    lineHeight: 20,
    color: "#374151",
    textAlign: "center",
    marginTop: 4,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 36,
    marginTop: 14,
  },
  stat: { alignItems: "center", gap: 2 },
  statValue: { fontSize: 17, fontWeight: "800", color: "#111827" },
  statLabel: { fontSize: 12, color: "#6b7280" },
  actions: { flexDirection: "row", gap: 10, marginTop: 14 },
  btn: {
    paddingHorizontal: 28,
    paddingVertical: 10,
    borderRadius: 22,
  },
  btnPrimary: { backgroundColor: "#111827" },
  btnPrimaryText: { color: "#ffffff", fontWeight: "700", fontSize: 14 },
  btnGhost: { backgroundColor: "#f3f4f6" },
  btnGhostText: { color: "#111827", fontWeight: "700", fontSize: 14 },

  // Photo grid
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 32,
  },
  cell: { width: "33.333%", aspectRatio: 1, padding: 2 },
  cellImage: { flex: 1, borderRadius: 8 },
});
