import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";
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

const HEADER_HEIGHT = 360;
const ARTWORK =
  "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80";

const TRACKS = [
  { title: "Neon Skyline", artist: "Violet Motors", duration: "3:42" },
  { title: "Midnight Drive", artist: "Violet Motors", duration: "4:05" },
  { title: "Chrome Hearts", artist: "Violet Motors ft. Lumen", duration: "3:18" },
  { title: "Afterglow", artist: "Violet Motors", duration: "5:01" },
  { title: "Static Bloom", artist: "Violet Motors", duration: "2:56" },
  { title: "Coastline", artist: "Violet Motors", duration: "3:37" },
  { title: "Glass City", artist: "Violet Motors ft. Aria Vale", duration: "4:22" },
  { title: "Slow Motion", artist: "Violet Motors", duration: "3:49" },
  { title: "Polaris", artist: "Violet Motors", duration: "4:44" },
  { title: "Night Swim", artist: "Violet Motors", duration: "3:11" },
  { title: "Last Transmission", artist: "Violet Motors", duration: "6:02" },
];

/** Album artwork that shrinks + fades as it scrolls away — reads the shared
 *  scroll offset straight from the package's context. */
function Artwork() {
  const scrollY = useParallaxScroll();
  const animatedStyle = useAnimatedStyle(() => {
    "worklet";
    const t = interpolate(
      scrollY.value,
      [0, HEADER_HEIGHT * 0.6],
      [1, 0],
      Extrapolation.CLAMP,
    );
    return { opacity: t, transform: [{ scale: 0.8 + 0.2 * t }] };
  });
  return (
    <Animated.View style={[styles.artworkWrap, animatedStyle]}>
      <Image source={ARTWORK} style={styles.artwork} contentFit="cover" transition={300} />
    </Animated.View>
  );
}

export default function Playlist() {
  const insets = useSafeAreaInsets();
  const barHeight = insets.top + 52;

  return (
    <View style={styles.root}>
      <ParallaxScrollView
        headerHeight={HEADER_HEIGHT}
        parallaxFactor={0.35}
        bodyStyle={styles.bodySheet}
        header={
          <View style={styles.headerWrap}>
            <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
              <Defs>
                <LinearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0" stopColor="#6d28d9" />
                  <Stop offset="0.55" stopColor="#3b0764" />
                  <Stop offset="1" stopColor="#0f0f14" />
                </LinearGradient>
              </Defs>
              <Rect x="0" y="0" width="100%" height="100%" fill="url(#bg)" />
            </Svg>
            <View style={[styles.artworkCenter, { paddingTop: insets.top + 24 }]}>
              <Artwork />
            </View>
          </View>
        }
        overlay={
          <>
            <FadeInBar
              start={HEADER_HEIGHT - barHeight - 110}
              end={HEADER_HEIGHT - barHeight - 20}
              style={[styles.bar, { height: barHeight, paddingTop: insets.top }]}
            >
              <Text style={styles.barTitle} numberOfLines={1}>
                Midnight Drive — Violet Motors
              </Text>
            </FadeInBar>
            <BackButton variant="blur" blurTint="dark" />
          </>
        }
      >
        <View style={styles.albumHead}>
          <Text style={styles.albumTitle}>Midnight Drive</Text>
          <Text style={styles.albumArtist}>Violet Motors</Text>
          <Text style={styles.albumMeta}>
            Album · 2026 · {TRACKS.length} songs · 45 min
          </Text>

          <View style={styles.controls}>
            <Pressable style={styles.playBtn}>
              <Text style={styles.playBtnText}>▶ Play</Text>
            </Pressable>
            <Pressable style={styles.shuffleBtn}>
              <Text style={styles.shuffleBtnText}>Shuffle</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.trackList}>
          {TRACKS.map((t, i) => (
            <Pressable key={t.title} style={styles.track}>
              <Text style={styles.trackIndex}>{i + 1}</Text>
              <View style={styles.trackMain}>
                <Text style={styles.trackTitle} numberOfLines={1}>
                  {t.title}
                </Text>
                <Text style={styles.trackArtist} numberOfLines={1}>
                  {t.artist}
                </Text>
              </View>
              <Text style={styles.trackDuration}>{t.duration}</Text>
            </Pressable>
          ))}
        </View>
      </ParallaxScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#0f0f14" },
  headerWrap: { flex: 1 },
  artworkCenter: { flex: 1, alignItems: "center", justifyContent: "center" },
  artworkWrap: {
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 12,
  },
  artwork: { width: 216, height: 216, borderRadius: 10 },
  bodySheet: {
    backgroundColor: "#16121f",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    borderTopColor: "rgba(139,92,246,0.45)",
  },

  bar: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 70,
    backgroundColor: "rgba(15,15,20,0.97)",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#27272a",
  },
  barTitle: { fontSize: 15, fontWeight: "700", color: "#fafafa" },

  albumHead: { paddingHorizontal: 20, paddingTop: 18, gap: 3 },
  albumTitle: { color: "#fafafa", fontSize: 26, fontWeight: "800" },
  albumArtist: { color: "#d4d4d8", fontSize: 15, fontWeight: "600" },
  albumMeta: { color: "#71717a", fontSize: 12, marginTop: 2 },
  controls: { flexDirection: "row", alignItems: "center", gap: 12, marginTop: 14 },
  playBtn: {
    backgroundColor: "#8b5cf6",
    paddingHorizontal: 30,
    paddingVertical: 11,
    borderRadius: 24,
  },
  playBtnText: { color: "#ffffff", fontWeight: "800", fontSize: 15 },
  shuffleBtn: {
    borderWidth: 1,
    borderColor: "#3f3f46",
    paddingHorizontal: 22,
    paddingVertical: 11,
    borderRadius: 24,
  },
  shuffleBtnText: { color: "#e4e4e7", fontWeight: "700", fontSize: 14 },

  trackList: { paddingVertical: 12, paddingBottom: 40 },
  track: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingHorizontal: 20,
    paddingVertical: 11,
  },
  trackIndex: { width: 22, textAlign: "center", color: "#71717a", fontSize: 14 },
  trackMain: { flex: 1, gap: 2 },
  trackTitle: { color: "#fafafa", fontSize: 15, fontWeight: "600" },
  trackArtist: { color: "#71717a", fontSize: 12 },
  trackDuration: { color: "#71717a", fontSize: 13, fontVariant: ["tabular-nums"] },
});
