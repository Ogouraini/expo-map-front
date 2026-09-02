// src/utils/geometry.js


/** Convertit un polygone en attribut `points` SVG ("x1,y1 x2,y2 ..."). */
export function pointsToSvgString(points) {
  if (!points || points.length === 0) return '';
  return points.map(([x, y]) => `${x},${y}`).join(' ');
}

/** Centroïde exact d'un polygone (utilisé pour centrer le zoom et placer le label/icône). */
export function polygonCentroid(points) {
  if (!points || points.length === 0) return { x: 0, y: 0 };
  if (points.length === 1) return { x: points[0][0], y: points[0][1] };

  let area = 0;
  let cx = 0;
  let cy = 0;

  for (let i = 0; i < points.length; i++) {
    const [x0, y0] = points[i];
    const [x1, y1] = points[(i + 1) % points.length];
    const cross = x0 * y1 - x1 * y0;
    area += cross;
    cx += (x0 + x1) * cross;
    cy += (y0 + y1) * cross;
  }

  area *= 0.5;

  if (Math.abs(area) < 1e-6) {
    // polygone dégénéré (aligné/point) : on retombe sur la moyenne simple
    const n = points.length;
    const sum = points.reduce((acc, [x, y]) => ({ x: acc.x + x, y: acc.y + y }), { x: 0, y: 0 });
    return { x: sum.x / n, y: sum.y / n };
  }

  return { x: cx / (6 * area), y: cy / (6 * area) };
}

/** Boîte englobante d'un polygone. */
export function polygonBoundingBox(points) {
  const xs = points.map((p) => p[0]);
  const ys = points.map((p) => p[1]);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  return { minX, minY, maxX, maxY, width: maxX - minX, height: maxY - minY };
}

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
