<!-- src/components/SearchBar.vue -->
<template>
  <div class="search-bar">
    <div class="search-input-wrap">
      <span class="search-icon" aria-hidden="true">🔍</span>
      <input
        v-model="localQuery"
        type="search"
        class="search-input"
        placeholder="Rechercher un exposant, un stand, une catégorie..."
        aria-label="Rechercher dans le plan"
        @input="onInput"
      />
      <button v-if="localQuery" class="search-clear" aria-label="Effacer la recherche" @click="clear">
        ✕
      </button>
    </div>

    <ul v-if="results.length > 0" class="search-results">
      <li
        v-for="result in results"
        :key="result.id"
        class="search-result"
        @click="$emit('select', result)"
      >
        <span class="result-icon">{{ result.type === 'stand' ? '🏬' : '📍' }}</span>
        <span class="result-main">
          <span class="result-title">{{ result.exposant ? result.exposant.nom : result.libelle }}</span>
          <span class="result-meta">
            <template v-if="result.numero_stand">Stand {{ result.numero_stand }} · </template>
            <template v-if="result.categorie">{{ result.categorie }} · </template>
            {{ planName(result.plan_id) }}
          </span>
        </span>
      </li>
    </ul>

    <p v-else-if="localQuery && !searching" class="search-empty">Aucun résultat pour « {{ localQuery }} »</p>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  results: { type: Array, default: () => [] },
  searching: { type: Boolean, default: false },
  plans: { type: Array, default: () => [] },
  query: { type: String, default: '' },
});
const emit = defineEmits(['search', 'select', 'clear']);

const localQuery = ref(props.query);
let debounceTimer = null;

function onInput() {
  clearTimeout(debounceTimer);

  // Si le champ texte est vidé à la main, on émet immédiatement 'clear'
  if (!localQuery.value.trim()) {
    emit('clear');
    return;
  }

  debounceTimer = setTimeout(() => {
    emit('search', localQuery.value);
  }, 300);
}

function clear() {
  localQuery.value = '';
  clearTimeout(debounceTimer);
  emit('clear');
}

function planName(planId) {
  const plan = props.plans.find((p) => p.id === planId);
  return plan ? plan.nom : '';
}

watch(
  () => props.query,
  (newVal) => {
    localQuery.value = newVal;
  }
);
</script>

<style scoped>
.search-bar {
  position: relative;
  width: 100%;
}

.search-input-wrap {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--plan-surface, #fff);
  border: 1px solid var(--plan-border, #e2e8f0);
  border-radius: 0.75rem;
  padding: 0.5rem 0.75rem;
}

.search-icon {
  font-size: 0.95rem;
  opacity: 0.6;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 0.95rem;
  background: transparent;
  color: var(--plan-text, #1e293b);
}

.search-input::-webkit-search-cancel-button {
  display: none;
}

.search-clear {
  border: none;
  background: none;
  cursor: pointer;
  font-size: 0.9rem;
  opacity: 0.6;
  padding: 0.15rem 0.35rem;
}

.search-results {
  position: absolute;
  top: calc(100% + 0.4rem);
  left: 0;
  right: 0;
  max-height: 320px;
  overflow-y: auto;
  background: var(--plan-surface, #fff);
  border: 1px solid var(--plan-border, #e2e8f0);
  border-radius: 0.75rem;
  box-shadow: 0 12px 24px rgba(15, 23, 42, 0.12);
  z-index: 30;
  list-style: none;
  margin: 0;
  padding: 0.25rem;
}

.search-result {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.6rem 0.6rem;
  border-radius: 0.5rem;
  cursor: pointer;
}

.search-result:hover,
.search-result:active {
  background: var(--plan-surface-hover, #f1f5f9);
}

.result-icon {
  font-size: 1.1rem;
}

.result-main {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.result-title {
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--plan-text, #1e293b);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.result-meta {
  font-size: 0.78rem;
  color: var(--plan-text-muted, #64748b);
}

.search-empty {
  position: absolute;
  top: calc(100% + 0.4rem);
  left: 0;
  right: 0;
  margin: 0;
  padding: 0.75rem 1rem;
  font-size: 0.85rem;
  color: var(--plan-text-muted, #64748b);
  background: var(--plan-surface, #fff);
  border: 1px solid var(--plan-border, #e2e8f0);
  border-radius: 0.75rem;
}
</style>
