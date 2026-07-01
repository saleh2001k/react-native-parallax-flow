import React, { useMemo } from "react";
import { StyleSheet, Text, useWindowDimensions, View } from "react-native";
import Svg, {
  Circle,
  Defs,
  Ellipse,
  LinearGradient,
  RadialGradient,
  Rect,
  Stop,
} from "react-native-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ParallaxLayer, ParallaxScrollView } from "react-native-parallax-flow";
import { BackButton, FadeInBar } from "../components/Showcase";

const FACTS = [
  { label: "Distance from Sun", value: "1.43 billion km" },
  { label: "Day length", value: "10.7 hours" },
  { label: "Year length", value: "29.4 Earth years" },
  { label: "Known moons", value: "146" },
  { label: "Ring span", value: "282,000 km" },
  { label: "Made of", value: "Hydrogen & helium" },
];

function makeStars(count: number, seedInit: number) {
  let seed = seedInit;
  const rand = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };
  return Array.from({ length: count }).map(() => ({
    cx: rand() * 100,
    cy: rand() * 150,
    r: rand() * 0.45 + 0.15,
    o: rand() * 0.7 + 0.25,
  }));
}

export default function Space() {
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const headerHeight = Math.round(height * 0.62);
  const barHeight = insets.top + 52;
  const starsFar = useMemo(() => makeStars(70, 424242), []);
  const starsNear = useMemo(() => makeStars(35, 777), []);

  return (
    <View style={styles.root}>
      <ParallaxScrollView
        headerHeight={headerHeight}
        headerParallax={false}
        headerStyle={styles.header}
        bodyStyle={styles.body}
        header={
          <View style={styles.scene}>
            {/* Deep space + nebula — farthest. */}
            <ParallaxLayer factor={0.03}>
              <Svg
                width="100%"
                height="100%"
                viewBox="0 0 100 200"
                preserveAspectRatio="xMidYMid slice"
              >
                <Defs>
                  <LinearGradient id="space" x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0" stopColor="#020208" />
                    <Stop offset="0.5" stopColor="#0a0a1e" />
                    <Stop offset="1" stopColor="#11112e" />
                  </LinearGradient>
                  <RadialGradient id="nebula" cx="0.3" cy="0.35" r="0.5">
                    <Stop offset="0" stopColor="#7c3aed" stopOpacity={0.28} />
                    <Stop offset="0.6" stopColor="#4c1d95" stopOpacity={0.12} />
                    <Stop offset="1" stopColor="#4c1d95" stopOpacity={0} />
                  </RadialGradient>
                </Defs>
                <Rect x="0" y="0" width="100" height="200" fill="url(#space)" />
                <Rect x="0" y="0" width="100" height="200" fill="url(#nebula)" />
              </Svg>
            </ParallaxLayer>

            {/* Star fields at two depths. */}
            <ParallaxLayer factor={0.08}>
              <Svg
                width="100%"
                height="100%"
                viewBox="0 0 100 200"
                preserveAspectRatio="xMidYMin slice"
              >
                {starsFar.map((s, i) => (
                  <Circle
                    key={i}
                    cx={s.cx}
                    cy={s.cy}
                    r={s.r}
                    fill="#ffffff"
                    opacity={s.o}
                  />
                ))}
              </Svg>
            </ParallaxLayer>
            <ParallaxLayer factor={0.15}>
              <Svg
                width="100%"
                height="100%"
                viewBox="0 0 100 200"
                preserveAspectRatio="xMidYMin slice"
              >
                {starsNear.map((s, i) => (
                  <Circle
                    key={i}
                    cx={s.cx}
                    cy={s.cy}
                    r={s.r * 1.5}
                    fill="#dbeafe"
                    opacity={s.o}
                  />
                ))}
              </Svg>
            </ParallaxLayer>

            {/* Title — drifts slowly above the planet. */}
            <ParallaxLayer factor={0.25} style={{ paddingTop: insets.top + 58 }}>
              <View style={styles.titleWrap}>
                <Text style={styles.kicker}>THE SOLAR SYSTEM</Text>
                <Text style={styles.title}>Saturn</Text>
              </View>
            </ParallaxLayer>

            {/* Saturn — nearest, zooms on pull. */}
            <ParallaxLayer
              factor={0.5}
              zoomOnPull
              zoomReference={headerHeight}
              style={styles.planetLayer}
            >
              <Svg
                width="100%"
                height="100%"
                viewBox="0 0 100 100"
                preserveAspectRatio="xMidYMid meet"
              >
                <Defs>
                  <LinearGradient id="planet" x1="0" y1="0" x2="1" y2="1">
                    <Stop offset="0" stopColor="#f5deb3" />
                    <Stop offset="0.5" stopColor="#deb887" />
                    <Stop offset="1" stopColor="#8b6f47" />
                  </LinearGradient>
                </Defs>
                {/* Ring behind */}
                <Ellipse
                  cx="50"
                  cy="50"
                  rx="42"
                  ry="11"
                  stroke="#c9b28a"
                  strokeWidth="4"
                  strokeOpacity={0.55}
                  fill="none"
                  transform="rotate(-16 50 50)"
                />
                <Circle cx="50" cy="50" r="24" fill="url(#planet)" />
                {/* Ring front */}
                <Ellipse
                  cx="50"
                  cy="50"
                  rx="34"
                  ry="8"
                  stroke="#e8d5ae"
                  strokeWidth="2.4"
                  strokeOpacity={0.85}
                  fill="none"
                  transform="rotate(-16 50 50)"
                />
              </Svg>
            </ParallaxLayer>

            {/* A stray moon — fastest, nearest. */}
            <ParallaxLayer factor={0.72}>
              <Svg
                width="100%"
                height="100%"
                viewBox="0 0 100 200"
                preserveAspectRatio="xMidYMin slice"
              >
                <Circle cx="16" cy="120" r="3.4" fill="#94a3b8" />
                <Circle cx="15" cy="118.8" r="1" fill="#64748b" opacity={0.8} />
              </Svg>
            </ParallaxLayer>
          </View>
        }
        overlay={
          <>
            <FadeInBar
              start={headerHeight - barHeight - 120}
              end={headerHeight - barHeight - 30}
              style={[styles.bar, { height: barHeight, paddingTop: insets.top }]}
            >
              <Text style={styles.barTitle}>Saturn</Text>
            </FadeInBar>
            <BackButton variant="minimal" />
          </>
        }
      >
        <View style={styles.section}>
          <Text style={styles.heading}>The ringed giant</Text>
          <Text style={styles.paragraph}>
            Saturn is the sixth planet from the Sun and the second largest —
            a gas giant so light it would float in water. Its rings are made
            of billions of chunks of ice and rock, some as small as dust,
            others the size of houses.
          </Text>
        </View>

        <View style={styles.factGrid}>
          {FACTS.map(f => (
            <View key={f.label} style={styles.factCell}>
              <View style={styles.factCard}>
                <Text style={styles.factValue}>{f.value}</Text>
                <Text style={styles.factLabel}>{f.label}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>Cassini's legacy</Text>
          <Text style={styles.paragraph}>
            The Cassini probe orbited Saturn for 13 years, diving between the
            planet and its rings 22 times before its final plunge in 2017 —
            sending data until the very last second.
          </Text>
        </View>

        <View style={{ height: insets.bottom + 36 }} />
      </ParallaxScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#020208" },
  header: { backgroundColor: "#020208" },
  scene: { flex: 1 },
  titleWrap: { alignItems: "center", gap: 4 },
  kicker: {
    color: "#a5b4fc",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 3,
  },
  title: { color: "#ffffff", fontSize: 44, fontWeight: "900" },
  planetLayer: { top: "16%" },

  body: {
    backgroundColor: "#0d0d1c",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderTopWidth: 1,
    borderTopColor: "rgba(165,180,252,0.25)",
  },

  bar: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(2,2,8,0.97)",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#1e1b4b",
  },
  barTitle: { fontSize: 16, fontWeight: "700", color: "#e0e7ff" },

  section: { paddingHorizontal: 22, paddingTop: 26, gap: 10 },
  heading: { fontSize: 19, fontWeight: "800", color: "#e0e7ff" },
  paragraph: { fontSize: 14.5, lineHeight: 22, color: "#94a3b8" },

  factGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    paddingTop: 22,
    gap: 0,
  },
  factCell: { width: "50%", padding: 6 },
  factCard: {
    backgroundColor: "#15152b",
    borderRadius: 14,
    padding: 14,
    gap: 3,
  },
  factValue: { color: "#e0e7ff", fontSize: 16, fontWeight: "800" },
  factLabel: { color: "#6b7194", fontSize: 11.5, fontWeight: "600" },
});
