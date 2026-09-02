<!-- src/components/CategoryFilter.vue -->
<template>
  <div v-if="categories.length > 0" class="category-filter">
    <button
      v-for="category in categories"
      :key="category"
      class="category-chip"
      :class="{ active: selected.includes(category) }"
      @click="$emit('toggle', category)"
    >
      {{ category }}
    </button>
    <button v-if="selected.length > 0" class="category-chip clear" @click="$emit('clear')">
      Réinitialiser
    </button>
  </div>
</template>

<script setup>
defineProps({
  categories: { type: Array, default: () => [] },
  selected: { type: Array, default: () => [] },
});
defineEmits(['toggle', 'clear']);
</script>

<style scoped>
.category-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.category-chip {
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
  border: 1px solid var(--plan-border, #e2e8f0);
  background: var(--plan-surface, #fff);
  color: var(--plan-text, #1e293b);
  font-size: 0.82rem;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;
}

.category-chip.active {
  background: var(--plan-accent-soft, #dbeafe);
  border-color: var(--plan-accent, #2563eb);
  color: var(--plan-accent, #2563eb);
  font-weight: 600;
}

.category-chip.clear {
  color: var(--plan-text-muted, #64748b);
  border-style: dashed;
}
</style>
