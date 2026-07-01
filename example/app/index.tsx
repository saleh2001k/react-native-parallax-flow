import React from "react";
import { Link } from "expo-router";
import type { Href } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import Svg, {
  Defs,
  LinearGradient,
  RadialGradient,
  Rect,
  Stop,
} from "react-native-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ParallaxLayer,
  ParallaxScrollView,
} from "react-native-parallax-flow";
import { FadeInBar } from "../components/Showcase";

const HEADER_HEIGHT = 290;

interface Item {
  href: Href;
  title: string;
  subtitle: string;
  /** Unsplash thumb for image-led screens… */
  image?: string;
  /** …or a gradient pair matching the screen's theme. */
  colors?: [string, string];
}

interface Section {
  index: string;
  label: string;
  items: Item[];
}

const unsplash = (id: string) =>
  `https://images.unsplash.com/${id}?w=500&q=70`;

const SECTIONS: Section[] = [
  {
    index: "01",
    label: "Real-world screens",
    items: [
      {
        href: "/artist",
        title: "Artist",
        subtitle: "Video hero, crossfading navbars",
        image: unsplash("photo-1493225457124-a3eb161ffa5f"),
      },
      {
        href: "/profile",
        title: "Profile",
        subtitle: "Cover photo, fade-in navbar",
        image: unsplash("photo-1506905925346-21bda4d32df4"),
      },
      {
        href: "/product",
        title: "Product",
        subtitle: "Docking body, sticky cart",
        image: unsplash("photo-1542291026-7eec264c27ff"),
      },
      {
        href: "/playlist",
        title: "Playlist",
        subtitle: "Artwork shrinks and fades",
        image: unsplash("photo-1470225620780-dba8ba36b745"),
      },
      {
        href: "/travel",
        title: "Travel",
        subtitle: "Glass card, frosted navbar",
        image: unsplash("photo-1570077188670-e3a8d69ac5ff"),
      },
      {
        href: "/event",
        title: "Event",
        subtitle: "Ticket bar scrolls under blur",
        image: unsplash("photo-1470229722913-7c0e2dbbafd3"),
      },
      {
        href: "/restaurant",
        title: "Restaurant",
        subtitle: "Sectioned menu, blur bar",
        image: unsplash("photo-1517248135467-4c7edcad34c4"),
      },
      {
        href: "/boarding-pass",
        title: "Boarding pass",
        subtitle: "Perforated ticket edge",
        image: unsplash("photo-1436491865332-7a61a109cc05"),
      },
    ],
  },
  {
    index: "02",
    label: "Showpieces",
    items: [
      {
        href: "/layers",
        title: "Night Ridge",
        subtitle: "Nine-layer mountain scene",
        colors: ["#ff9955", "#17142c"],
      },
      {
        href: "/space",
        title: "Solar system",
        subtitle: "Saturn zooms on pull",
        colors: ["#4c1d95", "#020208"],
      },
      {
        href: "/magazine",
        title: "Magazine",
        subtitle: "Cover elements split by depth",
        image: unsplash("photo-1529626455594-4ff0802cfb7e"),
      },
      {
        href: "/image-header",
        title: "Image hero",
        subtitle: "Floating card, fading caption",
        image: unsplash("photo-1501785888041-af3ef285b470"),
      },
    ],
  },
  {
    index: "03",
    label: "Fundamentals & tools",
    items: [
      {
        href: "/content-header",
        title: "Auto height",
        subtitle: "Header sizes to content",
        colors: ["#6366f1", "#312e81"],
      },
      {
        href: "/fixed-header",
        title: "Fixed + zoom",
        subtitle: "Pull past the top to zoom",
        colors: ["#14b8a6", "#134e4a"],
      },
      {
        href: "/playground",
        title: "Playground",
        subtitle: "Live-tweak every prop",
        colors: ["#a78bfa", "#4c1d95"],
      },
      {
        href: "/scroll-to-top",
        title: "Imperative",
        subtitle: "scrollTo via forwarded ref",
        colors: ["#f59e0b", "#78350f"],
      },
      {
        href: "/edge-cases",
        title: "Edge cases",
        subtitle: "factor 0 / 1, empty header",
        colors: ["#fb7185", "#881337"],
      },
    ],
  },
];

function CardVisual({ item }: { item: Item }) {
  if (item.image) {
    return (
      <View style={styles.visual}>
        <Image
          source={item.image}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          transition={250}
        />
        <View style={styles.visualScrim} />
      </View>
    );
  }
  const [from, to] = item.colors ?? ["#27272a", "#0b0c10"];
  return (
    <View style={styles.visual}>
      <Svg width="100%" height="100%">
        <Defs>
          <LinearGradient id={`g-${from}`} x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={from} />
            <Stop offset="1" stopColor={to} />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill={`url(#g-${from})`} />
      </Svg>
    </View>
  );
}

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
            {/* Quiet backdrop — charcoal with one soft indigo glow. */}
            <ParallaxLayer factor={0.08}>
              <Svg width="100%" height="100%">
                <Defs>
                  <RadialGradient id="glow" cx="0.85" cy="0.15" r="0.9">
                    <Stop offset="0" stopColor="#6d28d9" stopOpacity={0.5} />
                    <Stop offset="0.55" stopColor="#312e81" stopOpacity={0.18} />
                    <Stop offset="1" stopColor="#0b0c10" stopOpacity={0} />
                  </RadialGradient>
                </Defs>
                <Rect x="0" y="0" width="100%" height="100%" fill="#0b0c10" />
                <Rect x="0" y="0" width="100%" height="100%" fill="url(#glow)" />
              </Svg>
            </ParallaxLayer>

            {/* Giant watermark glyph drifting at its own depth. */}
            <ParallaxLayer factor={0.3} style={styles.watermarkLayer}>
              <Text style={styles.watermark}>PF</Text>
            </ParallaxLayer>

            {/* Title block. */}
            <ParallaxLayer factor={0.5} style={styles.titleLayer}>
              <View style={{ paddingTop: insets.top + 34 }}>
                <Text style={styles.overline}>
                  REACT NATIVE · V0.5.0 PRE-RELEASE
                </Text>
                <Text style={styles.heroTitle}>Parallax{"\n"}Flow</Text>
                <View style={styles.accentRule} />
                <Text style={styles.heroSub}>
                  Scroll-driven headers, depth layers and overlays — on the UI
                  thread.
                </Text>
              </View>
            </ParallaxLayer>
          </View>
        }
        overlay={
          <FadeInBar
            start={HEADER_HEIGHT - barHeight - 70}
            end={HEADER_HEIGHT - barHeight - 6}
            style={[styles.bar, { height: barHeight, paddingTop: insets.top }]}
          >
            <Text style={styles.barTitle}>Parallax Flow</Text>
          </FadeInBar>
        }
      >
        {SECTIONS.map(section => (
          <View key={section.index} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIndex}>{section.index}</Text>
              <Text style={styles.sectionLabel}>{section.label}</Text>
              <View style={styles.sectionRule} />
            </View>

            <View style={styles.grid}>
              {section.items.map(item => (
                <View key={String(item.href)} style={styles.cell}>
                  <Link href={item.href} asChild>
                    <Pressable
                      style={({ pressed }) => [
                        styles.card,
                        pressed && styles.cardPressed,
                      ]}
                    >
                      <CardVisual item={item} />
                      <View style={styles.cardBody}>
                        <Text style={styles.cardTitle} numberOfLines={1}>
                          {item.title}
                        </Text>
                        <Text style={styles.cardSub} numberOfLines={2}>
                          {item.subtitle}
                        </Text>
                      </View>
                    </Pressable>
                  </Link>
                </View>
              ))}
            </View>
          </View>
        ))}

        <Text style={styles.footer}>
          react-native-parallax-flow · MIT · powered by reanimated
        </Text>
        <View style={{ height: insets.bottom + 28 }} />
      </ParallaxScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#0b0c10" },
  header: { backgroundColor: "#0b0c10" },
  hero: { flex: 1 },

  watermarkLayer: { alignItems: "flex-end", justifyContent: "center" },
  watermark: {
    fontSize: 210,
    lineHeight: 210,
    fontWeight: "900",
    color: "rgba(255,255,255,0.04)",
    marginRight: -18,
  },

  titleLayer: { paddingHorizontal: 26 },
  overline: {
    color: "#8b8b9e",
    fontSize: 10.5,
    fontWeight: "700",
    letterSpacing: 2.5,
  },
  heroTitle: {
    color: "#ffffff",
    fontSize: 52,
    lineHeight: 54,
    fontWeight: "900",
    letterSpacing: -1,
    marginTop: 10,
  },
  accentRule: {
    width: 44,
    height: 3,
    borderRadius: 2,
    backgroundColor: "#8b5cf6",
    marginTop: 14,
  },
  heroSub: {
    color: "#9d9dae",
    fontSize: 13.5,
    lineHeight: 20,
    marginTop: 12,
    maxWidth: 280,
  },

  body: {
    backgroundColor: "#0f1117",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.07)",
  },

  bar: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(11,12,16,0.97)",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#27272a",
  },
  barTitle: { color: "#ffffff", fontSize: 16, fontWeight: "800" },

  section: { paddingTop: 30, paddingHorizontal: 16 },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 4,
  },
  sectionIndex: { color: "#8b5cf6", fontSize: 12, fontWeight: "800" },
  sectionLabel: {
    color: "#e7e7ec",
    fontSize: 12.5,
    fontWeight: "800",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  sectionRule: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: "rgba(255,255,255,0.12)",
  },

  grid: { flexDirection: "row", flexWrap: "wrap", marginTop: 14 },
  cell: { width: "50%", padding: 5 },
  card: {
    backgroundColor: "#14161d",
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  cardPressed: { opacity: 0.75, transform: [{ scale: 0.98 }] },
  visual: { height: 92 },
  visualScrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(11,12,16,0.18)",
  },
  cardBody: { padding: 12, gap: 3 },
  cardTitle: { color: "#fafafa", fontSize: 14.5, fontWeight: "700" },
  cardSub: { color: "#84848f", fontSize: 11.5, lineHeight: 16 },

  footer: {
    color: "#4b4b55",
    fontSize: 11.5,
    textAlign: "center",
    paddingTop: 36,
  },
});
