import React, { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";
import { VideoView, useVideoPlayer } from "expo-video";
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
import { FadeInBar, FadeOutView } from "../components/Showcase";

const HEADER_HEIGHT = 440;
// Muted looping stock clip standing in for artist footage.
const VIDEO_URL =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4";

const SONGS = [
  { title: "Neon Skyline", plays: "1.2B", duration: "3:42", liked: true },
  { title: "Midnight Drive", plays: "2.1B", duration: "4:05", liked: true },
  { title: "Chrome Hearts", plays: "984M", duration: "3:18", liked: false },
  { title: "Afterglow", plays: "2.8B", duration: "5:01", liked: true },
  { title: "Static Bloom", plays: "1.9B", duration: "2:56", liked: true },
  { title: "Polaris", plays: "892M", duration: "4:44", liked: false },
];

const ALBUMS = [
  { title: "Midnight Drive", year: 2026, seed: "alb1" },
  { title: "Static Bloom", year: 2024, seed: "alb2" },
  { title: "First Light", year: 2021, seed: "alb3" },
];

const SIMILAR = [
  { name: "Glass Arcade", followers: "12M", seed: "sim1" },
  { name: "Nova State", followers: "9.4M", seed: "sim2" },
  { name: "Aria Vale", followers: "21M", seed: "sim3" },
  { name: "Lumen", followers: "6.8M", seed: "sim4" },
];

const STATS = [
  { label: "Followers", value: "54.2M" },
  { label: "Following", value: "47" },
  { label: "Albums", value: "3" },
];

type Tab = "songs" | "albums" | "similar";

/** Big artist name pinned to the hero's bottom edge — shrinks, drifts and
 *  fades as it scrolls away while the navbar title crossfades in. */
function ShrinkingTitle({ children }: { children: string }) {
  const scrollY = useParallaxScroll();
  const animatedStyle = useAnimatedStyle(() => {
    "worklet";
    const t = interpolate(
      scrollY.value,
      [0, HEADER_HEIGHT * 0.55],
      [1, 0],
      Extrapolation.CLAMP,
    );
    return {
      opacity: interpolate(t, [0.25, 0.55], [0, 1], Extrapolation.CLAMP),
      transform: [{ scale: 0.6 + 0.4 * t }, { translateY: (1 - t) * 26 }],
    };
  });
  return (
    <Animated.Text style={[styles.bigTitle, animatedStyle]} numberOfLines={1}>
      {children}
    </Animated.Text>
  );
}

function IconChip({ glyph, onPress }: { glyph: string; onPress?: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      style={({ pressed }) => [styles.iconChip, pressed && { opacity: 0.6 }]}
    >
      <Text style={styles.iconChipGlyph}>{glyph}</Text>
    </Pressable>
  );
}

export default function Artist() {
  const insets = useSafeAreaInsets();
  const barHeight = insets.top + 52;
  const fadeStart = HEADER_HEIGHT - barHeight - 120;
  const fadeEnd = HEADER_HEIGHT - barHeight - 30;
  const [tab, setTab] = useState<Tab>("songs");
  const [following, setFollowing] = useState(false);

  const player = useVideoPlayer(VIDEO_URL, p => {
    p.loop = true;
    p.muted = true;
    p.play();
  });

  return (
    <View style={styles.root}>
      <ParallaxScrollView
        headerHeight={HEADER_HEIGHT}
        parallaxFactor={0.35}
        bodyStyle={styles.body}
        scrollViewProps={{ showsVerticalScrollIndicator: false }}
        header={
          <View style={styles.headerWrap}>
            <VideoView
              player={player}
              style={StyleSheet.absoluteFill}
              contentFit="cover"
              nativeControls={false}
            />
            {/* Bottom gradient so the title always reads over the footage. */}
            <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
              <Defs>
                <LinearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0" stopColor="#000000" stopOpacity={0.25} />
                  <Stop offset="0.45" stopColor="#000000" stopOpacity={0} />
                  <Stop offset="0.72" stopColor="#000000" stopOpacity={0.35} />
                  <Stop offset="1" stopColor="#000000" stopOpacity={0.96} />
                </LinearGradient>
              </Defs>
              <Rect x="0" y="0" width="100%" height="100%" fill="url(#fade)" />
            </Svg>
            <View style={styles.titleSlot}>
              <ShrinkingTitle>VIOLET MOTORS</ShrinkingTitle>
            </View>
          </View>
        }
        overlay={
          <>
            {/* State 1: floating controls over the video — fade OUT. */}
            <FadeOutView
              start={fadeStart}
              end={fadeEnd}
              style={[styles.overBar, { top: insets.top + 6 }]}
            >
              <IconChip glyph="‹" onPress={() => router.back()} />
              <View style={styles.overBarRight}>
                <IconChip glyph="↑" />
                <IconChip glyph="⋯" />
              </View>
            </FadeOutView>

            {/* State 2: solid navbar with the title — fades IN over the same
                range, completing the crossfade. */}
            <FadeInBar
              start={fadeStart}
              end={fadeEnd}
              style={[styles.topBar, { height: barHeight, paddingTop: insets.top }]}
            >
              <IconChip glyph="‹" onPress={() => router.back()} />
              <Text style={styles.topBarTitle}>Violet Motors</Text>
              <IconChip glyph="⋯" />
            </FadeInBar>
          </>
        }
      >
        <View style={styles.content}>
          <View style={styles.metaBlock}>
            <View style={styles.verifiedRow}>
              <Text style={styles.verifiedCheck}>✓</Text>
              <Text style={styles.verifiedText}>Verified Artist</Text>
            </View>
            <Text style={styles.listeners}>67,234,567 monthly listeners</Text>
          </View>

          <View style={styles.statsRow}>
            {STATS.map(s => (
              <View key={s.label} style={styles.statsCard}>
                <Text style={styles.statsValue}>{s.value}</Text>
                <Text style={styles.statsLabel}>{s.label}</Text>
              </View>
            ))}
          </View>

          <View style={styles.actions}>
            <Pressable
              onPress={() => setFollowing(f => !f)}
              style={[styles.followBtn, following && styles.followingBtn]}
            >
              <Text
                style={[
                  styles.followBtnText,
                  following && styles.followingBtnText,
                ]}
              >
                {following ? "Following" : "Follow"}
              </Text>
            </Pressable>
            <IconChip glyph="🔔" />
            <IconChip glyph="↑" />
          </View>

          <View style={styles.tabs}>
            {(
              [
                ["songs", "Popular"],
                ["albums", "Albums"],
                ["similar", "Similar"],
              ] as [Tab, string][]
            ).map(([id, label]) => (
              <Pressable
                key={id}
                onPress={() => setTab(id)}
                style={[styles.tab, tab === id && styles.tabActive]}
              >
                <Text style={[styles.tabText, tab === id && styles.tabTextActive]}>
                  {label}
                </Text>
              </Pressable>
            ))}
          </View>

          {tab === "songs" && (
            <View>
              {SONGS.map((song, i) => (
                <Pressable key={song.title} style={styles.songRow}>
                  <Text style={styles.songIndex}>{i + 1}</Text>
                  <Image
                    source={`https://picsum.photos/seed/${song.title}/100/100`}
                    style={styles.songArt}
                    contentFit="cover"
                  />
                  <View style={styles.songMain}>
                    <Text style={styles.songTitle} numberOfLines={1}>
                      {song.title}
                    </Text>
                    <Text style={styles.songMeta}>
                      Violet Motors · {song.plays}
                    </Text>
                  </View>
                  <Text style={[styles.songHeart, song.liked && styles.songHeartOn]}>
                    {song.liked ? "♥" : "♡"}
                  </Text>
                  <Text style={styles.songDuration}>{song.duration}</Text>
                </Pressable>
              ))}
            </View>
          )}

          {tab === "albums" && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.cardRow}
            >
              {ALBUMS.map(a => (
                <Pressable key={a.seed} style={styles.albumCard}>
                  <Image
                    source={`https://picsum.photos/seed/${a.seed}/400/400`}
                    style={styles.albumArt}
                    contentFit="cover"
                  />
                  <Text style={styles.albumTitle} numberOfLines={1}>
                    {a.title}
                  </Text>
                  <Text style={styles.albumMeta}>{a.year} · Album</Text>
                </Pressable>
              ))}
            </ScrollView>
          )}

          {tab === "similar" && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.cardRow}
            >
              {SIMILAR.map(a => (
                <Pressable key={a.seed} style={styles.artistCard}>
                  <Image
                    source={`https://picsum.photos/seed/${a.seed}/300/300`}
                    style={styles.artistArt}
                    contentFit="cover"
                  />
                  <Text style={styles.artistName} numberOfLines={1}>
                    {a.name}
                  </Text>
                  <Text style={styles.artistMeta}>{a.followers} followers</Text>
                </Pressable>
              ))}
            </ScrollView>
          )}

          <View style={styles.about}>
            <Text style={styles.aboutHeading}>About</Text>
            <Text style={styles.aboutText}>
              Synthwave four-piece from Lisbon chasing the space between club
              and cinema. Two platinum records, one very loud warehouse, and a
              tour that never seems to end.
            </Text>
          </View>

          <View style={{ height: insets.bottom + 36 }} />
        </View>
      </ParallaxScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#000000" },
  headerWrap: { flex: 1 },
  titleSlot: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingBottom: 18,
  },
  bigTitle: {
    color: "#ffffff",
    fontSize: 44,
    fontWeight: "900",
    letterSpacing: 1,
    transformOrigin: "left bottom",
  },

  body: { backgroundColor: "#000000" },

  overBar: {
    position: "absolute",
    left: 14,
    right: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  overBarRight: { flexDirection: "row", gap: 8 },
  iconChip: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  iconChipGlyph: { color: "#ffffff", fontSize: 17, fontWeight: "700" },

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    backgroundColor: "rgba(0,0,0,0.97)",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#27272a",
  },
  topBarTitle: { color: "#ffffff", fontSize: 17, fontWeight: "800" },

  content: { paddingHorizontal: 20 },
  metaBlock: { paddingTop: 20, gap: 6 },
  verifiedRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  verifiedCheck: {
    color: "#000",
    backgroundColor: "#3b82f6",
    width: 16,
    height: 16,
    borderRadius: 8,
    textAlign: "center",
    fontSize: 10,
    fontWeight: "900",
    overflow: "hidden",
  },
  verifiedText: { color: "#3b82f6", fontSize: 13, fontWeight: "600" },
  listeners: { color: "#a1a1aa", fontSize: 15, fontWeight: "500" },

  statsRow: { flexDirection: "row", gap: 8, marginTop: 18 },
  statsCard: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 14,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  statsValue: { color: "#ffffff", fontSize: 18, fontWeight: "800" },
  statsLabel: { color: "#a1a1aa", fontSize: 11.5, marginTop: 2 },

  actions: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 16 },
  followBtn: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 22,
    alignItems: "center",
    paddingVertical: 11,
  },
  followingBtn: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#52525b",
  },
  followBtnText: { color: "#000000", fontSize: 14, fontWeight: "800" },
  followingBtnText: { color: "#e4e4e7" },

  tabs: {
    flexDirection: "row",
    marginTop: 24,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  tab: { paddingVertical: 12, marginRight: 26 },
  tabActive: { borderBottomWidth: 2, borderBottomColor: "#8b5cf6" },
  tabText: { color: "#a1a1aa", fontSize: 15, fontWeight: "600" },
  tabTextActive: { color: "#ffffff" },

  songRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
  },
  songIndex: { color: "#71717a", width: 18, textAlign: "center", fontSize: 14 },
  songArt: { width: 44, height: 44, borderRadius: 6 },
  songMain: { flex: 1, gap: 2 },
  songTitle: { color: "#ffffff", fontSize: 15, fontWeight: "600" },
  songMeta: { color: "#71717a", fontSize: 12 },
  songHeart: { color: "#52525b", fontSize: 16, width: 22, textAlign: "center" },
  songHeartOn: { color: "#8b5cf6" },
  songDuration: {
    color: "#a1a1aa",
    fontSize: 13,
    fontVariant: ["tabular-nums"],
  },

  cardRow: { gap: 14, paddingVertical: 14 },
  albumCard: { width: 150, gap: 3 },
  albumArt: { width: 150, height: 150, borderRadius: 10, marginBottom: 6 },
  albumTitle: { color: "#ffffff", fontSize: 14, fontWeight: "700" },
  albumMeta: { color: "#71717a", fontSize: 12 },
  artistCard: { width: 124, alignItems: "center", gap: 3 },
  artistArt: { width: 110, height: 110, borderRadius: 55, marginBottom: 6 },
  artistName: { color: "#ffffff", fontSize: 13.5, fontWeight: "700" },
  artistMeta: { color: "#71717a", fontSize: 11.5 },

  about: { marginTop: 26, gap: 10 },
  aboutHeading: { color: "#ffffff", fontSize: 19, fontWeight: "800" },
  aboutText: { color: "#a1a1aa", fontSize: 14.5, lineHeight: 22 },
});
