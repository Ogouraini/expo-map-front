<!-- src/components/SpaceLabelTooltip.vue -->
<template>
  <div class="tooltip" :style="positionStyle" @click.stop>
    {{ label }}
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  label: { type: String, required: true },
  x: { type: Number, required: true },
  y: { type: Number, required: true },
});
const emit = defineEmits(['close']);

const positionStyle = computed(() => ({
  left: `${props.x}px`,
  top: `${props.y}px`,
}));

// se ferme automatiquement, ou au premier clic ailleurs
let timer = null;
function handleOutsideClick() {
  emit('close');
}

onMounted(() => {
  timer = setTimeout(() => emit('close'), 2500);
  window.addEventListener('click', handleOutsideClick);
});
onUnmounted(() => {
  clearTimeout(timer);
  window.removeEventListener('click', handleOutsideClick);
});
</script>

<style scoped>
.tooltip {
  position: fixed;
  transform: translate(-50%, -120%);
  background: #0f172a;
  color: #fff;
  padding: 0.4rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.82rem;
  white-space: nowrap;
  z-index: 90;
  pointer-events: none;
  box-shadow: 0 6px 16px rgba(15, 23, 42, 0.25);
}
</style>
