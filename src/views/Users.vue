<template>
  <Layout>
    <div class="users-page">
      <div class="page-header">
        <h1>User Management</h1>
        <el-button type="primary" @click="showCreateDialog = true">
          <el-icon><Plus /></el-icon>
          Add User
        </el-button>
      </div>

      <el-card>
        <el-table
          :data="usersStore.users"
          :loading="usersStore.loading"
          style="width: 100%"
          v-loading="usersStore.loading"
        >
          <el-table-column prop="id" label="ID" width="100">
            <template #default="{ row }">
              #{{ row.id.substring(0, 8) }}
            </template>
          </el-table-column>
          <el-table-column prop="email" label="Email" />
          <el-table-column label="Name">
            <template #default="{ row }">
              {{ row.firstName }} {{ row.lastName }}
            </template>
          </el-table-column>
          <el-table-column prop="phone" label="Phone" />
          <el-table-column prop="role" label="Role">
            <template #default="{ row }">
              <el-tag :type="row.role === 'admin' ? 'danger' : 'success'">
                {{ row.role }}
              </el-tag>
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

      <!-- Create Dialog -->
      <el-dialog v-model="showCreateDialog" title="Create User" width="500px">
        <el-form :model="createForm" label-width="120px">
          <el-form-item label="Email">
            <el-input v-model="createForm.email" />
          </el-form-item>
          <el-form-item label="Password">
            <el-input v-model="createForm.password" type="password" show-password />
          </el-form-item>
          <el-form-item label="First Name">
            <el-input v-model="createForm.firstName" />
          </el-form-item>
          <el-form-item label="Last Name">
            <el-input v-model="createForm.lastName" />
          </el-form-item>
          <el-form-item label="Phone">
            <el-input v-model="createForm.phone" />
          </el-form-item>
          <el-form-item label="Role">
            <el-select v-model="createForm.role">
              <el-option label="User" value="user" />
              <el-option label="Admin" value="admin" />
            </el-select>
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="showCreateDialog = false">Cancel</el-button>
          <el-button type="primary" @click="handleCreate" :loading="submitting">
            Create
          </el-button>
        </template>
      </el-dialog>

      <!-- Edit Dialog -->
      <el-dialog v-model="showEditDialog" title="Edit User" width="500px">
        <el-form :model="editForm" label-width="120px">
          <el-form-item label="Email">
            <el-input v-model="editForm.email" />
          </el-form-item>
          <el-form-item label="Password">
            <el-input v-model="editForm.password" type="password" show-password placeholder="Leave blank to keep current" />
          </el-form-item>
          <el-form-item label="First Name">
            <el-input v-model="editForm.firstName" />
          </el-form-item>
          <el-form-item label="Last Name">
            <el-input v-model="editForm.lastName" />
          </el-form-item>
          <el-form-item label="Phone">
            <el-input v-model="editForm.phone" />
          </el-form-item>
          <el-form-item label="Role">
            <el-select v-model="editForm.role">
              <el-option label="User" value="user" />
              <el-option label="Admin" value="admin" />
            </el-select>
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="showEditDialog = false">Cancel</el-button>
          <el-button type="primary" @click="handleUpdate" :loading="submitting">
            Update
          </el-button>
        </template>
      </el-dialog>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import { onMounted, ref, reactive } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
import Layout from '../components/Layout.vue';
import { useUsersStore } from '../stores/users';
import type { User, UserRole } from '../types/user';

const usersStore = useUsersStore();

const showCreateDialog = ref(false);
const showEditDialog = ref(false);
const submitting = ref(false);
const currentUser = ref<User | null>(null);

const createForm = reactive({
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  phone: '',
  role: 'user' as UserRole,
});

const editForm = reactive({
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  phone: '',
  role: 'user' as UserRole,
});

onMounted(() => {
  usersStore.fetchUsers();
});

function handleEdit(user: User) {
  currentUser.value = user;
  editForm.email = user.email;
  editForm.password = '';
  editForm.firstName = user.firstName;
  editForm.lastName = user.lastName;
  editForm.phone = user.phone || '';
  editForm.role = user.role;
  showEditDialog.value = true;
}

async function handleCreate() {
  submitting.value = true;
  try {
    await usersStore.createUser({
      email: createForm.email,
      password: createForm.password,
      firstName: createForm.firstName,
      lastName: createForm.lastName,
      phone: createForm.phone,
      role: createForm.role,
    });
    ElMessage.success('User created successfully');
    showCreateDialog.value = false;
    resetCreateForm();
  } catch (error: any) {
    ElMessage.error(error.response?.data?.message || 'Failed to create user');
  } finally {
    submitting.value = false;
  }
}

async function handleUpdate() {
  if (!currentUser.value) return;

  submitting.value = true;
  try {
    const updateData: any = {
      email: editForm.email,
      firstName: editForm.firstName,
      lastName: editForm.lastName,
      phone: editForm.phone,
    };

    if (editForm.password) {
      updateData.password = editForm.password;
    }

    await usersStore.updateUser(currentUser.value.id, updateData);

    if (editForm.role !== currentUser.value.role) {
      await usersStore.changeUserRole(currentUser.value.id, { role: editForm.role });
    }

    ElMessage.success('User updated successfully');
    showEditDialog.value = false;
  } catch (error: any) {
    ElMessage.error(error.response?.data?.message || 'Failed to update user');
  } finally {
    submitting.value = false;
  }
}

async function handleDelete(user: User) {
  try {
    await ElMessageBox.confirm(
      `Are you sure you want to delete user ${user.firstName} ${user.lastName}?`,
      'Confirm Delete',
      {
        type: 'warning',
      }
    );

    await usersStore.deleteUser(user.id);
    ElMessage.success('User deleted successfully');
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.response?.data?.message || 'Failed to delete user');
    }
  }
}

function resetCreateForm() {
  createForm.email = '';
  createForm.password = '';
  createForm.firstName = '';
  createForm.lastName = '';
  createForm.phone = '';
  createForm.role = 'user' as UserRole;
}
</script>

<style scoped>
.users-page {
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

