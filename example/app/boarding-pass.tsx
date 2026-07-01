import React, { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import Svg, { Path, Rect } from "react-native-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ParallaxScrollView } from "react-native-parallax-flow";
import { BackButton, FadeInBar } from "../components/Showcase";

const HEADER_HEIGHT = 340;
const HERO =
  "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&q=80";

const PAPER = "#f8fafc";
const TOOTH_HEIGHT = 22;

/** Zig-zag "torn ticket" edge, filled with the body paper color. The gaps
 *  between the teeth reveal the hero image behind — that's what the
 *  `bodyOverlap` prop is for. */
function PerforatedEdge() {
  const d = useMemo(() => {
    const teeth = 14;
    const w = 400;
    let path = `M0 ${TOOTH_HEIGHT}`;
    for (let i = 0; i < teeth; i++) {
      const mid = (w / teeth) * (i + 0.5);
      const end = (w / teeth) * (i + 1);
      path += ` L${mid} 0 L${end} ${TOOTH_HEIGHT}`;
    }
    return `${path} Z`;
  }, []);
  return (
    <Svg
      width="100%"
      height={TOOTH_HEIGHT}
      viewBox={`0 0 400 ${TOOTH_HEIGHT}`}
      preserveAspectRatio="none"
    >
      <Path d={d} fill={PAPER} />
    </Svg>
  );
}

/** Fake barcode from deterministic pseudo-random bar widths. */
function Barcode() {
  const bars = useMemo(() => {
    let seed = 20260822;
    const rand = () => {
      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      return seed / 0x7fffffff;
    };
    const out: { x: number; w: number }[] = [];
    let x = 0;
    while (x < 316) {
      const w = 1.5 + rand() * 4.5;
      out.push({ x, w });
      x += w + 1.5 + rand() * 4;
    }
    return out;
  }, []);
  return (
    <Svg width="100%" height={54} viewBox="0 0 320 54" preserveAspectRatio="none">
      {bars.map((b, i) => (
        <Rect key={i} x={b.x} y="0" width={b.w} height="54" fill="#0f172a" />
      ))}
    </Svg>
  );
}

export default function BoardingPass() {
  const insets = useSafeAreaInsets();
  const barHeight = insets.top + 52;

  return (
    <View style={styles.root}>
      <ParallaxScrollView
        headerHeight={HEADER_HEIGHT}
        parallaxFactor={0.5}
        // The body wrapper is transparent (the zig-zag edge + paper live
        // inside it), so neither the overlap nor the bounce color can be
        // derived — set both explicitly.
        bodyStyle={styles.body}
        bodyOverlap={TOOTH_HEIGHT}
        bounceColor={PAPER}
        header={
          <View style={styles.headerWrap}>
            <Image
              source={HERO}
              style={StyleSheet.absoluteFill}
              contentFit="cover"
              transition={300}
            />
            <View style={styles.scrim} />
            <View style={[styles.headerContent, { paddingTop: insets.top }]}>
              <Text style={styles.headerKicker}>NH · 107</Text>
              <Text style={styles.headerTitle}>San Francisco → Tokyo</Text>
            </View>
          </View>
        }
        overlay={
          <>
            <FadeInBar
              start={HEADER_HEIGHT - barHeight - 90}
              end={HEADER_HEIGHT - barHeight - 10}
              style={[styles.topBar, { height: barHeight, paddingTop: insets.top }]}
            >
              <Text style={styles.topBarTitle}>Boarding pass · NH 107</Text>
            </FadeInBar>
            <BackButton />
          </>
        }
      >
        <PerforatedEdge />
        <View style={styles.paper}>
          <View style={styles.routeRow}>
            <View style={styles.routeCol}>
              <Text style={styles.routeCode}>SFO</Text>
              <Text style={styles.routeCity}>San Francisco</Text>
              <Text style={styles.routeTime}>10:40</Text>
            </View>
            <View style={styles.routeMid}>
              <Text style={styles.routePlane}>✈</Text>
              <Text style={styles.routeDuration}>11h 05m</Text>
            </View>
            <View style={[styles.routeCol, styles.routeColRight]}>
              <Text style={styles.routeCode}>NRT</Text>
              <Text style={styles.routeCity}>Tokyo Narita</Text>
              <Text style={styles.routeTime}>14:45 +1</Text>
            </View>
          </View>

          <View style={styles.dashedDivider} />

          <View style={styles.detailGrid}>
            {[
              { label: "Passenger", value: "AYMAN / SALEH" },
              { label: "Date", value: "22 AUG 2026" },
              { label: "Gate", value: "B27" },
              { label: "Seat", value: "34K" },
              { label: "Boarding", value: "09:55" },
              { label: "Group", value: "2" },
            ].map(d => (
              <View key={d.label} style={styles.detail}>
                <Text style={styles.detailLabel}>{d.label}</Text>
                <Text style={styles.detailValue}>{d.value}</Text>
              </View>
            ))}
          </View>

          <View style={styles.dashedDivider} />

          <View style={styles.barcodeWrap}>
            <Barcode />
            <Text style={styles.barcodeText}>NH107 · SFO NRT · 34K</Text>
          </View>

          <Pressable style={styles.walletBtn}>
            <Text style={styles.walletBtnText}>Add to Wallet</Text>
          </Pressable>

          <View style={{ height: insets.bottom + 24 }} />
        </View>
      </ParallaxScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#0f172a" },
  headerWrap: { flex: 1 },
  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(15,23,42,0.3)",
  },
  headerContent: { flex: 1, justifyContent: "center", alignItems: "center", gap: 6 },
  headerKicker: {
    color: "#bae6fd",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 3,
  },
  headerTitle: { color: "#ffffff", fontSize: 26, fontWeight: "800" },

  body: { backgroundColor: "transparent" },
  paper: { flex: 1, backgroundColor: PAPER, paddingHorizontal: 22 },

  topBar: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(248,250,252,0.97)",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#e2e8f0",
  },
  topBarTitle: { fontSize: 15, fontWeight: "700", color: "#0f172a" },

  routeRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 22,
  },
  routeCol: { flex: 1, gap: 2 },
  routeColRight: { alignItems: "flex-end" },
  routeCode: { fontSize: 34, fontWeight: "900", color: "#0f172a" },
  routeCity: { fontSize: 12, color: "#64748b" },
  routeTime: { fontSize: 15, fontWeight: "700", color: "#0369a1" },
  routeMid: { alignItems: "center", gap: 2, paddingHorizontal: 10 },
  routePlane: { fontSize: 20, color: "#0f172a" },
  routeDuration: { fontSize: 11, color: "#64748b", fontWeight: "600" },

  dashedDivider: {
    borderBottomWidth: 1.5,
    borderStyle: "dashed",
    borderColor: "#cbd5e1",
    marginVertical: 18,
  },

  detailGrid: { flexDirection: "row", flexWrap: "wrap", rowGap: 16 },
  detail: { width: "33.333%", gap: 2 },
  detailLabel: {
    fontSize: 10.5,
    fontWeight: "700",
    letterSpacing: 0.5,
    color: "#94a3b8",
    textTransform: "uppercase",
  },
  detailValue: { fontSize: 14.5, fontWeight: "800", color: "#0f172a" },

  barcodeWrap: { gap: 8, alignItems: "center" },
  barcodeText: {
    fontSize: 11,
    color: "#64748b",
    letterSpacing: 2,
    fontVariant: ["tabular-nums"],
  },

  walletBtn: {
    marginTop: 22,
    backgroundColor: "#0f172a",
    borderRadius: 14,
    alignItems: "center",
    paddingVertical: 15,
  },
  walletBtnText: { color: "#ffffff", fontWeight: "800", fontSize: 15 },
});
