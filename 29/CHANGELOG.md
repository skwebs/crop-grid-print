# Changelog

All notable changes and modifications made to the RC Crop Print Studio application.

## [Unreleased] - 2026-09-14

### Replaced
- **Cropper.js Removed in Favor of AI Smart Crop**:
  - Removed Cropper.js library and manual freeform crop box[cite: 1].
  - Integrated `@vladmandic/face-api` (TinyFaceDetector and 68-point landmark detection)[cite: 2].
  - Implemented automated portrait alignment that detects eye coordinates, levels head tilt, and calculates individual shoulder/torso width[cite: 2].
  - Fixed crop aspect ratio permanently to the passport standard (35×45 mm / ratio ~0.7778)[cite: 1, 2].

### Added
- **Smart Crop Modal & Interactive Tuning**:
  - Replaced the crop UI with a dedicated Smart Crop editor modal[cite: 1, 2].
  - Added interactive canvas controls: drag to pan, mouse-wheel to zoom/tilt, and two-finger pinch-to-zoom[cite: 2].
  - Added dedicated tuning tabs and sliders for:
    - **Zoom / Scale** (0.5x to 2.5x)[cite: 2]
    - **Vertical Headroom** (-300px to +300px)[cite: 2]
    - **Horizontal Center** (-250px to +250px)[cite: 2]
    - **Fine Tilt Angle** (-30° to +30°)[cite: 2]
  - Added **Reset to Auto** button to revert individual adjustments back to original AI detected landmarks[cite: 2].
- **Automated Default Fallback on Upload**:
  - Batch uploads immediately compute and generate default smart-cropped canvases upon file selection, preventing blank thumbnail states or unrendered print slots.
- **Sequential Crop Review Flow**:
  - Uploading multiple photos automatically queues them for sequential review (`Smart Crop (1 of N)`).
  - Clicking **Next Image →** saves the current smart framing and immediately opens the next uploaded photo in sequence.

### Retained
- Single-column compact sidebar with collapsible sections[cite: 1].
- Spacing unit selector (`px`, `mm`, `cm`, `in`) with unit conversions and preset buttons[cite: 1].
- Image border width and color picker controls.
- `Image Background` color fill behind transparent image areas.
- Pan canvas directly with left-click/middle-click drag without holding spacebar.
- Horizontal canvas scrolling with `Shift` + mouse wheel.
- Non-blocking top spinner pill (`#processingIndicator`) during AI inference and canvas rendering.