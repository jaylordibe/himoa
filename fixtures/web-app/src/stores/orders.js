import { defineStore } from 'pinia';
import { getJson } from '../api/client';

export const useOrdersStore = defineStore('orders', {
  state: () => ({ orders: [], loading: false, error: null }),
  actions: {
    async fetchOrders() {
      this.loading = true;
      this.error = null;
      try {
        this.orders = await getJson('/api/orders');
      } catch (error) {
        this.error = error;
      } finally {
        this.loading = false;
      }
    },
  },
});
