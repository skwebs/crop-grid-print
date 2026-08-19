/* ============================================================
   RC CROP PRINT
   ============================================================ */
/* ============================================================
   DOM REFERENCES
   ============================================================ */
const app = document.getElementById("app");
const viewport = document.getElementById("viewport");
const viewportCanvas = document.getElementById("viewportCanvas");
const ctx = viewportCanvas.getContext("2d");
const topRuler = document.getElementById("topRuler");
const leftRuler = document.getElementById("leftRuler");
const sourceInput = document.getElementById("sourceInput");
const layoutPanel = document.getElementById("layoutPanel");
const showLayoutButton = document.getElementById("showLayoutButton");
const closeLayoutButton = document.getElementById("closeLayoutButton");
const layoutButton = document.getElementById("layoutButton");
const paperSize = document.getElementById("paperSize");
const rowsInput = document.getElementById("rows");
const columnsInput = document.getElementById("columns");
const slotColor = document.getElementById("slotColor");
const slotColorText = document.getElementById("slotColorText");
const portraitButton = document.getElementById("portraitButton");
const landscapeButton = document.getElementById("landscapeButton");
const rotateImageButton = document.getElementById("rotateImageButton");
const rotateText = document.getElementById("rotateText");
const zoomText = document.getElementById("zoomText");
const status = document.getElementById("status");
const downloadButton = document.getElementById("downloadButton");
const rulerUnitSelect = document.getElementById("rulerUnit");
/* ============================================================
   CROP DOM
   ============================================================ */
const cropModal = document.getElementById("cropModal");
const cropImage = document.getElementById("cropImage");
const cropApply = document.getElementById("cropApply");
const cropCancel = document.getElementById("cropCancel");
const cropRotateLeft = document.getElementById("cropRotateLeft");
const cropRotateRight = document.getElementById("cropRotateRight");
const ratioButtons = document.querySelectorAll(".ratioButton");
/* ============================================================
   CONSTANTS
   ============================================================ */
const DPI = 300;
const BASE_IMAGE_WIDTH = 360;
const BASE_IMAGE_HEIGHT = 450;
const MIN_ZOOM = 0.05;
const MAX_ZOOM = 8;
/* ============================================================
   PAPER SIZES
   ============================================================ */
const PAPER_SIZES = {
  A4: {
    width: 2480,
    height: 3505,
  },
  "4x6": {
    width: 1200,
    height: 1800,
  },
  "5x7": {
    width: 1500,
    height: 2100,
  },
};
/* ============================================================
   VIEWPORT STATE
   ============================================================ */
let dpr = window.devicePixelRatio || 1;
let viewportWidth = 0;
let viewportHeight = 0;
/* ============================================================
   IMAGE STATE
   ============================================================ */
let cropper = null;
let cropObjectUrl = null;
let croppedCanvas = null;
/*
 * false = original orientation
 * true  = rotated -90°
 */
let imageRotated = false;
/* ============================================================
   SHEET STATE
   ============================================================ */
let sheetCanvas = null;
let hasGeneratedSheet = false;
let sheetUpdateTimer = null;
/* ============================================================
   RULER
   ============================================================ */
let rulerUnit = "in";
/* ============================================================
   LAYOUT STATE
   ============================================================ */
const layout = {
  paper: "A4",
  rows: 3,
  columns: 2,
  landscape: false,
  slotColor: "#ffffff",
  gap: 40,
};
/* ============================================================
   CAMERA STATE
   ============================================================ */
const camera = {
  x: 0,
  y: 0,
  zoom: 1,
};
/* ============================================================
   RESPONSIVE
   ============================================================ */
function isSmallScreen() {
  return window.matchMedia("(max-width: 700px)").matches;
}
/* ============================================================
   LAYOUT PANEL STATE
   ============================================================ */
/*
 * Desktop:
 *
 *     OPEN by default.
 *
 * Mobile:
 *
 *     CLOSED by default.
 */
let layoutVisible = !isSmallScreen();
/* ============================================================
   UPDATE LAYOUT UI
   ============================================================ */
function updateLayoutUI() {
  if (layoutVisible) {
    layoutPanel.classList.remove("hidden");
    showLayoutButton.classList.add("hidden");
  } else {
    layoutPanel.classList.add("hidden");
    showLayoutButton.classList.remove("hidden");
  }
}
/* ============================================================
   SHOW LAYOUT
   ============================================================ */
function showLayout() {
  layoutVisible = true;
  updateLayoutUI();
}
/* ============================================================
   HIDE LAYOUT
   ============================================================ */
function hideLayout() {
  layoutVisible = false;
  updateLayoutUI();
}
/* ============================================================
   MOBILE CANVAS INTERACTION
   ============================================================ */
/*
 * This is the ONLY place where canvas interaction
 * affects the Print Layout.
 *
 * Desktop:
 *
 *     Nothing happens.
 *
 * Mobile:
 *
 *     If layout is open -> close it.
 *
 *     If layout is already closed -> nothing.
 */
function handleCanvasInteraction() {
  if (!isSmallScreen()) {
    return;
  }
  if (layoutVisible) {
    hideLayout();
  }
}
/* ============================================================
   RESPONSIVE SCREEN CHANGE
   ============================================================ */
const mediaQuery = window.matchMedia("(max-width: 700px)");
mediaQuery.addEventListener("change", (event) => {
  if (event.matches) {
    /*
     * Entering mobile.
     *
     * Mobile default:
     * hidden.
     */
    layoutVisible = false;
  } else {
    /*
     * Entering desktop.
     *
     * Desktop default:
     * visible.
     */
    layoutVisible = true;
  }
  updateLayoutUI();
});
/* ============================================================
   VIEWPORT RESIZE
   ============================================================ */
function resizeViewport() {
  dpr = window.devicePixelRatio || 1;
  viewportWidth = window.innerWidth;
  viewportHeight = window.innerHeight;
  viewportCanvas.width = viewportWidth * dpr;
  viewportCanvas.height = viewportHeight * dpr;
  viewportCanvas.style.width = `${viewportWidth}px`;
  viewportCanvas.style.height = `${viewportHeight}px`;
  render();
}
window.addEventListener("resize", resizeViewport);
/* ============================================================
   CLAMP
   ============================================================ */
function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
/* ============================================================
   WORLD → SCREEN
   ============================================================ */
function worldToScreen(x, y) {
  return {
    x: x * camera.zoom + camera.x,
    y: y * camera.zoom + camera.y,
  };
}
/* ============================================================
   SCREEN → WORLD
   ============================================================ */
function screenToWorld(x, y) {
  return {
    x: (x - camera.x) / camera.zoom,
    y: (y - camera.y) / camera.zoom,
  };
}
/* ============================================================
   IMAGE DIMENSIONS
   ============================================================ */
function getImageDimensions() {
  if (imageRotated) {
    return {
      width: BASE_IMAGE_HEIGHT,
      height: BASE_IMAGE_WIDTH,
    };
  }
  return {
    width: BASE_IMAGE_WIDTH,
    height: BASE_IMAGE_HEIGHT,
  };
}
/* ============================================================
   RULER PIXELS PER UNIT
   ============================================================ */
function getPixelsPerUnit() {
  switch (rulerUnit) {
    case "cm":
      return DPI / 2.54;
    case "mm":
      return DPI / 25.4;
    default:
      return DPI;
  }
}
/* ============================================================
   RULER UNIT LABEL
   ============================================================ */
function getRulerUnitLabel() {
  switch (rulerUnit) {
    case "cm":
      return "cm";
    case "mm":
      return "mm";
    default:
      return "in";
  }
}
/* ============================================================
   FORMAT RULER VALUE
   ============================================================ */
function formatRulerValue(value) {
  if (rulerUnit === "mm") {
    return Number(value.toFixed(1)).toString();
  }
  return Number(value.toFixed(2)).toString();
}
/* ============================================================
   RULER STEP
   ============================================================ */
function getRulerStep() {
  const pixelsPerUnit = getPixelsPerUnit();
  const target = 80 / camera.zoom / pixelsPerUnit;
  const steps = [
    0.01, 0.02, 0.05, 0.1, 0.2, 0.25, 0.5, 1, 2, 5, 10, 20, 50, 100, 200, 500,
  ];
  for (const step of steps) {
    if (step >= target) {
      return step;
    }
  }
  return 500;
}
/* ============================================================
   ZOOM AT POINT
   ============================================================ */
function zoomAt(x, y, newZoom) {
  newZoom = clamp(newZoom, MIN_ZOOM, MAX_ZOOM);
  const world = screenToWorld(x, y);
  camera.zoom = newZoom;
  camera.x = x - world.x * camera.zoom;
  camera.y = y - world.y * camera.zoom;
  updateZoom();
  render();
}
/* ============================================================
   ZOOM
   ============================================================ */
function zoomBy(factor, x, y) {
  zoomAt(x, y, camera.zoom * factor);
}
/* ============================================================
   ZOOM LABEL
   ============================================================ */
function updateZoom() {
  zoomText.textContent = `${Math.round(camera.zoom * 100)}%`;
}
/* ============================================================
   DEBOUNCED SHEET UPDATE
   ============================================================ */
function scheduleSheetUpdate() {
  clearTimeout(sheetUpdateTimer);
  sheetUpdateTimer = setTimeout(generateSheet, 120);
}
/* ============================================================
   IMAGE UPLOAD
   ============================================================ */
sourceInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (!file) {
    return;
  }
  if (cropObjectUrl) {
    URL.revokeObjectURL(cropObjectUrl);
  }
  cropObjectUrl = URL.createObjectURL(file);
  imageRotated = false;
  updateRotateButton();
  cropImage.src = cropObjectUrl;
  cropModal.classList.add("visible");
  if (cropper) {
    cropper.destroy();
    cropper = null;
  }
  cropImage.onload = () => {
    cropper = new Cropper(cropImage, {
      viewMode: 1,
      dragMode: "move",
      autoCropArea: 0.85,
      responsive: true,
      restore: false,
      guides: true,
      center: true,
      highlight: true,
      background: false,
      movable: true,
      zoomable: true,
      rotatable: true,
      scalable: false,
      cropBoxMovable: true,
      cropBoxResizable: true,
      toggleDragModeOnDblclick: false,
    });
  };
});
/* ============================================================
   CROP RATIO BUTTONS
   ============================================================ */
ratioButtons.forEach((button) => {
  button.addEventListener("click", () => {
    ratioButtons.forEach((item) => {
      item.classList.remove("bg-white", "text-gray-900");
      item.classList.add("bg-neutral-800", "text-white");
    });
    button.classList.remove("bg-neutral-800", "text-white");
    button.classList.add("bg-white", "text-gray-900");
    if (!cropper) {
      return;
    }
    cropper.setAspectRatio(Number(button.dataset.ratio));
  });
});
/* ============================================================
   CROP ROTATE LEFT
   ============================================================ */
cropRotateLeft.addEventListener("click", () => {
  if (cropper) {
    cropper.rotate(-90);
  }
});
/* ============================================================
   CROP ROTATE RIGHT
   ============================================================ */
cropRotateRight.addEventListener("click", () => {
  if (cropper) {
    cropper.rotate(90);
  }
});
/* ============================================================
   CLOSE CROPPER
   ============================================================ */
function closeCropper() {
  cropModal.classList.remove("visible");
  if (cropper) {
    cropper.destroy();
    cropper = null;
  }
}
/* ============================================================
   CANCEL CROP
   ============================================================ */
cropCancel.addEventListener("click", closeCropper);
/* ============================================================
   APPLY CROP
   ============================================================ */
cropApply.addEventListener("click", () => {
  if (!cropper) {
    return;
  }
  croppedCanvas = cropper.getCroppedCanvas({
    width: BASE_IMAGE_WIDTH,
    height: BASE_IMAGE_HEIGHT,
    imageSmoothingEnabled: true,
    imageSmoothingQuality: "high",
    fillColor: "#ffffff",
  });
  closeCropper();
  imageRotated = false;
  updateRotateButton();
  sheetCanvas = null;
  hasGeneratedSheet = false;
  generateSheet();
  status.textContent = "Crop applied";
});
/* ============================================================
   ROTATE CROPPED IMAGE
   ============================================================ */
function rotateCroppedImage() {
  if (!croppedCanvas) {
    return;
  }
  const rotated = document.createElement("canvas");
  rotated.width = croppedCanvas.height;
  rotated.height = croppedCanvas.width;
  const rotateContext = rotated.getContext("2d");
  rotateContext.translate(rotated.width / 2, rotated.height / 2);
  rotateContext.rotate(-Math.PI / 2);
  rotateContext.drawImage(
    croppedCanvas,
    -croppedCanvas.width / 2,
    -croppedCanvas.height / 2,
  );
  croppedCanvas = rotated;
  imageRotated = !imageRotated;
  updateRotateButton();
  scheduleSheetUpdate();
  status.textContent = imageRotated ? "Image: Landscape" : "Image: Portrait";
}
/* ============================================================
   ROTATE BUTTON UI
   ============================================================ */
function updateRotateButton() {
  if (imageRotated) {
    rotateText.textContent = "Portrait";
    rotateImageButton.className =
      "flex h-7.5 w-full items-center justify-center gap-1 rounded-[5px] border border-gray-900 bg-gray-900 px-2 text-[10px] font-semibold leading-none text-white";
  } else {
    rotateText.textContent = "Rotate −90°";
    rotateImageButton.className =
      "flex h-7.5 w-full items-center justify-center gap-1 rounded-[5px] border border-gray-300 bg-white px-2 text-[10px] font-semibold leading-none text-gray-700 hover:bg-gray-100";
  }
}
rotateImageButton.addEventListener("click", rotateCroppedImage);
/* ============================================================
   GET PAPER
   ============================================================ */
function getPaper() {
  const paper = PAPER_SIZES[layout.paper];
  if (layout.landscape) {
    return {
      width: paper.height,
      height: paper.width,
    };
  }
  return paper;
}
/* ============================================================
   GENERATE SHEET
   ============================================================ */
function generateSheet() {
  if (!croppedCanvas) {
    return;
  }
  const oldZoom = camera.zoom;
  const oldX = camera.x;
  const oldY = camera.y;
  const paper = getPaper();
  const image = getImageDimensions();
  sheetCanvas = document.createElement("canvas");
  sheetCanvas.width = paper.width;
  sheetCanvas.height = paper.height;
  const sheetContext = sheetCanvas.getContext("2d");
  /*
   * Paper.
   */
  sheetContext.fillStyle = "#ffffff";
  sheetContext.fillRect(0, 0, paper.width, paper.height);
  const gap = layout.gap;
  const margin = gap / 2;
  /*
   * Grid.
   */
  for (let row = 0; row < layout.rows; row++) {
    for (let column = 0; column < layout.columns; column++) {
      const x = margin + column * (image.width + gap);
      const y = margin + row * (image.height + gap);
      if (x + image.width > paper.width || y + image.height > paper.height) {
        continue;
      }
      /*
       * Slot background.
       */
      sheetContext.fillStyle = layout.slotColor;
      sheetContext.fillRect(x, y, image.width, image.height);
      /*
       * Image.
       */
      sheetContext.drawImage(croppedCanvas, x, y, image.width, image.height);
      /*
       * Border.
       */
      sheetContext.strokeStyle = "#000000";
      sheetContext.lineWidth = 5;
      sheetContext.strokeRect(x, y, image.width, image.height);
    }
  }
  /*
   * First generation.
   */
  if (!hasGeneratedSheet) {
    hasGeneratedSheet = true;
    fitSheet();
  } else {
    camera.zoom = oldZoom;
    camera.x = oldX;
    camera.y = oldY;
    updateZoom();
    render();
  }
  updateStatus();
}
/* ============================================================
   FIT
   ============================================================ */
function fitSheet() {
  if (!sheetCanvas) {
    return;
  }
  const padding = 100;
  const zoomX = (viewportWidth - padding * 2) / sheetCanvas.width;
  const zoomY = (viewportHeight - padding * 2) / sheetCanvas.height;
  camera.zoom = clamp(Math.min(zoomX, zoomY), MIN_ZOOM, MAX_ZOOM);
  camera.x = (viewportWidth - sheetCanvas.width * camera.zoom) / 2;
  camera.y = (viewportHeight - sheetCanvas.height * camera.zoom) / 2;
  updateZoom();
  render();
}
/* ============================================================
   ACTUAL SIZE
   ============================================================ */
function actualSize() {
  if (!sheetCanvas) {
    return;
  }
  camera.zoom = 1;
  camera.x = (viewportWidth - sheetCanvas.width) / 2;
  camera.y = (viewportHeight - sheetCanvas.height) / 2;
  updateZoom();
  render();
}
/* ============================================================
   PAPER SIZE
   ============================================================ */
paperSize.addEventListener("change", () => {
  layout.paper = paperSize.value;
  scheduleSheetUpdate();
});
/* ============================================================
   ROWS
   ============================================================ */
rowsInput.addEventListener("input", () => {
  layout.rows = clamp(Number(rowsInput.value) || 1, 1, 10);
  scheduleSheetUpdate();
});
/* ============================================================
   COLUMNS
   ============================================================ */
columnsInput.addEventListener("input", () => {
  layout.columns = clamp(Number(columnsInput.value) || 1, 1, 10);
  scheduleSheetUpdate();
});
/* ============================================================
   SLOT COLOR
   ============================================================ */
slotColor.addEventListener("input", () => {
  layout.slotColor = slotColor.value;
  slotColorText.textContent = slotColor.value;
  scheduleSheetUpdate();
});
/* ============================================================
   PORTRAIT
   ============================================================ */
portraitButton.addEventListener("click", () => {
  layout.landscape = false;
  portraitButton.className =
    "h-7.5 flex-1 rounded-[5px] border border-gray-900 bg-gray-900 px-1.5 text-[10px] font-medium leading-none text-white";
  landscapeButton.className =
    "h-7.5 flex-1 rounded-[5px] border border-gray-300 bg-white px-1.5 text-[10px] font-medium leading-none text-gray-700 hover:bg-gray-100";
  scheduleSheetUpdate();
});
/* ============================================================
   LANDSCAPE
   ============================================================ */
landscapeButton.addEventListener("click", () => {
  layout.landscape = true;
  landscapeButton.className =
    "h-7.5 flex-1 rounded-[5px] border border-gray-900 bg-gray-900 px-1.5 text-[10px] font-medium leading-none text-white";
  portraitButton.className =
    "h-7.5 flex-1 rounded-[5px] border border-gray-300 bg-white px-1.5 text-[10px] font-medium leading-none text-gray-700 hover:bg-gray-100";
  scheduleSheetUpdate();
});
/* ============================================================
   RULER UNIT
   ============================================================ */
rulerUnitSelect.addEventListener("change", () => {
  rulerUnit = rulerUnitSelect.value;
  render();
});
/* ============================================================
   LAYOUT BUTTONS
   ============================================================ */
closeLayoutButton.addEventListener("click", hideLayout);
showLayoutButton.addEventListener("click", showLayout);
layoutButton.addEventListener("click", () => {
  if (layoutVisible) {
    hideLayout();
  } else {
    showLayout();
  }
});
/* ============================================================
   DOWNLOAD
   ============================================================ */
downloadButton.addEventListener("click", () => {
  if (!sheetCanvas) {
    return;
  }
  sheetCanvas.toBlob((blob) => {
    if (!blob) {
      return;
    }
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `rc-crop-print-${Date.now()}.png`;
    link.click();
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 500);
  }, "image/png");
});
/* ============================================================
   MOUSE PAN
   ============================================================ */
let mouseDragging = false;
let lastMouseX = 0;
let lastMouseY = 0;
let spacePressed = false;
/* ============================================================
   SPACE
   ============================================================ */
window.addEventListener("keydown", (event) => {
  if (event.code === "Space") {
    spacePressed = true;
    event.preventDefault();
  }
});
window.addEventListener("keyup", (event) => {
  if (event.code === "Space") {
    spacePressed = false;
  }
});
/* ============================================================
   MOUSE DOWN
   ============================================================ */
viewport.addEventListener("mousedown", (event) => {
  /*
   * Desktop interaction does not close layout.
   *
   * Mobile browsers generally use pointer events,
   * but this is harmless if called here.
   */
  handleCanvasInteraction();
  const canPan = event.button === 1 || (event.button === 0 && spacePressed);
  if (!canPan) {
    return;
  }
  event.preventDefault();
  mouseDragging = true;
  lastMouseX = event.clientX;
  lastMouseY = event.clientY;
  viewport.classList.add("dragging");
});
/* ============================================================
   MOUSE MOVE
   ============================================================ */
window.addEventListener("mousemove", (event) => {
  if (!mouseDragging) {
    return;
  }
  camera.x += event.clientX - lastMouseX;
  camera.y += event.clientY - lastMouseY;
  lastMouseX = event.clientX;
  lastMouseY = event.clientY;
  render();
});
/* ============================================================
   MOUSE UP
   ============================================================ */
window.addEventListener("mouseup", () => {
  mouseDragging = false;
  viewport.classList.remove("dragging");
});
/* ============================================================
   WHEEL
   ============================================================ */
viewport.addEventListener(
  "wheel",
  (event) => {
    /*
     * Mobile:
     * If a canvas wheel interaction somehow occurs,
     * close the open layout.
     *
     * Desktop:
     * no effect.
     */
    handleCanvasInteraction();
    event.preventDefault();
    const rect = viewport.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    /*
     * Ctrl/Cmd + wheel = zoom.
     */
    if (event.ctrlKey || event.metaKey) {
      zoomBy(event.deltaY < 0 ? 1.1 : 1 / 1.1, x, y);
      return;
    }
    /*
     * Normal wheel = pan.
     */
    camera.x -= event.deltaX;
    camera.y -= event.deltaY;
    render();
  },
  {
    passive: false,
  },
);
/* ============================================================
   POINTER / TOUCH STATE
   ============================================================ */
const pointers = new Map();
let gesture = {
  mode: null,
  startDistance: 0,
  startZoom: 1,
  startCenter: null,
  startCameraX: 0,
  startCameraY: 0,
  startWorldX: 0,
  startWorldY: 0,
};
/* ============================================================
   POINTER HELPERS
   ============================================================ */
function getPointers() {
  return [...pointers.values()];
}
function getCenter(a, b) {
  return {
    x: (a.x + b.x) / 2,
    y: (a.y + b.y) / 2,
  };
}
function getDistance(a, b) {
  return Math.hypot(b.x - a.x, b.y - a.y);
}
/* ============================================================
   START TOUCH GESTURE
   ============================================================ */
function startTouchGesture() {
  const points = getPointers();
  /*
   * One finger = pan.
   */
  if (points.length === 1) {
    const point = points[0];
    gesture = {
      mode: "pan",
      startDistance: 0,
      startZoom: camera.zoom,
      startCenter: {
        x: point.x,
        y: point.y,
      },
      startCameraX: camera.x,
      startCameraY: camera.y,
      startWorldX: 0,
      startWorldY: 0,
    };
    return;
  }
  /*
   * Two fingers = pinch + pan.
   */
  if (points.length === 2) {
    const [a, b] = points;
    const center = getCenter(a, b);
    const distance = getDistance(a, b);
    const world = screenToWorld(center.x, center.y);
    gesture = {
      mode: "pinch",
      startDistance: distance,
      startZoom: camera.zoom,
      startCenter: center,
      startCameraX: camera.x,
      startCameraY: camera.y,
      startWorldX: world.x,
      startWorldY: world.y,
    };
  }
}
/* ============================================================
   POINTER DOWN
   ============================================================ */
viewport.addEventListener(
  "pointerdown",
  (event) => {
    if (event.pointerType === "mouse") {
      return;
    }
    /*
     * IMPORTANT:
     *
     * On mobile, opening the canvas is considered
     * canvas interaction.
     *
     * Therefore an opened Print Layout closes here.
     */
    handleCanvasInteraction();
    event.preventDefault();
    viewport.setPointerCapture(event.pointerId);
    pointers.set(event.pointerId, {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
    });
    startTouchGesture();
  },
  {
    passive: false,
  },
);
/* ============================================================
   POINTER MOVE
   ============================================================ */
viewport.addEventListener(
  "pointermove",
  (event) => {
    if (event.pointerType === "mouse") {
      return;
    }
    event.preventDefault();
    const pointer = pointers.get(event.pointerId);
    if (!pointer) {
      return;
    }
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    const points = getPointers();
    /*
     * One finger pan.
     */
    if (points.length === 1 && gesture.mode === "pan") {
      const point = points[0];
      camera.x = gesture.startCameraX + (point.x - gesture.startCenter.x);
      camera.y = gesture.startCameraY + (point.y - gesture.startCenter.y);
      render();
      return;
    }
    /*
     * Two finger pinch + pan.
     */
    if (points.length === 2 && gesture.mode === "pinch") {
      const [a, b] = points;
      const center = getCenter(a, b);
      const distance = getDistance(a, b);
      const scale = distance / gesture.startDistance;
      camera.zoom = clamp(gesture.startZoom * scale, MIN_ZOOM, MAX_ZOOM);
      /*
       * Keep midpoint anchored.
       */
      camera.x = center.x - gesture.startWorldX * camera.zoom;
      camera.y = center.y - gesture.startWorldY * camera.zoom;
      updateZoom();
      render();
    }
  },
  {
    passive: false,
  },
);
/* ============================================================
   POINTER END
   ============================================================ */
function finishTouch(event) {
  if (event.pointerType === "mouse") {
    return;
  }
  pointers.delete(event.pointerId);
  /*
   * Continue one-finger pan if another finger remains.
   */
  if (pointers.size === 1) {
    const point = getPointers()[0];
    gesture = {
      mode: "pan",
      startDistance: 0,
      startZoom: camera.zoom,
      startCenter: {
        x: point.x,
        y: point.y,
      },
      startCameraX: camera.x,
      startCameraY: camera.y,
      startWorldX: 0,
      startWorldY: 0,
    };
    return;
  }
  gesture.mode = null;
}
viewport.addEventListener("pointerup", finishTouch);
viewport.addEventListener("pointercancel", finishTouch);
/* ============================================================
   KEYBOARD SHORTCUTS
   ============================================================ */
window.addEventListener("keydown", (event) => {
  const modifier = event.ctrlKey || event.metaKey;
  if (!modifier) {
    return;
  }
  /*
   * Zoom in.
   */
  if (event.key === "+" || event.key === "=") {
    event.preventDefault();
    zoomBy(1.2, viewportWidth / 2, viewportHeight / 2);
  }
  /*
   * Zoom out.
   */
  if (event.key === "-") {
    event.preventDefault();
    zoomBy(1 / 1.2, viewportWidth / 2, viewportHeight / 2);
  }
  /*
   * Fit.
   */
  if (event.key === "0") {
    event.preventDefault();
    fitSheet();
  }
  /*
   * Actual 100%.
   */
  if (event.key === "1") {
    event.preventDefault();
    actualSize();
  }
});
/* ============================================================
   TOOLBAR ZOOM
   ============================================================ */
document.getElementById("zoomIn").addEventListener("click", () => {
  zoomBy(1.2, viewportWidth / 2, viewportHeight / 2);
});
document.getElementById("zoomOut").addEventListener("click", () => {
  zoomBy(1 / 1.2, viewportWidth / 2, viewportHeight / 2);
});
document.getElementById("fitButton").addEventListener("click", fitSheet);
document.getElementById("actualButton").addEventListener("click", actualSize);
/* ============================================================
   DRAW SHEET
   ============================================================ */
function drawSheet() {
  if (!sheetCanvas) {
    return;
  }
  const position = worldToScreen(0, 0);
  const width = sheetCanvas.width * camera.zoom;
  const height = sheetCanvas.height * camera.zoom;
  ctx.save();
  /*
   * Paper shadow.
   */
  ctx.shadowColor = "rgba(0,0,0,.25)";
  ctx.shadowBlur = 24;
  ctx.shadowOffsetY = 8;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(position.x, position.y, width, height);
  ctx.shadowColor = "transparent";
  /*
   * Sheet.
   */
  ctx.drawImage(sheetCanvas, position.x, position.y, width, height);
  /*
   * Border.
   */
  ctx.strokeStyle = "#9ca3af";
  ctx.lineWidth = 1;
  ctx.strokeRect(position.x, position.y, width, height);
  ctx.restore();
}
/* ============================================================
   WORKSPACE GRID
   ============================================================ */
function drawWorkspaceGrid() {
  const spacing = 32;
  const topLeft = screenToWorld(0, 0);
  const bottomRight = screenToWorld(viewportWidth, viewportHeight);
  const startX = Math.floor(topLeft.x / spacing) * spacing;
  const endX = Math.ceil(bottomRight.x / spacing) * spacing;
  const startY = Math.floor(topLeft.y / spacing) * spacing;
  const endY = Math.ceil(bottomRight.y / spacing) * spacing;
  ctx.save();
  ctx.translate(camera.x, camera.y);
  ctx.scale(camera.zoom, camera.zoom);
  ctx.strokeStyle = "rgba(100,116,139,.10)";
  ctx.lineWidth = 1 / camera.zoom;
  for (let x = startX; x <= endX; x += spacing) {
    ctx.beginPath();
    ctx.moveTo(x, startY);
    ctx.lineTo(x, endY);
    ctx.stroke();
  }
  for (let y = startY; y <= endY; y += spacing) {
    ctx.beginPath();
    ctx.moveTo(startX, y);
    ctx.lineTo(endX, y);
    ctx.stroke();
  }
  ctx.restore();
}
/* ============================================================
   TOP RULER
   ============================================================ */
function drawTopRuler() {
  const width = viewportWidth - 32;
  const height = 32;
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, width * dpr);
  canvas.height = height * dpr;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  const ruler = canvas.getContext("2d");
  ruler.setTransform(dpr, 0, 0, dpr, 0, 0);
  ruler.fillStyle = "#f8fafc";
  ruler.fillRect(0, 0, width, height);
  const pixelsPerUnit = getPixelsPerUnit();
  const step = getRulerStep();
  const startPixel = screenToWorld(32, 0).x;
  const endPixel = screenToWorld(viewportWidth, 0).x;
  const startUnit = startPixel / pixelsPerUnit;
  const endUnit = endPixel / pixelsPerUnit;
  const firstUnit = Math.floor(startUnit / step) * step;
  ruler.strokeStyle = "#94a3b8";
  ruler.fillStyle = "#475569";
  ruler.font = "9px Arial";
  ruler.textAlign = "center";
  ruler.textBaseline = "top";
  for (let unit = firstUnit; unit <= endUnit; unit += step) {
    const worldPixel = unit * pixelsPerUnit;
    const screen = worldToScreen(worldPixel, 0);
    const x = screen.x - 32;
    ruler.beginPath();
    ruler.moveTo(x, 32);
    ruler.lineTo(x, 20);
    ruler.stroke();
    ruler.fillText(formatRulerValue(unit), x, 3);
  }
  ruler.fillStyle = "#64748b";
  ruler.font = "8px Arial";
  ruler.textAlign = "right";
  ruler.fillText(getRulerUnitLabel(), width - 4, 3);
  topRuler.replaceChildren(canvas);
}
/* ============================================================
   LEFT RULER
   ============================================================ */
function drawLeftRuler() {
  const width = 32;
  const height = viewportHeight - 32;
  const canvas = document.createElement("canvas");
  canvas.width = width * dpr;
  canvas.height = Math.max(1, height * dpr);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  const ruler = canvas.getContext("2d");
  ruler.setTransform(dpr, 0, 0, dpr, 0, 0);
  ruler.fillStyle = "#f8fafc";
  ruler.fillRect(0, 0, width, height);
  const pixelsPerUnit = getPixelsPerUnit();
  const step = getRulerStep();
  const startPixel = screenToWorld(0, 32).y;
  const endPixel = screenToWorld(0, viewportHeight).y;
  const startUnit = startPixel / pixelsPerUnit;
  const endUnit = endPixel / pixelsPerUnit;
  const firstUnit = Math.floor(startUnit / step) * step;
  ruler.strokeStyle = "#94a3b8";
  ruler.fillStyle = "#475569";
  ruler.font = "9px Arial";
  ruler.textAlign = "left";
  ruler.textBaseline = "middle";
  for (let unit = firstUnit; unit <= endUnit; unit += step) {
    const worldPixel = unit * pixelsPerUnit;
    const screen = worldToScreen(0, worldPixel);
    const y = screen.y - 32;
    ruler.beginPath();
    ruler.moveTo(32, y);
    ruler.lineTo(20, y);
    ruler.stroke();
    ruler.fillText(formatRulerValue(unit), 3, y);
  }
  ruler.fillStyle = "#64748b";
  ruler.font = "8px Arial";
  ruler.textAlign = "right";
  ruler.textBaseline = "bottom";
  ruler.fillText(getRulerUnitLabel(), width - 3, height - 3);
  leftRuler.replaceChildren(canvas);
}
/* ============================================================
   RULERS
   ============================================================ */
function drawRulers() {
  drawTopRuler();
  drawLeftRuler();
}
/* ============================================================
   MAIN RENDER
   ============================================================ */
function render() {
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, viewportWidth, viewportHeight);
  /*
   * Workspace.
   */
  ctx.fillStyle = "#d1d5db";
  ctx.fillRect(0, 0, viewportWidth, viewportHeight);
  /*
   * Workspace grid.
   */
  drawWorkspaceGrid();
  /*
   * Print sheet.
   */
  if (sheetCanvas) {
    drawSheet();
  } else {
    ctx.fillStyle = "#64748b";
    ctx.font = "14px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(
      "Upload an image to begin",
      viewportWidth / 2,
      viewportHeight / 2,
    );
  }
  /*
   * Fixed rulers.
   */
  drawRulers();
}
/* ============================================================
   STATUS
   ============================================================ */
function updateStatus() {
  if (!sheetCanvas) {
    return;
  }
  const image = getImageDimensions();
  status.textContent =
    `${layout.paper} · ` +
    `${layout.landscape ? "Landscape" : "Portrait"} · ` +
    `Image ${image.width}×${image.height} · ` +
    `${layout.rows}×${layout.columns} · ` +
    `${rulerUnit}`;
}
/* ============================================================
   INITIALIZATION
   ============================================================ */
updateRotateButton();
updateLayoutUI();
resizeViewport();
