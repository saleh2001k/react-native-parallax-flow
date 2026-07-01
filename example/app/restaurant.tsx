import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ParallaxScrollView } from "react-native-parallax-flow";
import { BackButton, BlurFadeBar } from "../components/Showcase";

const HEADER_HEIGHT = 320;
const HERO =
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80";

type Dish = { name: string; desc: string; price: string; img: string };

const MENU: { section: string; dishes: Dish[] }[] = [
  {
    section: "Starters",
    dishes: [
      {
        name: "Charred octopus",
        desc: "Smoked paprika, lemon, olive crumb",
        price: "$14",
        img: "https://picsum.photos/seed/dish1/200/200",
      },
      {
        name: "Burrata & peach",
        desc: "Basil oil, aged balsamic, sourdough",
        price: "$12",
        img: "https://picsum.photos/seed/dish2/200/200",
      },
    ],
  },
  {
    section: "Mains",
    dishes: [
      {
        name: "Wood-fired ribeye",
        desc: "300g, bone marrow butter, fries",
        price: "$34",
        img: "https://picsum.photos/seed/dish3/200/200",
      },
      {
        name: "Miso black cod",
        desc: "Charred greens, pickled ginger",
        price: "$29",
        img: "https://picsum.photos/seed/dish4/200/200",
      },
      {
        name: "Truffle tagliatelle",
        desc: "Fresh pasta, parmesan cream",
        price: "$22",
        img: "https://picsum.photos/seed/dish5/200/200",
      },
    ],
  },
  {
    section: "Desserts",
    dishes: [
      {
        name: "Burnt basque cheesecake",
        desc: "Salted caramel, almond brittle",
        price: "$10",
        img: "https://picsum.photos/seed/dish6/200/200",
      },
      {
        name: "Dark chocolate fondant",
        desc: "Pistachio ice cream",
        price: "$11",
        img: "https://picsum.photos/seed/dish7/200/200",
      },
    ],
  },
];

export default function Restaurant() {
  const insets = useSafeAreaInsets();
  const barHeight = insets.top + 52;

  return (
    <View style={styles.root}>
      <ParallaxScrollView
        headerHeight={HEADER_HEIGHT}
        parallaxFactor={0.6}
        bodyStyle={styles.body}
        bounceColor="#fffaf5"
        header={
          <View style={styles.headerWrap}>
            <Image
              source={HERO}
              style={StyleSheet.absoluteFill}
              contentFit="cover"
              transition={300}
            />
            <View style={styles.scrim} />
          </View>
        }
        overlay={
          <>
            <BlurFadeBar
              start={HEADER_HEIGHT - barHeight - 90}
              end={HEADER_HEIGHT - barHeight - 10}
              tint="light"
              style={[styles.bar, { height: barHeight, paddingTop: insets.top }]}
            >
              <Text style={styles.barTitle}>Ember & Vine</Text>
              <Text style={styles.barRating}>★ 4.7</Text>
            </BlurFadeBar>
            <BackButton variant="minimal" />
          </>
        }
      >
        <View style={styles.intro}>
          <Text style={styles.name}>Ember & Vine</Text>
          <Text style={styles.tagline}>Wood-fire kitchen · Natural wines</Text>
          <View style={styles.chipRow}>
            <View style={styles.chip}>
              <Text style={styles.chipText}>★ 4.7 (860)</Text>
            </View>
            <View style={styles.chip}>
              <Text style={styles.chipText}>25–35 min</Text>
            </View>
            <View style={styles.chip}>
              <Text style={styles.chipText}>$$ · Mediterranean</Text>
            </View>
          </View>
        </View>

        {MENU.map(group => (
          <View key={group.section} style={styles.menuSection}>
            <Text style={styles.sectionTitle}>{group.section}</Text>
            {group.dishes.map(dish => (
              <View key={dish.name} style={styles.dish}>
                <View style={styles.dishMain}>
                  <Text style={styles.dishName}>{dish.name}</Text>
                  <Text style={styles.dishDesc}>{dish.desc}</Text>
                  <Text style={styles.dishPrice}>{dish.price}</Text>
                </View>
                <Image
                  source={dish.img}
                  style={styles.dishImage}
                  contentFit="cover"
                  transition={200}
                />
              </View>
            ))}
          </View>
        ))}

        <View style={{ height: insets.bottom + 32 }} />
      </ParallaxScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#292524" },
  headerWrap: { flex: 1 },
  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(41,37,36,0.22)",
  },

  body: {
    backgroundColor: "#fffaf5",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },

  bar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    overflow: "hidden",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(41,37,36,0.15)",
  },
  barTitle: { fontSize: 16, fontWeight: "800", color: "#292524" },
  barRating: { fontSize: 14, fontWeight: "700", color: "#b45309" },

  intro: { paddingHorizontal: 22, paddingTop: 22, gap: 6 },
  name: { fontSize: 26, fontWeight: "900", color: "#292524" },
  tagline: { fontSize: 14, color: "#78716c" },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 8 },
  chip: {
    backgroundColor: "#f5efe6",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  chipText: { fontSize: 12, fontWeight: "700", color: "#57534e" },

  menuSection: { paddingHorizontal: 22, paddingTop: 26, gap: 12 },
  sectionTitle: { fontSize: 19, fontWeight: "800", color: "#292524" },
  dish: {
    flexDirection: "row",
    gap: 14,
    paddingBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#e7e0d5",
  },
  dishMain: { flex: 1, gap: 3 },
  dishName: { fontSize: 15.5, fontWeight: "700", color: "#292524" },
  dishDesc: { fontSize: 13, lineHeight: 18, color: "#78716c" },
  dishPrice: { fontSize: 14, fontWeight: "800", color: "#b45309", marginTop: 2 },
  dishImage: { width: 76, height: 76, borderRadius: 12 },
});
