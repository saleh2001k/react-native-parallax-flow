import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ParallaxLayer, ParallaxScrollView } from "react-native-parallax-flow";
import { BackButton, FadeInBar } from "../components/Showcase";

const HEADER_HEIGHT = 540;
const PORTRAIT =
  "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&q=80";

export default function Magazine() {
  const insets = useSafeAreaInsets();
  const barHeight = insets.top + 52;

  return (
    <View style={styles.root}>
      <ParallaxScrollView
        headerHeight={HEADER_HEIGHT}
        // Every element of the cover is its own layer at its own depth — the
        // photo, the headline, the color block and the giant watermark all
        // separate as you scroll.
        headerParallax={false}
        headerStyle={styles.header}
        bodyStyle={styles.body}
        header={
          <View style={styles.cover}>
            {/* Giant watermark word — deepest, barely moves. */}
            <ParallaxLayer factor={0.06} style={styles.watermarkLayer}>
              <Text style={styles.watermark}>VOLT</Text>
            </ParallaxLayer>

            {/* Masthead — pinned near the top. */}
            <ParallaxLayer factor={0.12} style={{ paddingTop: insets.top + 56 }}>
              <View style={styles.masthead}>
                <Text style={styles.mastheadText}>VOLT MAGAZINE</Text>
                <Text style={styles.mastheadMeta}>ISSUE 08 — JULY 2026</Text>
              </View>
            </ParallaxLayer>

            {/* Color block — mid depth, slides diagonally behind the photo. */}
            <ParallaxLayer factor={0.38}>
              <View style={styles.colorBlock} />
            </ParallaxLayer>

            {/* Cover photo — near. */}
            <ParallaxLayer factor={0.55} style={styles.photoLayer}>
              <Image
                source={PORTRAIT}
                style={styles.photo}
                contentFit="cover"
                transition={300}
              />
            </ParallaxLayer>

            {/* Headline — nearest text, overlaps the photo. */}
            <ParallaxLayer factor={0.72} style={styles.headlineLayer}>
              <Text style={styles.headline}>THE{"\n"}NEW{"\n"}WAVE</Text>
              <Text style={styles.subline}>
                Sound, style and the studios shaping next year
              </Text>
            </ParallaxLayer>
          </View>
        }
        overlay={
          <>
            <FadeInBar
              start={HEADER_HEIGHT - barHeight - 130}
              end={HEADER_HEIGHT - barHeight - 40}
              style={[styles.bar, { height: barHeight, paddingTop: insets.top }]}
            >
              <Text style={styles.barTitle}>VOLT · The New Wave</Text>
            </FadeInBar>
            <BackButton variant="solid" />
          </>
        }
      >
        <View style={styles.article}>
          <Text style={styles.lede}>
            Every decade gets a sound. This one is being mixed in bedrooms,
            garages and one very loud warehouse in Rotterdam.
          </Text>
          <Text style={styles.paragraph}>
            The producers profiled in this issue share almost nothing —
            not genre, not geography, not gear. What they share is a refusal
            to master for the algorithm: songs that start quiet, breathe
            slowly and reward the second listen.
          </Text>

          <View style={styles.pullQuote}>
            <Text style={styles.pullQuoteText}>
              "We stopped asking what the platform wants. The room tells you
              what it wants."
            </Text>
            <Text style={styles.pullQuoteAttr}>— Mara Voss, Studio Achtung</Text>
          </View>

          <Text style={styles.paragraph}>
            Across forty pages we visit six studios, one abandoned pool
            turned echo chamber, and the mastering engineer who deleted his
            loudness meter. The new wave isn't louder. It's closer.
          </Text>
        </View>

        <View style={{ height: insets.bottom + 36 }} />
      </ParallaxScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#f4f1ea" },
  header: { backgroundColor: "#f4f1ea" },
  cover: { flex: 1 },

  watermarkLayer: { alignItems: "center", justifyContent: "center" },
  watermark: {
    fontSize: 170,
    fontWeight: "900",
    color: "rgba(28,25,23,0.07)",
    letterSpacing: 8,
    transform: [{ rotate: "-90deg" }],
  },

  masthead: { alignItems: "center", gap: 3 },
  mastheadText: {
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: 6,
    color: "#1c1917",
  },
  mastheadMeta: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 2,
    color: "#78716c",
  },

  colorBlock: {
    position: "absolute",
    right: -60,
    top: "30%",
    width: 260,
    height: 340,
    backgroundColor: "#facc15",
    transform: [{ rotate: "8deg" }],
  },

  photoLayer: { alignItems: "flex-end", paddingRight: 26, paddingTop: 150 },
  photo: {
    width: 235,
    height: 310,
    borderWidth: 6,
    borderColor: "#1c1917",
  },

  headlineLayer: { justifyContent: "flex-end", padding: 26, paddingBottom: 84 },
  headline: {
    fontSize: 64,
    lineHeight: 62,
    fontWeight: "900",
    color: "#1c1917",
    letterSpacing: -1,
  },
  subline: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: "600",
    color: "#57534e",
    maxWidth: 240,
  },

  body: {
    backgroundColor: "#ffffff",
    borderTopRightRadius: 64,
  },

  bar: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.97)",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#e7e5e4",
  },
  barTitle: {
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 2,
    color: "#1c1917",
  },

  article: { padding: 26, gap: 18 },
  lede: {
    fontSize: 20,
    lineHeight: 29,
    fontWeight: "700",
    color: "#1c1917",
  },
  paragraph: { fontSize: 15, lineHeight: 24, color: "#44403c" },
  pullQuote: {
    borderLeftWidth: 4,
    borderLeftColor: "#facc15",
    paddingLeft: 18,
    paddingVertical: 4,
    gap: 8,
  },
  pullQuoteText: {
    fontSize: 19,
    lineHeight: 27,
    fontWeight: "800",
    color: "#1c1917",
    fontStyle: "italic",
  },
  pullQuoteAttr: { fontSize: 12.5, fontWeight: "600", color: "#78716c" },
});
