import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ParallaxScrollView } from "react-native-parallax-flow";
import { BackButton, BlurFadeBar } from "../components/Showcase";

const HEADER_HEIGHT = 420;
const HERO =
  "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1200&q=80";

const GALLERY = [
  "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=600&q=80",
  "https://images.unsplash.com/photo-1560703650-ef3e0f254ae0?w=600&q=80",
  "https://images.unsplash.com/photo-1504512485720-7d83a16ee930?w=600&q=80",
  "https://images.unsplash.com/photo-1523592121529-f6dde35f079e?w=600&q=80",
];

const EXPERIENCES = [
  { icon: "⛵", title: "Caldera sunset cruise", meta: "4.9 · 3 hours" },
  { icon: "🍷", title: "Volcanic vineyard tasting", meta: "4.8 · 2 hours" },
  { icon: "🥾", title: "Fira → Oia rim hike", meta: "4.9 · half day" },
  { icon: "🏛️", title: "Akrotiri ruins tour", meta: "4.7 · 2 hours" },
];

export default function Travel() {
  const insets = useSafeAreaInsets();
  const barHeight = insets.top + 52;

  return (
    <View style={styles.root}>
      <ParallaxScrollView
        headerHeight={HEADER_HEIGHT}
        parallaxFactor={0.5}
        bodyStyle={styles.body}
        bounceColor="#ffffff"
        header={
          <View style={styles.headerWrap}>
            <Image
              source={HERO}
              style={StyleSheet.absoluteFill}
              contentFit="cover"
              transition={300}
            />
            {/* Frosted-glass info card pinned to the hero's bottom edge. */}
            <View style={styles.glassCardWrap}>
              <BlurView intensity={50} tint="light" style={styles.glassCard}>
                <View style={styles.glassMain}>
                  <Text style={styles.glassTitle}>Santorini</Text>
                  <Text style={styles.glassSub}>Cyclades, Greece</Text>
                </View>
                <View style={styles.glassSide}>
                  <Text style={styles.glassTemp}>27°</Text>
                  <Text style={styles.glassRating}>★ 4.9</Text>
                </View>
              </BlurView>
            </View>
          </View>
        }
        overlay={
          <>
            <BlurFadeBar
              start={HEADER_HEIGHT - barHeight - 120}
              end={HEADER_HEIGHT - barHeight - 30}
              tint="light"
              style={[styles.bar, { height: barHeight, paddingTop: insets.top }]}
            >
              <Text style={styles.barTitle}>Santorini</Text>
            </BlurFadeBar>
            <BackButton variant="blur" blurTint="dark" />
          </>
        }
      >
        <View style={styles.section}>
          <Text style={styles.heading}>About</Text>
          <Text style={styles.paragraph}>
            White-washed villages spill down volcanic cliffs above a flooded
            caldera. Days are for black-sand beaches and hilltop ruins; evenings
            belong to Oia's famous sunset, best watched from the castle walls
            with the crowds — or from a catamaran without them.
          </Text>
        </View>

        <View style={styles.gallerySection}>
          <Text style={[styles.heading, styles.galleryHeading]}>Gallery</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.galleryRow}
          >
            {GALLERY.map(uri => (
              <Image
                key={uri}
                source={uri}
                style={styles.galleryImage}
                contentFit="cover"
                transition={300}
              />
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>Top experiences</Text>
          {EXPERIENCES.map(e => (
            <View key={e.title} style={styles.expRow}>
              <Text style={styles.expIcon}>{e.icon}</Text>
              <View style={styles.expMain}>
                <Text style={styles.expTitle}>{e.title}</Text>
                <Text style={styles.expMeta}>{e.meta}</Text>
              </View>
              <Text style={styles.expChevron}>›</Text>
            </View>
          ))}
        </View>
        <View style={{ height: insets.bottom + 32 }} />
      </ParallaxScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#0c4a6e" },
  headerWrap: { flex: 1, justifyContent: "flex-end" },
  glassCardWrap: { paddingHorizontal: 16, paddingBottom: 42 },
  glassCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    overflow: "hidden",
    padding: 18,
  },
  glassMain: { flex: 1, gap: 2 },
  glassTitle: { fontSize: 26, fontWeight: "800", color: "#0f172a" },
  glassSub: { fontSize: 13, fontWeight: "600", color: "#334155" },
  glassSide: { alignItems: "flex-end", gap: 2 },
  glassTemp: { fontSize: 24, fontWeight: "800", color: "#0f172a" },
  glassRating: { fontSize: 13, fontWeight: "700", color: "#b45309" },

  body: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },

  bar: {
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(15,23,42,0.12)",
  },
  barTitle: { fontSize: 16, fontWeight: "700", color: "#0f172a" },

  section: { paddingHorizontal: 22, paddingTop: 24, gap: 10 },
  heading: { fontSize: 19, fontWeight: "800", color: "#0f172a" },
  paragraph: { fontSize: 14.5, lineHeight: 22, color: "#475569" },

  gallerySection: { paddingTop: 24 },
  galleryHeading: { paddingHorizontal: 22, marginBottom: 10 },
  galleryRow: { paddingHorizontal: 22, gap: 10 },
  galleryImage: { width: 150, height: 200, borderRadius: 16 },

  expRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: "#f8fafc",
    borderRadius: 16,
    padding: 14,
  },
  expIcon: { fontSize: 24 },
  expMain: { flex: 1, gap: 2 },
  expTitle: { fontSize: 15, fontWeight: "700", color: "#0f172a" },
  expMeta: { fontSize: 12, color: "#64748b" },
  expChevron: { fontSize: 22, color: "#94a3b8", fontWeight: "300" },
});
