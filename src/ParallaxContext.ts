import { createContext, useContext } from 'react';
import type { SharedValue } from 'react-native-reanimated';

/**
 * Shared scroll offset (in px) published by `ParallaxScrollView` and consumed
 * by `ParallaxLayer` so layers can move at independent speeds.
 */
export const ParallaxScrollContext = createContext<SharedValue<number> | null>(
  null,
);

export function useParallaxScroll(): SharedValue<number> {
  const value = useContext(ParallaxScrollContext);
  if (value === null) {
    throw new Error(
      'ParallaxLayer must be rendered inside a ParallaxScrollView (usually in its `header`).',
    );
  }
  return value;
}
