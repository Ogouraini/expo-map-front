<!-- src/components/ExhibitionPlanViewer.vue -->
<template>
  <div class="plan-viewer" :style="containerAspectStyle">
    <svg
      ref="svgRef"
      class="plan-svg"
      :viewBox="viewBoxString"
      preserveAspectRatio="xMidYMid meet"
      @wheel.prevent="onWheel"
      @pointerdown="handlePointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @pointercancel="onPointerUp"
    >
      
      <g v-if="backgroundMarkup" :transform="backgroundTransform" v-html="backgroundMarkup" />
      <rect
        v-else
        x="0"
        y="0"
        :width="plan.largeur_reference"
        :height="plan.hauteur_reference"
        class="plan-fallback-bg"
      />

      <!-- espaces (stands + toilettes + presse + salles de conférence + ...) -->
      <g
        v-for="space in visibleSpaces"
        :key="space.id"
        class="space-group"
        :class="{ 
            dimmed: isDimmed(space), 
            highlighted: space.id === highlightedSpaceId,
            'search-matched': isSearchResult(space) /* 👈 Classe appliquée si le stand est trouvé */
          }"
          @click.stop="onSpaceClick(space, $event)"
      >
        <title>{{ tooltipFor(space) }}</title>
        <polygon
          :points="pointsToSvgString(space.geometrie)"
          class="space-shape"
          :class="`type-${space.type}`"
          :style="{ '--space-color': visualFor(space).color }"
        />
        <text
          :x="centroidFor(space).x"
          :y="centroidFor(space).y"
          class="space-label"
          text-anchor="middle"
          dominant-baseline="middle"
        >
          <template v-if="space.type === 'stand'">{{ space.numero_stand }}</template>
          <template v-else>{{ space.libelle }}</template>
          <!-- <template v-else>{{ visualFor(space).icon }}</template> -->
        </text>
      </g>
    </svg>

    <!-- Contrôles de zoom -->
    <div class="zoom-controls">
      <button aria-label="Zoomer" @click="zoomIn">+</button>
      <button aria-label="Dézoomer" @click="zoomOut">−</button>
      <button aria-label="Réinitialiser la vue" @click="resetView">⤢</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { usePlanZoomPan } from '@/composables/usePlanZoomPan';
import { pointsToSvgString, polygonCentroid } from '@/utils/geometry';
import { getSpaceVisual } from '@/config/spaceTypes';

const props = defineProps({
  plan: { type: Object, required: true },
  spaces: { type: Array, default: () => [] },
  selectedCategories: { type: Array, default: () => [] },
  searchResultIds: { type: Array, default: () => [] },
  highlightedSpaceId: { type: String, default: null },
  focusToken: { type: Number, default: 0 },
});
const emit = defineEmits(['space-click']);

const svgRef = ref(null);
const backgroundMarkup = ref('');
const backgroundTransform = ref('');

// Variables pour distinguer le drag (glissement) du clic
const MOVEMENT_THRESHOLD = 5; // Seuil max de mouvement en pixels pour autoriser le clic
let startX = 0;
let startY = 0;

const {
  viewBoxString,
  setDimensions,
  resetView,
  onWheel,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  zoomIn,
  zoomOut,
} = usePlanZoomPan(svgRef, props.plan.largeur_reference, props.plan.hauteur_reference);

const containerAspectStyle = computed(() => ({
  aspectRatio: `${props.plan.largeur_reference} / ${props.plan.hauteur_reference}`,
}));

const visibleSpaces = computed(() => props.spaces);

function handlePointerDown(event) {
  startX = event.clientX;
  startY = event.clientY;
  onPointerDown(event);
}

function isDimmed(space) {
  if (props.searchResultIds.length > 0) {
    return !props.searchResultIds.includes(space.id);
  }

  // Comportement initial si pas de recherche (filtre par catégorie)
  if (space.type !== 'stand') return false;
  if (props.selectedCategories.length === 0) return false;
  return !props.selectedCategories.includes(space.categorie);
}

function isSearchResult(space) {
  return props.searchResultIds.length > 0 && props.searchResultIds.includes(space.id);
}

function visualFor(space) {
  return getSpaceVisual(space);
}

function centroidFor(space) {
  return polygonCentroid(space.geometrie);
}

function tooltipFor(space) {
  if (space.type === 'stand') {
    return space.exposant ? space.exposant.nom : `Stand ${space.numero_stand} (libre)`;
  }
  return space.libelle;
}

/**
 * Charge le SVG de fond du hall et l'inline dans le DOM (voir commentaire
 * dans le template). On récupère aussi le viewBox/les dimensions d'origine
 * du fichier pour recaler son échelle sur le système de coordonnées de
 * référence du plan (plan.largeur_reference / hauteur_reference) — celui
 * dans lequel sont exprimées les géométries des exhibition_spaces. En
 * théorie le backend garantit déjà la cohérence des deux, mais ce recalage
 * évite tout décalage silencieux si jamais ce n'est pas exactement le cas.
 */
async function loadBackground() {
  backgroundMarkup.value = '';
  if (!props.plan.background_svg_url) return;

  try {
    const response = await fetch(props.plan.background_svg_url);
    if (!response.ok) throw new Error('SVG de fond introuvable');
    const rawSvg = await response.text();

    const parsed = new DOMParser().parseFromString(rawSvg, 'image/svg+xml');
    const svgEl = parsed.documentElement;
    if (svgEl.nodeName.toLowerCase() !== 'svg') throw new Error('Fichier SVG invalide');

    svgEl.querySelectorAll('script').forEach((node) => node.remove());

    let sourceWidth = props.plan.largeur_reference;
    let sourceHeight = props.plan.hauteur_reference;
    const viewBoxAttr = svgEl.getAttribute('viewBox');
    if (viewBoxAttr) {
      const parts = viewBoxAttr.trim().split(/\s+/).map(Number);
      if (parts.length === 4 && parts[2] > 0 && parts[3] > 0) {
        [, , sourceWidth, sourceHeight] = parts;
      }
    } else {
      const widthAttr = parseFloat(svgEl.getAttribute('width'));
      const heightAttr = parseFloat(svgEl.getAttribute('height'));
      if (widthAttr > 0 && heightAttr > 0) {
        sourceWidth = widthAttr;
        sourceHeight = heightAttr;
      }
    }

    const scaleX = props.plan.largeur_reference / sourceWidth;
    const scaleY = props.plan.hauteur_reference / sourceHeight;
    backgroundTransform.value = `scale(${scaleX} ${scaleY})`;
    backgroundMarkup.value = svgEl.innerHTML;
  } catch (err) {
    backgroundMarkup.value = ''; // déclenche le fallback visuel
  }
}

function onSpaceClick(space, event) {
  const deltaX = Math.abs(event.clientX - startX);
  const deltaY = Math.abs(event.clientY - startY);

  // Si l'utilisateur a glissé la carte de plus de 5px, il s'agit d'un déplacement (pan) et non d'un clic
  if (deltaX > MOVEMENT_THRESHOLD || deltaY > MOVEMENT_THRESHOLD) {
    return;
  }

  if (isDimmed(space)) return; // espace filtré : pas d'ouverture de fiche
  emit('space-click', space, { clientX: event.clientX, clientY: event.clientY });
}

// Re-dimensionne la vue quand on change de hall (dimensions de plan différentes)
watch(
  () => props.plan.id,
  () => {
    setDimensions(props.plan.largeur_reference, props.plan.hauteur_reference);
    loadBackground();
  }
);

// Centrage + surbrillance automatique déclenchés par la recherche
watch(
  () => props.focusToken,
);

onMounted(() => {
  resetView();
  loadBackground();
});

defineExpose({ resetView, zoomIn, zoomOut });
</script>

<style scoped>
.plan-viewer {
  position: relative;
  width: 100%;
  max-height: 75vh;
  background: var(--plan-bg, #f8fafc);
  border-radius: 1rem;
  overflow: hidden;
  touch-action: none; /* on gère nous-mêmes le pan/pinch */
  border: 1px solid var(--plan-border, #e2e8f0);
}

.plan-svg {
  width: 100%;
  height: 100%;
  display: block;
  cursor: grab;
}

.plan-fallback-bg {
  fill: #eef2f7;
}

.space-group {
  cursor: pointer;
}

.space-shape {
  fill: var(--space-color);
  fill-opacity: 0.55;
  stroke: var(--space-color);
  stroke-width: 3;
  transition: fill-opacity 0.15s ease, stroke-width 0.15s ease;
}

.space-group:hover .space-shape {
  fill-opacity: 0.75;
}

.space-group.dimmed {
  opacity: 0.15;
  cursor: default;
  pointer-events: none; /* Désactive le clic sur les stands non trouvés */
}

.space-group.highlighted .space-shape {
  fill: rgb(224, 10, 3) !important;
  stroke: rgb(163, 7, 2) !important;
  fill-opacity: 0.9;
  stroke-width: 4px;
  animation: pulse 2s ease-in-out 8;
}

@keyframes pulse {
  0%, 100% { stroke-width: 2; }
  50% { stroke-width: 10; }
}

.space-label {
  font-size: 16px;
  font-weight: 600;
  fill: #0f172a;
  pointer-events: none;
  paint-order: stroke;
  stroke: #fff;
  stroke-width: 3px;
}

.zoom-controls {
  position: absolute;
  right: 0.75rem;
  bottom: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.zoom-controls button {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 0.6rem;
  border: 1px solid var(--plan-border, #e2e8f0);
  background: var(--plan-surface, #fff);
  font-size: 1.1rem;
  line-height: 1;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(15, 23, 42, 0.12);
}

@media (max-width: 480px) {
  .plan-viewer {
    max-height: 60vh;
    border-radius: 0.5rem;
  }
  .space-label {
    font-size: 20px; 
  }
}
</style>