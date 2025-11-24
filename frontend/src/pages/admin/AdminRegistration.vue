<template>
  <div class="admin-create-page">
    <!-- Form Card -->
    <div class="form-card">
      <h2 class="form-title">Admin Information</h2>

      <form @submit.prevent="submitForm" class="admin-form">

        <!-- FULL NAME -->
        <div class="form-group">
          <label class="form-label">Full Name</label>
          <input type="text" v-model="form.name" class="form-input" required />
        </div>

        <!-- USERNAME -->
        <div class="form-group">
          <label class="form-label">Username</label>
          <input type="text" v-model="form.username" class="form-input" required />
        </div>

        <!-- EMAIL -->
        <div class="form-group">
          <label class="form-label">Email Address</label>
          <input type="email" v-model="form.email" class="form-input" required />
        </div>

        <!-- PASSWORD -->
        <div class="form-group">
          <label class="form-label">Password</label>
          <input type="password" v-model="form.password" class="form-input" required />
        </div>

        <!-- ROLE -->
        <div class="form-group">
          <label class="form-label">Role</label>
          <select v-model="form.role" class="form-select">
            <option value="admin">Admin</option>
            <option value="super_admin">Super Admin</option>
          </select>
        </div>

        <!-- STATUS -->
        <div class="form-group">
          <label class="form-label">Status</label>
          <select v-model="form.status" class="form-select">
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <!-- SUBMIT -->
        <button type="submit" class="btn-submit" :disabled="loading">
          <svg v-if="loading" width="20" height="20" viewBox="0 0 24 24"
               fill="none" stroke="currentColor" stroke-width="2" class="spinner">
            <line x1="12" y1="2" x2="12" y2="6"></line>
            <line x1="12" y1="18" x2="12" y2="22"></line>
            <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
          </svg>
          <span>{{ loading ? 'Creating...' : 'Create Admin' }}</span>
        </button>

      </form>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { useAdminStore } from '@/store/adminStore'

const adminStore = useAdminStore()

const loading = ref(false)

const form = ref({
  name: '',
  username: '',
  email: '',
  password: '',
  role: 'admin',
  status: 'active'
})

const submitForm = async () => {
  if (loading.value) return
  loading.value = true

  try {
    const result = await adminStore.createAdmin(form.value)

    if (result.success) {
      alert('Admin account created successfully!')
      Object.assign(form.value, {
        name: '', username: '', email: '', password: '',
        role: 'admin', status: 'active'
      })
    } else {
      alert('Error: ' + result.error)
    }
  } catch (err) {
    alert('Unexpected Error: ' + err.message)
  }

  loading.value = false
}
</script>
<style scoped>
.admin-create-page {
  max-width: 100%;
  margin: 0 auto;
  padding-bottom: 40px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
}

.page-title {
  margin: 0 0 8px 0;
  font-size: 2rem;
  font-weight: 700;
  color: #2d1f1a;
}

.page-subtitle {
  margin: 0;
  color: #6b5d57;
  font-size: 1rem;
}

/* Form Card */
.form-card {
  background: white;
  border-radius: 16px;
  padding: 32px;
  border: 2px solid #e5e1dc;
  box-shadow: 0 2px 8px rgba(45,31,26,0.08);
}

.form-title {
  margin: 0 0 24px 0;
  font-size: 1.4rem;
  font-weight: 700;
  color: #2d1f1a;
}

/* Form Layout */
.admin-form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #5c4033;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.form-input,
.form-select {
  padding: 14px 16px;
  border: 1px solid #e5e1dc;
  border-radius: 12px;
  font-size: 0.95rem;
  background: white;
  color: #2d1f1a;
  transition: all 0.2s;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: #5c4033;
  box-shadow: 0 0 0 3px rgba(92,64,51,0.1);
}

/* Submit Button */
.btn-submit {
  grid-column: 1 / -1;
  margin-top: 12px;
  padding: 16px;
  border: none;
  cursor: pointer;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 700;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;

  background: linear-gradient(135deg, #5c4033 0%, #3e2a23 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(92,64,51,0.25);
  transition: all 0.2s;
}

.btn-submit:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(92,64,51,0.35);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Responsive */
@media (max-width: 768px) {
  .admin-form {
    grid-template-columns: 1fr;
  }
}
</style>
