// src/stores/exhibition.js
import { defineStore } from 'pinia';
import { exhibitionApi } from '@/services/exhibitionApi';
import { CURRENT_EVENT_ID } from '@/config/eventConfig';
import { getSpaceInteractionKind } from '@/config/spaceTypes';

export const useExhibitionStore = defineStore('exhibition', {
  state: () => ({
    eventId: CURRENT_EVENT_ID,

    plans: [],
    currentPlanId: null,
    spacesByPlan: {}, 

    loadingPlans: false,
    loadingSpaces: false,
    error: null,

    // recherche
    searchQuery: '',
    searchResults: [],
    searching: false,

    // filtres
    selectedCategories: [],

    // sélection courante 
    selectedSpace: null,
    selectedSpaceKind: null, // 'exhibitor' | 'conference' | 'label'
    selectedSpaceScreenPos: null, // { x, y } utile pour positionner un petit tooltip

    // surbrillance déclenché par la recherche
    highlightedSpaceId: null,
    focusToken: 0, // incrémenté à chaque demande de centrage, même sur le même id
  }),

  getters: {
    currentPlan(state) {
      return state.plans.find((p) => p.id === state.currentPlanId) || null;
    },
    currentSpaces(state) {
      return state.spacesByPlan[state.currentPlanId] || [];
    },
    // catégories disponibles pour le hall actuellement affiché
    availableCategories(state) {
      const spaces = state.spacesByPlan[state.currentPlanId] || [];
      const categories = spaces
        .filter((s) => s.type === 'stand' && s.categorie)
        .map((s) => s.categorie);
      return [...new Set(categories)].sort();
    },
  },

  actions: {
    async init() {
      this.loadingPlans = true;
      this.error = null;
      try {
        this.plans = await exhibitionApi.getPlans(this.eventId);
        if (this.plans.length > 0) {
          await this.setCurrentPlan(this.plans[0].id);
        }
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loadingPlans = false;
      }
    },

    async setCurrentPlan(planId) {
      this.currentPlanId = planId;
      this.closeSelection();
      if (this.spacesByPlan[planId]) return; 

      this.loadingSpaces = true;
      this.error = null;
      try {
        this.spacesByPlan[planId] = await exhibitionApi.getSpaces(planId);
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loadingSpaces = false;
      }
    },

    async performSearch(query) {
      this.searchQuery = query;
      if (!query || query.trim().length === 0) {
        this.searchResults = [];
        return;
      }
      this.searching = true;
      try {
        this.searchResults = await exhibitionApi.search(this.eventId, query);
      } catch (err) {
        this.error = err.message;
        this.searchResults = [];
      } finally {
        this.searching = false;
      }
    },

    clearSearch() {
      this.searchQuery = '';
      this.searchResults = [];
    },

    /**
     * Sélection d'un résultat de recherche : bascule sur le bon hall si
     * besoin, puis demande le centrage + surbrillance du stand trouvé.
     */
    async selectSearchResult(result) {
      if (result.plan_id !== this.currentPlanId) {
        await this.setCurrentPlan(result.plan_id);
      }
      this.highlightedSpaceId = result.id;
      this.focusToken += 1;
      this.searchResults = [];
      this.searchQuery = '';
    },

    toggleCategory(category) {
      const index = this.selectedCategories.indexOf(category);
      if (index === -1) {
        this.selectedCategories.push(category);
      } else {
        this.selectedCategories.splice(index, 1);
      }
    },

    clearCategoryFilters() {
      this.selectedCategories = [];
    },

    /**
     * Clic/tap sur un espace du plan. Le type d'interaction (fiche exposant
     * complète, panneau conférence, ou simple libellé) est piloté par le
     * champ `type` de l'espace — voir getSpaceInteractionKind.
     */
    selectSpace(space, screenPos = null) {
      this.selectedSpace = space;
      this.selectedSpaceKind = getSpaceInteractionKind(space.type);
      this.selectedSpaceScreenPos = screenPos;
    },

    closeSelection() {
      this.selectedSpace = null;
      this.selectedSpaceKind = null;
      this.selectedSpaceScreenPos = null;
    },
  },
});
