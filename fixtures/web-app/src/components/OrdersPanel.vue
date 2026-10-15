<script setup>
// Grew over time: filtering, sorting, selection and the detail view all live
// here, and the template below repeats the row markup for the two layouts.
import { computed, onMounted, ref } from 'vue';
import { useOrdersStore } from '../stores/orders';
import OrderTotal from './OrderTotal.vue';

const store = useOrdersStore();
const query = ref('');
const sortNewestFirst = ref(true);
const selectedId = ref(null);
const compact = ref(false);

onMounted(() => store.fetchOrders());

const visible = computed(() => {
  const term = query.value.trim().toLowerCase();
  const filtered = store.orders.filter((order) =>
    order.reference.toLowerCase().includes(term),
  );
  return [...filtered].sort((a, b) =>
    sortNewestFirst.value ? b.placedAt.localeCompare(a.placedAt) : a.placedAt.localeCompare(b.placedAt),
  );
});

const selected = computed(() => store.orders.find((order) => order.id === selectedId.value) ?? null);
</script>

<template>
  <section>
    <div class="toolbar">
      <input v-model="query" placeholder="Search orders" />
      <button @click="sortNewestFirst = !sortNewestFirst">Sort</button>
      <button @click="compact = !compact">Layout</button>
    </div>

    <p v-if="store.loading">Loading…</p>

    <ul v-if="!compact">
      <li v-for="order in visible" :key="order.id" @click="selectedId = order.id">
        <strong>{{ order.reference }}</strong>
        <span>{{ order.placedAt }}</span>
        <OrderTotal :total-cents="order.totalCents" />
      </li>
    </ul>
    <table v-else>
      <tr v-for="order in visible" :key="order.id" @click="selectedId = order.id">
        <td>{{ order.reference }}</td>
        <td>{{ order.placedAt }}</td>
        <td><OrderTotal :total-cents="order.totalCents" /></td>
      </tr>
    </table>

    <aside v-if="selected">
      <h2>{{ selected.reference }}</h2>
      <p>Placed {{ selected.placedAt }}</p>
      <OrderTotal :total-cents="selected.totalCents" />
      <button @click="selectedId = null">Close</button>
    </aside>
  </section>
</template>

<style scoped>
.toolbar {
  display: flex;
  gap: var(--space-2);
  margin-bottom: var(--space-4);
}
li,
tr {
  cursor: pointer;
}
</style>
