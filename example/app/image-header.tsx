import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ParallaxScrollView } from "react-native-parallax-flow";
import { BackButton, bodySheetStyle, Filler } from "../components/Showcase";

const HEADER_HEIGHT = 340;
const IMAGE =
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200&q=80";

export default function ImageHeader() {
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.root}>
      <BackButton />
      <ParallaxScrollView
        headerHeight={HEADER_HEIGHT}
        bodyStyle={bodySheetStyle}
        header={
          <View style={styles.headerWrap}>
            <Image
              source={IMAGE}
              style={StyleSheet.absoluteFill}
              contentFit="cover"
              transition={300}
            />
            <View style={styles.scrim} />
            <View style={[styles.caption, { paddingTop: insets.top }]}>
              <Text style={styles.title}>Lakeside</Text>
              <Text style={styles.subtitle}>A full-bleed image hero</Text>
            </View>
          </View>
        }
      >
        <Filler count={12} />
      </ParallaxScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#1f2937" },
  headerWrap: { flex: 1, justifyContent: "flex-end" },
  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.28)",
  },
  caption: { padding: 24, gap: 4 },
  title: { color: "#ffffff", fontSize: 34, fontWeight: "800" },
  subtitle: { color: "#e5e7eb", fontSize: 15 },
});
