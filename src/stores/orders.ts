import { defineStore } from 'pinia';
import { ref } from 'vue';
import { ordersApi } from '../api/orders';
import type { Order, OrderStatus, UpdateOrderStatusDto } from '../types/order';

export const useOrdersStore = defineStore('orders', () => {
  const orders = ref<Order[]>([]);
  const loading = ref(false);
  const stats = ref<any>(null);

  async function fetchOrders(status?: OrderStatus) {
    loading.value = true;
    try {
      orders.value = await ordersApi.getAll(status);
    } finally {
      loading.value = false;
    }
  }

  async function updateOrderStatus(id: string, data: UpdateOrderStatusDto) {
    const order = await ordersApi.updateStatus(id, data);
    const index = orders.value.findIndex((o) => o.id === id);
    if (index !== -1) {
      orders.value[index] = order;
    }
    return order;
  }

  async function fetchStats() {
    stats.value = await ordersApi.getStats();
  }

  return {
    orders,
    loading,
    stats,
    fetchOrders,
    updateOrderStatus,
    fetchStats,
  };
});

