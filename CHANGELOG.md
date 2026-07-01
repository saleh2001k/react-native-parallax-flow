# Changelog

## 0.5.0 — 2026-07-02

First npm release.

### Added
- `bodyOverlap` prop — the body overlaps the header's bottom edge so rounded
  body corners reveal the header's image/gradient instead of the screen
  background. Defaults to the body's top corner radius; explicit values
  support non-radius cutouts (e.g. zig-zag edges).
- Build output (`lib/`) with CommonJS + type declarations; Metro consumers
  keep getting the TypeScript source via the `react-native` field.

### Fixed
- iOS: native video layers in the header flashed — the ScrollView container
  no longer runs a layout animation (its snapshot flashed `AVPlayerLayer`s).
  The body keeps its layout transition.

## 0.4.0 — 2026-07-01

### Added
- `bounceColor` prop — paints the bottom over-scroll (bounce) region in the
  body's surface color so the iOS rubber-band never flashes the screen
  background. Auto-derived from a static `bodyStyle`.

## 0.3.0 — 2026-07-01

### Added
- `headerStyle` / `bodyStyle` accept Reanimated animated styles.
- `scrollY` prop — pass an external shared value to drive scroll-linked
  animations at the screen level (docking bodies, morphing radii).

## 0.2.0 — 2026-07-01

### Added
- `overlay` prop — an absolute slot above the scroll content, inside the
  parallax context, for fade-in navbars and floating controls.

### Fixed
- Pull-to-zoom no longer opens a gap between header and body (the centered
  scale is now compensated with a half translate, pinning the top edge and
  gluing the bottom edge).

## 0.1.0 — 2026-07-01

- Initial version: `ParallaxScrollView` (header parallax, pull-to-zoom, body
  slides over), `ParallaxLayer` depth layers, `useParallaxScroll`.
