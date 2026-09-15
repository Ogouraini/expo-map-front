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
      @pointerup="handlePointerUp"
      @pointercancel="handlePointerUp"
    >
      <!--
        Le fichier SVG du hall contient désormais TOUT : le décor ET les
        tracés de chaque espace (id="space-xxx")
      -->
      <g v-if="planMarkup" ref="planGroupRef" :transform="planTransform" v-html="planMarkup" />
      <rect
        v-else
        x="0"
        y="0"
        :width="plan.largeur_reference"
        :height="plan.hauteur_reference"
        class="plan-fallback-bg"
      />
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
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import { usePlanZoomPan } from '@/composables/usePlanZoomPan';
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
const planGroupRef = ref(null);
const planMarkup = ref('');
const planTransform = ref('');

// spaceId -> { shapeEl, labelEl } : rattaché une fois par bindSpaces(),
// réutilisé ensuite par applyVisualStates() pour éviter de requêter le DOM
// à chaque changement de filtre/recherche/surbrillance.
let boundElements = new Map();

// Distingue un tap (ouvrir la fiche) d'un pan (glisser le plan).
const MOVEMENT_THRESHOLD = 5;
let startX = 0;
let startY = 0;
let pendingSpace = null;

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

/**
 * Id du tracé SVG correspondant à un espace de la BD. Convention retenue :
 * l'id du <path>/<g> dans le fichier SVG est identique à l'id de l'espace
 * (ex: id="space-a5" ↔ espace { id: 'space-a5' }). Si un jour le nom du
 * tracé ne peut pas coller à une PK stable côté BD, ajouter une colonne
 * dédiée `svg_element_id` et l'utiliser ici en priorité.
 */
function svgIdFor(space) {
  return space.svg_element_id || space.id;
}

function spaceFromEvent(event) {
  const el = event.target;
  if (!el || typeof el.closest !== 'function') return null;
  const shapeEl = el.closest('[data-space-id]');
  if (!shapeEl) return null;
  const id = shapeEl.getAttribute('data-space-id');
  return props.spaces.find((s) => s.id === id) || null;
}

function handlePointerDown(event) {
  startX = event.clientX;
  startY = event.clientY;
  // Capturer la cible AVANT setPointerCapture : une fois le pointeur
  // capturé par le <svg>, pointerup/click sont retargetés vers le svg
  // et n'atteignent plus le tracé du stand.
  pendingSpace = spaceFromEvent(event);
  onPointerDown(event);
}

function handlePointerUp(event) {
  const space = pendingSpace;
  pendingSpace = null;
  const deltaX = Math.abs(event.clientX - startX);
  const deltaY = Math.abs(event.clientY - startY);
  onPointerUp(event);

  if (deltaX > MOVEMENT_THRESHOLD || deltaY > MOVEMENT_THRESHOLD) return;
  if (!space || isDimmed(space)) return;
  emit('space-click', space, { clientX: event.clientX, clientY: event.clientY });
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

function tooltipFor(space) {
  if (space.type === 'stand') {
    return space.exposant ? space.exposant.nom : `Stand ${space.numero_stand} (libre)`;
  }
  return space.libelle;
}

/** Centre approximatif d'un tracé, calculé par le navigateur via getBBox().
 * Contrairement à l'ancien polygonCentroid(), ça fonctionne pour n'importe
 * quelle forme (polygone, courbe de Bézier, pilule...) puisqu'on n'a plus
 * accès aux points bruts — juste à l'élément SVG déjà dessiné. */
function centroidFor(shapeEl) {
  const bbox = shapeEl.getBBox();
  return { x: bbox.x + bbox.width / 2, y: bbox.y + bbox.height / 2 };
}

/**
 * Relie chaque espace de la BD au tracé correspondant dans le SVG inliné
 * (matching par id), puis lui applique classe/couleur/tooltip/libellé.
 * Les tracés du SVG qui ne correspondent à aucun espace connu restent de
 * simples éléments de décor, inertes (pas de clic, pas de survol).
 */
function bindSpaces() {
  boundElements.forEach(({ labelEl }) => labelEl?.remove());
  boundElements.clear();

  if (!planGroupRef.value) {
    console.error('[DEBUG] planGroupRef est null, impossible de cibler le SVG !');
    return;
  }

  console.log('[DEBUG] 6. Début de bindSpaces. Nombre d\'espaces reçus :', props.spaces.length);

  props.spaces.forEach((space) => {
    const id = svgIdFor(space);
    const shapeEl = planGroupRef.value.querySelector(`#${CSS.escape(id)}`);
    
    if (!shapeEl) {
      console.warn(`[DEBUG] ❌ Aucun élément SVG trouvé pour l'ID : "${id}" (Espace:`, space, ')');
      return;
    }

    console.log(`[DEBUG] ✅ Élément SVG trouvé pour l'ID "${id}"`);

    shapeEl.removeAttribute('class');
    shapeEl.removeAttribute('style');
    shapeEl.removeAttribute('fill');
    shapeEl.removeAttribute('stroke');

    shapeEl.classList.add('space-shape', `type-${space.type}`);
    shapeEl.dataset.spaceId = space.id;
    
    const visual = visualFor(space);
    shapeEl.style.setProperty('--space-color', visual.color);

    shapeEl.querySelector(':scope > title')?.remove();
    const titleEl = document.createElementNS('http://www.w3.org/2000/svg', 'title');
    titleEl.textContent = tooltipFor(space);
    shapeEl.prepend(titleEl);

    try {
      const { x, y } = centroidFor(shapeEl);
      const labelEl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      labelEl.setAttribute('x', x);
      labelEl.setAttribute('y', y);
      labelEl.setAttribute('text-anchor', 'middle');
      labelEl.setAttribute('dominant-baseline', 'middle');
      labelEl.setAttribute('class', 'space-label');
      labelEl.textContent = space.type === 'stand' ? (space.numero_stand || space.id) : space.libelle;
      shapeEl.insertAdjacentElement('afterend', labelEl);

      boundElements.set(space.id, { shapeEl, labelEl });
    } catch (e) {
      console.error(`[DEBUG] Erreur calcul centre espace ${space.id}:`, e);
    }
  });

  applyVisualStates();
}

/** Ne touche qu'aux classes dimmed/highlighted/search-matched des tracés
 * déjà rattachés — pas de re-requête DOM à chaque changement de filtre. */
function applyVisualStates() {
  boundElements.forEach(({ shapeEl }, spaceId) => {
    const space = props.spaces.find((s) => s.id === spaceId);
    if (!space) return;
    shapeEl.classList.toggle('dimmed', isDimmed(space));
    shapeEl.classList.toggle('highlighted', space.id === props.highlightedSpaceId);
    shapeEl.classList.toggle('search-matched', isSearchResult(space));
  });
}

/**
 * Charge le SVG complet du hall (fond + espaces) et l'inline dans le DOM.
 * On récupère le viewBox/les dimensions d'origine du fichier pour recaler
 * son échelle sur le système de coordonnées de référence du plan
 * (plan.largeur_reference / hauteur_reference) — en théorie le backend
 * garantit déjà la cohérence des deux, mais ce recalage évite tout
 * décalage silencieux si jamais ce n'est pas exactement le cas.
 * Une fois le markup posé dans le DOM (nextTick), bindSpaces() rattache
 * les données à chaque tracé.
 */
async function loadPlanSvg() {
  planMarkup.value = '';
  boundElements.clear();
  
  console.log('[DEBUG] 1. Chargement du plan :', props.plan);
  if (!props.plan.background_svg_url) {
    console.error('[DEBUG] URL du SVG manquante dans props.plan !');
    return;
  }

  try {
    console.log('[DEBUG] 2. Requête vers :', props.plan.background_svg_url);
    const response = await fetch(props.plan.background_svg_url);
    console.log('[DEBUG] 3. Statut HTTP :', response.status, response.statusText);

    if (!response.ok) throw new Error(`SVG introuvable (Statut: ${response.status})`);

    const rawSvg = await response.text();
    console.log('[DEBUG] 4. CONTENU BRUT DU SVG RECEVA :');
    console.log(rawSvg); 

    const parsed = new DOMParser().parseFromString(rawSvg, 'image/svg+xml');
    
    // Vérification des erreurs de parsing XML
    const parserError = parsed.querySelector('parsererror');
    if (parserError) {
      throw new Error(`Erreur de syntaxe XML/SVG : ${parserError.textContent}`);
    }

    const svgEl = parsed.documentElement;
    if (svgEl.nodeName.toLowerCase() !== 'svg') {
      throw new Error(`Élément racine invalide : "<${svgEl.nodeName}>" au lieu de "<svg>"`);
    }

    svgEl.querySelectorAll('script').forEach((node) => node.remove());

    let sourceWidth = props.plan.largeur_reference;
    let sourceHeight = props.plan.hauteur_reference;
    const viewBoxAttr = svgEl.getAttribute('viewBox');
    if (viewBoxAttr) {
      const parts = viewBoxAttr.trim().split(/\s+/).map(Number);
      if (parts.length === 4 && parts[2] > 0 && parts[3] > 0) {
        [, , sourceWidth, sourceHeight] = parts;
      }
    }

    const scaleX = props.plan.largeur_reference / sourceWidth;
    const scaleY = props.plan.hauteur_reference / sourceHeight;
    planTransform.value = `scale(${scaleX} ${scaleY})`;
    planMarkup.value = svgEl.innerHTML;

    await nextTick();
    console.log('[DEBUG] 5. SVG injecté dans le DOM, appel de bindSpaces()');
    bindSpaces();
  } catch (err) {
    console.error('[DEBUG] ERREUR lors du chargement du SVG :', err);
    planMarkup.value = '';
  }
}


// Re-dimensionne et recharge tout le plan (dimensions/svg différents)
watch(
  () => props.plan.id,
  () => {
    setDimensions(props.plan.largeur_reference, props.plan.hauteur_reference);
    loadPlanSvg();
  }
);

// Les espaces changent (ex: rafraîchissement de la liste des exposants)
// sans changer de hall : on ne recharge pas le SVG, juste le rattachement.
watch(
  () => props.spaces,
  () => nextTick(() => bindSpaces())
);

// Filtre catégorie / résultats recherche / surbrillance : léger, pas de
// requête DOM, juste un toggle de classes sur les éléments déjà rattachés.
watch(
  () => [props.selectedCategories, props.searchResultIds, props.highlightedSpaceId],
  () => applyVisualStates(),
  { deep: true }
);

onMounted(() => {
  resetView();
  loadPlanSvg();
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

/* Ces classes sont posées dynamiquement en JS (bindSpaces/applyVisualStates)
   directement sur les tracés existants du SVG, plus sur un <g> généré. */
.plan-svg :deep(.space-shape) {
  cursor: pointer;
  fill: var(--space-color) !important;
  fill-opacity: 0.65;
  stroke: var(--space-color) !important;
  stroke-width: 2px;
  transition: fill-opacity 0.15s ease, stroke-width 0.15s ease;
}

.plan-svg :deep(.space-shape:hover) {
  fill-opacity: 0.85;
}

.plan-svg :deep(.space-shape.dimmed) {
  opacity: 0.15;
  cursor: default;
  pointer-events: none;
}

.plan-svg :deep(.space-shape.highlighted) {
  fill: #e00a03 !important;
  stroke: #a30702 !important;
  fill-opacity: 0.9;
  stroke-width: 4px;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { stroke-width: 2; }
  50% { stroke-width: 10; }
}

.plan-svg :deep(.space-label) {
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
  .plan-svg :deep(.space-label) {
    font-size: 20px;
  }
}
</style>
