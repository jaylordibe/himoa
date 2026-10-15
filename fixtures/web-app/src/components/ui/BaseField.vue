<script setup>
const props = defineProps({
  id: { type: String, required: true },
  label: { type: String, required: true },
  type: { type: String, default: 'text' },
  error: { type: String, default: '' },
  modelValue: { type: String, default: '' },
});
const emit = defineEmits(['update:modelValue']);
const errorId = `${props.id}-error`;
</script>

<template>
  <div class="base-field">
    <label :for="id">{{ label }}</label>
    <input
      :id="id"
      :type="type"
      :value="modelValue"
      :aria-invalid="error ? 'true' : 'false'"
      :aria-describedby="error ? errorId : undefined"
      @input="emit('update:modelValue', $event.target.value)"
    />
    <p v-if="error" :id="errorId" class="base-field__error">{{ error }}</p>
  </div>
</template>

<style scoped>
.base-field {
  display: grid;
  gap: var(--space-1);
}
.base-field__error {
  color: var(--color-danger);
  font-size: var(--font-size-sm);
}
</style>
