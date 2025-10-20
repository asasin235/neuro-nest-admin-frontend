<template>
  <Layout>
    <div class="orders-page">
      <div class="page-header">
        <h1>Order Management</h1>
        <el-select v-model="filterStatus" placeholder="Filter by status" clearable @change="handleFilterChange">
          <el-option label="All" value="" />
          <el-option label="Pending" value="pending" />
          <el-option label="Confirmed" value="confirmed" />
          <el-option label="Processing" value="processing" />
          <el-option label="Shipped" value="shipped" />
          <el-option label="Delivered" value="delivered" />
          <el-option label="Cancelled" value="cancelled" />
        </el-select>
      </div>

      <el-card>
        <el-table
          :data="ordersStore.orders"
          :loading="ordersStore.loading"
          style="width: 100%"
        >
          <el-table-column prop="id" label="Order ID" width="120">
            <template #default="{ row }">
              #{{ row.id.substring(0, 8) }}
            </template>
          </el-table-column>
          <el-table-column label="Customer">
            <template #default="{ row }">
              {{ row.user.firstName }} {{ row.user.lastName }}
            </template>
          </el-table-column>
          <el-table-column prop="user.email" label="Email" />
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
          <el-table-column label="Date">
            <template #default="{ row }">
              {{ new Date(row.createdAt).toLocaleDateString() }}
            </template>
          </el-table-column>
          <el-table-column label="Actions" width="200">
            <template #default="{ row }">
              <el-button size="small" @click="handleView(row)">
                View
              </el-button>
              <el-button size="small" type="primary" @click="handleUpdateStatus(row)">
                Update Status
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <!-- View Order Dialog -->
      <el-dialog v-model="showViewDialog" title="Order Details" width="700px">
        <div v-if="currentOrder" class="order-details">
          <el-descriptions :column="2" border>
            <el-descriptions-item label="Order ID">
              #{{ currentOrder.id }}
            </el-descriptions-item>
            <el-descriptions-item label="Status">
              <el-tag :type="getStatusType(currentOrder.status)">
                {{ currentOrder.status }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="Customer">
              {{ currentOrder.user.firstName }} {{ currentOrder.user.lastName }}
            </el-descriptions-item>
            <el-descriptions-item label="Email">
              {{ currentOrder.user.email }}
            </el-descriptions-item>
            <el-descriptions-item label="Phone">
              {{ currentOrder.contactPhone }}
            </el-descriptions-item>
            <el-descriptions-item label="Total Amount">
              ${{ currentOrder.totalAmount.toFixed(2) }}
            </el-descriptions-item>
            <el-descriptions-item label="Shipping Address" :span="2">
              {{ currentOrder.shippingAddress }}
            </el-descriptions-item>
            <el-descriptions-item label="Created At" :span="2">
              {{ new Date(currentOrder.createdAt).toLocaleString() }}
            </el-descriptions-item>
          </el-descriptions>

          <h3 style="margin-top: 20px">Order Items</h3>
          <el-table :data="currentOrder.items" style="width: 100%">
            <el-table-column prop="itemName" label="Item" />
            <el-table-column prop="itemType" label="Type" />
            <el-table-column prop="quantity" label="Quantity" />
            <el-table-column label="Price">
              <template #default="{ row }">
                ${{ row.price.toFixed(2) }}
              </template>
            </el-table-column>
            <el-table-column label="Subtotal">
              <template #default="{ row }">
                ${{ (row.price * row.quantity).toFixed(2) }}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-dialog>

      <!-- Update Status Dialog -->
      <el-dialog v-model="showUpdateDialog" title="Update Order Status" width="400px">
        <el-form :model="statusForm" label-width="100px">
          <el-form-item label="New Status">
            <el-select v-model="statusForm.status" style="width: 100%">
              <el-option label="Pending" value="pending" />
              <el-option label="Confirmed" value="confirmed" />
              <el-option label="Processing" value="processing" />
              <el-option label="Shipped" value="shipped" />
              <el-option label="Delivered" value="delivered" />
              <el-option label="Cancelled" value="cancelled" />
            </el-select>
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="showUpdateDialog = false">Cancel</el-button>
          <el-button type="primary" @click="handleStatusSubmit" :loading="submitting">
            Update
          </el-button>
        </template>
      </el-dialog>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import { onMounted, ref, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import Layout from '../components/Layout.vue';
import { useOrdersStore } from '../stores/orders';
import type { Order, OrderStatus } from '../types/order';

const ordersStore = useOrdersStore();

const showViewDialog = ref(false);
const showUpdateDialog = ref(false);
const submitting = ref(false);
const currentOrder = ref<Order | null>(null);
const filterStatus = ref<OrderStatus | ''>('');

const statusForm = reactive({
  status: '' as OrderStatus,
});

onMounted(() => {
  ordersStore.fetchOrders();
});

function handleFilterChange() {
  ordersStore.fetchOrders(filterStatus.value || undefined);
}

function handleView(order: Order) {
  currentOrder.value = order;
  showViewDialog.value = true;
}

function handleUpdateStatus(order: Order) {
  currentOrder.value = order;
  statusForm.status = order.status;
  showUpdateDialog.value = true;
}

async function handleStatusSubmit() {
  if (!currentOrder.value) return;

  submitting.value = true;
  try {
    await ordersStore.updateOrderStatus(currentOrder.value.id, {
      status: statusForm.status,
    });
    ElMessage.success('Order status updated successfully');
    showUpdateDialog.value = false;
  } catch (error: any) {
    ElMessage.error(error.response?.data?.message || 'Failed to update status');
  } finally {
    submitting.value = false;
  }
}

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
.orders-page {
  height: 100%;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h1 {
  margin: 0;
}

.order-details h3 {
  margin-top: 20px;
  margin-bottom: 10px;
}
</style>

