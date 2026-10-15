<script setup>
const props = defineProps({ totalCents: { type: Number, required: true } });
const formatted = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'EUR' })
  .format(props.totalCents / 100);
</script>

<template>
  <span class="order-total">{{ formatted }}</span>
</template>

<style scoped>
.order-total {
  font-size: var(--font-size-md);
  color: var(--color-text-muted);
}
</style>
