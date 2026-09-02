<!-- src/components/HallSelector.vue -->
<template>
  <div class="hall-selector" role="tablist" aria-label="Sélection du hall">
    <button
      v-for="plan in plans"
      :key="plan.id"
      role="tab"
      :aria-selected="plan.id === currentPlanId"
      class="hall-tab"
      :class="{ active: plan.id === currentPlanId }"
      @click="$emit('select', plan.id)"
    >
      {{ plan.nom }}
    </button>
  </div>
</template>

<script setup>
defineProps({
  plans: { type: Array, required: true },
  currentPlanId: { type: String, default: null },
});
defineEmits(['select']);
</script>

<style scoped>
.hall-selector {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding: 0.25rem;
  -webkit-overflow-scrolling: touch;
}

.hall-tab {
  flex: none;
  padding: 0.5rem 1rem;
  border-radius: 999px;
  border: 1px solid var(--plan-border, #e2e8f0);
  background: var(--plan-surface, #fff);
  color: var(--plan-text, #1e293b);
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;
}

.hall-tab:hover {
  border-color: var(--plan-accent, #2563eb);
}

.hall-tab.active {
  background: var(--plan-accent, #2563eb);
  border-color: var(--plan-accent, #2563eb);
  color: #fff;
}

@media (max-width: 480px) {
  .hall-tab {
    padding: 0.45rem 0.85rem;
    font-size: 0.85rem;
  }
}
</style>
