// src/composables/usePlanZoomPan.js

import { reactive, computed, ref } from 'vue';
import { clamp } from '@/utils/geometry';

const MIN_ZOOM_RATIO = 1 / 6; // on peut zoomer jusqu'à 6x
const MAX_ZOOM_RATIO = 1; // on ne peut pas dézoomer plus que la vue "plan entier"

export function usePlanZoomPan(svgRef, initialWidth, initialHeight) {
  const planWidth = ref(initialWidth);
  const planHeight = ref(initialHeight);

  const viewBox = reactive({
    x: 0,
    y: 0,
    w: initialWidth,
    h: initialHeight,
  });

  const viewBoxString = computed(() => `${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`);

  // pointeurs actifs, pour distinguer pan (1 doigt/souris) et pinch (2 doigts)
  const activePointers = new Map();
  let pinchStartDist = null;
  let panStart = null; // { pointerX, pointerY, viewBoxX, viewBoxY }

  function setDimensions(width, height) {
    planWidth.value = width;
    planHeight.value = height;
    resetView();
  }

  function resetView() {
    viewBox.x = 0;
    viewBox.y = 0;
    viewBox.w = planWidth.value;
    viewBox.h = planHeight.value;
  }

  function getRect() {
    return svgRef.value ? svgRef.value.getBoundingClientRect() : null;
  }

  function clampPan() {
    const maxX = planWidth.value - viewBox.w;
    const maxY = planHeight.value - viewBox.h;
    viewBox.x = clamp(viewBox.x, Math.min(0, maxX), Math.max(0, maxX));
    viewBox.y = clamp(viewBox.y, Math.min(0, maxY), Math.max(0, maxY));
  }

  /** Zoom centré sur un point écran (cx, cy relatifs au conteneur SVG). */
  function zoomAt(cx, cy, scaleFactor, rect) {
    if (!rect) return;
    const ratio = planHeight.value / planWidth.value;

    const svgX = viewBox.x + (cx / rect.width) * viewBox.w;
    const svgY = viewBox.y + (cy / rect.height) * viewBox.h;

    const minW = planWidth.value * MIN_ZOOM_RATIO;
    const maxW = planWidth.value * MAX_ZOOM_RATIO;
    const newW = clamp(viewBox.w * scaleFactor, minW, maxW);
    const newH = newW * ratio;

    viewBox.x = svgX - (cx / rect.width) * newW;
    viewBox.y = svgY - (cy / rect.height) * newH;
    viewBox.w = newW;
    viewBox.h = newH;

    clampPan();
  }

  function onWheel(event) {
    const rect = getRect();
    if (!rect) return;
    const cx = event.clientX - rect.left;
    const cy = event.clientY - rect.top;
    const scaleFactor = event.deltaY < 0 ? 0.9 : 1.1; // molette haut = zoom avant
    zoomAt(cx, cy, scaleFactor, rect);
  }

  function onPointerDown(event) {
    const rect = getRect();
    if (!rect) return;
    svgRef.value.setPointerCapture(event.pointerId);
    activePointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (activePointers.size === 1) {
      panStart = {
        pointerX: event.clientX,
        pointerY: event.clientY,
        viewBoxX: viewBox.x,
        viewBoxY: viewBox.y,
      };
    } else if (activePointers.size === 2) {
      pinchStartDist = getPointersDistance();
    }
  }

  function onPointerMove(event) {
    if (!activePointers.has(event.pointerId)) return;
    activePointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    const rect = getRect();
    if (!rect) return;

    if (activePointers.size === 1 && panStart) {
      const dx = event.clientX - panStart.pointerX;
      const dy = event.clientY - panStart.pointerY;
      const scaleX = viewBox.w / rect.width;
      const scaleY = viewBox.h / rect.height;
      viewBox.x = panStart.viewBoxX - dx * scaleX;
      viewBox.y = panStart.viewBoxY - dy * scaleY;
      clampPan();
    } else if (activePointers.size === 2) {
      const newDist = getPointersDistance();
      const center = getPointersCenter(rect);
      if (pinchStartDist && newDist) {
        const scaleFactor = pinchStartDist / newDist;
        zoomAt(center.x, center.y, scaleFactor, rect);
      }
      pinchStartDist = newDist;
    }
  }

  function onPointerUp(event) {
    activePointers.delete(event.pointerId);
    if (activePointers.size < 2) pinchStartDist = null;
    if (activePointers.size === 0) panStart = null;
  }

  function getPointersDistance() {
    const pts = Array.from(activePointers.values());
    if (pts.length < 2) return null;
    const [a, b] = pts;
    return Math.hypot(b.x - a.x, b.y - a.y);
  }

  function getPointersCenter(rect) {
    const pts = Array.from(activePointers.values());
    const avgX = pts.reduce((sum, p) => sum + p.x, 0) / pts.length;
    const avgY = pts.reduce((sum, p) => sum + p.y, 0) / pts.length;
    return { x: avgX - rect.left, y: avgY - rect.top };
  }

  function zoomButton(factor) {
    const rect = getRect();
    if (!rect) return;
    zoomAt(rect.width / 2, rect.height / 2, factor, rect);
  }

  function zoomIn() {
    zoomButton(0.8);
  }

  function zoomOut() {
    zoomButton(1.25);
  }

  // Anime le viewBox vers une cible (centrage automatique sur un résultat de recherche)
  let animationFrame = null;
  function animateTo(target, duration = 400) {
    if (animationFrame) cancelAnimationFrame(animationFrame);
    const start = { x: viewBox.x, y: viewBox.y, w: viewBox.w, h: viewBox.h };
    const startTime = performance.now();

    function step(now) {
      const t = clamp((now - startTime) / duration, 0, 1);
      const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
      viewBox.x = start.x + (target.x - start.x) * eased;
      viewBox.y = start.y + (target.y - start.y) * eased;
      viewBox.w = start.w + (target.w - start.w) * eased;
      viewBox.h = start.h + (target.h - start.h) * eased;
      if (t < 1) {
        animationFrame = requestAnimationFrame(step);
      } else {
        animationFrame = null;
      }
    }
    animationFrame = requestAnimationFrame(step);
  }

  /** Centre + zoome sur une boîte englobante (utilisé pour un résultat de recherche). */
  function centerOnBoundingBox(bbox, paddingFactor = 3) {
    const ratio = planHeight.value / planWidth.value;
    const minW = planWidth.value * MIN_ZOOM_RATIO;
    const maxW = planWidth.value * MAX_ZOOM_RATIO;
    const targetW = clamp(Math.max(bbox.width, bbox.height / ratio) * paddingFactor, minW, maxW);
    const targetH = targetW * ratio;

    const centerX = bbox.minX + bbox.width / 2;
    const centerY = bbox.minY + bbox.height / 2;

    let targetX = centerX - targetW / 2;
    let targetY = centerY - targetH / 2;

    const maxX = planWidth.value - targetW;
    const maxY = planHeight.value - targetH;
    targetX = clamp(targetX, Math.min(0, maxX), Math.max(0, maxX));
    targetY = clamp(targetY, Math.min(0, maxY), Math.max(0, maxY));

    animateTo({ x: targetX, y: targetY, w: targetW, h: targetH });
  }

  return {
    viewBox,
    viewBoxString,
    setDimensions,
    resetView,
    onWheel,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    zoomIn,
    zoomOut,
    centerOnBoundingBox,
  };
}
