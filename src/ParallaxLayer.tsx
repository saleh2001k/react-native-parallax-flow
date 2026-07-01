import React, { type ReactNode } from 'react';
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { useParallaxScroll } from './ParallaxContext';

export type ParallaxLayerProps = {
  /**
   * Fraction of the scroll speed this layer moves at, in `[0, 1]`.
   * Lower = slower = reads as **further away** (background). Higher = faster =
   * **closer** (foreground). Stack several layers with different factors to
   * fake depth. Clamped to `[0, 1]`.
   */
  factor?: number;
  /**
   * Scale the layer up when the user pulls past the top (over-scroll).
   * Great for the nearest layers. Off by default.
   */
  zoomOnPull?: boolean;
  /**
   * Reference height (px) used for the pull-to-zoom scale ramp. Usually the
   * header height. Defaults to `300`.
   */
  zoomReference?: number;
  /** Extra style. The layer is `position: absolute` + inset 0 by default. */
  style?: StyleProp<ViewStyle>;
  /** Defaults to `'none'` so layers never eat touches. */
  pointerEvents?: 'auto' | 'none' | 'box-none' | 'box-only';
  children?: ReactNode;
};

/**
 * One depth layer inside a `ParallaxScrollView` header. Reads the shared
 * scroll offset from context and translates itself at its own speed, so
 * stacking layers with different `factor`s produces a layered parallax scene.
 */
export function ParallaxLayer({
  factor = 0.5,
  zoomOnPull = false,
  zoomReference = 300,
  style,
  pointerEvents = 'none',
  children,
}: ParallaxLayerProps) {
  const scrollY = useParallaxScroll();
  const f = Math.min(1, Math.max(0, factor));
  const zoomRef = zoomReference > 0 ? zoomReference : 300;

  const animatedStyle = useAnimatedStyle(() => {
    'worklet';
    const y = scrollY.value;
    // Counter-translate so the net layer speed is y * factor (same math as the
    // header itself). Clamped at 0 so over-scroll doesn't drag it down.
    const translateY = Math.max(0, y) * (1 - f);
    if (zoomOnPull && y < 0) {
      // Centered scale adds (-y)/2 above the top edge (when the layer spans
      // ~zoomReference tall), so translate by y/2 to keep the top edge pinned
      // during the pull instead of drifting down with the bounce.
      return { transform: [{ translateY: y / 2 }, { scale: 1 - y / zoomRef }] };
    }
    return { transform: [{ translateY }] };
  });

  return (
    <Animated.View
      pointerEvents={pointerEvents}
      style={[StyleSheet.absoluteFill, style, animatedStyle]}
    >
      {children}
    </Animated.View>
  );
}
