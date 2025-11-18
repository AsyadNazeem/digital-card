<template>
  <div class="add-theme-page">
    <!-- Page Header -->
    <div class="page-header">
      <button @click="showAddForm = true" class="btn-primary">
        <span class="icon">➕</span>
        Add New Theme
      </button>
    </div>

    <!-- Themes Grid -->
    <div class="themes-grid">
      <div
          v-for="theme in themes"
          :key="theme.id"
          class="theme-card"
          :class="{ premium: theme.isPremium }"
      >
        <!-- Theme Preview -->
        <div class="theme-preview">
          <img
              v-if="theme.previewImage"
              :src="`${API_BASE_URL}${theme.previewImage}`"
              :alt="theme.name"
              class="preview-image"
          />
          <div v-else class="preview-placeholder">
            <span>🎨</span>
            <p>No Preview</p>
          </div>

          <!-- Premium Badge -->
          <div v-if="theme.isPremium" class="premium-badge">
            <span>⭐</span>
            Premium
          </div>
        </div>

        <!-- Theme Info -->
        <div class="theme-info">
          <h3 class="theme-name">{{ theme.name }}</h3>
          <p class="theme-description">{{ theme.description || 'No description' }}</p>

          <div class="theme-meta">
            <span class="meta-item">
              <span class="icon">📄</span>
              {{ theme.cssFile }}
            </span>
            <span class="meta-item">
              <span class="icon">📅</span>
              {{ formatDate(theme.createdAt) }}
            </span>
          </div>

          <!-- Actions -->
          <div class="theme-actions">
            <button @click="editTheme(theme)" class="btn-edit">
              <span class="icon">✏️</span>
              Edit
            </button>
            <button @click="confirmDelete(theme)" class="btn-delete">
              <span class="icon">🗑️</span>
              Delete
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="themes.length === 0 && !loading" class="empty-state">
        <span class="empty-icon">🎨</span>
        <h3>No Themes Yet</h3>
        <p>Add your first theme to get started</p>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading themes...</p>
    </div>

    <!-- Add/Edit Theme Modal -->
    <transition name="modal">
      <div v-if="showAddForm" class="modal-overlay" @click="closeModal">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h2>{{ editingTheme ? 'Edit Theme' : 'Add New Theme' }}</h2>
            <button @click="closeModal" class="btn-close">✕</button>
          </div>

          <form @submit.prevent="submitTheme" class="theme-form">
            <!-- Theme Name -->
            <div class="form-group">
              <label for="name">Theme Name *</label>
              <input
                  id="name"
                  v-model="formData.name"
                  type="text"
                  placeholder="e.g., Professional Blue"
                  required
              />
            </div>

            <!-- Description -->
            <div class="form-group">
              <label for="description">Description</label>
              <textarea
                  id="description"
                  v-model="formData.description"
                  rows="3"
                  placeholder="Describe this theme..."
              ></textarea>
            </div>

            <!-- CSS File Upload -->
            <div class="form-group">
              <label for="cssFile">CSS File *</label>
              <div class="file-upload">
                <input
                    id="cssFile"
                    type="file"
                    accept=".css"
                    @change="handleCssFileChange"
                    ref="cssFileInput"
                />
                <div class="file-info">
                  <span v-if="formData.cssFileName" class="file-name">
                    📄 {{ formData.cssFileName }}
                  </span>
                  <span v-else class="file-placeholder">
                    Choose CSS file...
                  </span>
                </div>
              </div>
              <small class="form-hint">Upload theme CSS file (e.g., theme1.css)</small>
            </div>

            <!-- Preview Image Upload -->
            <div class="form-group">
              <label for="previewImage">Preview Image </label>
              <div class="file-upload">
                <input
                    id="previewImage"
                    type="file"
                    accept="image/*"
                    @change="handlePreviewImageChange"
                    ref="previewImageInput"
                />
                <div class="file-info">
                  <span v-if="formData.previewImageName" class="file-name">
                    🖼️ {{ formData.previewImageName }}
                  </span>
                  <span v-else class="file-placeholder">
                    Choose preview image...
                  </span>
                </div>
              </div>
              <small class="form-hint">Upload a screenshot of the theme</small>

              <!-- Image Preview -->
              <div v-if="previewImageUrl" class="image-preview">
                <img :src="previewImageUrl" alt="Preview" />
              </div>
            </div>

            <!-- Premium Toggle -->
            <div class="form-group">
              <label class="checkbox-label">
                <input
                    type="checkbox"
                    v-model="formData.isPremium"
                />
                <span class="checkbox-text">
                  <span class="checkbox-icon">⭐</span>
                  Mark as Premium Theme
                </span>
              </label>
            </div>

            <!-- Form Actions -->
            <div class="form-actions">
              <button type="button" @click="closeModal" class="btn-cancel">
                Cancel
              </button>
              <button type="submit" class="btn-submit" :disabled="submitting">
                <span v-if="submitting" class="spinner-small"></span>
                <span v-else>{{ editingTheme ? 'Update Theme' : 'Add Theme' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>

    <!-- Delete Confirmation Modal -->
    <transition name="modal">
      <div v-if="showDeleteConfirm" class="modal-overlay" @click="showDeleteConfirm = false">
        <div class="modal-content modal-confirm" @click.stop>
          <div class="confirm-icon">⚠️</div>
          <h3>Delete Theme?</h3>
          <p>Are you sure you want to delete <strong>{{ themeToDelete?.name }}</strong>?</p>
          <p class="warning-text">This action cannot be undone.</p>

          <div class="form-actions">
            <button @click="showDeleteConfirm = false" class="btn-cancel">
              Cancel
            </button>
            <button @click="deleteTheme" class="btn-delete" :disabled="deleting">
              <span v-if="deleting" class="spinner-small"></span>
              <span v-else>Delete Theme</span>
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import adminApi from '../../services/adminApi';
import { API_BASE_URL } from '../../config';

// State
const themes = ref([]);
const loading = ref(false);
const showAddForm = ref(false);
const editingTheme = ref(null);
const submitting = ref(false);
const showDeleteConfirm = ref(false);
const themeToDelete = ref(null);
const deleting = ref(false);

// Form data
const formData = ref({
  name: '',
  description: '',
  cssFile: null,
  cssFileName: '',
  previewImage: null,
  previewImageName: '',
  isPremium: false
});

// Preview image URL
const previewImageUrl = ref('');

// Refs
const cssFileInput = ref(null);
const previewImageInput = ref(null);

// Load themes
async function loadThemes() {
  loading.value = true;
  try {
    const response = await adminApi.get('/themes');
    themes.value = response.data.themes || [];
    console.log('✅ Themes loaded:', themes.value.length);
  } catch (err) {
    console.error('❌ Error loading themes:', err);
    alert('Failed to load themes');
  } finally {
    loading.value = false;
  }
}

// Handle CSS file change
function handleCssFileChange(event) {
  const file = event.target.files[0];
  if (file) {
    formData.value.cssFile = file;
    formData.value.cssFileName = file.name;
  }
}

// Handle preview image change
function handlePreviewImageChange(event) {
  const file = event.target.files[0];
  if (file) {
    formData.value.previewImage = file;
    formData.value.previewImageName = file.name;

    // Create preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      previewImageUrl.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
}

// Submit theme (add or edit)
async function submitTheme() {
  // Validation
  if (!formData.value.name) {
    alert('Please enter theme name');
    return;
  }

  if (!editingTheme.value) {
    if (!formData.value.cssFile) {
      alert('Please upload CSS file');
      return;
    }
  }

  submitting.value = true;

  try {
    const data = new FormData();
    data.append('name', formData.value.name);
    data.append('description', formData.value.description || '');
    data.append('isPremium', formData.value.isPremium);

    if (formData.value.cssFile) {
      data.append('cssFile', formData.value.cssFile);
    }

    if (formData.value.previewImage) {
      data.append('previewImage', formData.value.previewImage);
    }

    if (editingTheme.value) {
      // Update existing theme
      await adminApi.put(`/themes/${editingTheme.value.id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('✅ Theme updated successfully!');
    } else {
      // Add new theme
      await adminApi.post('/themes', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('✅ Theme added successfully!');
    }

    closeModal();
    await loadThemes();

  } catch (err) {
    console.error('❌ Error submitting theme:', err);
    alert(err.response?.data?.message || 'Failed to save theme');
  } finally {
    submitting.value = false;
  }
}

// Edit theme
function editTheme(theme) {
  editingTheme.value = theme;
  formData.value = {
    name: theme.name,
    description: theme.description || '',
    cssFile: null,
    cssFileName: '',
    previewImage: null,
    previewImageName: '',
    isPremium: theme.isPremium
  };

  // Show existing preview image
  if (theme.previewImage) {
    previewImageUrl.value = `${API_BASE_URL}${theme.previewImage}`;
  }

  showAddForm.value = true;
}

// Confirm delete
function confirmDelete(theme) {
  themeToDelete.value = theme;
  showDeleteConfirm.value = true;
}

// Delete theme
async function deleteTheme() {
  if (!themeToDelete.value) return;

  deleting.value = true;

  try {
    await adminApi.delete(`/themes/${themeToDelete.value.id}`);
    alert('✅ Theme deleted successfully!');
    showDeleteConfirm.value = false;
    themeToDelete.value = null;
    await loadThemes();
  } catch (err) {
    console.error('❌ Error deleting theme:', err);
    alert(err.response?.data?.message || 'Failed to delete theme');
  } finally {
    deleting.value = false;
  }
}

// Close modal
function closeModal() {
  showAddForm.value = false;
  editingTheme.value = null;
  formData.value = {
    name: '',
    description: '',
    cssFile: null,
    cssFileName: '',
    previewImage: null,
    previewImageName: '',
    isPremium: false
  };
  previewImageUrl.value = '';

  // Reset file inputs
  if (cssFileInput.value) cssFileInput.value.value = '';
  if (previewImageInput.value) previewImageInput.value.value = '';
}

// Format date
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// Load themes on mount
onMounted(() => {
  loadThemes();
});
</script>

<style scoped>
.add-theme-page {
  max-width: 1400px;
  margin: 0 auto;
}

/* Page Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 4px 0;
}

.page-description {
  font-size: 0.95rem;
  color: #718096;
  margin: 0;
}

.btn-primary {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

/* Themes Grid */
.themes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
}

.theme-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.theme-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.theme-card.premium {
  border-color: #ffd700;
}

/* Theme Preview */
.theme-preview {
  position: relative;
  width: 100%;
  height: 200px;
  background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
  overflow: hidden;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preview-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 8px;
  color: #94a3b8;
}

.preview-placeholder span {
  font-size: 3rem;
}

.preview-placeholder p {
  margin: 0;
  font-size: 0.875rem;
}

.premium-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
  color: #1a202c;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  box-shadow: 0 2px 8px rgba(255, 215, 0, 0.3);
}

/* Theme Info */
.theme-info {
  padding: 20px;
}

.theme-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 8px 0;
}

.theme-description {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0 0 16px 0;
  line-height: 1.5;
  min-height: 42px;
}

.theme-meta {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
  padding: 12px;
  background: #f8fafc;
  border-radius: 8px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8125rem;
  color: #64748b;
}

.meta-item .icon {
  font-size: 1rem;
}

/* Theme Actions */
.theme-actions {
  display: flex;
  gap: 8px;
}

.btn-edit,
.btn-delete {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-edit {
  background: #f0f4ff;
  color: #4f46e5;
}

.btn-edit:hover {
  background: #e0e7ff;
}

.btn-delete {
  background: #fef2f2;
  color: #ef4444;
}

.btn-delete:hover {
  background: #fee2e2;
}

/* Empty State */
.empty-state {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-state h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 8px 0;
}

.empty-state p {
  font-size: 0.95rem;
  color: #64748b;
  margin: 0;
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  gap: 16px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e2e8f0;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-state p {
  color: #64748b;
  font-size: 0.95rem;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 20px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0;
}

.btn-close {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: #f1f5f9;
  border: none;
  font-size: 1.25rem;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-close:hover {
  background: #e2e8f0;
  color: #1a202c;
}

/* Theme Form */
.theme-form {
  padding: 24px;
}

.form-group {
  margin-bottom: 24px;
}

.form-group label {
  display: block;
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 8px;
  font-size: 0.95rem;
}

.form-group input[type="text"],
.form-group textarea {
  width: 93.5%;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 0.95rem;
  font-family: inherit;
  transition: all 0.2s ease;
}

.form-group input[type="text"]:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
}

/* File Upload */
.file-upload {
  position: relative;
}

.file-upload input[type="file"] {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
  z-index: 1;
}

.file-info {
  padding: 12px 16px;
  border: 2px dashed #e2e8f0;
  border-radius: 10px;
  background: #f8fafc;
  cursor: pointer;
  transition: all 0.2s ease;
}

.file-upload:hover .file-info {
  border-color: #667eea;
  background: #f0f4ff;
}

.file-name {
  color: #1a202c;
  font-weight: 500;
}

.file-placeholder {
  color: #94a3b8;
}

.form-hint {
  display: block;
  margin-top: 6px;
  font-size: 0.8125rem;
  color: #64748b;
}

/* Image Preview */
.image-preview {
  margin-top: 12px;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid #e2e8f0;
}

.image-preview img {
  width: 100%;
  height: auto;
  display: block;
}

/* Checkbox */
.checkbox-label {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: 12px;
  border-radius: 8px;
  transition: background 0.2s ease;
}

.checkbox-label:hover {
  background: #f8fafc;
}

.checkbox-label input[type="checkbox"] {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.checkbox-text {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
  color: #1a202c;
}

.checkbox-icon {
  font-size: 1.25rem;
}

/* Form Actions */
.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
}

.btn-cancel,
.btn-submit {
  padding: 12px 24px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-cancel {
  background: #f1f5f9;
  color: #64748b;
}

.btn-cancel:hover {
  background: #e2e8f0;
}

.btn-submit {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spinner-small {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

/* Delete Confirmation Modal */
.modal-confirm {
  max-width: 440px;
  text-align: center;
  padding: 32px;
}

.confirm-icon {
  font-size: 4rem;
  margin-bottom: 16px;
}

.modal-confirm h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 12px 0;
}

.modal-confirm p {
  font-size: 0.95rem;
  color: #64748b;
  margin: 0 0 8px 0;
}

.warning-text {
  color: #ef4444 !important;
  font-weight: 600;
}

.modal-confirm .form-actions {
  margin-top: 24px;
  justify-content: center;
}

/* Modal Animations */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition: transform 0.3s ease;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.9);
}

/* Responsive */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .themes-grid {
    grid-template-columns: 1fr;
  }

  .modal-content {
    margin: 20px;
  }
}

.btn-primary {
  background: linear-gradient(135deg, #5c4033 0%, #3e2a23 100%); /* Changed */
  box-shadow: 0 4px 12px rgba(92, 64, 51, 0.3); /* Changed */
}

.btn-primary:hover {
  box-shadow: 0 6px 20px rgba(92, 64, 51, 0.4); /* Changed */
}

.theme-card.premium {
  border-color: #d4af37; /* Changed to gold */
}

.premium-badge {
  background: linear-gradient(135deg, #d4af37 0%, #f5e6d3 100%); /* Changed to gold */
  color: #2d1f1a; /* Changed */
  box-shadow: 0 2px 8px rgba(212, 175, 55, 0.3); /* Changed */
}

.theme-name {
  color: #2d1f1a; /* Changed */
}

.theme-description {
  color: #6b5d57; /* Changed */
}

.theme-meta {
  background: #fafaf8; /* Changed */
}

.meta-item {
  color: #6b5d57; /* Changed */
}

.btn-edit {
  background: #f5e6d3; /* Changed */
  color: #5c4033; /* Changed */
}

.btn-edit:hover {
  background: #f5e6d3; /* Changed */
}

.btn-delete {
  background: #fef2f2;
  color: #ef4444;
}

.btn-delete:hover {
  background: #fee2e2;
}

.empty-state h3 {
  color: #2d1f1a; /* Changed */
}

.empty-state p {
  color: #6b5d57; /* Changed */
}

.loading-state p {
  color: #6b5d57; /* Changed */
}

.spinner {
  border: 4px solid #e5e1dc; /* Changed */
  border-top-color: #5c4033; /* Changed */
}

.modal-header {
  border-bottom: 1px solid #e5e1dc; /* Changed */
}

.modal-header h2 {
  color: #2d1f1a; /* Changed */
}

.btn-close {
  background: #fafaf8; /* Changed */
  color: #6b5d57; /* Changed */
}

.btn-close:hover {
  background: #f5f5f0; /* Changed */
  color: #2d1f1a; /* Changed */
}

.form-group label {
  color: #2d1f1a; /* Changed */
}

.form-group input[type="text"],
.form-group textarea {
  border: 2px solid #e5e1dc; /* Changed */
}

.form-group input[type="text"]:focus,
.form-group textarea:focus {
  border-color: #5c4033; /* Changed */
  box-shadow: 0 0 0 3px rgba(92, 64, 51, 0.1); /* Changed */
}

.file-info {
  border: 2px dashed #e5e1dc; /* Changed */
  background: #fafaf8; /* Changed */
}

.file-upload:hover .file-info {
  border-color: #5c4033; /* Changed */
  background: #f5e6d3; /* Changed */
}

.file-name {
  color: #2d1f1a; /* Changed */
}

.file-placeholder {
  color: #9b8b7e; /* Changed */
}

.form-hint {
  color: #6b5d57; /* Changed */
}

.image-preview {
  border: 2px solid #e5e1dc; /* Changed */
}

.checkbox-label:hover {
  background: #fafaf8; /* Changed */
}

.checkbox-text {
  color: #2d1f1a; /* Changed */
}

.btn-cancel {
  background: #fafaf8; /* Changed */
  color: #6b5d57; /* Changed */
}

.btn-cancel:hover {
  background: #f5f5f0; /* Changed */
}

.btn-submit {
  background: linear-gradient(135deg, #5c4033 0%, #3e2a23 100%); /* Changed */
}

.btn-submit:hover:not(:disabled) {
  box-shadow: 0 6px 20px rgba(92, 64, 51, 0.3); /* Changed */
}

.spinner-small {
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
}

.modal-confirm h3 {
  color: #2d1f1a; /* Changed */
}

.modal-confirm p {
  color: #6b5d57; /* Changed */
}

.warning-text {
  color: #ef4444 !important;
}
</style>
