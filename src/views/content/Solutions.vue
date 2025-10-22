<template>
  <div class="solutions-view">
    <div class="header">
      <h1>Solutions Management</h1>
      <button @click="showCreateModal = true" class="btn-primary">
        <span>+</span> Add Solution
      </button>
    </div>

    <!-- Solutions Table -->
    <div class="card">
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Slug</th>
              <th>Status</th>
              <th>Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="solution in solutions" :key="solution.id">
              <td>
                <strong>{{ solution.title }}</strong>
              </td>
              <td>
                <span :class="`badge badge-${solution.category}`">
                  {{ solution.category }}
                </span>
              </td>
              <td><code>{{ solution.slug }}</code></td>
              <td>
                <span :class="`status-badge ${solution.isActive ? 'active' : 'inactive'}`">
                  {{ solution.isActive ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td>{{ formatDate(solution.updatedAt) }}</td>
              <td class="actions">
                <button @click="editSolution(solution)" class="btn-icon" title="Edit">
                  ✏️
                </button>
                <button @click="deleteSolutionConfirm(solution)" class="btn-icon danger" title="Delete">
                  🗑️
                </button>
              </td>
            </tr>
            <tr v-if="!solutions.length && !loading">
              <td colspan="6" class="empty-state">
                No solutions found. Create your first one!
              </td>
            </tr>
            <tr v-if="loading">
              <td colspan="6" class="loading-state">Loading...</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showCreateModal || showEditModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <div class="modal-header">
          <h2>{{ showEditModal ? 'Edit Solution' : 'Create Solution' }}</h2>
          <button @click="closeModal" class="btn-close">×</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="submitForm">
            <!-- Basic Info -->
            <div class="form-section">
              <h3>Basic Information</h3>
              <div class="form-group">
                <label>Title *</label>
                <input v-model="formData.title" type="text" required placeholder="e.g. Smart Lighting Control" />
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Slug *</label>
                  <input v-model="formData.slug" type="text" required placeholder="lighting-control" />
                </div>
                <div class="form-group">
                  <label>Category *</label>
                  <select v-model="formData.category" required>
                    <option value="">Select category</option>
                    <option value="lighting">Lighting</option>
                    <option value="security">Security</option>
                    <option value="climate">Climate</option>
                    <option value="entertainment">Entertainment</option>
                    <option value="networking">Networking</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Hero Section -->
            <div class="form-section">
              <h3>Hero Section</h3>
              <div class="form-group">
                <label>Hero Title *</label>
                <input v-model="formData.heroTitle" type="text" required />
              </div>
              <div class="form-group">
                <label>Hero Subtitle *</label>
                <textarea v-model="formData.heroSubtitle" rows="2" required></textarea>
              </div>
              <div class="form-group">
                <label>Hero Image URL</label>
                <input v-model="formData.heroImage" type="text" placeholder="https://..." />
              </div>
            </div>

            <!-- Benefits -->
            <div class="form-section">
              <h3>Benefits</h3>
              <div v-for="(benefit, index) in formData.benefits" :key="index" class="array-item">
                <input v-model="formData.benefits[index]" type="text" placeholder="Benefit description" />
                <button type="button" @click="removeBenefit(index)" class="btn-remove">×</button>
              </div>
              <button type="button" @click="addBenefit" class="btn-secondary btn-sm">+ Add Benefit</button>
            </div>

            <!-- Features -->
            <div class="form-section">
              <h3>Features</h3>
              <div v-for="(feature, index) in formData.features" :key="index" class="array-item">
                <input v-model="formData.features[index]" type="text" placeholder="Feature description" />
                <button type="button" @click="removeFeature(index)" class="btn-remove">×</button>
              </div>
              <button type="button" @click="addFeature" class="btn-secondary btn-sm">+ Add Feature</button>
            </div>

            <!-- Content -->
            <div class="form-section">
              <h3>Content</h3>
              <div class="form-group">
                <label>Main Content *</label>
                <textarea v-model="formData.content" rows="6" required placeholder="Detailed description..."></textarea>
              </div>
            </div>

            <!-- SEO -->
            <div class="form-section">
              <h3>SEO Settings</h3>
              <div class="form-group">
                <label>Meta Title</label>
                <input v-model="formData.metaTitle" type="text" />
              </div>
              <div class="form-group">
                <label>Meta Description</label>
                <textarea v-model="formData.metaDescription" rows="2"></textarea>
              </div>
            </div>

            <!-- Status -->
            <div class="form-section">
              <div class="form-group checkbox">
                <label>
                  <input v-model="formData.isActive" type="checkbox" />
                  Active (visible on website)
                </label>
              </div>
            </div>

            <!-- Actions -->
            <div class="modal-actions">
              <button type="button" @click="closeModal" class="btn-secondary">Cancel</button>
              <button type="submit" class="btn-primary" :disabled="submitting">
                {{ submitting ? 'Saving...' : (showEditModal ? 'Update' : 'Create') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as solutionsApi from '../../api/solutions'
import type { Solution, CreateSolutionDto } from '../../types/content/solution'

const solutions = ref<Solution[]>([])
const loading = ref(false)
const submitting = ref(false)
const showCreateModal = ref(false)
const showEditModal = ref(false)
const currentSolution = ref<Solution | null>(null)

const defaultFormData = (): CreateSolutionDto => ({
  slug: '',
  title: '',
  category: '',
  heroTitle: '',
  heroSubtitle: '',
  benefits: [''],
  features: [''],
  content: '',
  isActive: true
})

const formData = ref<CreateSolutionDto>(defaultFormData())

onMounted(() => {
  loadSolutions()
})

const loadSolutions = async () => {
  loading.value = true
  try {
    const response = await solutionsApi.getSolutions()
    solutions.value = response.data
  } catch (error) {
    console.error('Failed to load solutions:', error)
    alert('Failed to load solutions')
  } finally {
    loading.value = false
  }
}

const editSolution = (solution: Solution) => {
  currentSolution.value = solution
  formData.value = {
    slug: solution.slug,
    title: solution.title,
    category: solution.category,
    heroImage: solution.heroImage,
    heroTitle: solution.heroTitle,
    heroSubtitle: solution.heroSubtitle,
    benefits: [...solution.benefits],
    features: [...solution.features],
    relatedProducts: solution.relatedProducts ? [...solution.relatedProducts] : undefined,
    content: solution.content,
    metaTitle: solution.metaTitle,
    metaDescription: solution.metaDescription,
    isActive: solution.isActive
  }
  showEditModal.value = true
}

const submitForm = async () => {
  submitting.value = true
  try {
    // Filter empty benefits/features
    const cleanedData = {
      ...formData.value,
      benefits: formData.value.benefits.filter(b => b.trim() !== ''),
      features: formData.value.features.filter(f => f.trim() !== '')
    }

    if (showEditModal.value && currentSolution.value) {
      await solutionsApi.updateSolution(currentSolution.value.id, cleanedData)
    } else {
      await solutionsApi.createSolution(cleanedData)
    }
    
    await loadSolutions()
    closeModal()
    alert(`Solution ${showEditModal.value ? 'updated' : 'created'} successfully!`)
  } catch (error: any) {
    console.error('Failed to save solution:', error)
    alert(`Failed to save solution: ${error.response?.data?.message || error.message}`)
  } finally {
    submitting.value = false
  }
}

const deleteSolutionConfirm = async (solution: Solution) => {
  if (!confirm(`Are you sure you want to delete "${solution.title}"?`)) return
  
  try {
    await solutionsApi.deleteSolution(solution.id)
    await loadSolutions()
    alert('Solution deleted successfully!')
  } catch (error) {
    console.error('Failed to delete solution:', error)
    alert('Failed to delete solution')
  }
}

const closeModal = () => {
  showCreateModal.value = false
  showEditModal.value = false
  currentSolution.value = null
  formData.value = defaultFormData()
}

const addBenefit = () => {
  formData.value.benefits.push('')
}

const removeBenefit = (index: number) => {
  formData.value.benefits.splice(index, 1)
}

const addFeature = () => {
  formData.value.features.push('')
}

const removeFeature = (index: number) => {
  formData.value.features.splice(index, 1)
}

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>

<style scoped>
.solutions-view {
  padding: 2rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.header h1 {
  font-size: 2rem;
  font-weight: 700;
}

.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.table-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  background: #f8fafc;
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #64748b;
  font-size: 0.875rem;
  text-transform: uppercase;
}

td {
  padding: 1rem;
  border-top: 1px solid #e2e8f0;
}

.badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;
}

.badge-lighting { background: #dbeafe; color: #1e40af; }
.badge-security { background: #fee2e2; color: #991b1b; }
.badge-climate { background: #d1fae5; color: #065f46; }
.badge-entertainment { background: #fce7f3; color: #9f1239; }
.badge-networking { background: #e0e7ff; color: #3730a3; }

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

.status-badge.active {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.inactive {
  background: #f3f4f6;
  color: #6b7280;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.btn-icon {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.25rem;
  padding: 0.25rem;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.btn-icon:hover {
  opacity: 1;
}

.btn-icon.danger:hover {
  opacity: 1;
}

.btn-primary {
  background: #0891b2;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.2s;
}

.btn-primary:hover {
  background: #0e7490;
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background: white;
  color: #0891b2;
  padding: 0.75rem 1.5rem;
  border: 2px solid #0891b2;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background: #0891b2;
  color: white;
}

.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
}

.modal {
  background: white;
  border-radius: 8px;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header h2 {
  font-size: 1.5rem;
  font-weight: 700;
}

.btn-close {
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: #64748b;
  line-height: 1;
  padding: 0;
  width: 2rem;
  height: 2rem;
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
}

.form-section {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #e2e8f0;
}

.form-section:last-child {
  border-bottom: none;
}

.form-section h3 {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #1e293b;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #334155;
}

.form-group input[type="text"],
.form-group input[type="email"],
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 1rem;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #0891b2;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.array-item {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.array-item input {
  flex: 1;
}

.btn-remove {
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 6px;
  width: 2rem;
  cursor: pointer;
  font-size: 1.25rem;
  line-height: 1;
}

.form-group.checkbox label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.form-group.checkbox input {
  width: auto;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e2e8f0;
}

.empty-state,
.loading-state {
  text-align: center;
  padding: 3rem;
  color: #64748b;
}

code {
  background: #f1f5f9;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
}
</style>

