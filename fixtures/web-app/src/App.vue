<script setup>
import OrdersPanel from './components/OrdersPanel.vue';
</script>

<template>
  <main class="app">
    <h1>Your orders</h1>
    <OrdersPanel />
  </main>
</template>

<style scoped>
.app {
  max-width: 64rem;
  margin: 0 auto;
  padding: var(--space-4);
  font-family: var(--font-body);
  color: var(--color-text);
}
</style>
