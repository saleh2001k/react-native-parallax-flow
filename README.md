# react-native-parallax-flow

A tiny, dependency-light **parallax `ScrollView`** for React Native.

- 🪂 **Header parallax** — the header eases away slower than the body as you scroll.
- 🔍 **Pull-to-zoom** — give the header a fixed height and it zooms in on over-scroll.
- 🧊 **Body slides over** — the content body scrolls up _on top of_ the header (great for the rounded-sheet look).
- 🏔️ **Multi-layer depth** — stack `ParallaxLayer`s at different speeds for a layered-scene effect.
- 🎯 **Scroll-aware overlay** — an `overlay` slot above the scroll content that can read the scroll offset, for fade-in navbars and floating controls.
- 🎨 **Fully style-prop driven** — zero opinionated colors. You paint the header and body.
- 🧵 Runs on the UI thread via [`react-native-reanimated`](https://docs.swmansion.com/react-native-reanimated/). Works on the New Architecture.

> Three tiny files. No theme provider, no config, no native code.

> ⚠️ **Status: pre-release.** Not published to npm yet — a few edge cases are
> still being covered. Until then, install straight from GitHub (below).

---

## Install

Not on npm yet — install from GitHub:

```sh
npm install github:saleh2001k/react-native-parallax-flow react-native-reanimated
# or
bun add github:saleh2001k/react-native-parallax-flow react-native-reanimated
```

Once published: `npm install react-native-parallax-flow react-native-reanimated`.

`react-native-reanimated` is a **peer dependency** (>= 3). Make sure its Babel
plugin is set up — in Expo SDK 50+ `babel-preset-expo` wires it for you; in a
bare app add `'react-native-worklets/plugin'` (Reanimated 4) or
`'react-native-reanimated/plugin'` (Reanimated 3) as the **last** entry in
`babel.config.js`.

---

## Quick start

### Auto-height header (sizes to its content)

```tsx
import { ParallaxScrollView } from 'react-native-parallax-flow';
import { View, Text } from 'react-native';

export default function Screen() {
  return (
    <ParallaxScrollView
      headerStyle={{ backgroundColor: '#4f46e5' }}
      bodyStyle={{
        backgroundColor: '#fff',
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
      }}
      header={
        <View style={{ padding: 24, paddingTop: 80 }}>
          <Text style={{ color: '#fff', fontSize: 30, fontWeight: '800' }}>
            Hello parallax
          </Text>
        </View>
      }
    >
      <YourContent />
    </ParallaxScrollView>
  );
}
```

### Fixed-height header (unlocks pull-to-zoom)

```tsx
<ParallaxScrollView
  headerHeight={280}
  parallaxFactor={0.5}
  headerStyle={{ backgroundColor: '#0f766e' }}
  bodyStyle={{ backgroundColor: '#fff', borderTopLeftRadius: 28, borderTopRightRadius: 28 }}
  header={<Hero />}
>
  <YourContent />
</ParallaxScrollView>
```

---

## Props

| Prop                    | Type                                  | Default | Notes |
| ----------------------- | ------------------------------------- | ------- | ----- |
| `header`                | `ReactNode`                           | —       | Content of the parallax header region. Can be `null`. |
| `children`              | `ReactNode`                           | —       | The body that slides up over the header. |
| `headerHeight`          | `number`                              | _auto_  | Fixed header height. Omit / `undefined` / `0` → header sizes to its content. A fixed height enables pull-to-zoom. |
| `parallaxFactor`        | `number`                              | `0.5`   | Fraction of the body's scroll speed the header moves at, in `[0, 1]`. `1` = header keeps pace with the body (no parallax). `0` = header frozen in place (max parallax). `0.5` = half speed. Out-of-range values are **clamped**. |
| `headerParallax`        | `boolean`                             | `true`  | Set `false` to stop the header **container** from transforming — for multi-layer scenes where each `ParallaxLayer` owns its own motion. |
| `headerStyle`           | `StyleProp<ViewStyle>`                | —       | Style for the header container — paint background / border here. |
| `bodyStyle`             | `StyleProp<ViewStyle>`                | —       | Style for the body wrapper — background, radius, shadow live here. |
| `contentContainerStyle` | `StyleProp<ViewStyle>`                | —       | Merged into the ScrollView's `contentContainerStyle` (already gets `flexGrow: 1`). |
| `scrollViewProps`       | `Omit<ScrollViewProps, 'onScroll' \| 'scrollEventThrottle' \| 'contentContainerStyle'>` | — | Any other ScrollView props (e.g. `showsVerticalScrollIndicator`, `refreshControl`). The omitted props are managed internally. |
| `overlay`               | `ReactNode`                           | —       | Rendered absolutely **above** the scroll content but inside the parallax context — its children can call `useParallaxScroll()`. Container is `pointerEvents="box-none"`, so it never blocks scrolling. Perfect for fade-in navbars. |
| `ref`                   | `Ref<Animated.ScrollView>`            | —       | Forwarded to the inner `Animated.ScrollView` — call `scrollTo`, `scrollToEnd`, etc. |

---

## How the parallax works

The header lives in the ScrollView's normal flow, so it already moves up by
`scrollY` as you scroll. To slow it, the component translates it back _down_ by
`scrollY * (1 - parallaxFactor)` (clamped at `0`). The net header speed is
therefore `scrollSpeed * parallaxFactor` — lower factor = slower header = more
parallax. The clamp stops over-scroll bounce from dragging the header below the
top.

With a fixed `headerHeight`, the header additionally **scales up** by
`1 + (-scrollY / headerHeight)` when you pull _past_ the top (`scrollY < 0`),
giving the pull-to-zoom effect. The translate math is identical in both modes,
so `parallaxFactor` behaves the same whether or not you set a height.

The body is rendered _after_ the header, so it has a higher z-order and slides
over it. `LinearTransition` keeps height changes smooth (the "flow").

---

## Multi-layer depth (`ParallaxLayer`)

Stack several layers inside the `header`, each moving at its own speed, to fake
depth — distant things drift slowly, near things rush past. Put `ParallaxLayer`s
in the header and turn off the container's own transform with
`headerParallax={false}`.

```tsx
import { ParallaxScrollView, ParallaxLayer } from 'react-native-parallax-flow';

<ParallaxScrollView
  headerHeight={600}
  headerParallax={false}
  header={
    <>
      <ParallaxLayer factor={0.05}>{/* sky — barely moves (far) */}</ParallaxLayer>
      <ParallaxLayer factor={0.3}>{/* mountains */}</ParallaxLayer>
      <ParallaxLayer factor={0.6}>{/* hills */}</ParallaxLayer>
      <ParallaxLayer factor={0.9} zoomOnPull zoomReference={600}>
        {/* foreground — moves most (near) + zooms on pull */}
      </ParallaxLayer>
    </>
  }
>
  <Body />
</ParallaxScrollView>;
```

Each layer is `position: absolute` + inset 0 by default, so they overlap. Fill
them with anything — `react-native-svg` shapes, `<Image>`s, plain `View`s. See
the [`layers`](./example/app/layers.tsx) showcase for a full mountain scene.

### `ParallaxLayer` props

| Prop            | Type                  | Default  | Notes |
| --------------- | --------------------- | -------- | ----- |
| `factor`        | `number`              | `0.5`    | Fraction of scroll speed, `[0, 1]`. **Lower = slower = further away.** Clamped. |
| `zoomOnPull`    | `boolean`             | `false`  | Scale the layer up on top over-scroll (best on the nearest layers). |
| `zoomReference` | `number`              | `300`    | Height (px) the zoom ramp is normalized against — usually the header height. |
| `style`         | `StyleProp<ViewStyle>`| —        | Extra style on top of the absolute-fill default. |
| `pointerEvents` | `'auto' \| 'none' \| 'box-none' \| 'box-only'` | `'none'` | Layers don't eat touches by default. |

> `ParallaxLayer` must be rendered inside a `ParallaxScrollView` (it reads the
> shared scroll offset from context). `useParallaxScroll()` is also exported if
> you want to build a custom layer.

## Recipes

### Fade-in navbar (appears on scroll)

The classic "title bar fades in once the hero scrolls away" pattern (profiles,
product pages, album screens). Render the bar through the `overlay` prop so it
can read the scroll offset via `useParallaxScroll()`:

```tsx
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { ParallaxScrollView, useParallaxScroll } from 'react-native-parallax-flow';

function FadeInBar({ start, end, children }) {
  const scrollY = useParallaxScroll();
  const style = useAnimatedStyle(() => {
    const t = interpolate(scrollY.value, [start, end], [0, 1], Extrapolation.CLAMP);
    return { opacity: t, transform: [{ translateY: (1 - t) * -10 }] };
  });
  return <Animated.View style={[{ height: 96, backgroundColor: '#fff' }, style]}>{children}</Animated.View>;
}

<ParallaxScrollView
  headerHeight={300}
  header={<Hero />}
  overlay={
    <FadeInBar start={110} end={200}>
      <Text>Screen title</Text>
    </FadeInBar>
  }
>
  <Body />
</ParallaxScrollView>;
```

See the `profile`, `product` and `playlist` showcases in the example app for
complete screens built on this.

### Sheet-style body (rounded corners + shadow)

```tsx
<ParallaxScrollView
  headerHeight={300}
  bodyStyle={{
    backgroundColor: '#fff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -4 },
    elevation: 8,
  }}
  header={<Hero />}
>
  ...
</ParallaxScrollView>
```

### Full-bleed image hero

```tsx
import { Image } from 'expo-image';

<ParallaxScrollView
  headerHeight={340}
  parallaxFactor={0.6}
  header={
    <View style={{ flex: 1 }}>
      <Image source={URL} style={StyleSheet.absoluteFill} contentFit="cover" />
    </View>
  }
>
  ...
</ParallaxScrollView>
```

### Programmatic scroll (forwardRef)

```tsx
import { useRef } from 'react';
import type Animated from 'react-native-reanimated';

const ref = useRef<Animated.ScrollView>(null);

<ParallaxScrollView ref={ref} header={<Hero />}>...</ParallaxScrollView>;

// later:
ref.current?.scrollTo({ y: 0, animated: true });
```

---

## Edge cases & gotchas

- **`parallaxFactor` is clamped** to `[0, 1]` — passing `2` behaves like `1`.
- **`headerHeight={0}`** is treated the same as omitting it (auto mode); a 0-px
  header is never useful.
- **Short body** (less than a screen) still fills the viewport — the content
  container uses `flexGrow: 1`, so no gap appears under the body.
- **`onScroll` / `scrollEventThrottle`** are managed internally and can't be
  overridden via `scrollViewProps` (they're typed out).
- **Reanimated peer** must be installed and its Babel plugin enabled, or the
  worklets won't run.

---

## Example app

A full Expo (SDK 54) + expo-router demo lives in [`example/`](./example) with
showcases for every mode (auto header, fixed header + zoom, image hero, an
interactive playground, programmatic scroll, and edge cases) plus three
**real-app screens** you can lift straight into a project:

- **Social profile** — cover photo, fade-in navbar, overlapping avatar, stats, photo grid.
- **Product detail** — image hero, fade-in title/price bar, color + size pickers, sticky add-to-cart.
- **Album playlist** — Spotify-style artwork that shrinks/fades, gradient scene, fade-in title bar, track list.

```sh
cd example
bun install      # or npm install
bun ios          # or bun android / bun start
```

---

## License

MIT © Saleh Ayman
