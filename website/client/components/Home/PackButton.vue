<template>
  <button
    class="pack-button"
    :disabled="!isValid || loading"
    aria-label="Pack repository"
    type="submit"
  >
    {{ loading ? 'Processing...' : 'Pack' }}
    <PackIcon v-if="!loading" :size="20" />
  </button>
</template>

<script setup>
import PackIcon from './PackIcon.vue';

defineProps({
  loading: Boolean,
  isValid: Boolean,
});
</script>

<style scoped>
.pack-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  height: 50px;
  width: 100%;
  font-size: 16px;
  font-weight: 500;
  background: var(--vp-c-brand-1);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

}

.pack-button:hover:not(:disabled) {
  background: var(--vp-c-brand-2);
}

.pack-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pack-button-icon {
  font-size: 20px;
  line-height: 1;
}

@media (max-width: 768px) {
  .pack-button {
    width: 100%;
  }
}
</style>
