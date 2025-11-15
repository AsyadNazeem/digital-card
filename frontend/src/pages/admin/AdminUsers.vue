<template>
  <div class="admin-users-page">
    <div class="page-header">
      <button @click="$router.push('/admin/users/create')" class="btn-create">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        Create User
      </button>
    </div>

    <div class="users-table-card">
      <div class="table-controls">
        <div class="search-box">
          <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <input
              v-model="searchQuery"
              type="text"
              placeholder="Search users..."
              class="search-input"
          />
        </div>

        <select v-model="filterProvider" class="filter-select">
          <option value="all">All Users</option>
          <option value="local">Local Users</option>
          <option value="google">Google Users</option>
        </select>
      </div>

      <div class="table-wrapper">
        <!-- Loading State -->
        <div v-if="adminStore.loading" class="loading-state">
          <svg class="spinner" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="2" x2="12" y2="6"></line>
            <line x1="12" y1="18" x2="12" y2="22"></line>
            <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
            <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
            <line x1="2" y1="12" x2="6" y2="12"></line>
            <line x1="18" y1="12" x2="22" y2="12"></line>
            <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
            <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
          </svg>
          <p>Loading users...</p>
        </div>

        <!-- Users Table -->
        <table v-else class="users-table">
          <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Provider</th>
            <th>Registration</th>
            <th>Company Limit</th>
            <th>Contact Limit</th>
            <th>Joined</th>
            <th>Actions</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="user in filteredUsers" :key="user.id" @click="openUserDetails(user)" class="clickable-row">
            <td class="text-muted">#{{ user.id }}</td>
            <td class="user-name">{{ user.name }}</td>
            <td class="user-email">{{ user.email }}</td>
            <td class="text-muted">{{ user.phone || 'N/A' }}</td>
            <td>
                <span class="badge" :class="user.provider">
                  {{ user.provider === 'google' ? '🔗 Google' : '📧 Local' }}
                </span>
            </td>
            <td>
                <span class="badge" :class="user.registrationType">
                  {{ getRegistrationTypeLabel(user.registrationType)}}
                </span>
            </td>
            <td class="text-center">{{ user.companyLimit }}</td>
            <td class="text-center">{{ user.contactLimit }}</td>
            <td class="text-muted">{{ formatDate(user.createdAt) }}</td>
            <td class="actions" @click.stop>
              <button @click="deleteUser(user.id)" class="btn-delete" title="Delete User">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            </td>
          </tr>
          </tbody>
        </table>

        <!-- No Data State -->
        <div v-if="!adminStore.loading && filteredUsers.length === 0" class="no-data">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <p>No users found</p>
        </div>
      </div>
    </div>

    <!-- User Details Modal -->
    <transition name="modal-fade">
      <div v-if="showModal" class="modal-overlay" @click="closeModal">
        <div class="modal-container" @click.stop>
          <!-- Modal Header -->
          <div class="modal-header">
            <div class="user-info">
              <div class="user-avatar">{{ selectedUser?.name?.charAt(0).toUpperCase() }}</div>
              <div>
                <h2 class="modal-title">{{ selectedUser?.name }}</h2>
                <p class="modal-subtitle">{{ selectedUser?.email }}</p>
              </div>
            </div>
            <button @click="closeModal" class="btn-close">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <!-- Limits Section -->
          <div class="limits-section">
            <div class="limit-card">
              <div class="limit-header">
                <span class="limit-icon">🏢</span>
                <span class="limit-label">Company Limit</span>
              </div>
              <div class="limit-controls">
                <span class="limit-value">{{ updatedLimits.companyLimit }}</span>
                <div class="limit-buttons">
                  <button @click="updateLimit('company', -1)" class="btn-limit" :disabled="updatedLimits.companyLimit <= 1">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                  </button>
                  <button @click="updateLimit('company', 1)" class="btn-limit">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div class="limit-card">
              <div class="limit-header">
                <span class="limit-icon">👥</span>
                <span class="limit-label">Contact Limit</span>
              </div>
              <div class="limit-controls">
                <span class="limit-value">{{ updatedLimits.contactLimit }}</span>
                <div class="limit-buttons">
                  <button @click="updateLimit('contact', -1)" class="btn-limit" :disabled="updatedLimits.contactLimit <= 1">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                  </button>
                  <button @click="updateLimit('contact', 1)" class="btn-limit">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <button
                v-if="limitsChanged"
                @click="saveLimits"
                class="btn-save-limits"
                :disabled="savingLimits"
            >
              <svg v-if="savingLimits" class="spinner-small" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="2" x2="12" y2="6"></line>
                <line x1="12" y1="18" x2="12" y2="22"></line>
              </svg>
              <span v-else>💾 Save Changes</span>
            </button>
          </div>

          <!-- Tabs -->
          <div class="tabs-container">
            <button
                @click="activeTab = 'companies'"
                class="tab-button"
                :class="{ active: activeTab === 'companies' }"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              Companies ({{ companies.length }})
            </button>
            <button
                @click="activeTab = 'contacts'"
                class="tab-button"
                :class="{ active: activeTab === 'contacts' }"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              Contacts ({{ contacts.length }})
            </button>
          </div>

          <!-- Tab Content -->
          <div class="tab-content">
            <!-- Loading State -->
            <div v-if="loadingData" class="loading-state-small">
              <svg class="spinner" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="2" x2="12" y2="6"></line>
                <line x1="12" y1="18" x2="12" y2="22"></line>
              </svg>
              <p>Loading data...</p>
            </div>

            <!-- Companies Tab -->
            <div v-else-if="activeTab === 'companies'">
              <div v-if="companies.length === 0" class="empty-state">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                </svg>
                <p>No companies registered</p>
              </div>
              <div v-else class="table-container">
                <table class="data-table">
                  <thead>
                  <tr>
                    <th>ID</th>
                    <th>Company Name</th>
                    <th>Website</th>
                    <th>Email</th>
                    <th>Created Date</th>
                    <th>Status</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="company in companies" :key="company.id">
                    <td class="td-id">#{{ company.id }}</td>
                    <td class="td-name">
                      <div class="name-cell">
                        <span class="cell-icon">🏢</span>
                        <span>{{ company.companyName || 'Unnamed Company' }}</span>
                      </div>
                    </td>
                    <td class="td-website">
                      <a v-if="company.website" :href="company.website" target="_blank" class="link-external">
                        {{ company.displayUrl || company.website }}
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                          <polyline points="15 3 21 3 21 9"></polyline>
                          <line x1="10" y1="14" x2="21" y2="3"></line>
                        </svg>
                      </a>
                      <span v-else class="text-muted">No website</span>
                    </td>
                    <td class="td-email">{{ company.email || '-' }}</td>
                    <td class="td-date">{{ formatDate(company.createdAt) }}</td>
                    <td class="td-status">
                        <span class="status-badge" :class="company.status || 'active'">
                          {{ (company.status || 'active').toUpperCase() }}
                        </span>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Contacts Tab -->
            <div v-else-if="activeTab === 'contacts'">
              <div v-if="contacts.length === 0" class="empty-state">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                </svg>
                <p>No contacts registered</p>
              </div>
              <div v-else class="table-container">
                <table class="data-table">
                  <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Mobile</th>
                    <th>Designation</th>
                    <th>Created Date</th>
                    <th>Actions</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="contact in contacts" :key="contact.id">
                    <td class="td-id">#{{ contact.id }}</td>
                    <td class="td-name">
                      <div class="name-cell">
                        <span class="cell-icon">👤</span>
                        <span>{{ contact.firstName }} {{ contact.lastName }}</span>
                      </div>
                    </td>
                    <td class="td-email">{{ contact.email || '-' }}</td>
                    <td class="td-phone">{{ contact.mobile || contact.telephone || '-' }}</td>
                    <td class="td-designation">{{ contact.designation || '-' }}</td>
                    <td class="td-date">{{ formatDate(contact.createdAt) }}</td>
                    <td class="td-actions">
                      <a
                          :href="getContactCardUrl(contact.mobile)"
                          target="_blank"
                          class="btn-view-card"
                          title="View Contact Card"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect>
                          <polyline points="22 7 13 13 2 7"></polyline>
                        </svg>
                        View Card
                      </a>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAdminStore } from '../../store/adminStore'
import adminApi from '../../services/adminApi'

const adminStore = useAdminStore()
const searchQuery = ref('')
const filterProvider = ref('all')
const showModal = ref(false)
const selectedUser = ref(null)
const activeTab = ref('companies')
const companies = ref([])
const contacts = ref([])
const loadingData = ref(false)
const updatedLimits = ref({ companyLimit: 0, contactLimit: 0 })
const originalLimits = ref({ companyLimit: 0, contactLimit: 0 })
const savingLimits = ref(false)

const filteredUsers = computed(() => {
  let users = adminStore.users || []

  if (filterProvider.value !== 'all') {
    users = users.filter(u => u.provider === filterProvider.value)
  }

  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    users = users.filter(u =>
        u.name?.toLowerCase().includes(query) ||
        u.email?.toLowerCase().includes(query) ||
        u.phone?.toLowerCase().includes(query)
    )
  }

  return users
})

const limitsChanged = computed(() => {
  return updatedLimits.value.companyLimit !== originalLimits.value.companyLimit ||
      updatedLimits.value.contactLimit !== originalLimits.value.contactLimit
})

function getRegistrationTypeLabel(type) {
  const labels = {
    'self': '👤 Self',
    'admin': '⚡ Admin',
    'google': '🔗 Google'
  }
  return labels[type] || '👤 Self'
}

function formatDate(dateString) {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

function getContactCardUrl(mobile) {
  if (!mobile) return '#'
  // Remove the + symbol and any spaces/dashes
  const cleanNumber = mobile.replace(/[\s\-+]/g, '')
  return `http://localhost:5173/card/${cleanNumber}`
}

async function openUserDetails(user) {
  selectedUser.value = user
  showModal.value = true
  activeTab.value = 'companies'

  // Initialize limits
  updatedLimits.value = {
    companyLimit: user.companyLimit || 1,
    contactLimit: user.contactLimit || 1
  }
  originalLimits.value = { ...updatedLimits.value }

  await fetchUserData(user.id)
}

async function fetchUserData(userId) {
  loadingData.value = true
  try {
    // Fetch companies - get all columns
    const companiesRes = await adminApi.get(`/user/${userId}/companies`)
    companies.value = companiesRes.data.companies || []

    // Fetch contacts - get all columns
    const contactsRes = await adminApi.get(`/user/${userId}/contacts`)
    contacts.value = contactsRes.data.contacts || []

    console.log('📊 Companies:', companies.value)
    console.log('📞 Contacts:', contacts.value)
  } catch (err) {
    console.error('Error fetching user data:', err)
    companies.value = []
    contacts.value = []
  } finally {
    loadingData.value = false
  }
}

function updateLimit(type, change) {
  if (type === 'company') {
    const newValue = updatedLimits.value.companyLimit + change
    if (newValue >= 1) {
      updatedLimits.value.companyLimit = newValue
    }
  } else if (type === 'contact') {
    const newValue = updatedLimits.value.contactLimit + change
    if (newValue >= 1) {
      updatedLimits.value.contactLimit = newValue
    }
  }
}

async function saveLimits() {
  if (!selectedUser.value || savingLimits.value) return

  savingLimits.value = true
  try {
    await adminApi.patch(`/user/${selectedUser.value.id}/limits`, {
      companyLimit: updatedLimits.value.companyLimit,
      contactLimit: updatedLimits.value.contactLimit
    })

    // Update original limits
    originalLimits.value = { ...updatedLimits.value }

    // Refresh users list
    await adminStore.fetchUsers()

    alert('Limits updated successfully!')
  } catch (err) {
    console.error('Error updating limits:', err)
    alert(err.response?.data?.message || 'Failed to update limits')
  } finally {
    savingLimits.value = false
  }
}

function closeModal() {
  showModal.value = false
  selectedUser.value = null
  companies.value = []
  contacts.value = []
}

async function deleteUser(userId) {
  if (!confirm('Are you sure you want to delete this user?')) return

  try {
    await adminApi.delete(`/user/${userId}`)
    await adminStore.fetchUsers()
    alert('User deleted successfully')
  } catch (err) {
    console.error('Error deleting user:', err)
    alert(err.response?.data?.message || 'Failed to delete user')
  }
}

onMounted(() => {
  adminStore.fetchUsers()
})
</script>

<style scoped>
.admin-users-page {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
}

.btn-create {
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
  transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn-create:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
}

.users-table-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: all 0.2s;
}

.users-table-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.table-controls {
  display: flex;
  gap: 16px;
  padding: 24px;
  border-bottom: 1px solid #e5e7eb;
  background: #f8f9fa;
}

.search-box {
  flex: 1;
  position: relative;
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  pointer-events: none;
}

.search-input {
  width: 95%;
  padding: 12px 16px 12px 48px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  font-size: 0.95rem;
  background: white;
  transition: all 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.filter-select {
  padding: 12px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  font-size: 0.95rem;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 160px;
  font-weight: 500;
}

.filter-select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.table-wrapper {
  overflow-x: auto;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
}

.users-table thead {
  background: #f8f9fa;
}

.users-table th {
  padding: 16px;
  text-align: left;
  font-weight: 600;
  color: #4a5568;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid #e5e7eb;
}

.users-table td {
  padding: 16px;
  border-bottom: 1px solid #e5e7eb;
  font-size: 0.95rem;
  color: #2d3748;
}

.users-table tbody tr {
  transition: all 0.15s;
}

.clickable-row {
  cursor: pointer;
}

.clickable-row:hover {
  background: #f8fafc;
  transform: scale(1.002);
}

.user-name {
  font-weight: 600;
  color: #0f172a;
}

.user-email {
  color: #64748b;
  font-size: 0.9rem;
}

.text-center {
  text-align: center;
  font-weight: 600;
}

.text-muted {
  color: #64748b;
  font-size: 0.9rem;
}

.badge {
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  white-space: nowrap;
}

.badge.google {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  color: #92400e;
}

.badge.local {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  color: #1e40af;
}

.badge.self {
  background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%);
  color: #3730a3;
}

.badge.admin {
  background: linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%);
  color: #9f1239;
}

.actions {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.btn-delete {
  padding: 8px;
  background: #fee2e2;
  color: #dc2626;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-delete:hover {
  background: #fecaca;
  transform: scale(1.1);
}

.no-data {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 64px 32px;
  color: #94a3b8;
}

.no-data svg {
  margin-bottom: 16px;
  opacity: 0.5;
}

.no-data p {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 500;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 64px 32px;
  color: #667eea;
}

.loading-state svg.spinner {
  margin-bottom: 16px;
  animation: spin 1s linear infinite;
}

.loading-state p {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-container {
  background: white;
  border-radius: 20px;
  width: 100%;
  max-width: 1200px;
  max-height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px;
  border-bottom: 1px solid #e5e7eb;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
}

.modal-title {
  margin: 0 0 4px 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
}

.modal-subtitle {
  margin: 0;
  color: #64748b;
  font-size: 0.95rem;
}

.btn-close {
  padding: 8px;
  background: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  color: #64748b;
  transition: all 0.2s;
}

.btn-close:hover {
  background: #fee2e2;
  color: #dc2626;
  transform: rotate(90deg);
}

/* Limits Section */
.limits-section {
  padding: 24px 32px;
  background: white;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  gap: 16px;
  align-items: center;
}

.limit-card {
  flex: 1;
  padding: 16px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 12px;
  border: 1px solid #e5e7eb;
}

.limit-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.limit-icon {
  font-size: 1.25rem;
}

.limit-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.limit-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.limit-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: #0f172a;
}

.limit-buttons {
  display: flex;
  gap: 8px;
}

.btn-limit {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  background: white;
  color: #667eea;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.btn-limit:hover:not(:disabled) {
  background: #667eea;
  color: white;
  transform: scale(1.1);
}

.btn-limit:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.btn-save-limits {
  padding: 12px 24px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
  white-space: nowrap;
}

.btn-save-limits:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
}

.btn-save-limits:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Tabs */
.tabs-container {
  display: flex;
  gap: 8px;
  padding: 0 32px;
  background: white;
  border-bottom: 2px solid #e5e7eb;
}

.tab-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 24px;
  background: transparent;
  border: none;
  border-bottom: 3px solid transparent;
  color: #64748b;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.95rem;
  margin-bottom: -2px;
}

.tab-button:hover {
  color: #667eea;
  background: #f8fafc;
}

.tab-button.active {
  color: #667eea;
  border-bottom-color: #667eea;
}

/* Tab Content */
.tab-content {
  flex: 1;
  overflow-y: auto;
  padding: 24px 32px;
  background: white;
}

.loading-state-small {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  color: #667eea;
}

.loading-state-small svg {
  margin-bottom: 12px;
  animation: spin 1s linear infinite;
}

.loading-state-small p {
  margin: 0;
  font-weight: 600;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  color: #94a3b8;
}

.empty-state svg {
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-state p {
  margin: 0;
  font-size: 1rem;
  font-weight: 500;
}

/* List Items */
.list-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* Data Tables */
.table-container {
  overflow-x: auto;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.data-table thead {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

.data-table th {
  padding: 12px 16px;
  text-align: left;
  font-weight: 600;
  color: #475569;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 2px solid #e5e7eb;
  white-space: nowrap;
}

.data-table tbody tr {
  transition: all 0.15s;
  border-bottom: 1px solid #f1f5f9;
}

.data-table tbody tr:hover {
  background: #f8fafc;
}

.data-table td {
  padding: 12px 16px;
  color: #334155;
  vertical-align: middle;
}

.td-id {
  color: #94a3b8;
  font-weight: 600;
  font-size: 0.85rem;
}

.td-name {
  font-weight: 600;
  color: #0f172a;
}

.name-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.cell-icon {
  font-size: 1.1rem;
}

.td-email,
.td-phone,
.td-website {
  color: #64748b;
  font-size: 0.85rem;
}

.td-designation {
  color: #64748b;
  font-size: 0.85rem;
  font-style: italic;
}

.td-date {
  color: #94a3b8;
  font-size: 0.8rem;
  white-space: nowrap;
}

.td-status {
  text-align: center;
}

.status-badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.status-badge.active {
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
  color: #065f46;
}

.status-badge.inactive {
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  color: #991b1b;
}

.link-external {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: #3b82f6;
  text-decoration: none;
  transition: all 0.2s;
}

.link-external:hover {
  color: #1d4ed8;
  text-decoration: underline;
}

.td-actions {
  text-align: center;
}

.btn-view-card {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  color: #1e40af;
  border-radius: 6px;
  text-decoration: none;
  font-size: 0.8rem;
  font-weight: 600;
  transition: all 0.2s;
  white-space: nowrap;
}

.btn-view-card:hover {
  background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%);
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(30, 64, 175, 0.3);
}

.list-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  transition: all 0.2s;
}

.list-item:hover {
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
  transform: translateX(4px);
}

.item-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.item-details {
  flex: 1;
  min-width: 0;
}

.item-title {
  margin: 0 0 4px 0;
  font-size: 1rem;
  font-weight: 600;
  color: #0f172a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-subtitle {
  margin: 0;
  font-size: 0.85rem;
  color: #64748b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-meta {
  flex-shrink: 0;
}

.meta-badge {
  display: inline-block;
  padding: 6px 12px;
  background: #e0e7ff;
  color: #3730a3;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
}

.item-actions {
  flex-shrink: 0;
}

.btn-view {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: #dbeafe;
  color: #1e40af;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.2s;
}

.btn-view:hover {
  background: #1e40af;
  color: white;
  transform: scale(1.1);
}

/* Animations */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-active .modal-container,
.modal-fade-leave-active .modal-container {
  transition: all 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-from .modal-container,
.modal-fade-leave-to .modal-container {
  transform: scale(0.9) translateY(20px);
}

.spinner-small {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
  }

  .btn-create {
    width: 100%;
    justify-content: center;
  }

  .table-controls {
    flex-direction: column;
  }

  .filter-select {
    width: 100%;
  }

  .modal-container {
    max-height: 95vh;
  }

  .modal-header {
    padding: 20px;
  }

  .user-avatar {
    width: 48px;
    height: 48px;
    font-size: 1.25rem;
  }

  .modal-title {
    font-size: 1.25rem;
  }

  .limits-section {
    flex-direction: column;
    padding: 20px;
  }

  .tabs-container {
    padding: 0 20px;
  }

  .tab-button {
    padding: 12px 16px;
    font-size: 0.9rem;
  }

  .tab-content {
    padding: 20px;
  }

  .list-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .item-actions {
    width: 100%;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
