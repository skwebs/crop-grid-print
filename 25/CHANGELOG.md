# Changelog

All notable changes and modifications made to the RC Crop Print Studio application.

## [Unreleased] - 2026-09-14

### Changed
- **Canvas Panning**:
  - Removed requirement to hold the `Spacebar` key before dragging. Users can now directly hold left-click or middle-click and drag anywhere on the canvas viewport to pan.
- **Mouse Wheel Horizontal Scrolling**:
  - Added support for holding `Shift` + scrolling the mouse wheel to pan the canvas horizontally. Regular vertical scrolling remains unaffected.
- **Sidebar Layout & Organization**:
  - Streamlined `Print Layout` into an ultra-compact single-column sidebar.
  - Converted Rows and Columns input grid to single-column controls.
  - Converted Paper Orientation buttons to single-column stacking.
  - Grouped controls into clean, collapsible accordion panels (`Paper Setup`, `Grid & Alignment`, `Border & Colors`) with vertical scrolling so content never overflows the viewport.
- **Image Tray & Thumbnails**:
  - Unified tray position across desktop and mobile views (`bottom: 58px`) so it never shifts upwards unexpectedly on small screens.
  - Added a floating `×` close button attached directly to the top edge of the thumbnail tray.
  - Tray toggle button now hides while thumbnails are open and only displays when tray is closed.
  - Expanded thumbnail height to 88px and resized action buttons (Crop, Visibility, Remove) to each occupy `1/3` width of the thumbnail with larger, readable icons and targets.
  - Added `3px` container padding and negative outline offset to prevent top/bottom borders of selected thumbnails from getting clipped.

### Added
- **Image Border Thickness & Color Controls**:
  - Added configurable border thickness (width) input with minus/plus stepper buttons.
  - Added border color picker with live hex code text display.
  - Integrated border rendering directly into image cell canvas drawer.
- **Spacing Unit Dropdown & Conversion**:
  - Added unit dropdown to Spacing supporting `px`, `mm`, `cm`, and `in`.
  - Added dynamic stepping based on selected unit: `1/2` for mm, `1/10` for cm, and `1/16` for inch (and `1` for px).
  - Added real-time unit conversion that preserves the active spacing value across unit switches.
  - Added quick preset buttons (`0`, `1`, `2`, `5`) for rapid spacing adjustments.
- **Non-blocking Processing Indicator**:
  - Added sleek, floating spinner pill indicator at the top of the viewport (`Rendering...`) during asynchronous canvas generation and JPEG dumps without blocking user interaction.
- **Performance Optimizations**:
  - Integrated `requestAnimationFrame` debouncing on sheet redraws to guarantee 60fps canvas performance and fluid UI interactions.