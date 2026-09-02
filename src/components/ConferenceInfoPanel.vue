<!-- src/components/ConferenceInfoPanel.vue -->
<template>
  <div class="overlay" @click.self="$emit('close')">
    <div class="panel" role="dialog" aria-modal="true">
      <button class="close-btn" aria-label="Fermer" @click="$emit('close')">✕</button>

      <span class="badge">🎤 Salle de conférence</span>
      <h2 class="name">{{ space.libelle }}</h2>

      <template v-if="space.session_conference">
        <h3 class="session-title">{{ space.session_conference.titre }}</h3>
        <p class="schedule">{{ formattedSchedule }}</p>
        <p v-if="intervenantsLabel" class="speakers">Avec {{ intervenantsLabel }}</p>
        <a
          v-if="space.session_conference.lien_fiche_session"
          :href="space.session_conference.lien_fiche_session"
          target="_blank"
          rel="noopener"
          class="cta"
        >
          Voir la fiche session →
        </a>
      </template>
      <p v-else class="no-session">Aucune session programmée pour l'instant sur cette salle.</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  space: { type: Object, required: true },
});
defineEmits(['close']);

const intervenantsLabel = computed(() => {
  const list = props.space.session_conference?.intervenants;
  return list && list.length ? list.join(', ') : '';
});

const formattedSchedule = computed(() => {
  const session = props.space.session_conference;
  if (!session) return '';
  const format = (iso) =>
    new Date(iso).toLocaleString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  return `${format(session.horaire_debut)} → ${format(session.horaire_fin)}`;
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

.panel {
  position: relative;
  width: 100%;
  max-width: 420px;
  background: var(--plan-surface, #fff);
  border-radius: 1.25rem 1.25rem 0 0;
  padding: 1.5rem;
  box-shadow: 0 -8px 30px rgba(15, 23, 42, 0.2);
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

.badge {
  display: inline-block;
  padding: 0.2rem 0.65rem;
  border-radius: 999px;
  background: #ede9fe;
  color: #7c3aed;
  font-size: 0.78rem;
  font-weight: 600;
  margin-bottom: 0.6rem;
}

.name {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--plan-text, #1e293b);
  margin: 0 0 0.6rem;
}

.session-title {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.3rem;
}

.schedule {
  font-size: 0.85rem;
  color: var(--plan-text-muted, #64748b);
  margin: 0 0 0.3rem;
}

.speakers {
  font-size: 0.85rem;
  margin: 0 0 1rem;
}

.no-session {
  font-size: 0.9rem;
  color: var(--plan-text-muted, #64748b);
}

.cta {
  display: inline-block;
  padding: 0.6rem 1rem;
  background: #7c3aed;
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
  .panel {
    border-radius: 1.25rem;
  }
}
</style>
