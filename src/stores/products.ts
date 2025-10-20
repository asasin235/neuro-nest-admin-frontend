import { defineStore } from 'pinia';
import { ref } from 'vue';
import { productsAPI } from '../api/products';
import type { Component, ProductStats } from '../types/product';

export const useProductsStore = defineStore('products', () => {
  const products = ref<Component[]>([]);
  const lowStockProducts = ref<Component[]>([]);
  const stats = ref<ProductStats>({
    total: 0,
    outOfStock: 0,
    lowStock: 0,
    totalInventoryValue: 0,
  });
  const loading = ref(false);

  async function fetchProducts() {
    loading.value = true;
    try {
      const response = await productsAPI.getAll();
      products.value = response.data;
    } finally {
      loading.value = false;
    }
  }

  async function fetchLowStock() {
    try {
      const response = await productsAPI.getLowStock();
      lowStockProducts.value = response.data;
    } catch (error) {
      console.error('Failed to fetch low stock products:', error);
    }
  }

  async function fetchStats() {
    try {
      const response = await productsAPI.getStats();
      stats.value = response.data;
    } catch (error) {
      console.error('Failed to fetch product stats:', error);
    }
  }

  async function createProduct(formData: FormData) {
    const response = await productsAPI.create(formData);
    await fetchProducts();
    await fetchStats();
    return response.data;
  }

  async function updateProduct(id: string, formData: FormData) {
    const response = await productsAPI.update(id, formData);
    await fetchProducts();
    await fetchStats();
    return response.data;
  }

  async function updateStock(id: string, quantity: number) {
    const response = await productsAPI.updateStock(id, quantity);
    await fetchProducts();
    await fetchStats();
    return response.data;
  }

  async function deleteProduct(id: string) {
    await productsAPI.delete(id);
    await fetchProducts();
    await fetchStats();
  }

  return {
    products,
    lowStockProducts,
    stats,
    loading,
    fetchProducts,
    fetchLowStock,
    fetchStats,
    createProduct,
    updateProduct,
    updateStock,
    deleteProduct,
  };
});

