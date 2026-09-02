<!-- src/components/ExhibitorCard.vue -->
<template>
  <div class="overlay" @click.self="$emit('close')">
    <div class="card" role="dialog" aria-modal="true">
      <button class="close-btn" aria-label="Fermer" @click="$emit('close')">✕</button>

      <template v-if="space.exposant">
        <img
          v-if="space.exposant.logo_url"
          :src="space.exposant.logo_url"
          :alt="`Logo ${space.exposant.nom}`"
          class="logo"
        />
        <h2 class="name">{{ space.exposant.nom }}</h2>
        <span v-if="space.exposant.categorie" class="badge">{{ space.exposant.categorie }}</span>
        <p class="description">{{ space.exposant.description }}</p>
        <p class="stand-number">Stand {{ space.numero_stand }}</p>
        <a
          v-if="space.exposant.lien_fiche_complete"
          :href="space.exposant.lien_fiche_complete"
          target="_blank"
          rel="noopener"
          class="cta"
        >
          Voir la fiche complète →
        </a>
      </template>

      <template v-else>
        <h2 class="name">Stand {{ space.numero_stand }}</h2>
        <span class="badge badge-muted">{{ statusLabel }}</span>
        <p class="description">Cet emplacement n'a pas encore d'exposant confirmé.</p>
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  space: { type: Object, required: true },
});
defineEmits(['close']);

const statusLabel = computed(() => {
  const labels = { libre: 'Disponible', 'réservé': 'Réservé', 'occupé': 'Occupé' };
  return labels[props.space.statut] || props.space.statut;
});
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 100;
}

.card {
  position: relative;
  width: 100%;
  max-width: 420px;
  background: var(--plan-surface, #fff);
  border-radius: 1.25rem 1.25rem 0 0;
  padding: 1.5rem;
  box-shadow: 0 -8px 30px rgba(15, 23, 42, 0.2);
  max-height: 80vh;
  overflow-y: auto;
}

.close-btn {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  border: none;
  background: var(--plan-surface-hover, #f1f5f9);
  border-radius: 999px;
  width: 2rem;
  height: 2rem;
  cursor: pointer;
  font-size: 0.9rem;
}

.logo {
  width: 72px;
  height: 72px;
  object-fit: contain;
  border-radius: 0.75rem;
  border: 1px solid var(--plan-border, #e2e8f0);
  margin-bottom: 0.75rem;
}

.name {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--plan-text, #1e293b);
  margin: 0 0 0.35rem;
}

.badge {
  display: inline-block;
  padding: 0.2rem 0.65rem;
  border-radius: 999px;
  background: var(--plan-accent-soft, #dbeafe);
  color: var(--plan-accent, #2563eb);
  font-size: 0.78rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.badge-muted {
  background: #f1f5f9;
  color: #64748b;
}

.description {
  font-size: 0.9rem;
  color: var(--plan-text, #334155);
  line-height: 1.5;
  margin-bottom: 0.75rem;
}

.stand-number {
  font-size: 0.82rem;
  color: var(--plan-text-muted, #64748b);
  margin-bottom: 1rem;
}

.cta {
  display: inline-block;
  padding: 0.6rem 1rem;
  background: var(--plan-accent, #2563eb);
  color: #fff;
  border-radius: 0.6rem;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 600;
}

@media (min-width: 640px) {
  .overlay {
    align-items: center;
  }
  .card {
    border-radius: 1.25rem;
  }
}
</style>
