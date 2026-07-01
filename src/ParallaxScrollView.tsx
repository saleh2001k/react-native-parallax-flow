import React, { forwardRef, type ReactNode } from 'react';
import {
  View,
  StyleSheet,
  type ScrollViewProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  LinearTransition,
} from 'react-native-reanimated';
import { ParallaxScrollContext } from './ParallaxContext';

const DEFAULT_PARALLAX_FACTOR = 0.5;

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
  /** Style for the header container (paint background, border, etc. here). */
  headerStyle?: StyleProp<ViewStyle>;
  /** Style for the body wrapper (background, radius, shadow live here). */
  bodyStyle?: StyleProp<ViewStyle>;
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
    children,
  },
  ref,
) {
  const scrollY = useSharedValue(0);

  // Normalize props to plain primitives so the worklets close over stable
  // values (and to harden against bad input).
  // `0` height → treat as auto mode (a 0px header is never useful).
  const fixedHeaderHeight =
    headerHeight && headerHeight > 0 ? headerHeight : undefined;
  const factor = Math.min(1, Math.max(0, parallaxFactor));

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

          {/* Body rendered after header → higher z-order, slides over header. */}
          <Animated.View layout={LinearTransition} style={[styles.body, bodyStyle]}>
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
});
