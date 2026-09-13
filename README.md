Changelog

All notable changes to RC Crop Print are documented here.

The project evolved from a basic browser-based crop/print-grid utility into a multi-image, PPI-aware photo-print preparation application.

---

[v24] — Current Release

Overview

Current-generation RC Crop Print implementation combining the major capabilities introduced throughout the v5–v20 development cycle.

Added

- Multi-image upload.
- Image thumbnail tray.
- Per-image selection.
- Per-image crop.
- Per-image visibility control.
- Per-image removal.
- Add-image control.
- Print PPI selection:
  - 300 PPI
  - 450 PPI
  - 600 PPI
- Passport/photo crop presets:
  - 35 × 45 mm
  - 45 × 35 mm
- Editable zoom percentage.
- Pixel ruler unit.
- Empty-state upload workflow.
- Save Settings functionality.
- Image orientation control.
- Paper orientation control.
- Slot background color selection.

Supported Paper Sizes

- A4
- 4 × 6
- 5 × 7

Supported Ruler Units

- Inches ("in")
- Centimeters ("cm")
- Millimeters ("mm")
- Pixels ("px")

Crop

Cropper.js is used for interactive image cropping.

UX

- Responsive desktop/mobile interface.
- Compact floating toolbar.
- Mobile image tray.
- Mobile-friendly grid controls.
- Empty-state onboarding.
- Improved canvas navigation.

Technical

- Canvas-based rendering.
- Cropper.js integration.
- PiexifJS integration for EXIF-related image processing.
- Client-side image processing.
- No application backend required for the core workflow.

---

[v20] — Current Generation Foundation

Added

- Current-generation application structure.
- Consolidated multi-image workflow.
- Integrated print-layout workflow.
- Continued saved-settings support.
- Continued PPI-based output workflow.
- Passport/photo crop dimensions.
- Responsive image management.

Changed

- Application moved toward the current production-oriented implementation.

Technical

The repository history identifies this stage as the 20th-file/current generation, rather than a conventional numbered "20/" source directory.

---

[v19]

Added

- Empty-state interface.
- Initial upload screen.
- "Upload image to begin" workflow.
- Multiple-image upload guidance.
- Editable zoom input.
- Pixel ("px") ruler unit.

Changed

- Zoom percentage changed from display-only text to an editable input.
- Upload workflow became more explicit.

Improved

- Initial user experience.
- Mobile usability.
- Zoom precision.
- Ruler functionality.

---

[v18]

Added

Print PPI

Added selectable print resolution:

- 300 PPI
- 450 PPI
- 600 PPI

Passport Photo Presets

Added:

- 35 × 45 mm
- 45 × 35 mm

EXIF

Added PiexifJS for EXIF-related image processing.

Changed

- Crop workflow became oriented toward physical photo dimensions.
- Print workflow became more suitable for passport/ID photographs.

Impact

This release represents a major transition toward a photo-studio / document-photo printing workflow.

---

[v17]

Added

- Rows decrement button.
- Rows increment button.
- Columns decrement button.
- Columns increment button.

Changed

Rows and columns changed from conventional number inputs to compact controls:

−  [value]  +

Improved

- Touch interaction.
- Mobile usability.
- Grid configuration.
- Compact layout.

---

[v16]

Changed

- Continued refinement of the multi-image workflow.
- Continued refinement of saved application settings.
- Continued print workflow development.

Technical

Additional development/testing around print/document output was performed during this stage.

---

[v15]

Added

Save Settings

Added a user-controlled Save Settings option.

Settings can be restored when the application is opened again.

Improved

- Repeated-use workflow.
- Reduced configuration time.
- Persistence of general application preferences.

---

[v14]

Changed

- Continued refinement of multi-image functionality.
- Improved thumbnail management.
- Improved image selection.
- Improved per-image operations.

Improved

- Image-management workflow.
- Crop workflow for individual images.
- Multi-image interaction.

Notes

v14 is primarily a refinement stage following the major multi-image implementation introduced in v13.

---

[v13]

Major Release — Multi-image Support

Added

- Multiple image upload.
- Multiple image selection.
- Image thumbnail tray.
- Active-image indication.
- Per-image crop.
- Per-image visibility.
- Per-image removal.
- Add-image thumbnail.
- Mobile image tray.
- Mobile image tray toggle.

Changed

The application moved from a predominantly single-image workflow to a multi-image photo management workflow.

New Workflow

Upload Images
      ↓
Thumbnail Tray
      ↓
Select Image
      ↓
Crop / Hide / Remove
      ↓
Print Grid

Impact

One of the largest functional changes in the project's history.

---

[v12]

Architecture Refactor

Changed

The application was separated into dedicated files:

index.html
style.css
app.js

Improved

- Separation of concerns.
- Maintainability.
- CSS organization.
- JavaScript organization.
- Future feature development.

Existing Functionality

- Canvas editor.
- Rulers.
- Zoom.
- Fit.
- Actual size.
- Print layout.
- Cropper.js.
- Image rotation.
- Paper orientation.

---

[v11]

Responsive UI Refinement

Improved

- Mobile layout.
- Desktop layout.
- Layout-panel positioning.
- Mobile crop interface.
- Floating controls.
- Responsive sizing.

Changed

The layout panel receives dedicated mobile positioning and sizing.

---

[v10]

Image Orientation & Measurement

Added

Image Rotation

Added image orientation control:

Rotate −90°

Ruler Units

Added:

- "in"
- "cm"
- "mm"

Improved

- Physical print measurement.
- Image orientation.
- Print preparation workflow.

---

[v9]

Major Release — Canvas Editor

Added

- Full-screen canvas workspace.
- Canvas panning.
- Improved zoom.
- Integrated rulers.
- Floating editor controls.
- Interaction-aware controls.
- Improved canvas navigation.

Changed

The canvas became the primary editing surface.

Editor Model

┌─────────────────────────────┐
│           Rulers            │
│                             │
│       Canvas Workspace      │
│                             │
│                             │
│      Floating Controls      │
└─────────────────────────────┘

Impact

The application evolved from a simple image-print utility into a lightweight browser-based canvas editor.

---

[v8]

UI/UX Refinement

Improved

- Tailwind CSS interface.
- Control sizing.
- Spacing.
- Crop modal.
- Responsive behavior.
- Mobile crop workflow.
- Overall visual consistency.

Crop Presets

- Free
- 2:3
- 3:2
- 4:5
- 5:4
- 1:1

Notes

Primarily a refinement release rather than a major architectural change.

---

[v7]

Canvas Interaction Refinement

Changed

- Improved canvas interaction behavior.
- Floating controls respond to canvas interaction.
- Controls hide during active interaction.
- Improved editor-style interaction.

Improved

- Desktop dragging.
- Touch interaction.
- Mobile behavior.
- Crop workflow.

Crop Presets

- Free
- 2:3
- 3:2
- 4:5
- 5:4
- 1:1

---

[v6]

Major Release — Crop Editor

Added

- Cropper.js.
- Full-screen crop modal.
- Interactive crop area.
- Crop rotation.
- Crop cancellation.
- Crop confirmation.
- Aspect-ratio presets.

Crop Presets

- Free
- 2:3
- 3:2
- 4:5
- 5:4
- 1:1

Changed

The workflow changed from:

Upload → Print

to:

Upload
   ↓
Crop
   ↓
Print

Impact

Established the image-preparation workflow that became central to later releases.

---

[v5]

Initial Release — Canvas Print Grid

Added

Canvas

- Canvas-based workspace.
- Image rendering.
- Canvas navigation.
- Zoom controls.

Print Layout

Supported:

- A4
- 4 × 6
- 5 × 7

Grid

- Rows.
- Columns.
- Slot background color.

Orientation

- Portrait.
- Landscape.

View Controls

- Zoom in.
- Zoom out.
- Fit.
- Actual size.

Measurement

- Horizontal ruler.
- Vertical ruler.

Export

- Client-side image/download workflow.

Initial UI

- Application header.
- Upload control.
- Print-layout panel.
- Bottom toolbar.
- Status indicator.
- Responsive/mobile behavior.

---

Feature Matrix

Feature| v5| v6| v9| v10| v13| v15| v17| v18| v19+
Canvas| ✓| ✓| ✓| ✓| ✓| ✓| ✓| ✓| ✓
Print Grid| ✓| ✓| ✓| ✓| ✓| ✓| ✓| ✓| ✓
Rulers| ✓| ✓| ✓| ✓| ✓| ✓| ✓| ✓| ✓
Zoom| ✓| ✓| ✓| ✓| ✓| ✓| ✓| ✓| ✓
Crop| —| ✓| ✓| ✓| ✓| ✓| ✓| ✓| ✓
Crop Rotation| —| ✓| ✓| ✓| ✓| ✓| ✓| ✓| ✓
Image Rotation| —| —| —| ✓| ✓| ✓| ✓| ✓| ✓
in/cm/mm Rulers| —| —| —| ✓| ✓| ✓| ✓| ✓| ✓
Multiple Images| —| —| —| —| ✓| ✓| ✓| ✓| ✓
Thumbnail Tray| —| —| —| —| ✓| ✓| ✓| ✓| ✓
Image Visibility| —| —| —| —| ✓| ✓| ✓| ✓| ✓
Image Removal| —| —| —| —| ✓| ✓| ✓| ✓| ✓
Saved Settings| —| —| —| —| —| ✓| ✓| ✓| ✓
Grid Steppers| —| —| —| —| —| —| ✓| ✓| ✓
Print PPI| —| —| —| —| —| —| —| ✓| ✓
Passport Dimensions| —| —| —| —| —| —| —| ✓| ✓
EXIF Processing| —| —| —| —| —| —| —| ✓| ✓
Empty State| —| —| —| —| —| —| —| —| ✓
Editable Zoom| —| —| —| —| —| —| —| —| ✓
Pixel Ruler| —| —| —| —| —| —| —| —| ✓

---

Major Development Milestones

Milestone 1 — Canvas Foundation

v5

Image
  ↓
Canvas
  ↓
Print Grid
  ↓
Download

---

Milestone 2 — Image Preparation

v6

Image
  ↓
Crop
  ↓
Canvas
  ↓
Print Grid

---

Milestone 3 — Full Canvas Editor

v9

             ┌── Zoom
             │
             ├── Pan
Image ───────┼── Rulers
             │
             ├── Crop
             │
             └── Print Layout

---

Milestone 4 — Multi-image Studio

v13

              ┌── Image 1
              ├── Image 2
Upload ───────┼── Image 3
              ├── Image 4
              └── ...
                     ↓
                Print Grid

---

Milestone 5 — Persistent Workflow

v15

Application Settings
        ↓
Save
        ↓
Browser Storage
        ↓
Restore

---

Milestone 6 — Print Production

v18

Image
  ↓
Physical Crop Size
  ↓
PPI
  ↓
Print Grid
  ↓
High-resolution Output

---

Milestone 7 — Current Workflow

v19+

Upload
   ↓
Manage Images
   ↓
Crop
   ↓
Rotate
   ↓
Set Physical Size
   ↓
Set PPI
   ↓
Configure Grid
   ↓
Preview
   ↓
Download

---

Architecture Evolution

v5
Single-page Canvas Application
        ↓
v6
Canvas + Cropper.js
        ↓
v9
Canvas Editor
        ↓
v12
HTML / CSS / JS Separation
        ↓
v13
Multi-image Data Model
        ↓
v15
Persistent Settings
        ↓
v18
PPI + Physical Photo Dimensions
        ↓
v19+
Production-oriented Photo Print Studio

---

Versioning Note

The repository contains distinct historical version directories through v19.

The later deployed routes ("/20", "/21", "/22", "/23", "/24") should not automatically be interpreted as five independent source-code snapshots.

The repository history identifies the later implementation as the current/root generation.

Therefore, the practical version lineage is:

v5
 ↓
v6
 ↓
v7
 ↓
v8
 ↓
v9
 ↓
v10
 ↓
v11
 ↓
v12
 ↓
v13
 ↓
v14
 ↓
v15
 ↓
v16
 ↓
v17
 ↓
v18
 ↓
v19
 ↓
v20 / current generation
 ↓
/21
/22
/23
/24

"/24" should therefore be treated as the current deployed release endpoint rather than assuming it represents an entirely new implementation relative to "/20".

---

Current Product Position

RC Crop Print has evolved through four major product stages:

1. BASIC PRINT TOOL
   v5
        ↓
2. IMAGE EDITOR
   v6–v12
        ↓
3. MULTI-IMAGE PRINT STUDIO
   v13–v17
        ↓
4. PHOTO / PASSPORT PRINT WORKFLOW
   v18–v24

The most significant functional releases are:

- v6 — Crop editor
- v9 — Full canvas editor
- v13 — Multi-image workflow
- v15 — Saved settings
- v18 — PPI + physical photo dimensions
- v19 — Improved final workflow
- v20+ — Current-generation consolidation
