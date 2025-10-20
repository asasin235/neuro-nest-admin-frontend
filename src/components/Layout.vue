<template>
  <el-container class="layout-container">
    <el-aside width="250px" class="sidebar">
      <div class="logo">
        <h2>NeuroNest Admin</h2>
      </div>

      <el-menu
        :default-active="activeRoute"
        router
        class="sidebar-menu"
      >
        <el-menu-item index="/">
          <el-icon><House /></el-icon>
          <span>Dashboard</span>
        </el-menu-item>

        <el-menu-item index="/users">
          <el-icon><User /></el-icon>
          <span>Users</span>
        </el-menu-item>

        <el-menu-item index="/packages">
          <el-icon><Box /></el-icon>
          <span>Packages</span>
        </el-menu-item>

        <el-menu-item index="/orders">
          <el-icon><ShoppingCart /></el-icon>
          <span>Orders</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header class="header">
        <div class="header-content">
          <h3>{{ pageTitle }}</h3>
          <div class="user-info">
            <span>{{ authStore.user?.firstName }} {{ authStore.user?.lastName }}</span>
            <el-button @click="handleLogout" type="danger" size="small">
              Logout
            </el-button>
          </div>
        </div>
      </el-header>

      <el-main class="main-content">
        <slot />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { House, User, Box, ShoppingCart } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { useAuthStore } from '../stores/auth';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const activeRoute = computed(() => route.path);

const pageTitle = computed(() => {
  const titles: Record<string, string> = {
    '/': 'Dashboard',
    '/users': 'User Management',
    '/packages': 'Package Management',
    '/orders': 'Order Management',
  };
  return titles[route.path] || 'Admin Panel';
});

function handleLogout() {
  authStore.logout();
  ElMessage.success('Logged out successfully');
  router.push('/login');
}
</script>

<style scoped>
.layout-container {
  min-height: 100vh;
}

.sidebar {
  background: #304156;
  color: white;
}

.logo {
  padding: 20px;
  text-align: center;
  background: #1f2d3d;
}

.logo h2 {
  margin: 0;
  color: white;
  font-size: 18px;
}

.sidebar-menu {
  border: none;
  background: transparent;
}

.header {
  background: white;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.header h3 {
  margin: 0;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.main-content {
  background: #f5f5f5;
  padding: 20px;
}
</style>

