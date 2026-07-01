import React from "react";
import { Link } from "expo-router";
import type { Href } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Svg, {
  Circle,
  Defs,
  LinearGradient,
  Rect,
  Stop,
} from "react-native-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ParallaxLayer,
  ParallaxScrollView,
} from "react-native-parallax-flow";
import { FadeInBar } from "../components/Showcase";

const HEADER_HEIGHT = 300;

interface Item {
  href: Href;
  emoji: string;
  accent: string;
  title: string;
  subtitle: string;
}

interface Section {
  label: string;
  blurb: string;
  items: Item[];
}

const SECTIONS: Section[] = [
  {
    label: "Real-world screens",
    blurb: "Lift these straight into an app.",
    items: [
      {
        href: "/artist",
        emoji: "🎤",
        accent: "#8b5cf6",
        title: "Artist page",
        subtitle: "Video hero, shrinking title, crossfading navbars",
      },
      {
        href: "/profile",
        emoji: "👤",
        accent: "#0ea5e9",
        title: "Social profile",
        subtitle: "Cover photo, fade-in navbar, stats + photo grid",
      },
      {
        href: "/product",
        emoji: "👟",
        accent: "#dc2626",
        title: "Product detail",
        subtitle: "Docking body, fade-in price bar, sticky cart",
      },
      {
        href: "/playlist",
        emoji: "💿",
        accent: "#a855f7",
        title: "Album playlist",
        subtitle: "Artwork shrinks and fades, track list",
      },
      {
        href: "/travel",
        emoji: "🏝️",
        accent: "#0891b2",
        title: "Travel destination",
        subtitle: "Glass info card, frosted navbar and back button",
      },
      {
        href: "/event",
        emoji: "🎟️",
        accent: "#f43f5e",
        title: "Event tickets",
        subtitle: "Poster hero, frosted ticket bar over content",
      },
      {
        href: "/restaurant",
        emoji: "🍽️",
        accent: "#d97706",
        title: "Restaurant menu",
        subtitle: "Food hero, blur fade-in bar, sectioned menu",
      },
    ],
  },
  {
    label: "Showpieces",
    blurb: "The engine pushed as far as it goes.",
    items: [
      {
        href: "/layers",
        emoji: "🏔️",
        accent: "#f97316",
        title: "Night Ridge",
        subtitle: "Nine-layer mountain scene with moon and stars",
      },
      {
        href: "/space",
        emoji: "🪐",
        accent: "#6366f1",
        title: "Solar system",
        subtitle: "Saturn in layered deep space, zooms on pull",
      },
      {
        href: "/magazine",
        emoji: "📰",
        accent: "#eab308",
        title: "Magazine cover",
        subtitle: "Every cover element on its own depth layer",
      },
      {
        href: "/boarding-pass",
        emoji: "✈️",
        accent: "#0369a1",
        title: "Boarding pass",
        subtitle: "Perforated edge — sky shows through the teeth",
      },
    ],
  },
  {
    label: "Fundamentals",
    blurb: "One prop at a time.",
    items: [
      {
        href: "/content-header",
        emoji: "📐",
        accent: "#4f46e5",
        title: "Auto-height header",
        subtitle: "Header sizes to content, parallax counter-scroll",
      },
      {
        href: "/fixed-header",
        emoji: "🔍",
        accent: "#0f766e",
        title: "Fixed header + zoom",
        subtitle: "headerHeight set — pull past the top to zoom",
      },
      {
        href: "/image-header",
        emoji: "🖼️",
        accent: "#1f2937",
        title: "Image hero",
        subtitle: "Floating card body, caption fades on scroll",
      },
    ],
  },
  {
    label: "Tools",
    blurb: "Poke at the internals.",
    items: [
      {
        href: "/playground",
        emoji: "🎛️",
        accent: "#7c3aed",
        title: "Playground",
        subtitle: "Live-tweak parallaxFactor and header mode",
      },
      {
        href: "/scroll-to-top",
        emoji: "🧭",
        accent: "#b45309",
        title: "Programmatic scroll",
        subtitle: "forwardRef → scrollTo from a floating button",
      },
      {
        href: "/edge-cases",
        emoji: "🧪",
        accent: "#be123c",
        title: "Edge cases",
        subtitle: "factor 0 / 1, short content, empty header",
      },
    ],
  },
];

/** The home page runs on the library it demos. */
export default function Home() {
  const insets = useSafeAreaInsets();
  const barHeight = insets.top + 52;

  return (
    <View style={styles.root}>
      <ParallaxScrollView
        headerHeight={HEADER_HEIGHT}
        headerParallax={false}
        headerStyle={styles.header}
        bodyStyle={styles.body}
        scrollViewProps={{ showsVerticalScrollIndicator: false }}
        header={
          <View style={styles.hero}>
            {/* Gradient sky — farthest. */}
            <ParallaxLayer factor={0.05}>
              <Svg
                width="100%"
                height="100%"
                viewBox="0 0 100 120"
                preserveAspectRatio="xMidYMid slice"
              >
                <Defs>
                  <LinearGradient id="home" x1="0" y1="0" x2="0.6" y2="1">
                    <Stop offset="0" stopColor="#1e1b4b" />
                    <Stop offset="0.55" stopColor="#4c1d95" />
                    <Stop offset="1" stopColor="#0f1117" />
                  </LinearGradient>
                </Defs>
                <Rect x="0" y="0" width="100" height="120" fill="url(#home)" />
              </Svg>
            </ParallaxLayer>

            {/* Floating orbs at two depths — the parallax is the pitch. */}
            <ParallaxLayer factor={0.25}>
              <Svg
                width="100%"
                height="100%"
                viewBox="0 0 100 120"
                preserveAspectRatio="xMidYMid slice"
              >
                <Circle cx="14" cy="28" r="9" fill="#8b5cf6" opacity={0.35} />
                <Circle cx="88" cy="52" r="14" fill="#6366f1" opacity={0.28} />
                <Circle cx="70" cy="16" r="5" fill="#a78bfa" opacity={0.4} />
              </Svg>
            </ParallaxLayer>
            <ParallaxLayer factor={0.55}>
              <Svg
                width="100%"
                height="100%"
                viewBox="0 0 100 120"
                preserveAspectRatio="xMidYMid slice"
              >
                <Circle cx="30" cy="70" r="4" fill="#c4b5fd" opacity={0.5} />
                <Circle cx="82" cy="88" r="7" fill="#8b5cf6" opacity={0.45} />
                <Circle cx="8" cy="98" r="3" fill="#e9d5ff" opacity={0.6} />
              </Svg>
            </ParallaxLayer>

            {/* Title block. */}
            <ParallaxLayer
              factor={0.35}
              style={{ paddingTop: insets.top + 40 }}
            >
              <View style={styles.heroContent}>
                <View style={styles.versionPill}>
                  <Text style={styles.versionPillText}>v0.5.0 · pre-release</Text>
                </View>
                <Text style={styles.heroTitle}>Parallax Flow</Text>
                <Text style={styles.heroSub}>
                  Parallax headers · pull-to-zoom · depth layers{"\n"}
                  scroll-aware overlays · seamless bounce
                </Text>
              </View>
            </ParallaxLayer>
          </View>
        }
        overlay={
          <FadeInBar
            start={HEADER_HEIGHT - barHeight - 80}
            end={HEADER_HEIGHT - barHeight - 10}
            style={[styles.bar, { height: barHeight, paddingTop: insets.top }]}
          >
            <Text style={styles.barTitle}>Parallax Flow</Text>
          </FadeInBar>
        }
      >
        {SECTIONS.map(section => (
          <View key={section.label} style={styles.section}>
            <Text style={styles.sectionLabel}>{section.label}</Text>
            <Text style={styles.sectionBlurb}>{section.blurb}</Text>
            <View style={styles.cards}>
              {section.items.map(item => (
                <Link key={String(item.href)} href={item.href} asChild>
                  <Pressable
                    style={({ pressed }) => [
                      styles.card,
                      pressed && styles.cardPressed,
                    ]}
                  >
                    <View
                      style={[styles.tile, { backgroundColor: `${item.accent}26` }]}
                    >
                      <Text style={styles.tileEmoji}>{item.emoji}</Text>
                    </View>
                    <View style={styles.cardMain}>
                      <Text style={styles.cardTitle}>{item.title}</Text>
                      <Text style={styles.cardSub} numberOfLines={2}>
                        {item.subtitle}
                      </Text>
                    </View>
                    <Text style={[styles.chev, { color: item.accent }]}>›</Text>
                  </Pressable>
                </Link>
              ))}
            </View>
          </View>
        ))}

        <Text style={styles.footer}>
          react-native-parallax-flow — MIT · built with reanimated
        </Text>
        <View style={{ height: insets.bottom + 28 }} />
      </ParallaxScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#0f1117" },
  header: { backgroundColor: "#1e1b4b" },
  hero: { flex: 1 },
  heroContent: { alignItems: "center", gap: 10, paddingHorizontal: 24 },
  versionPill: {
    backgroundColor: "rgba(139,92,246,0.25)",
    borderWidth: 1,
    borderColor: "rgba(167,139,250,0.4)",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
  },
  versionPillText: {
    color: "#c4b5fd",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  heroTitle: { color: "#ffffff", fontSize: 38, fontWeight: "900" },
  heroSub: {
    color: "#a5b4fc",
    fontSize: 13,
    lineHeight: 20,
    textAlign: "center",
    fontWeight: "500",
  },

  body: {
    backgroundColor: "#0f1117",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },

  bar: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(15,17,23,0.97)",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#27272a",
  },
  barTitle: { color: "#ffffff", fontSize: 16, fontWeight: "800" },

  section: { paddingHorizontal: 18, paddingTop: 26 },
  sectionLabel: {
    color: "#e4e4e7",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  sectionBlurb: { color: "#71717a", fontSize: 12.5, marginTop: 2 },
  cards: { gap: 10, marginTop: 14 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: "#171a23",
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  cardPressed: { opacity: 0.75, transform: [{ scale: 0.99 }] },
  tile: {
    width: 46,
    height: 46,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  tileEmoji: { fontSize: 22 },
  cardMain: { flex: 1, gap: 2 },
  cardTitle: { color: "#fafafa", fontSize: 15, fontWeight: "700" },
  cardSub: { color: "#8e8e99", fontSize: 12, lineHeight: 17 },
  chev: { fontSize: 24, fontWeight: "400" },

  footer: {
    color: "#52525b",
    fontSize: 12,
    textAlign: "center",
    paddingTop: 34,
  },
});
