<!-- src/views/ExhibitionMapView.vue -->
<template>
  <div class="exhibition-map">
    <header class="toolbar">
      <HallSelector
        :plans="store.plans"
        :current-plan-id="store.currentPlanId"
        @select="store.setCurrentPlan"
      />
      <SearchBar
        :results="store.searchResults"
        :searching="store.searching"
        :plans="store.plans"
        :query="store.searchQuery"
        @search="store.performSearch"
        @select="store.selectSearchResult"
        @clear="store.clearSearch"
      />
      <CategoryFilter
        :categories="store.availableCategories"
        :selected="store.selectedCategories"
        @toggle="store.toggleCategory"
        @clear="store.clearCategoryFilters"
      />
    </header>

    <p v-if="store.error" class="error-banner">{{ store.error }}</p>

    <main class="plan-wrap">
      <p v-if="store.loadingPlans" class="status-message">Chargement des halls...</p>
      <p v-else-if="store.loadingSpaces" class="status-message">Chargement du plan...</p>
      <ExhibitionPlanViewer
        v-else-if="store.currentPlan"
        :plan="store.currentPlan"
        :spaces="store.currentSpaces"
        :selected-categories="store.selectedCategories"
        :highlighted-space-id="store.highlightedSpaceId"
        :search-result-ids="store.searchResults.map((s) => s.id)"
        :focus-token="store.focusToken"
        @space-click="onSpaceClick"
      />
    </main>

    <ExhibitorCard
      v-if="store.selectedSpaceKind === 'exhibitor'"
      :space="store.selectedSpace"
      @close="store.closeSelection"
    />
    <ConferenceInfoPanel
      v-else-if="store.selectedSpaceKind === 'conference'"
      :space="store.selectedSpace"
      @close="store.closeSelection"
    />
    <SpaceLabelTooltip
      v-else-if="store.selectedSpaceKind === 'label'"
      :label="store.selectedSpace.libelle"
      :x="store.selectedSpaceScreenPos?.clientX || 0"
      :y="store.selectedSpaceScreenPos?.clientY || 0"
      @close="store.closeSelection"
    />
  </div>
</template>

<script setup>
import { onMounted , watch} from 'vue';
import { useExhibitionStore } from '@/stores/exhibition';
import HallSelector from '@/components/HallSelector.vue';
import SearchBar from '@/components/SearchBar.vue';
import CategoryFilter from '@/components/CategoryFilter.vue';
import ExhibitionPlanViewer from '@/components/ExhibitionPlanViewer.vue';
import ExhibitorCard from '@/components/ExhibitorCard.vue';
import ConferenceInfoPanel from '@/components/ConferenceInfoPanel.vue';
import SpaceLabelTooltip from '@/components/SpaceLabelTooltip.vue';

const store = useExhibitionStore();



function onSpaceClick(space, screenPos) {
  store.selectSpace(space, screenPos);
}

watch(
  () => store.selectedSpaceKind,
  (newKind) => {
    console.log('Nouveau type sélectionné :', newKind);
    console.log('Espace sélectionné :', store.selectedSpace);
    console.log('Position :', store.selectedSpaceScreenPos);
  }
);

onMounted(() => {
  store.init();
});
</script>

<style scoped>
.exhibition-map {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  padding: 1rem;
  max-width: 1100px;
  margin: 0 auto;
}

.toolbar {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.error-banner {
  background: #fef2f2;
  color: #b91c1c;
  padding: 0.6rem 0.9rem;
  border-radius: 0.6rem;
  font-size: 0.85rem;
}

.status-message {
  text-align: center;
  color: var(--plan-text-muted, #64748b);
  padding: 3rem 0;
}

.plan-wrap {
  min-height: 300px;
}

@media (min-width: 768px) {
  .toolbar {
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
  }
  .toolbar > :first-child {
    flex: none;
  }
  .toolbar > :nth-child(2) {
    flex: 1 1 320px;
  }
  .toolbar > :nth-child(3) {
    flex: 1 1 100%;
  }
}
</style>
