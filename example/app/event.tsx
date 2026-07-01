import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ParallaxScrollView } from "react-native-parallax-flow";
import { BackButton, FadeInBar } from "../components/Showcase";

const HEADER_HEIGHT = 400;
const POSTER =
  "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200&q=80";

const LINEUP = [
  { time: "19:30", act: "Glass Arcade", stage: "Opening" },
  { time: "20:20", act: "Nova State", stage: "Main stage" },
  { time: "21:30", act: "Violet Motors", stage: "Main stage" },
  { time: "23:00", act: "Midnight DJ set", stage: "Terrace" },
];

export default function Event() {
  const insets = useSafeAreaInsets();
  const barHeight = insets.top + 52;

  return (
    <View style={styles.root}>
      <ParallaxScrollView
        headerHeight={HEADER_HEIGHT}
        parallaxFactor={0.45}
        bodyStyle={styles.body}
        bounceColor="#111113"
        header={
          <View style={styles.headerWrap}>
            <Image
              source={POSTER}
              style={StyleSheet.absoluteFill}
              contentFit="cover"
              transition={300}
            />
            <View style={styles.posterScrim} />
            <View style={styles.headerContent}>
              <View style={styles.dateChip}>
                <Text style={styles.dateChipText}>SAT · AUG 22 · 19:00</Text>
              </View>
              <Text style={styles.eventTitle}>Neon Nights Festival</Text>
              <Text style={styles.eventVenue}>Harbor Amphitheatre · Lisbon</Text>
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
              <Text style={styles.barTitle}>Neon Nights Festival</Text>
            </FadeInBar>
            <BackButton variant="solid" />
          </>
        }
      >
        <View style={styles.section}>
          <Text style={styles.heading}>Lineup</Text>
          {LINEUP.map(slot => (
            <View key={slot.time} style={styles.slot}>
              <Text style={styles.slotTime}>{slot.time}</Text>
              <View style={styles.slotMain}>
                <Text style={styles.slotAct}>{slot.act}</Text>
                <Text style={styles.slotStage}>{slot.stage}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>About</Text>
          <Text style={styles.paragraph}>
            One night, three stages, and the harbor skyline behind the main
            act. Doors open at 19:00 — come early for the sunset set on the
            terrace. Rain or shine; the amphitheatre is partially covered.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>Good to know</Text>
          <Text style={styles.bullet}>• 16+ event, ID required</Text>
          <Text style={styles.bullet}>• Re-entry allowed until 22:00</Text>
          <Text style={styles.bullet}>• Metro: Estação Oriente, 10 min walk</Text>
        </View>

        {/* Spacer so the blur ticket bar never covers the last content. */}
        <View style={{ height: 110 + insets.bottom }} />
      </ParallaxScrollView>

      {/* Frosted ticket bar — content scrolls visibly underneath the blur. */}
      <View style={[styles.ticketBarWrap, { paddingBottom: insets.bottom + 10 }]}>
        <BlurView intensity={60} tint="dark" style={StyleSheet.absoluteFill} />
        <View>
          <Text style={styles.ticketLabel}>From</Text>
          <Text style={styles.ticketPrice}>€59</Text>
        </View>
        <Pressable style={styles.ticketButton}>
          <Text style={styles.ticketButtonText}>Get Tickets</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#09090b" },
  headerWrap: { flex: 1, justifyContent: "flex-end" },
  posterScrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(9,9,11,0.35)",
  },
  headerContent: { padding: 22, paddingBottom: 40, gap: 8 },
  dateChip: {
    alignSelf: "flex-start",
    backgroundColor: "#f43f5e",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  dateChipText: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
  },
  eventTitle: { color: "#ffffff", fontSize: 32, fontWeight: "900" },
  eventVenue: { color: "#d4d4d8", fontSize: 14, fontWeight: "600" },

  body: {
    backgroundColor: "#111113",
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
  },

  bar: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(9,9,11,0.97)",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#27272a",
  },
  barTitle: { fontSize: 15, fontWeight: "700", color: "#fafafa" },

  section: { paddingHorizontal: 22, paddingTop: 26, gap: 10 },
  heading: { fontSize: 19, fontWeight: "800", color: "#fafafa" },
  paragraph: { fontSize: 14.5, lineHeight: 22, color: "#a1a1aa" },
  bullet: { fontSize: 14, lineHeight: 22, color: "#a1a1aa" },

  slot: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    backgroundColor: "#1a1a1e",
    borderRadius: 14,
    padding: 14,
  },
  slotTime: {
    color: "#f43f5e",
    fontSize: 14,
    fontWeight: "800",
    fontVariant: ["tabular-nums"],
  },
  slotMain: { flex: 1, gap: 2 },
  slotAct: { color: "#fafafa", fontSize: 15, fontWeight: "700" },
  slotStage: { color: "#71717a", fontSize: 12 },

  ticketBarWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 22,
    paddingTop: 12,
    overflow: "hidden",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(255,255,255,0.12)",
  },
  ticketLabel: { color: "#a1a1aa", fontSize: 11 },
  ticketPrice: { color: "#ffffff", fontSize: 22, fontWeight: "800" },
  ticketButton: {
    backgroundColor: "#f43f5e",
    paddingHorizontal: 32,
    paddingVertical: 13,
    borderRadius: 24,
  },
  ticketButtonText: { color: "#ffffff", fontWeight: "800", fontSize: 15 },
});
