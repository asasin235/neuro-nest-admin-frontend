<template>
  <Layout>
    <div class="packages-page">
      <div class="page-header">
        <h1>Package Management</h1>
        <el-button type="primary" @click="showCreateDialog = true">
          <el-icon><Plus /></el-icon>
          Add Package
        </el-button>
      </div>

      <el-card>
        <el-table
          :data="packagesStore.packages"
          :loading="packagesStore.loading"
          style="width: 100%"
        >
          <el-table-column prop="id" label="ID" width="100">
            <template #default="{ row }">
              #{{ row.id.substring(0, 8) }}
            </template>
          </el-table-column>
          <el-table-column prop="name" label="Name" />
          <el-table-column prop="description" label="Description" />
          <el-table-column prop="price" label="Price">
            <template #default="{ row }">
              ${{ row.price.toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column label="Features">
            <template #default="{ row }">
              {{ row.features.length }} items
            </template>
          </el-table-column>
          <el-table-column label="Image">
            <template #default="{ row }">
              <el-tag v-if="row.imagePath" type="success">Yes</el-tag>
              <el-tag v-else type="info">No</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="Actions" width="200">
            <template #default="{ row }">
              <el-button size="small" @click="handleEdit(row)">Edit</el-button>
              <el-button size="small" type="danger" @click="handleDelete(row)">
                Delete
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <!-- Create/Edit Dialog -->
      <el-dialog
        v-model="showCreateDialog"
        :title="isEditing ? 'Edit Package' : 'Create Package'"
        width="600px"
      >
        <el-form :model="packageForm" label-width="120px">
          <el-form-item label="Name">
            <el-input v-model="packageForm.name" />
          </el-form-item>
          <el-form-item label="Description">
            <el-input v-model="packageForm.description" type="textarea" :rows="3" />
          </el-form-item>
          <el-form-item label="Price">
            <el-input-number v-model="packageForm.price" :min="0" :precision="2" />
          </el-form-item>
          <el-form-item label="Features">
            <el-input
              v-model="featuresText"
              type="textarea"
              :rows="4"
              placeholder="Enter features, one per line"
            />
          </el-form-item>
          <el-form-item label="Image">
            <el-upload
              :auto-upload="false"
              :on-change="handleImageChange"
              :limit="1"
              :file-list="fileList"
              list-type="picture"
            >
              <el-button>Select Image</el-button>
            </el-upload>
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="closeDialog">Cancel</el-button>
          <el-button type="primary" @click="handleSubmit" :loading="submitting">
            {{ isEditing ? 'Update' : 'Create' }}
          </el-button>
        </template>
      </el-dialog>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import { onMounted, ref, reactive } from 'vue';
import { ElMessage, ElMessageBox, type UploadFile } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
import Layout from '../components/Layout.vue';
import { usePackagesStore } from '../stores/packages';
import type { Package } from '../types/package';

const packagesStore = usePackagesStore();

const showCreateDialog = ref(false);
const submitting = ref(false);
const isEditing = ref(false);
const currentPackage = ref<Package | null>(null);
const selectedImage = ref<File | null>(null);
const fileList = ref<UploadFile[]>([]);

const packageForm = reactive({
  name: '',
  description: '',
  price: 0,
  features: [] as string[],
});

const featuresText = ref('');

onMounted(() => {
  packagesStore.fetchPackages();
});

function handleEdit(pkg: Package) {
  isEditing.value = true;
  currentPackage.value = pkg;
  packageForm.name = pkg.name;
  packageForm.description = pkg.description;
  packageForm.price = pkg.price;
  packageForm.features = [...pkg.features];
  featuresText.value = pkg.features.join('\n');
  fileList.value = [];
  selectedImage.value = null;
  showCreateDialog.value = true;
}

function handleImageChange(file: UploadFile) {
  selectedImage.value = file.raw || null;
}

async function handleSubmit() {
  // Parse features from textarea
  packageForm.features = featuresText.value
    .split('\n')
    .map((f) => f.trim())
    .filter((f) => f.length > 0);

  submitting.value = true;
  try {
    if (isEditing.value && currentPackage.value) {
      await packagesStore.updatePackage(
        currentPackage.value.id,
        {
          name: packageForm.name,
          description: packageForm.description,
          price: packageForm.price,
          features: packageForm.features,
        },
        selectedImage.value || undefined
      );
      ElMessage({
        message: 'Package updated successfully',
        type: 'success',
        duration: 3000,
      });
    } else {
      await packagesStore.createPackage(
        {
          name: packageForm.name,
          description: packageForm.description,
          price: packageForm.price,
          features: packageForm.features,
        },
        selectedImage.value || undefined
      );
      ElMessage({
        message: 'Package created successfully',
        type: 'success',
        duration: 3000,
      });
    }
    closeDialog();
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
  } finally {
    submitting.value = false;
  }
}

async function handleDelete(pkg: Package) {
  try {
    await ElMessageBox.confirm(
      `Are you sure you want to delete package "${pkg.name}"?`,
      'Confirm Delete',
      {
        type: 'warning',
      }
    );

    await packagesStore.deletePackage(pkg.id);
    ElMessage({
      message: 'Package deleted successfully',
      type: 'success',
      duration: 3000,
    });
  } catch (error: any) {
    if (error !== 'cancel') {
      const errorMessage = error.response?.data?.message;
      const displayMessage = Array.isArray(errorMessage) 
        ? errorMessage.join(', ') 
        : (errorMessage || 'Failed to delete package');
      
      ElMessage({
        message: displayMessage,
        type: 'error',
        duration: 10000,
        showClose: true,
      });
    }
  }
}

function closeDialog() {
  showCreateDialog.value = false;
  isEditing.value = false;
  currentPackage.value = null;
  packageForm.name = '';
  packageForm.description = '';
  packageForm.price = 0;
  packageForm.features = [];
  featuresText.value = '';
  selectedImage.value = null;
  fileList.value = [];
}
</script>

<style scoped>
.packages-page {
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
</style>

