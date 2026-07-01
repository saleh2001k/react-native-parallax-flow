import React, { forwardRef, type ReactNode } from 'react';
import {
  View,
  StyleSheet,
  type ColorValue,
  type ScrollViewProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  LinearTransition,
  type AnimatedStyle,
  type SharedValue,
} from 'react-native-reanimated';
import { ParallaxScrollContext } from './ParallaxContext';

const DEFAULT_PARALLAX_FACTOR = 0.5;
// Tall enough that no realistic rubber-band over-scroll out-runs the tail.
const BOUNCE_TAIL_HEIGHT = 1200;

/** Best-effort backgroundColor from a (possibly animated) body style. */
function extractBackgroundColor(
  style: StyleProp<AnimatedStyle<ViewStyle>>,
): ColorValue | undefined {
  const flat = StyleSheet.flatten(style as StyleProp<ViewStyle>);
  const bg = flat?.backgroundColor;
  return typeof bg === 'string' || typeof bg === 'number' ? bg : undefined;
}

/** Largest top corner radius found in a (possibly animated) body style. */
function extractTopRadius(style: StyleProp<AnimatedStyle<ViewStyle>>): number {
  const flat = StyleSheet.flatten(style as StyleProp<ViewStyle>);
  if (!flat) return 0;
  const base = typeof flat.borderRadius === 'number' ? flat.borderRadius : 0;
  const tl =
    typeof flat.borderTopLeftRadius === 'number' ? flat.borderTopLeftRadius : base;
  const tr =
    typeof flat.borderTopRightRadius === 'number' ? flat.borderTopRightRadius : base;
  return Math.max(tl, tr, 0);
}

export type ParallaxScrollViewProps = {
  /** Content rendered inside the parallax header region. */
  header: ReactNode;
  /**
   * Fixed header height. Omit (or pass `undefined`/`0`) to let the header
   * size itself to its content. A fixed height unlocks pull-to-zoom on
   * over-scroll.
   */
  headerHeight?: number;
  /**
   * How much slower the header moves than the body, in `[0, 1]`.
   * `1` = header fully pinned (no parallax). `0` = header scrolls away at
   * normal speed. `0.5` (default) = header moves at half scroll speed.
   * Values outside the range are clamped.
   */
  parallaxFactor?: number;
  /**
   * When `false`, the header container itself does **not** transform — useful
   * for multi-layer scenes where each `ParallaxLayer` owns its own motion.
   * Defaults to `true`.
   */
  headerParallax?: boolean;
  /**
   * Style for the header container (paint background, border, etc. here).
   * Accepts Reanimated animated styles too.
   */
  headerStyle?: StyleProp<AnimatedStyle<ViewStyle>>;
  /**
   * Style for the body wrapper (background, radius, shadow live here).
   * Accepts Reanimated animated styles — combine with the `scrollY` prop to
   * morph the body as it scrolls (e.g. flatten its top radius as it docks
   * under a navbar).
   */
  bodyStyle?: StyleProp<AnimatedStyle<ViewStyle>>;
  /** Extra style merged into the ScrollView's contentContainerStyle. */
  contentContainerStyle?: StyleProp<ViewStyle>;
  /**
   * Any other ScrollView props. `onScroll`, `scrollEventThrottle` and
   * `contentContainerStyle` are managed internally and excluded here.
   */
  scrollViewProps?: Omit<
    ScrollViewProps,
    'onScroll' | 'scrollEventThrottle' | 'contentContainerStyle'
  >;
  /**
   * Rendered absolutely on top of the ScrollView but **inside** the parallax
   * context, so its children can call `useParallaxScroll()` — ideal for a
   * navbar that fades in as the header scrolls away, floating buttons, etc.
   * The overlay container is `pointerEvents="box-none"`, so it never blocks
   * scrolling; only its children receive touches.
   */
  overlay?: ReactNode;
  /**
   * Optional external shared value mirroring the scroll offset (px). Pass your
   * own `useSharedValue(0)` when you need scroll-linked animations *outside*
   * the component tree — e.g. an animated `bodyStyle` or `headerStyle` built
   * at the screen level. Inside `header` / `overlay` / body children, prefer
   * `useParallaxScroll()` instead.
   */
  scrollY?: SharedValue<number>;
  /**
   * How many px the body overlaps (slides up over) the bottom of the header.
   * With rounded body corners, the corner cutouts then reveal the header's
   * content — an image, a gradient — instead of the screen background peeking
   * through at rest. Defaults to the largest top corner radius found in a
   * static `bodyStyle`. Pass `0` to disable, or a custom value for
   * non-radius cutouts (e.g. a zig-zag body edge).
   */
  bodyOverlap?: number;
  /**
   * Color painted beneath the body for the bottom over-scroll (bounce) region.
   * On iOS, rubber-banding past the bottom reveals whatever sits behind the
   * scroll content — usually the screen background, which flashes a mismatched
   * color under the body. Set this to the body's surface color to keep the
   * bounce seamless (the bounce itself stays enabled). Defaults to the
   * `backgroundColor` found in a static `bodyStyle`, if any.
   */
  bounceColor?: ColorValue;
  children: ReactNode;
};

/**
 * A ScrollView whose header parallaxes (moves slower than the body) while the
 * body slides up over it. With a fixed `headerHeight`, the header also
 * zooms in when you pull past the top.
 *
 * The `ref` is forwarded to the underlying `Animated.ScrollView`, so you can
 * call imperative methods like `scrollTo` / `scrollToEnd`.
 */
export const ParallaxScrollView = forwardRef<
  Animated.ScrollView,
  ParallaxScrollViewProps
>(function ParallaxScrollView(
  {
    header,
    headerHeight,
    parallaxFactor = DEFAULT_PARALLAX_FACTOR,
    headerParallax = true,
    headerStyle,
    bodyStyle,
    contentContainerStyle,
    scrollViewProps,
    overlay,
    scrollY: externalScrollY,
    bodyOverlap,
    bounceColor,
    children,
  },
  ref,
) {
  const internalScrollY = useSharedValue(0);
  const scrollY = externalScrollY ?? internalScrollY;

  // Normalize props to plain primitives so the worklets close over stable
  // values (and to harden against bad input).
  // `0` height → treat as auto mode (a 0px header is never useful).
  const fixedHeaderHeight =
    headerHeight && headerHeight > 0 ? headerHeight : undefined;
  const factor = Math.min(1, Math.max(0, parallaxFactor));

  const resolvedBounceColor = bounceColor ?? extractBackgroundColor(bodyStyle);
  // No header → nothing to overlap; a negative margin would clip the body top.
  const resolvedOverlap =
    header == null ? 0 : Math.max(0, bodyOverlap ?? extractTopRadius(bodyStyle));

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      scrollY.value = event.contentOffset.y;
    },
  });

  // The header lives in normal scroll flow, so it already moves up by scrollY.
  // Counteract part of that (push it back down by scrollY*(1-factor)) so its
  // net speed is scrollY*factor — i.e. it eases away slower than the body.
  // Clamped at 0 so over-scroll bounce doesn't drag the header below the top.
  //
  // With a fixed headerHeight we additionally scale the header up when you
  // pull past the top (scrollY < 0) for the classic pull-to-zoom effect.
  // During that over-scroll the ScrollView shifts all content down, which
  // would drag the header down too — so we translate by scrollY (negative) to
  // cancel that out and keep the header pinned to the top while it grows.
  const animatedHeaderStyle = useAnimatedStyle(() => {
    'worklet';
    if (!headerParallax) return {};
    const y = scrollY.value;
    if (!fixedHeaderHeight) {
      return { transform: [{ translateY: Math.max(0, y) * (1 - factor) }] };
    }
    if (y < 0) {
      // The scale is centered, so it adds (-y)/2 of height above the top edge.
      // Translating by y/2 (not y) therefore keeps the top edge pinned to the
      // viewport top AND the bottom edge glued to the body — no gap opens
      // between header and body while zooming.
      return { transform: [{ translateY: y / 2 }, { scale: 1 - y / fixedHeaderHeight }] };
    }
    return { transform: [{ translateY: y * (1 - factor) }] };
  });

  return (
    <ParallaxScrollContext.Provider value={scrollY}>
      <View style={styles.container}>
        <Animated.ScrollView
          ref={ref}
          {...scrollViewProps}
          onScroll={scrollHandler}
          layout={LinearTransition}
          scrollEventThrottle={16}
          contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
        >
          {/* Header sits in normal scroll flow → interactive by default.
              Its transform pushes it down relative to scroll, slowing its exit. */}
          <Animated.View
            style={[
              styles.headerContainer,
              fixedHeaderHeight ? { height: fixedHeaderHeight } : null,
              headerStyle,
              animatedHeaderStyle,
            ]}
          >
            {header}
          </Animated.View>

          {/* Body rendered after header → higher z-order, slides over header.
              The negative margin tucks the body over the header's bottom edge
              so rounded corners reveal the header content, not the screen
              background. */}
          <Animated.View
            layout={LinearTransition}
            style={[
              styles.body,
              resolvedOverlap > 0 ? { marginTop: -resolvedOverlap } : null,
              bodyStyle,
            ]}
          >
            {/* Bounce tail: extends the body surface below the content so the
                iOS bottom rubber-band shows this color instead of whatever is
                behind the ScrollView. Purely cosmetic — never intercepts
                touches, never affects layout. */}
            {resolvedBounceColor != null && (
              <View
                pointerEvents="none"
                style={[styles.bounceTail, { backgroundColor: resolvedBounceColor }]}
              />
            )}
            {children}
          </Animated.View>
        </Animated.ScrollView>

        {/* Overlay floats above the scroll content but stays inside the
            provider, so overlay children can read the scroll offset. */}
        {overlay != null && (
          <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
            {overlay}
          </View>
        )}
      </View>
    </ParallaxScrollContext.Provider>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  headerContainer: {
    overflow: 'hidden',
  },
  body: {
    flex: 1,
  },
  bounceTail: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: -BOUNCE_TAIL_HEIGHT,
    height: BOUNCE_TAIL_HEIGHT,
  },
});
