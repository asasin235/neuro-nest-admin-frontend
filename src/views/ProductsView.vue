<template>
  <div class="products-page">
    <div class="header">
      <h1>Products Management</h1>
      <el-button type="primary" @click="openCreateDialog">Add New Product</el-button>
    </div>

    <!-- Filter Tabs -->
    <el-tabs v-model="activeTab" @tab-change="handleTabChange">
      <el-tab-pane label="All Products" name="all" />
      <el-tab-pane label="In Stock" name="inStock" />
      <el-tab-pane label="Low Stock" name="lowStock" />
      <el-tab-pane label="Out of Stock" name="outOfStock" />
    </el-tabs>

    <!-- Products Table -->
    <el-table :data="filteredProducts" v-loading="productsStore.loading" stripe>
      <el-table-column label="Image" width="100">
        <template #default="{ row }">
          <div class="product-icon">{{ row.icon }}</div>
        </template>
      </el-table-column>

      <el-table-column prop="name" label="Name" sortable />
      
      <el-table-column prop="category" label="Category" sortable width="150" />
      
      <el-table-column label="Price Range" width="150">
        <template #default="{ row }">
          {{ row.priceRange }}
        </template>
      </el-table-column>
      
      <el-table-column prop="quantity" label="Quantity" sortable width="120">
        <template #default="{ row }">
          <el-input-number
            v-model="row.quantity"
            :min="0"
            :max="9999"
            size="small"
            @change="(val: number | null) => quickUpdateStock(row.id, val ?? 0)"
          />
        </template>
      </el-table-column>

      <el-table-column label="Status" width="150" sortable>
        <template #default="{ row }">
          <el-tag v-if="row.quantity === 0" type="danger">Out of Stock</el-tag>
          <el-tag v-else-if="row.quantity <= row.lowStockThreshold" type="warning">
            Low Stock
          </el-tag>
          <el-tag v-else type="success">In Stock</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="Actions" width="200">
        <template #default="{ row }">
          <el-button size="small" @click="openEditDialog(row)">Edit</el-button>
          <el-button size="small" type="danger" @click="handleDelete(row)">Delete</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- Create/Edit Dialog -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? 'Edit Product' : 'Create New Product'"
      width="600px"
    >
      <el-form :model="form" label-width="150px">
        <el-form-item label="Name">
          <el-input v-model="form.name" />
        </el-form-item>

        <el-form-item label="Category">
          <el-input v-model="form.category" />
        </el-form-item>

        <el-form-item label="Icon">
          <el-input v-model="form.icon" placeholder="e.g., 💡" />
        </el-form-item>

        <el-form-item label="Price Range">
          <el-input v-model="form.priceRange" placeholder="e.g., ₹500-₹2,000" />
        </el-form-item>

        <el-form-item label="Min Price">
          <el-input-number v-model="form.priceMin" :min="0" />
        </el-form-item>

        <el-form-item label="Max Price">
          <el-input-number v-model="form.priceMax" :min="0" />
        </el-form-item>

        <el-form-item label="Quantity Range">
          <el-input v-model="form.quantityRange" placeholder="e.g., 1-20+" />
        </el-form-item>

        <el-form-item label="Stock Quantity">
          <el-input-number v-model="form.quantity" :min="0" />
        </el-form-item>

        <el-form-item label="Low Stock Threshold">
          <el-input-number v-model="form.lowStockThreshold" :min="1" />
        </el-form-item>

        <el-form-item label="Options">
          <el-input v-model="form.options" type="textarea" :rows="2" />
        </el-form-item>

        <el-form-item label="Description">
          <el-input v-model="form.description" type="textarea" :rows="3" />
        </el-form-item>

        <el-form-item label="Image">
          <el-upload
            :auto-upload="false"
            :on-change="handleFileChange"
            :file-list="fileList"
            :limit="1"
            accept="image/*"
          >
            <el-button size="small">Choose File</el-button>
          </el-upload>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="handleSubmit">
          {{ isEdit ? 'Update' : 'Create' }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useProductsStore } from '../stores/products';
import type { Component } from '../types/product';
import type { UploadFile } from 'element-plus';

const productsStore = useProductsStore();
const activeTab = ref('all');
const dialogVisible = ref(false);
const isEdit = ref(false);
const currentId = ref('');
const fileList = ref<UploadFile[]>([]);
const selectedFile = ref<File | null>(null);

const form = ref({
  name: '',
  category: '',
  icon: '',
  priceRange: '',
  priceMin: 0,
  priceMax: 0,
  quantityRange: '',
  options: '',
  description: '',
  quantity: 0,
  lowStockThreshold: 10,
});

const filteredProducts = computed(() => {
  const products = productsStore.products;
  
  switch (activeTab.value) {
    case 'inStock':
      return products.filter(p => p.quantity > p.lowStockThreshold);
    case 'lowStock':
      return products.filter(p => p.quantity > 0 && p.quantity <= p.lowStockThreshold);
    case 'outOfStock':
      return products.filter(p => p.quantity === 0);
    default:
      return products;
  }
});

onMounted(() => {
  productsStore.fetchProducts();
  productsStore.fetchStats();
});

function handleTabChange() {
  // Tab changed, filtered products will auto-update
}

function openCreateDialog() {
  isEdit.value = false;
  currentId.value = '';
  resetForm();
  dialogVisible.value = true;
}

function openEditDialog(product: Component) {
  isEdit.value = true;
  currentId.value = product.id;
  form.value = {
    name: product.name,
    category: product.category,
    icon: product.icon,
    priceRange: product.priceRange,
    priceMin: product.priceMin,
    priceMax: product.priceMax,
    quantityRange: product.quantityRange,
    options: product.options,
    description: product.description,
    quantity: product.quantity,
    lowStockThreshold: product.lowStockThreshold,
  };
  fileList.value = [];
  selectedFile.value = null;
  dialogVisible.value = true;
}

function resetForm() {
  form.value = {
    name: '',
    category: '',
    icon: '',
    priceRange: '',
    priceMin: 0,
    priceMax: 0,
    quantityRange: '',
    options: '',
    description: '',
    quantity: 0,
    lowStockThreshold: 10,
  };
  fileList.value = [];
  selectedFile.value = null;
}

function handleFileChange(file: UploadFile) {
  selectedFile.value = file.raw || null;
  fileList.value = file ? [file] : [];
}

async function handleSubmit() {
  try {
    const formData = new FormData();
    formData.append('name', form.value.name);
    formData.append('category', form.value.category);
    formData.append('icon', form.value.icon);
    formData.append('priceRange', form.value.priceRange);
    formData.append('priceMin', form.value.priceMin.toString());
    formData.append('priceMax', form.value.priceMax.toString());
    formData.append('quantityRange', form.value.quantityRange);
    formData.append('options', form.value.options);
    formData.append('description', form.value.description);
    formData.append('quantity', form.value.quantity.toString());
    formData.append('lowStockThreshold', form.value.lowStockThreshold.toString());
    
    if (selectedFile.value) {
      formData.append('image', selectedFile.value);
    }

    if (isEdit.value) {
      await productsStore.updateProduct(currentId.value, formData);
    } else {
      await productsStore.createProduct(formData);
    }

    ElMessage.success(isEdit.value ? 'Product updated successfully' : 'Product created successfully');
    dialogVisible.value = false;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message;
    const displayMessage = Array.isArray(errorMessage)
      ? errorMessage.join(', ')
      : (errorMessage || 'Operation failed');

    ElMessage({
      message: displayMessage,
      type: 'error',
      duration: 10000,
      showClose: true,
    });
  }
}

async function quickUpdateStock(id: string, quantity: number) {
  try {
    await productsStore.updateStock(id, quantity);
    ElMessage.success('Stock updated successfully');
  } catch (error: any) {
    const errorMessage = error.response?.data?.message;
    const displayMessage = Array.isArray(errorMessage)
      ? errorMessage.join(', ')
      : (errorMessage || 'Failed to update stock');

    ElMessage({
      message: displayMessage,
      type: 'error',
      duration: 10000,
      showClose: true,
    });
  }
}

async function handleDelete(product: Component) {
  try {
    await ElMessageBox.confirm(
      `Are you sure you want to delete "${product.name}"?`,
      'Confirm Delete',
      { type: 'warning' }
    );

    await productsStore.deleteProduct(product.id);
    ElMessage.success('Product deleted successfully');
  } catch (error: any) {
    if (error !== 'cancel') {
      const errorMessage = error.response?.data?.message;
      const displayMessage = Array.isArray(errorMessage)
        ? errorMessage.join(', ')
        : (errorMessage || 'Failed to delete product');

      ElMessage({
        message: displayMessage,
        type: 'error',
        duration: 10000,
        showClose: true,
      });
    }
  }
}
</script>

<style scoped>
.products-page {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header h1 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
}

.product-icon {
  font-size: 32px;
  text-align: center;
}
</style>

