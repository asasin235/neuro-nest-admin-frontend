import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/Login.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/',
      name: 'Dashboard',
      component: () => import('../views/Dashboard.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/users',
      name: 'Users',
      component: () => import('../views/Users.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/packages',
      name: 'Packages',
      component: () => import('../views/Packages.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/orders',
      name: 'Orders',
      component: () => import('../views/Orders.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/products',
      name: 'Products',
      component: () => import('../views/ProductsView.vue'),
      meta: { requiresAuth: true },
    },
    // Content Management Routes
    {
      path: '/content/solutions',
      name: 'Solutions',
      component: () => import('../views/content/Solutions.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/content/use-cases',
      name: 'UseCases',
      component: () => import('../views/content/UseCases.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/content/knowledge-base',
      name: 'KnowledgeBase',
      component: () => import('../views/content/KnowledgeBase.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/content/faqs',
      name: 'FAQs',
      component: () => import('../views/content/FAQs.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/content/homepage',
      name: 'HomepageContent',
      component: () => import('../views/content/HomepageContent.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/content/how-it-works',
      name: 'HowItWorksContent',
      component: () => import('../views/content/HowItWorksContent.vue'),
      meta: { requiresAuth: true },
    },
    // Settings Routes
    {
      path: '/settings/team',
      name: 'TeamMembers',
      component: () => import('../views/settings/TeamMembers.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/settings/company',
      name: 'CompanyInfo',
      component: () => import('../views/settings/CompanyInfo.vue'),
      meta: { requiresAuth: true },
    },
    // Customer Routes
    {
      path: '/customer/contact-submissions',
      name: 'ContactSubmissions',
      component: () => import('../views/customer/ContactSubmissions.vue'),
      meta: { requiresAuth: true },
    },
  ],
});

router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login');
  } else if (to.path === '/login' && authStore.isAuthenticated) {
    next('/');
  } else {
    next();
  }
});

export default router;

