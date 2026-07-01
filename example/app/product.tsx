import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { ParallaxScrollView } from "react-native-parallax-flow";
import { BackButton, FadeInBar } from "../components/Showcase";

const HEADER_HEIGHT = 380;
const PRODUCT_IMAGE =
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&q=80";

const COLORS = [
  { id: "crimson", value: "#dc2626" },
  { id: "midnight", value: "#1e293b" },
  { id: "sand", value: "#d6c7a1" },
  { id: "sage", value: "#84a98c" },
];
const SIZES = ["38", "39", "40", "41", "42", "43", "44"];

const DETAILS = [
  { label: "Material", value: "Knit mesh, recycled rubber" },
  { label: "Weight", value: "245 g (size 42)" },
  { label: "Drop", value: "8 mm heel-to-toe" },
  { label: "Delivery", value: "Free, 2–4 business days" },
];

export default function Product() {
  const insets = useSafeAreaInsets();
  const barHeight = insets.top + 52;
  const [color, setColor] = useState("crimson");
  const [size, setSize] = useState("42");

  // Docking animation: mirror the scroll offset through the `scrollY` prop and
  // flatten the body's top radius as it slides under the navbar, so the sheet
  // "docks" into a full-width page.
  const scrollY = useSharedValue(0);
  const dockStyle = useAnimatedStyle(() => {
    "worklet";
    const radius = interpolate(
      scrollY.value,
      [HEADER_HEIGHT - barHeight - 90, HEADER_HEIGHT - barHeight],
      [28, 0],
      Extrapolation.CLAMP,
    );
    return { borderTopLeftRadius: radius, borderTopRightRadius: radius };
  });

  return (
    <View style={styles.root}>
      <ParallaxScrollView
        headerHeight={HEADER_HEIGHT}
        parallaxFactor={0.55}
        scrollY={scrollY}
        bodyStyle={[styles.bodySheet, dockStyle]}
        // Radius lives in the animated style, so the auto-derive can't see
        // it — overlap the hero by the resting radius explicitly.
        bodyOverlap={28}
        header={
          <View style={styles.headerWrap}>
            <Image
              source={PRODUCT_IMAGE}
              style={StyleSheet.absoluteFill}
              contentFit="cover"
              transition={300}
            />
          </View>
        }
        overlay={
          <>
            <FadeInBar
              start={HEADER_HEIGHT - barHeight - 100}
              end={HEADER_HEIGHT - barHeight}
              style={[styles.bar, { height: barHeight, paddingTop: insets.top }]}
            >
              <Text style={styles.barTitle} numberOfLines={1}>
                Air Zoom Pulse
              </Text>
              <Text style={styles.barPrice}>$139</Text>
            </FadeInBar>
            <BackButton variant="solid" />
          </>
        }
      >
        <View style={styles.content}>
          <Text style={styles.kicker}>RUNNING · MEN</Text>
          <View style={styles.titleRow}>
            <Text style={styles.title}>Air Zoom Pulse</Text>
            <Text style={styles.price}>$139</Text>
          </View>
          <Text style={styles.rating}>★ 4.8 · 324 reviews</Text>

          <Text style={styles.sectionLabel}>Color</Text>
          <View style={styles.swatchRow}>
            {COLORS.map(c => (
              <Pressable
                key={c.id}
                onPress={() => setColor(c.id)}
                style={[
                  styles.swatch,
                  { backgroundColor: c.value },
                  color === c.id && styles.swatchActive,
                ]}
              />
            ))}
          </View>

          <Text style={styles.sectionLabel}>Size (EU)</Text>
          <View style={styles.sizeRow}>
            {SIZES.map(s => (
              <Pressable
                key={s}
                onPress={() => setSize(s)}
                style={[styles.sizePill, size === s && styles.sizePillActive]}
              >
                <Text
                  style={[styles.sizeText, size === s && styles.sizeTextActive]}
                >
                  {s}
                </Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.sectionLabel}>Description</Text>
          <Text style={styles.description}>
            A featherweight daily trainer with a responsive foam midsole and a
            breathable knit upper. Built for tempo runs and easy miles alike —
            the recycled rubber outsole grips wet pavement without adding bulk.
          </Text>

          <Text style={styles.sectionLabel}>Details</Text>
          <View style={styles.detailCard}>
            {DETAILS.map((d, i) => (
              <View
                key={d.label}
                style={[styles.detailRow, i > 0 && styles.detailRowBorder]}
              >
                <Text style={styles.detailLabel}>{d.label}</Text>
                <Text style={styles.detailValue}>{d.value}</Text>
              </View>
            ))}
          </View>

          {/* Spacer so the sticky CTA never covers the last content. */}
          <View style={{ height: 96 + insets.bottom }} />
        </View>
      </ParallaxScrollView>

      {/* Sticky add-to-cart bar */}
      <View style={[styles.cta, { paddingBottom: insets.bottom + 12 }]}>
        <View>
          <Text style={styles.ctaPriceLabel}>Total</Text>
          <Text style={styles.ctaPrice}>$139</Text>
        </View>
        <Pressable style={styles.ctaButton}>
          <Text style={styles.ctaButtonText}>Add to Cart</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#e7e5e4" },
  headerWrap: { flex: 1 },
  // Top radius is animated (see dockStyle); only paint the surface here.
  bodySheet: {
    backgroundColor: "#ffffff",
  },

  bar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingHorizontal: 70,
    backgroundColor: "rgba(255,255,255,0.97)",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#e5e7eb",
  },
  barTitle: { fontSize: 16, fontWeight: "700", color: "#111827", flexShrink: 1 },
  barPrice: { fontSize: 16, fontWeight: "800", color: "#dc2626" },

  content: { padding: 24, gap: 8 },
  kicker: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.5,
    color: "#9ca3af",
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },
  title: { fontSize: 26, fontWeight: "800", color: "#111827", flexShrink: 1 },
  price: { fontSize: 24, fontWeight: "800", color: "#dc2626" },
  rating: { fontSize: 13, color: "#6b7280" },

  sectionLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111827",
    marginTop: 16,
  },
  swatchRow: { flexDirection: "row", gap: 12, marginTop: 4 },
  swatch: { width: 34, height: 34, borderRadius: 17 },
  swatchActive: {
    borderWidth: 3,
    borderColor: "#ffffff",
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 3,
  },
  sizeRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 4 },
  sizePill: {
    minWidth: 48,
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "#f3f4f6",
  },
  sizePillActive: { backgroundColor: "#111827" },
  sizeText: { fontSize: 14, fontWeight: "700", color: "#374151" },
  sizeTextActive: { color: "#ffffff" },
  description: { fontSize: 14, lineHeight: 21, color: "#4b5563", marginTop: 4 },

  detailCard: {
    backgroundColor: "#f9fafb",
    borderRadius: 14,
    paddingHorizontal: 16,
    marginTop: 4,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
    paddingVertical: 12,
  },
  detailRowBorder: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#e5e7eb",
  },
  detailLabel: { fontSize: 13, color: "#6b7280" },
  detailValue: { fontSize: 13, fontWeight: "600", color: "#111827" },

  cta: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 14,
    backgroundColor: "#ffffff",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#e5e7eb",
  },
  ctaPriceLabel: { fontSize: 11, color: "#9ca3af" },
  ctaPrice: { fontSize: 20, fontWeight: "800", color: "#111827" },
  ctaButton: {
    backgroundColor: "#111827",
    paddingHorizontal: 36,
    paddingVertical: 14,
    borderRadius: 26,
  },
  ctaButtonText: { color: "#ffffff", fontWeight: "700", fontSize: 15 },
});
