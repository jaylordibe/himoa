<script setup>
defineProps({
  type: { type: String, default: 'button' },
  disabled: { type: Boolean, default: false },
});
</script>

<template>
  <button :type="type" :disabled="disabled" class="base-button">
    <slot />
  </button>
</template>

<style scoped>
.base-button {
  padding: var(--space-2) var(--space-4);
  border: 1px solid var(--color-brand);
  border-radius: var(--radius-sm);
  background: var(--color-brand);
  color: var(--color-surface);
  font-weight: var(--font-weight-strong);
}
.base-button:disabled {
  opacity: 0.6;
}
.base-button:focus-visible {
  outline: 2px solid var(--color-text);
  outline-offset: 2px;
}
</style>
