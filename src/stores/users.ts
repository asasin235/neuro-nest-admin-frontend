import { defineStore } from 'pinia';
import { ref } from 'vue';
import { usersApi } from '../api/users';
import type { User, CreateUserDto, UpdateUserDto, ChangeRoleDto } from '../types/user';

export const useUsersStore = defineStore('users', () => {
  const users = ref<User[]>([]);
  const loading = ref(false);
  const stats = ref<any>(null);

  async function fetchUsers() {
    loading.value = true;
    try {
      users.value = await usersApi.getAll();
    } finally {
      loading.value = false;
    }
  }

  async function createUser(data: CreateUserDto) {
    const user = await usersApi.create(data);
    users.value.unshift(user);
    return user;
  }

  async function updateUser(id: string, data: UpdateUserDto) {
    const user = await usersApi.update(id, data);
    const index = users.value.findIndex((u) => u.id === id);
    if (index !== -1) {
      users.value[index] = user;
    }
    return user;
  }

  async function changeUserRole(id: string, data: ChangeRoleDto) {
    const user = await usersApi.changeRole(id, data);
    const index = users.value.findIndex((u) => u.id === id);
    if (index !== -1) {
      users.value[index] = user;
    }
    return user;
  }

  async function deleteUser(id: string) {
    await usersApi.delete(id);
    users.value = users.value.filter((u) => u.id !== id);
  }

  async function fetchStats() {
    stats.value = await usersApi.getStats();
  }

  return {
    users,
    loading,
    stats,
    fetchUsers,
    createUser,
    updateUser,
    changeUserRole,
    deleteUser,
    fetchStats,
  };
});

