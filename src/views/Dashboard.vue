<template>
  <Layout>
    <div class="dashboard">
      <h1>Dashboard</h1>

      <el-row :gutter="20" class="stats-row">
        <el-col :span="6">
          <el-card>
            <div class="stat-card">
              <el-icon :size="40" color="#409EFF"><User /></el-icon>
              <div class="stat-info">
                <h3>{{ userStats?.total || 0 }}</h3>
                <p>Total Users</p>
              </div>
            </div>
          </el-card>
        </el-col>

        <el-col :span="6">
          <el-card>
            <div class="stat-card">
              <el-icon :size="40" color="#67C23A"><Box /></el-icon>
              <div class="stat-info">
                <h3>{{ packageStats?.total || 0 }}</h3>
                <p>Total Packages</p>
              </div>
            </div>
          </el-card>
        </el-col>

        <el-col :span="6">
          <el-card>
            <div class="stat-card">
              <el-icon :size="40" color="#E6A23C"><ShoppingCart /></el-icon>
              <div class="stat-info">
                <h3>{{ orderStats?.total || 0 }}</h3>
                <p>Total Orders</p>
              </div>
            </div>
          </el-card>
        </el-col>

        <el-col :span="6">
          <el-card>
            <div class="stat-card">
              <el-icon :size="40" color="#F56C6C"><Money /></el-icon>
              <div class="stat-info">
                <h3>${{ orderStats?.totalRevenue?.toFixed(2) || 0 }}</h3>
                <p>Total Revenue</p>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <!-- Product Inventory Stats -->
      <el-row :gutter="20" class="stats-row">
        <el-col :span="6">
          <el-card>
            <div class="stat-card">
              <el-icon :size="40" color="#409EFF"><Grid /></el-icon>
              <div class="stat-info">
                <h3>{{ productStats?.total || 0 }}</h3>
                <p>Total Products</p>
              </div>
            </div>
          </el-card>
        </el-col>

        <el-col :span="6">
          <el-card>
            <div class="stat-card">
              <el-icon :size="40" color="#F56C6C"><WarningFilled /></el-icon>
              <div class="stat-info">
                <h3>{{ productStats?.outOfStock || 0 }}</h3>
                <p>Out of Stock</p>
              </div>
            </div>
          </el-card>
        </el-col>

        <el-col :span="6">
          <el-card>
            <div class="stat-card">
              <el-icon :size="40" color="#E6A23C"><Warning /></el-icon>
              <div class="stat-info">
                <h3>{{ productStats?.lowStock || 0 }}</h3>
                <p>Low Stock</p>
              </div>
            </div>
          </el-card>
        </el-col>

        <el-col :span="6">
          <el-card>
            <div class="stat-card">
              <el-icon :size="40" color="#67C23A"><Money /></el-icon>
              <div class="stat-info">
                <h3>₹{{ productStats?.totalInventoryValue?.toFixed(0) || 0 }}</h3>
                <p>Inventory Value</p>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <el-row :gutter="20" class="content-row">
        <el-col :span="12">
          <el-card header="Recent Orders">
            <el-table :data="orderStats?.recentOrders || []" style="width: 100%">
              <el-table-column prop="id" label="Order ID" width="100">
                <template #default="{ row }">
                  #{{ row.id.substring(0, 8) }}
                </template>
              </el-table-column>
              <el-table-column prop="user.firstName" label="Customer" />
              <el-table-column prop="totalAmount" label="Amount">
                <template #default="{ row }">
                  ${{ row.totalAmount.toFixed(2) }}
                </template>
              </el-table-column>
              <el-table-column prop="status" label="Status">
                <template #default="{ row }">
                  <el-tag :type="getStatusType(row.status)">
                    {{ row.status }}
                  </el-tag>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>

        <el-col :span="12">
          <el-card header="Order Status Distribution">
            <div v-if="orderStats?.statusCounts" class="status-distribution">
              <div
                v-for="(count, status) in orderStats.statusCounts"
                :key="status"
                class="status-item"
              >
                <span>{{ status }}:</span>
                <strong>{{ count }}</strong>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { User, Box, ShoppingCart, Money, Grid, Warning, WarningFilled } from '@element-plus/icons-vue';
import Layout from '../components/Layout.vue';
import { useUsersStore } from '../stores/users';
import { usePackagesStore } from '../stores/packages';
import { useOrdersStore } from '../stores/orders';
import { useProductsStore } from '../stores/products';

const usersStore = useUsersStore();
const packagesStore = usePackagesStore();
const ordersStore = useOrdersStore();
const productsStore = useProductsStore();

const userStats = ref<any>(null);
const packageStats = ref<any>(null);
const orderStats = ref<any>(null);
const productStats = ref<any>(null);

onMounted(async () => {
  try {
    userStats.value = await usersStore.fetchStats();
    packageStats.value = await packagesStore.fetchStats();
    orderStats.value = await ordersStore.fetchStats();
    await productsStore.fetchStats();
    productStats.value = productsStore.stats;
  } catch (error) {
    console.error('Error loading stats:', error);
  }
});

function getStatusType(status: string) {
  const types: Record<string, any> = {
    pending: 'warning',
    confirmed: 'info',
    processing: '',
    shipped: 'success',
    delivered: 'success',
    cancelled: 'danger',
  };
  return types[status] || '';
}
</script>

<style scoped>
.dashboard h1 {
  margin-bottom: 20px;
}

.stats-row {
  margin-bottom: 20px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 15px;
}

.stat-info h3 {
  margin: 0;
  font-size: 24px;
  font-weight: bold;
}

.stat-info p {
  margin: 5px 0 0;
  color: #999;
  font-size: 14px;
}

.content-row {
  margin-top: 20px;
}

.status-distribution {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.status-item {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background: #f5f5f5;
  border-radius: 4px;
}
</style>

