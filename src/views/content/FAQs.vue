<template>
  <div class="faqs-view">
    <div class="header">
      <h1>FAQs Management</h1>
      <button @click="openCreateModal" class="btn-primary">+ Add FAQ</button>
    </div>

    <!-- Category Filter -->
    <div class="filters card">
      <select v-model="selectedCategory" @change="filterFAQs">
        <option value="all">All Categories</option>
        <option value="general">General</option>
        <option value="technical">Technical</option>
        <option value="billing">Billing</option>
        <option value="shipping">Shipping</option>
        <option value="products">Products</option>
      </select>
    </div>

    <!-- FAQs List -->
    <div class="faqs-grid">
      <div v-for="faq in filteredFAQs" :key="faq.id" class="faq-card card">
        <div class="faq-header">
          <span :class="`badge badge-${faq.category}`">{{ faq.category }}</span>
          <span :class="`status-badge ${faq.isActive ? 'active' : 'inactive'}`">
            {{ faq.isActive ? 'Active' : 'Inactive' }}
          </span>
        </div>
        <h3>{{ faq.question }}</h3>
        <p class="answer">{{ faq.answer }}</p>
        <div class="faq-footer">
          <div class="stats">
            <span>👍 {{ faq.helpfulCount }}</span>
            <span>👎 {{ faq.notHelpfulCount }}</span>
          </div>
          <div class="actions">
            <button @click="editFAQ(faq)" class="btn-icon">✏️</button>
            <button @click="deleteFAQ(faq)" class="btn-icon danger">🗑️</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <div class="modal-header">
          <h2>{{ editMode ? 'Edit FAQ' : 'Create FAQ' }}</h2>
          <button @click="closeModal" class="btn-close">×</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="submitFAQ">
            <div class="form-group">
              <label>Category *</label>
              <select v-model="formData.category" required>
                <option value="">Select category</option>
                <option value="general">General</option>
                <option value="technical">Technical</option>
                <option value="billing">Billing</option>
                <option value="shipping">Shipping</option>
                <option value="products">Products</option>
              </select>
            </div>

            <div class="form-group">
              <label>Question *</label>
              <input v-model="formData.question" type="text" required />
            </div>

            <div class="form-group">
              <label>Answer *</label>
              <textarea v-model="formData.answer" rows="6" required></textarea>
            </div>

            <div class="form-group checkbox">
              <label>
                <input v-model="formData.isActive" type="checkbox" />
                Active (visible on website)
              </label>
            </div>

            <div class="modal-actions">
              <button type="button" @click="closeModal" class="btn-secondary">Cancel</button>
              <button type="submit" class="btn-primary">{{ editMode ? 'Update' : 'Create' }}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import * as faqsApi from '../../api/faqs'
import type { FAQ } from '../../types/content'

const faqs = ref<FAQ[]>([])
const selectedCategory = ref('all')
const showModal = ref(false)
const editMode = ref(false)
const currentFAQ = ref<FAQ | null>(null)

const formData = ref({
  question: '',
  answer: '',
  category: '',
  isActive: true
})

const filteredFAQs = computed(() => {
  if (selectedCategory.value === 'all') return faqs.value
  return faqs.value.filter(faq => faq.category === selectedCategory.value)
})

onMounted(() => {
  loadFAQs()
})

const loadFAQs = async () => {
  try {
    const response = await faqsApi.getFAQs()
    faqs.value = response.data
  } catch (error) {
    console.error('Failed to load FAQs:', error)
    alert('Failed to load FAQs')
  }
}

const filterFAQs = () => {
  // Filtering is reactive through computed property
}

const openCreateModal = () => {
  editMode.value = false
  formData.value = {
    question: '',
    answer: '',
    category: '',
    isActive: true
  }
  showModal.value = true
}

const editFAQ = (faq: FAQ) => {
  editMode.value = true
  currentFAQ.value = faq
  formData.value = {
    question: faq.question,
    answer: faq.answer,
    category: faq.category,
    isActive: faq.isActive
  }
  showModal.value = true
}

const submitFAQ = async () => {
  try {
    if (editMode.value && currentFAQ.value) {
      await faqsApi.updateFAQ(currentFAQ.value.id, formData.value)
    } else {
      await faqsApi.createFAQ(formData.value)
    }
    await loadFAQs()
    closeModal()
    alert(`FAQ ${editMode.value ? 'updated' : 'created'} successfully!`)
  } catch (error) {
    console.error('Failed to save FAQ:', error)
    alert('Failed to save FAQ')
  }
}

const deleteFAQ = async (faq: FAQ) => {
  if (!confirm(`Are you sure you want to delete this FAQ?`)) return
  
  try {
    await faqsApi.deleteFAQ(faq.id)
    await loadFAQs()
    alert('FAQ deleted successfully!')
  } catch (error) {
    console.error('Failed to delete FAQ:', error)
    alert('Failed to delete FAQ')
  }
}

const closeModal = () => {
  showModal.value = false
  currentFAQ.value = null
}
</script>

<style scoped>
.faqs-view {
  padding: 2rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.filters {
  padding: 1rem;
  margin-bottom: 2rem;
}

.filters select {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
}

.faqs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 1.5rem;
}

.faq-card {
  padding: 1.5rem;
}

.faq-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.faq-card h3 {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: #1e293b;
}

.answer {
  color: #64748b;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.faq-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
}

.stats {
  display: flex;
  gap: 1rem;
  font-size: 0.875rem;
}

/* Reuse common styles from Solutions.vue */
.card, .badge, .status-badge, .btn-primary, .btn-secondary, .btn-icon,
.modal-overlay, .modal, .modal-header, .modal-body, .form-group,
.modal-actions, .btn-close {
  /* Same as Solutions.vue */
}
</style>

