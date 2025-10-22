<template>
  <div class="login-container">
    <el-card class="login-card">
      <template #header>
        <h1>NeuroNest Admin</h1>
      </template>

      <el-form
        ref="formRef"
        :model="loginForm"
        :rules="rules"
        @submit.prevent="handleLogin"
      >
        <el-form-item prop="email">
          <el-input
            v-model="loginForm.email"
            placeholder="Email"
            size="large"
            :prefix-icon="User"
          />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="Password"
            size="large"
            :prefix-icon="Lock"
            show-password
          />
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            size="large"
            :loading="loading"
            native-type="submit"
            style="width: 100%"
          >
            Login
          </el-button>
        </el-form-item>
      </el-form>

      <!-- Default credentials hint -->
      <el-alert
        title="Default Admin Credentials"
        type="info"
        :closable="false"
        style="margin-top: 20px"
      >
        <p style="margin: 0; font-size: 14px">
          <strong>Email:</strong> admin@neuronest.house<br />
          <strong>Password:</strong> Admin@123456
        </p>
      </el-alert>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, type FormInstance } from 'element-plus';
import { User, Lock } from '@element-plus/icons-vue';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const formRef = ref<FormInstance>();
const loading = ref(false);

const loginForm = reactive({
  email: '',
  password: '',
});

const rules = {
  email: [
    { required: true, message: 'Please input email', trigger: 'blur' },
    { type: 'email', message: 'Please input valid email', trigger: 'blur' },
  ],
  password: [
    { required: true, message: 'Please input password', trigger: 'blur' },
    { min: 8, message: 'Password must be at least 8 characters', trigger: 'blur' },
  ],
};

async function handleLogin() {
  if (!formRef.value) return;

  await formRef.value.validate(async (valid) => {
    if (!valid) return;

    loading.value = true;
    try {
      await authStore.login(loginForm.email, loginForm.password);
      ElMessage.success('Login successful');
      router.push('/');
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Extract error message
      let errorMessage = 'Login failed';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      // Show specific messages for common errors
      if (error.response?.status === 401) {
        errorMessage = 'Invalid email or password. Please try again.';
      } else if (error.response?.status === 403) {
        errorMessage = 'Access denied. Admin privileges required.';
      } else if (!error.response) {
        errorMessage = 'Unable to connect to server. Please check if the backend is running.';
      }
      
      ElMessage.error({
        message: errorMessage,
        duration: 5000,
        showClose: true
      });
    } finally {
      loading.value = false;
    }
  });
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-card {
  width: 100%;
  max-width: 400px;
}

h1 {
  text-align: center;
  margin: 0;
  color: #333;
}
</style>

