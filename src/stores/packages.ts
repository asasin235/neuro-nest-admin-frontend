import { defineStore } from 'pinia';
import { ref } from 'vue';
import { packagesApi } from '../api/packages';
import type { Package, CreatePackageDto, UpdatePackageDto } from '../types/package';

export const usePackagesStore = defineStore('packages', () => {
  const packages = ref<Package[]>([]);
  const loading = ref(false);
  const stats = ref<any>(null);

  async function fetchPackages() {
    loading.value = true;
    try {
      packages.value = await packagesApi.getAll();
    } finally {
      loading.value = false;
    }
  }

  async function createPackage(data: CreatePackageDto, image?: File) {
    const pkg = await packagesApi.create(data, image);
    packages.value.unshift(pkg);
    return pkg;
  }

  async function updatePackage(id: string, data: UpdatePackageDto, image?: File) {
    const pkg = await packagesApi.update(id, data, image);
    const index = packages.value.findIndex((p) => p.id === id);
    if (index !== -1) {
      packages.value[index] = pkg;
    }
    return pkg;
  }

  async function deletePackage(id: string) {
    await packagesApi.delete(id);
    packages.value = packages.value.filter((p) => p.id !== id);
  }

  async function fetchStats() {
    stats.value = await packagesApi.getStats();
  }

  return {
    packages,
    loading,
    stats,
    fetchPackages,
    createPackage,
    updatePackage,
    deletePackage,
    fetchStats,
  };
});

