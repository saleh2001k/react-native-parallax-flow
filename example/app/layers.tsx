import React, { useMemo } from "react";
import { StyleSheet, Text, useWindowDimensions, View } from "react-native";
import Svg, {
  Circle,
  Defs,
  Ellipse,
  G,
  LinearGradient,
  Path,
  RadialGradient,
  Rect,
  Stop,
} from "react-native-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import {
  ParallaxLayer,
  ParallaxScrollView,
  useParallaxScroll,
} from "react-native-parallax-flow";
import { BackButton, Filler } from "../components/Showcase";
import { BgPaths } from "../components/mountainPaths";

// Mountains are authored in this space; slice + bottom-anchor them.
const MTN_VB = "0 0 4000 2000";
const MTN_FIT = "xMidYMax slice" as const;

function makeStars(count: number, seedInit: number) {
  let seed = seedInit;
  const rand = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };
  return Array.from({ length: count }).map(() => ({
    cx: rand() * 100,
    cy: rand() * 130,
    r: rand() * 0.5 + 0.2,
    o: rand() * 0.6 + 0.3,
  }));
}

/** Soft SVG cloud bank — drawn locally so the scene never depends on remote
 *  assets. One blurred-looking cluster from stacked ellipses. */
function CloudBank({ tint = "#ffffff" }: { tint?: string }) {
  return (
    <Svg
      width="100%"
      height="100%"
      viewBox="0 0 100 40"
      preserveAspectRatio="xMidYMid meet"
    >
      <G fill={tint}>
        <Ellipse cx="22" cy="18" rx="16" ry="4.5" opacity={0.16} />
        <Ellipse cx="30" cy="15" rx="10" ry="3" opacity={0.22} />
        <Ellipse cx="70" cy="26" rx="20" ry="5" opacity={0.14} />
        <Ellipse cx="78" cy="23" rx="11" ry="3" opacity={0.2} />
        <Ellipse cx="48" cy="33" rx="14" ry="3.5" opacity={0.12} />
      </G>
    </Svg>
  );
}

/** "Scroll" hint that fades away as soon as the user starts scrolling. */
function ScrollHint() {
  const scrollY = useParallaxScroll();
  const animatedStyle = useAnimatedStyle(() => {
    "worklet";
    const t = interpolate(scrollY.value, [0, 90], [1, 0], Extrapolation.CLAMP);
    return { opacity: t, transform: [{ translateY: (1 - t) * 14 }] };
  });
  return (
    <Animated.View style={[styles.hint, animatedStyle]}>
      <Text style={styles.hintText}>scroll</Text>
      <Text style={styles.hintChevron}>⌄</Text>
    </Animated.View>
  );
}

export default function Layers() {
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const headerHeight = Math.round(height * 0.65);
  const starsWhite = useMemo(() => makeStars(60, 1337), []);
  const starsPurple = useMemo(() => makeStars(40, 9001), []);

  return (
    <View style={styles.root}>
      <BackButton variant="minimal" />
      <ParallaxScrollView
        headerHeight={headerHeight}
        // Each ParallaxLayer owns its own motion → turn off the container's.
        headerParallax={false}
        headerStyle={styles.header}
        // The scene continues into a dark body — no white sheet breaking the
        // night mood; a faint horizon line marks the seam.
        bodyStyle={styles.body}
        header={
          <View style={styles.scene}>
            {/* Sky gradient — slowest (farthest). */}
            <ParallaxLayer factor={0.04}>
              <Svg
                width="100%"
                height="100%"
                viewBox="0 0 100 200"
                preserveAspectRatio="xMidYMid slice"
              >
                <Defs>
                  <LinearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0" stopColor="#000000" />
                    <Stop offset="0.3" stopColor="#000000" />
                    <Stop offset="0.45" stopColor="#111122" />
                    <Stop offset="0.55" stopColor="#332233" />
                    <Stop offset="0.72" stopColor="#884444" />
                    <Stop offset="0.82" stopColor="#ff9955" />
                    <Stop offset="0.9" stopColor="#ff9900" />
                    <Stop offset="1" stopColor="#ff9900" />
                  </LinearGradient>
                </Defs>
                <Rect x="0" y="0" width="100" height="200" fill="url(#sky)" />
              </Svg>
            </ParallaxLayer>

            {/* Stars — two tints at slightly different depths. */}
            <ParallaxLayer factor={0.1}>
              <Svg
                width="100%"
                height="100%"
                viewBox="0 0 100 200"
                preserveAspectRatio="xMidYMin slice"
              >
                {starsWhite.map((s, i) => (
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
            <ParallaxLayer factor={0.13}>
              <Svg
                width="100%"
                height="100%"
                viewBox="0 0 100 200"
                preserveAspectRatio="xMidYMin slice"
              >
                {starsPurple.map((s, i) => (
                  <Circle
                    key={i}
                    cx={s.cx}
                    cy={s.cy}
                    r={s.r * 0.8}
                    fill="#ceb9ff"
                    opacity={s.o * 0.5}
                  />
                ))}
              </Svg>
            </ParallaxLayer>

            {/* Moon with a soft glow. */}
            <ParallaxLayer factor={0.16}>
              <Svg
                width="100%"
                height="100%"
                viewBox="0 0 100 200"
                preserveAspectRatio="xMidYMin slice"
              >
                <Defs>
                  <RadialGradient id="moonGlow" cx="0.5" cy="0.5" r="0.5">
                    <Stop offset="0" stopColor="#fff7e0" stopOpacity={0.5} />
                    <Stop offset="0.5" stopColor="#fff7e0" stopOpacity={0.14} />
                    <Stop offset="1" stopColor="#fff7e0" stopOpacity={0} />
                  </RadialGradient>
                </Defs>
                <Circle cx="76" cy="34" r="22" fill="url(#moonGlow)" />
                <Circle cx="76" cy="34" r="6.5" fill="#fdf3d8" />
                <Circle cx="74" cy="32.5" r="1.4" fill="#e8dcbc" opacity={0.7} />
                <Circle cx="78.5" cy="36" r="0.9" fill="#e8dcbc" opacity={0.6} />
              </Svg>
            </ParallaxLayer>

            {/* Clouds — local SVG, no remote assets. */}
            <ParallaxLayer factor={0.24} style={styles.cloudLayer}>
              <CloudBank />
            </ParallaxLayer>

            {/* Title + scroll hint — subtle independent drift. */}
            <ParallaxLayer
              factor={0.35}
              style={{ paddingTop: insets.top + 64 }}
            >
              <View style={styles.titleWrap}>
                <Text style={styles.kicker}>MULTI-LAYER PARALLAX</Text>
                <Text style={styles.title}>Night Ridge</Text>
                <ScrollHint />
              </View>
            </ParallaxLayer>

            {/* Far mountains — layer1 (two gradient fills). */}
            <ParallaxLayer factor={0.4} style={styles.mtnBand}>
              <Svg
                width="100%"
                height="100%"
                viewBox={MTN_VB}
                preserveAspectRatio={MTN_FIT}
              >
                <Defs>
                  <LinearGradient
                    id="g1"
                    x1="2000"
                    y1="600"
                    x2="2000"
                    y2="2000"
                    gradientUnits="userSpaceOnUse"
                  >
                    <Stop offset="0.01" stopColor="#ffc0bd" />
                    <Stop offset="1" stopColor="#914d64" stopOpacity={0.53} />
                  </LinearGradient>
                  <LinearGradient id="g2" x1="0" y1="1" x2="1" y2="1">
                    <Stop offset="0" stopColor="#70375a" />
                    <Stop offset="0.96" stopColor="#8a6e95" />
                  </LinearGradient>
                </Defs>
                <Path d={BgPaths.layer1[0]} fill="url(#g1)" />
                <Path d={BgPaths.layer1[1]} fill="url(#g2)" />
              </Svg>
            </ParallaxLayer>

            {/* Trees — layer3. */}
            <ParallaxLayer factor={0.58} style={styles.mtnBand}>
              <Svg
                width="100%"
                height="100%"
                viewBox={MTN_VB}
                preserveAspectRatio={MTN_FIT}
              >
                <Defs>
                  <LinearGradient
                    id="g3"
                    x1="2000"
                    y1="600"
                    x2="2000"
                    y2="1000"
                    gradientUnits="userSpaceOnUse"
                  >
                    <Stop offset="0.2" stopColor="#433d6c" />
                    <Stop offset="1" stopColor="#17142c" />
                  </LinearGradient>
                </Defs>
                <Path d={BgPaths.layer3} fill="url(#g3)" />
              </Svg>
            </ParallaxLayer>

            {/* Terrain — layer4. */}
            <ParallaxLayer factor={0.76} style={styles.mtnBand}>
              <Svg
                width="100%"
                height="100%"
                viewBox={MTN_VB}
                preserveAspectRatio={MTN_FIT}
              >
                <Defs>
                  <LinearGradient
                    id="g4"
                    x1="2000"
                    y1="700"
                    x2="1970"
                    y2="1000"
                    gradientUnits="userSpaceOnUse"
                  >
                    <Stop offset="0" stopColor="#0e0a1a" />
                    <Stop offset="0.3" stopColor="#100d1f" />
                    <Stop offset="0.64" stopColor="#17142c" />
                    <Stop offset="0.95" stopColor="#201f3f" />
                  </LinearGradient>
                </Defs>
                <Path d={BgPaths.layer4} fill="url(#g4)" />
              </Svg>
            </ParallaxLayer>

            {/* Foreground — layer5 silhouette, fastest (nearest), zooms on
                pull. The rect runs to the bottom of the viewBox (y 2000) so no
                gap shows under the silhouette on tall screens. */}
            <ParallaxLayer
              factor={0.95}
              zoomOnPull
              zoomReference={headerHeight}
              style={styles.mtnBand}
            >
              <Svg
                width="100%"
                height="100%"
                viewBox={MTN_VB}
                preserveAspectRatio={MTN_FIT}
              >
                <Rect x="0" y="990" width="4000" height="1010" fill="#000000" />
                <Path d={BgPaths.layer5} fill="#000000" />
              </Svg>
            </ParallaxLayer>
          </View>
        }
      >
        <Filler dark count={12} />
      </ParallaxScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#000010" },
  header: { backgroundColor: "#000010" },
  body: {
    backgroundColor: "#0b0a16",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,153,85,0.35)",
  },
  scene: { flex: 1 },
  // Mountains occupy the bottom band of the tall header, sitting right above
  // the body. Sky/stars stay full-height behind them. Shared offset so all
  // mountain layers stay aligned as one scene.
  mtnBand: { top: "38%" },
  cloudLayer: { top: "18%", height: "22%" },
  titleWrap: { alignItems: "center", gap: 6 },
  kicker: {
    color: "#ffd9a8",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 3,
  },
  title: {
    color: "#ffffff",
    fontSize: 42,
    fontWeight: "900",
    letterSpacing: 0.5,
    textShadowColor: "rgba(255,153,85,0.35)",
    textShadowRadius: 18,
    textShadowOffset: { width: 0, height: 0 },
  },
  hint: { alignItems: "center", marginTop: 14, gap: -6 },
  hintText: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  hintChevron: { color: "rgba(255,255,255,0.55)", fontSize: 22 },
});
