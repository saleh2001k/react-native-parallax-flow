import React, { useMemo } from "react";
import { StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { Image } from "expo-image";
import Svg, {
  Circle,
  Defs,
  LinearGradient,
  Path,
  Rect,
  Stop,
} from "react-native-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ParallaxLayer, ParallaxScrollView } from "react-native-parallax-flow";
import { BackButton, bodySheetStyle, Filler } from "../components/Showcase";
import { BgPaths } from "../components/mountainPaths";

// Mountains are authored in this space; slice + bottom-anchor them.
const MTN_VB = "0 0 4000 2000";
const MTN_FIT = "xMidYMax slice" as const;

const CLOUD_1 =
  "https://raw.githubusercontent.com/SochavaAG/example-mycode/master/pens/starry-sky/images/cloud.png";
const CLOUD_2 =
  "https://raw.githubusercontent.com/SochavaAG/example-mycode/master/pens/starry-sky/images/cloud-2.png";

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

export default function Layers() {
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const headerHeight = Math.round(height * 0.65);
  const starsWhite = useMemo(() => makeStars(60, 1337), []);
  const starsPurple = useMemo(() => makeStars(40, 9001), []);

  return (
    <View style={styles.root}>
      <BackButton />
      <ParallaxScrollView
        headerHeight={headerHeight}
        // Each ParallaxLayer owns its own motion → turn off the container's.
        headerParallax={false}
        headerStyle={styles.header}
        bodyStyle={bodySheetStyle}
        header={
          <View style={styles.scene}>
            {/* Sky gradient — slowest (farthest). */}
            {/* Title — subtle independent drift. */}

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

            {/* Stars — two tints, like #stars-1 / #stars-2. */}
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

            {/* Clouds — the original cloud.png / cloud-2.png, at ~40% height. */}
            <ParallaxLayer factor={0.24} style={styles.cloudLayer}>
              <Image
                source={CLOUD_2}
                style={styles.cloud2}
                contentFit="fill"
                transition={300}
              />
              <Image
                source={CLOUD_1}
                style={styles.cloud1}
                contentFit="fill"
                transition={300}
              />
            </ParallaxLayer>

            <ParallaxLayer
              factor={0.35}
              style={{ paddingTop: insets.top + 64 }}
            >
              <View style={styles.titleWrap}>
                <Text style={styles.kicker}>MULTI-LAYER PARALLAX</Text>
                <Text style={styles.title}>Scroll Down</Text>
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

            {/* Foreground — layer5 silhouette, fastest (nearest), zooms on pull. */}
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
                <Rect x="0" y="990" width="4000" height="500" fill="#000000" />
                <Path d={BgPaths.layer5} fill="#000000" />
              </Svg>
            </ParallaxLayer>
          </View>
        }
      >
        <Filler count={12} />
      </ParallaxScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#000010" },
  header: { backgroundColor: "#000010" },
  scene: { flex: 1 },
  // Mountains occupy the bottom band of the tall header, sitting right above
  // the body. Sky/stars stay full-height behind them. Shared offset so all
  // mountain layers stay aligned as one scene.
  mtnBand: { top: "38%" },
  cloudLayer: { top: "20%", opacity: 0.4 },
  cloud1: {
    position: "absolute",
    right: -20,
    top: 0,
    width: "85%",
    height: 120,
  },
  cloud2: {
    position: "absolute",
    left: -40,
    top: 30,
    width: "95%",
    height: 150,
  },
  titleWrap: { alignItems: "center", gap: 6 },
  kicker: {
    color: "#ffd9a8",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2,
  },
  title: { color: "#ffffff", fontSize: 40, fontWeight: "900" },
});
