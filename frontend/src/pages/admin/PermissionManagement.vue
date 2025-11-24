<template>
  <div class="permission-management-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">User Permission Management</h1>
        <p class="page-subtitle">Manage permissions for individual admin users</p>
      </div>
      <button @click="showHistory = true" class="btn-history">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
        View History
      </button>
    </div>

    <!-- User Selector -->
    <div class="user-selector-card">
      <label class="selector-label">Select Admin User:</label>
      <div v-if="loadingUsers" class="loading-inline">Loading users...</div>
      <select v-else v-model="selectedUserId" @change="loadUserPermissions" class="user-select">
        <option value="">-- Select a user --</option>
        <option
            v-for="user in adminUsers"
            :key="user.id"
            :value="user.id"
            :disabled="user.isSuperAdmin"
        >
          {{ user.username }} ({{ user.name }}) - {{ user.role }}{{ user.isSuperAdmin ? ' - Cannot Modify' : '' }}
        </option>
      </select>
    </div>

    <!-- Selected User Info -->
    <div v-if="selectedUser" class="user-info-card">
      <div class="user-avatar">{{ selectedUser.username.charAt(0).toUpperCase() }}</div>
      <div class="user-details">
        <h3>{{ selectedUser.name || selectedUser.username }}</h3>
        <p>@{{ selectedUser.username }} • {{ selectedUser.email }}</p>
        <span class="role-badge" :class="selectedUser.role">{{ selectedUser.role }}</span>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <svg class="spinner" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="12" y1="2" x2="12" y2="6"></line>
        <line x1="12" y1="18" x2="12" y2="22"></line>
      </svg>
      <p>Loading permissions...</p>
    </div>

    <!-- ✅ NEW: Expandable Table View -->
    <div v-else-if="selectedUserId" class="permissions-table-container">
      <div class="permissions-table">
        <div
            v-for="(permissions, category) in permissionsByCategory"
            :key="category"
            class="category-row"
        >
          <!-- Category Header Row -->
          <div
              class="category-header-row"
              @click="toggleCategory(category)"
              :class="{ expanded: expandedCategories[category] }"
          >
            <div class="category-header-content">
              <svg
                  class="expand-icon"
                  :class="{ rotated: expandedCategories[category] }"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
              <span class="category-icon">{{ getCategoryIcon(category) }}</span>
              <span class="category-name">{{ category }}</span>
              <span class="category-badge">{{ permissions.length }} permissions</span>
            </div>
            <div class="category-stats">
              <span class="enabled-count">
                {{ getEnabledCount(permissions) }} / {{ permissions.length }} enabled
              </span>
            </div>
          </div>

          <!-- Expandable Permissions List -->
          <transition name="expand">
            <div v-if="expandedCategories[category]" class="permissions-rows">
              <div
                  v-for="permission in permissions"
                  :key="permission"
                  class="permission-row"
              >
                <div class="permission-cell">
                  <label class="permission-toggle">
                    <input
                        type="checkbox"
                        :checked="hasPermission(permission)"
                        @change="togglePermission(permission)"
                        :disabled="isDefaultPermission(permission) || toggling"
                        class="permission-checkbox"
                    />
                    <span class="checkbox-custom"></span>
                  </label>
                  <div class="permission-info">
                    <div class="permission-name-row">
                      <span class="permission-name">{{ formatPermission(permission) }}</span>
                      <span v-if="isDefaultPermission(permission)" class="default-badge">
                        Default
                      </span>
                    </div>
                    <p class="permission-description">{{ getPermissionDescription(permission) }}</p>
                  </div>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>

    <!-- No User Selected State -->
    <div v-else class="empty-state">
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
      </svg>
      <p>Select an admin user to manage their permissions</p>
    </div>

    <!-- History Modal -->
    <transition name="modal-fade">
      <div v-if="showHistory" class="modal-overlay" @click="showHistory = false">
        <div class="modal-container history-modal" @click.stop>
          <div class="modal-header">
            <h2 class="modal-title">Permission Change History</h2>
            <button @click="showHistory = false" class="btn-close">×</button>
          </div>

          <div class="modal-body">
            <div v-if="loadingHistory" class="loading-state-small">
              <svg class="spinner" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="2" x2="12" y2="6"></line>
              </svg>
              <p>Loading history...</p>
            </div>

            <div v-else-if="history.length === 0" class="empty-state">
              <p>No permission changes yet</p>
            </div>

            <div v-else class="history-list">
              <div v-for="item in history" :key="item.id" class="history-item">
                <div class="history-icon" :class="item.action">
                  <span v-if="item.action === 'granted'">✓</span>
                  <span v-else>✕</span>
                </div>
                <div class="history-content">
                  <p class="history-text">
                    <strong>{{ item.action === 'granted' ? 'Granted' : 'Revoked' }}</strong>
                    <span class="history-permission">{{ formatPermission(item.permission) }}</span>
                    {{ item.action === 'granted' ? 'to' : 'from' }}
                    <span class="history-username">@{{ item.targetUsername }}</span>
                  </p>
                  <p class="history-meta">
                    By Admin #{{ item.adminId }} • {{ formatDate(item.changedAt) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, reactive } from 'vue'
import { useAdminStore } from '@/store/adminStore'
import { PERMISSION_CATEGORIES } from '@/config/adminPermissions'

const adminStore = useAdminStore()

const selectedUserId = ref('')
const selectedUser = ref(null)
const adminUsers = ref([])
const loading = ref(false)
const loadingUsers = ref(false)
const toggling = ref(false)
const showHistory = ref(false)
const loadingHistory = ref(false)
const history = ref([])

// ✅ NEW: Track expanded categories
const expandedCategories = reactive({})

const userPermissions = ref({
  defaultPermissions: [],
  customPermissions: [],
  allPermissions: []
})

const permissionsByCategory = computed(() => PERMISSION_CATEGORIES)

// ✅ NEW: Toggle category expansion
const toggleCategory = (category) => {
  expandedCategories[category] = !expandedCategories[category]
}

// ✅ NEW: Get enabled count for a category
const getEnabledCount = (permissions) => {
  return permissions.filter(permission => hasPermission(permission)).length
}

const hasPermission = (permission) => {
  return userPermissions.value.allPermissions?.includes(permission) || false
}

const isDefaultPermission = (permission) => {
  return userPermissions.value.defaultPermissions?.includes(permission) || false
}

const formatPermission = (permission) => {
  return permission
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
}

const getPermissionDescription = (permission) => {
  const descriptions = {
    'view_dashboard': 'Access admin dashboard and view statistics',
    'view_users': 'View list of all users in the system',
    'create_user': 'Create new user accounts',
    'delete_user': 'Delete user accounts permanently',
    'edit_user_limits': 'Modify user company and contact limits',
    'view_companies': 'View all registered companies',
    'edit_company': 'Edit company information',
    'delete_company': 'Delete companies permanently',
    'view_contacts': 'View all contacts',
    'edit_contact': 'Edit contact information',
    'delete_contact': 'Delete contacts permanently',
    'view_requests': 'View user registration requests',
    'approve_request': 'Approve registration requests',
    'reject_request': 'Reject registration requests',
    'view_themes': 'View available themes',
    'manage_themes': 'Create, edit, and delete themes',
    'view_admins': 'View list of admins',
    'manage_admins': 'Create, edit, and delete admin accounts',
    'manage_permissions': 'Manage user permissions',
    'register_admin': 'Register new admin users',
    'view_settings': 'View and modify system settings'
  }
  return descriptions[permission] || 'No description available'
}

const getCategoryIcon = (category) => {
  const icons = {
    'User Management': '👥',
    'Company Management': '🏢',
    'Contact Management': '📇',
    'Request Management': '📋',
    'Theme Management': '🎨',
    'Admin Management': '👨‍💼',
    'Permission Management': '🔐',
    'System': '⚙️'
  }
  return icons[category] || '📌'
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const loadUsers = async () => {
  loadingUsers.value = true
  try {
    const result = await adminStore.fetchAdminUsers()
    if (result.success) {
      adminUsers.value = adminStore.adminUsers
    }
  } catch (err) {
    console.error('Error loading users:', err)
    alert('Failed to load admin users')
  } finally {
    loadingUsers.value = false
  }
}

const loadUserPermissions = async () => {
  if (!selectedUserId.value) {
    selectedUser.value = null
    userPermissions.value = {
      defaultPermissions: [],
      customPermissions: [],
      allPermissions: []
    }
    return
  }

  loading.value = true
  try {
    const result = await adminStore.fetchUserPermissions(selectedUserId.value)
    if (result.success) {
      selectedUser.value = result.data.user
      userPermissions.value = {
        defaultPermissions: result.data.defaultPermissions || [],
        customPermissions: result.data.customPermissions || [],
        allPermissions: result.data.allPermissions || []
      }
    }
  } catch (err) {
    console.error('Error loading permissions:', err)
    alert('Failed to load user permissions')
  } finally {
    loading.value = false
  }
}

const togglePermission = async (permission) => {
  if (toggling.value || !selectedUserId.value) return

  const currentlyHas = hasPermission(permission)
  const action = currentlyHas ? 'revoke' : 'grant'

  if (!confirm(`Are you sure you want to ${action} "${formatPermission(permission)}" ${action === 'grant' ? 'to' : 'from'} ${selectedUser.value.username}?`)) {
    return
  }

  toggling.value = true

  try {
    let result
    if (currentlyHas) {
      result = await adminStore.revokeUserPermission(selectedUserId.value, permission)
    } else {
      result = await adminStore.grantUserPermission(selectedUserId.value, permission)
    }

    if (result.success) {
      alert(`Permission ${action}ed successfully!`)
      await loadUserPermissions()
    } else {
      alert(`Failed to ${action} permission: ${result.error}`)
    }
  } catch (err) {
    alert(`Error: ${err.message}`)
  } finally {
    toggling.value = false
  }
}

const loadHistory = async () => {
  loadingHistory.value = true
  try {
    const result = await adminStore.fetchPermissionHistory()
    if (result.success) {
      history.value = adminStore.permissionHistory
    }
  } catch (err) {
    console.error('Error loading history:', err)
  } finally {
    loadingHistory.value = false
  }
}

watch(showHistory, (newValue) => {
  if (newValue && history.value.length === 0) {
    loadHistory()
  }
})

onMounted(async () => {
  await loadUsers()
})
</script>

<style scoped>
.permission-management-page {
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
  gap: 24px;
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

.btn-history {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: linear-gradient(135deg, #f8f6f4 0%, #f1ede8 100%);
  color: #5c4033;
  border: 1px solid #e5e1dc;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-history:hover {
  background: linear-gradient(135deg, #5c4033 0%, #3e2a23 100%);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(92, 64, 51, 0.3);
}

.user-selector-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(45, 31, 26, 0.08);
  border: 2px solid #e5e1dc;
}

.selector-label {
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
  color: #4a3f3a;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.user-select {
  width: 100%;
  padding: 14px;
  border: 1px solid #e5e1dc;
  border-radius: 12px;
  font-size: 1rem;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
}

.user-select:focus {
  outline: none;
  border-color: #5c4033;
  box-shadow: 0 0 0 3px rgba(92, 64, 51, 0.1);
}

.loading-inline {
  padding: 12px;
  color: #6b5d57;
  font-style: italic;
}

.user-info-card {
  background: linear-gradient(135deg, #f8f6f4 0%, #f1ede8 100%);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  border: 2px solid #e5e1dc;
}

.user-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, #5c4033 0%, #3e2a23 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  font-weight: 700;
}

.user-details h3 {
  margin: 0 0 4px 0;
  font-size: 1.25rem;
  color: #2d1f1a;
}

.user-details p {
  margin: 0 0 8px 0;
  color: #6b5d57;
  font-size: 0.9rem;
}

.role-badge {
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
}

.role-badge.super_admin {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  color: #78350f;
}

.role-badge.admin {
  background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%);
  color: #3730a3;
}

/* ✅ NEW: Table Styles */
.permissions-table-container {
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(45, 31, 26, 0.08);
  border: 2px solid #e5e1dc;
  overflow: hidden;
}

.permissions-table {
  width: 100%;
}

.category-row {
  border-bottom: 1px solid #e5e1dc;
}

.category-row:last-child {
  border-bottom: none;
}

.category-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  cursor: pointer;
  background: linear-gradient(135deg, #f8f6f4 0%, #f1ede8 100%);
  transition: all 0.2s;
  user-select: none;
}

.category-header-row:hover {
  background: linear-gradient(135deg, #f1ede8 0%, #e8e0d8 100%);
}

.category-header-row.expanded {
  background: linear-gradient(135deg, #5c4033 0%, #3e2a23 100%);
  color: white;
}

.category-header-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.expand-icon {
  transition: transform 0.3s;
  flex-shrink: 0;
}

.expand-icon.rotated {
  transform: rotate(180deg);
}

.category-icon {
  font-size: 1.5rem;
}

.category-name {
  font-size: 1.1rem;
  font-weight: 700;
}

.category-badge {
  padding: 4px 10px;
  background: rgba(92, 64, 51, 0.1);
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
}

.category-header-row.expanded .category-badge {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.category-stats {
  display: flex;
  align-items: center;
  gap: 12px;
}

.enabled-count {
  font-size: 0.9rem;
  font-weight: 600;
  opacity: 0.8;
}

.permissions-rows {
  background: white;
}

.permission-row {
  padding: 16px 24px 16px 64px;
  border-bottom: 1px solid #f8f6f4;
  transition: all 0.2s;
}

.permission-row:last-child {
  border-bottom: none;
}

.permission-row:hover {
  background: #fafaf8;
}

.permission-cell {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.permission-toggle {
  position: relative;
  display: flex;
  align-items: center;
  cursor: pointer;
  flex-shrink: 0;
}

.permission-checkbox {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.checkbox-custom {
  width: 24px;
  height: 24px;
  border: 2px solid #e5e1dc;
  border-radius: 6px;
  background: white;
  transition: all 0.2s;
  position: relative;
}

.permission-checkbox:checked + .checkbox-custom {
  background: linear-gradient(135deg, #5c4033 0%, #3e2a23 100%);
  border-color: #5c4033;
}

.permission-checkbox:checked + .checkbox-custom::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 14px;
  font-weight: 700;
}

.permission-checkbox:disabled + .checkbox-custom {
  opacity: 0.5;
  cursor: not-allowed;
}

.permission-info {
  flex: 1;
}

.permission-name-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 4px;
}

.permission-name {
  font-size: 1rem;
  font-weight: 600;
  color: #2d1f1a;
}

.default-badge {
  padding: 2px 8px;
  background: linear-gradient(135deg, #fef3e2 0%, #fde8c5 100%);
  color: #5c4033;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.permission-description {
  margin: 0;
  font-size: 0.85rem;
  color: #8a7b75;
  line-height: 1.5;
}

/* Expand Animation */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  max-height: 1000px;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 32px;
  color: #5c4033;
}

.spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80px 32px;
  color: #8a7b75;
}

.empty-state svg {
  margin-bottom: 16px;
  opacity: 0.5;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(45, 31, 26, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-container {
  background: white;
  border-radius: 20px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(45, 31, 26, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px;
  border-bottom: 2px solid #e5e1dc;
  background: linear-gradient(135deg, #f8f6f4 0%, #f1ede8 100%);
}

.modal-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d1f1a;
}

.btn-close {
  padding: 8px 12px;
  background: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  color: #6b5d57;
  font-size: 1.5rem;
  line-height: 1;
  transition: all 0.2s;
}

.btn-close:hover {
  background: #fee2e2;
  color: #dc2626;
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 24px 32px;
}

.loading-state-small {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 48px 24px;
  color: #5c4033;
}

.loading-state-small svg {
  margin-bottom: 12px;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.history-item {
  display: flex;
  gap: 16px;
  padding: 16px;
  background: linear-gradient(135deg, #f8f6f4 0%, #f1ede8 100%);
  border-radius: 12px;
}

.history-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-weight: 700;
}

.history-icon.granted {
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
  color: #065f46;
}

.history-icon.revoked {
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  color: #991b1b;
}

.history-content {
  flex: 1;
}

.history-text {
  margin: 0 0 8px 0;
  font-size: 0.95rem;
  color: #2d1f1a;
}

.history-permission {
  padding: 2px 8px;
  background: white;
  border-radius: 4px;
  font-weight: 600;
  margin: 0 4px;
}

.history-username {
  padding: 2px 8px;
  background: #5c4033;
  color: white;
  border-radius: 4px;
  font-weight: 600;
  margin: 0 4px;
}

.history-meta {
  margin: 0;
  font-size: 0.8rem;
  color: #8a7b75;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
  }

  .btn-history {
    width: 100%;
    justify-content: center;
  }

  .permission-row {
    padding: 16px;
  }

  .category-header-row {
    padding: 16px;
  }
}
</style>
