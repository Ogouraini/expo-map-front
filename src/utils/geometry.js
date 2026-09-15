// src/utils/geometry.js
// Depuis la refonte "SVG complet par hall", les espaces n'ont plus de champ
// `geometrie` (points bruts) : leur forme est directement le tracé SVG
// portant leur id (voir ExhibitionPlanViewer.vue::bindSpaces). Les anciennes
// fonctions polygonCentroid/pointsToSvgString/polygonBoundingBox, qui
// travaillaient sur ces points, n'ont donc plus d'utilité côté front et ont
// été retirées. clamp() reste utilisée par usePlanZoomPan.js (zoom/pan).

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
