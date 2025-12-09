<template>
  <section class="requests-section">
    <div class="section-header">
      <div>
        <p class="section-subtitle">Manage user requests for additional limits</p>
      </div>
      <div class="filter-tabs">
        <button
            @click="requestFilter = 'all'"
            :class="['filter-tab', { active: requestFilter === 'all' }]"
        >
          All ({{ allRequests.length }})
        </button>
        <button
            @click="requestFilter = 'pending'"
            :class="['filter-tab', { active: requestFilter === 'pending' }]"
        >
          Pending ({{ pendingRequestsCount }})
        </button>
        <button
            @click="requestFilter = 'approved'"
            :class="['filter-tab', { active: requestFilter === 'approved' }]"
        >
          Approved ({{ approvedRequestsCount }})
        </button>
        <button
            @click="requestFilter = 'rejected'"
            :class="['filter-tab', { active: requestFilter === 'rejected' }]"
        >
          Rejected ({{ rejectedRequestsCount }})
        </button>
      </div>
    </div>

    <!-- Requests Grid -->
    <div v-if="filteredRequests.length > 0" class="requests-grid">
      <div v-for="request in filteredRequests" :key="request.id" class="request-card">
        <!-- Card Header -->
        <div class="request-card-header">
          <div class="request-user-info">
            <div class="request-avatar">
              {{ request.User?.name?.charAt(0).toUpperCase() || '?' }}
            </div>
            <div>
              <h3 class="request-user-name">{{ request.User?.name || 'Unknown User' }}</h3>
              <p class="request-user-email">{{ request.User?.email }}</p>
            </div>
          </div>
          <span :class="['request-status-badge', request.status]">
            <svg v-if="request.status === 'pending'" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
            </svg>
            <svg v-else-if="request.status === 'approved'" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <svg v-else width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
            {{ request.status }}
          </span>
        </div>

        <!-- Card Body -->
        <div class="request-card-body">
          <!-- Current Limits -->
          <div class="current-limits-info">
            <h4 class="info-title">Current Limits</h4>
            <div class="limits-display">
              <div class="limit-item">
                <span class="limit-icon">🏢</span>
                <span>Companies: <strong>{{ request.User?.companyLimit || 0 }}</strong></span>
              </div>
              <div class="limit-item">
                <span class="limit-icon">👤</span>
                <span>Contacts: <strong>{{ request.User?.contactLimit || 0 }}</strong></span>
              </div>
              <div class="limit-item">
                <span class="limit-icon">⭐</span>
                <span>Reviews: <strong>{{ request.User?.reviewLimit || 0 }}</strong></span>
              </div>
            </div>
          </div>

          <!-- Requested Limits -->
          <div class="requested-limits-info">
            <h4 class="info-title">Requested Additional</h4>
            <div class="limits-display">
              <div v-if="request.requestedCompanies > 0" class="limit-item highlight">
                <span class="limit-icon">🏢</span>
                <span>+{{ request.requestedCompanies }} companies</span>
              </div>
              <div v-if="request.requestedContacts > 0" class="limit-item highlight">
                <span class="limit-icon">👤</span>
                <span>+{{ request.requestedContacts }} contacts</span>
              </div>
              <div v-if="request.requestedReviews > 0" class="limit-item highlight">
                <span class="limit-icon">⭐</span>
                <span>+{{ request.requestedReviews }} reviews</span>
              </div>
            </div>
          </div>

          <!-- Reason -->
          <div v-if="request.reason" class="request-reason-box">
            <h4 class="info-title">Reason</h4>
            <p class="reason-text">{{ request.reason }}</p>
          </div>

          <!-- Request Date -->
          <div class="request-meta">
            <span class="meta-label">Requested:</span>
            <span class="meta-value">{{ formatDate(request.createdAt) }}</span>
          </div>
        </div>

        <!-- Card Actions -->
        <div v-if="request.status === 'pending'" class="request-card-actions">
          <button @click="approveRequest(request)" class="action-btn approve" :disabled="processingRequest === request.id">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            {{ processingRequest === request.id ? 'Processing...' : 'Approve' }}
          </button>
          <button @click="rejectRequest(request)" class="action-btn reject" :disabled="processingRequest === request.id">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
            Reject
          </button>
        </div>

        <div v-else class="request-processed-info">
          <span class="processed-icon">{{ request.status === 'approved' ? '✅' : '❌' }}</span>
          <span class="processed-text">
            {{ request.status === 'approved' ? 'Request Approved' : 'Request Rejected' }}
          </span>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="requests-empty-state">
      <div class="empty-icon">📭</div>
      <h3>No {{ requestFilter !== 'all' ? requestFilter : '' }} requests found</h3>
      <p>{{ requestFilter === 'pending' ? 'All caught up! No pending requests.' : 'No requests to display.' }}</p>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAdminStore } from '../../store/adminStore'
import adminApi from '../../services/adminApi'

const admin = useAdminStore()
const requestFilter = ref('pending')
const processingRequest = ref(null)

const allRequests = computed(() => admin.requests)

const pendingRequestsCount = computed(() =>
    admin.requests.filter(r => r.status === 'pending').length
)

const approvedRequestsCount = computed(() =>
    admin.requests.filter(r => r.status === 'approved').length
)

const rejectedRequestsCount = computed(() =>
    admin.requests.filter(r => r.status === 'rejected').length
)

const filteredRequests = computed(() => {
  if (requestFilter.value === 'all') return admin.requests
  return admin.requests.filter(r => r.status === requestFilter.value)
})

// UPDATE: Include reviews in the confirmation message
async function approveRequest(request) {
  const parts = [];
  if (request.requestedCompanies > 0) parts.push(`+${request.requestedCompanies} companies`);
  if (request.requestedContacts > 0) parts.push(`+${request.requestedContacts} contacts`);
  if (request.requestedReviews > 0) parts.push(`+${request.requestedReviews} reviews`);

  const message = `Approve request for ${request.User?.name}?\n\nThis will add:\n${parts.join('\n')}`;

  if (!confirm(message)) {
    return
  }

  try {
    processingRequest.value = request.id
    await adminApi.post(`/request/${request.id}/approve`)

    alert('✅ Request approved successfully!')
    await admin.loadRequests()
  } catch (err) {
    console.error('Failed to approve request:', err)
    alert('❌ Failed to approve request: ' + (err.response?.data?.message || err.message))
  } finally {
    processingRequest.value = null
  }
}

async function rejectRequest(request) {
  const reason = prompt(`Reject request from ${request.User?.name}?\n\nOptional: Enter rejection reason:`)
  if (reason === null) return

  try {
    processingRequest.value = request.id
    await adminApi.post(`/request/${request.id}/reject`, { reason })

    alert('Request rejected.')
    await admin.loadRequests()
  } catch (err) {
    console.error('Failed to reject request:', err)
    alert('❌ Failed to reject request: ' + (err.response?.data?.message || err.message))
  } finally {
    processingRequest.value = null
  }
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  admin.loadRequests()
})
</script>

<style scoped>
/* Root container */
.requests-page {
  background: #f8f9fa;
  padding: 32px;
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto;
}

/* Section Header */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.section-title {
  font-size: 1.6rem;
  font-weight: 700;
  color: #2d1f1a;
}

.section-subtitle {
  font-size: 0.9rem;
  color: #6b5d57;
}

/* Filter Tabs */
.filter-tabs {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.filter-tab {
  padding: 10px 18px;
  font-size: 0.9rem;
  background: white;
  border: 2px solid #e5e1dc;
  border-radius: 10px;
  color: #6b5d57;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s ease;
}

.filter-tab:hover {
  border-color: #5c4033;
  color: #2d1f1a;
}

.filter-tab.active {
  background: linear-gradient(135deg, #5c4033, #3e2a23);
  color: white;
  border-color: transparent;
}

/* Requests Grid */
.requests-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 22px;
  margin-top: 20px;
}

/* Request Card */
.request-card {
  background: white;
  border-radius: 16px;
  border: 2px solid #e5e1dc;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(45, 31, 26, 0.07);
  transition: all 0.25s ease;
}

.request-card:hover {
  border-color: #5c4033;
  box-shadow: 0 8px 22px rgba(45, 31, 26, 0.12);
  transform: translateY(-3px);
}

/* Card Header */
.request-card-header {
  background: #f8f6f4;
  padding: 18px 20px;
  border-bottom: 2px solid #e5e1dc;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* User Info */
.request-user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.request-avatar {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #5c4033, #3e2a23);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 1.25rem;
}

.request-user-name {
  font-size: 1rem;
  font-weight: 700;
  margin: 0;
  color: #2d1f1a;
}

.request-user-email {
  margin: 0;
  font-size: 0.85rem;
  color: #6b5d57;
}

/* Status Badge */
.request-status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: capitalize;
}

.request-status-badge.pending {
  background: #fef3c7;
  color: #92400e;
}

.request-status-badge.approved {
  background: #d1fae5;
  color: #065f46;
}

.request-status-badge.rejected {
  background: #fee2e2;
  color: #991b1b;
}

/* Card Body */
.request-card-body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.info-title {
  font-size: 0.75rem;
  font-weight: 700;
  color: #6b5d57;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 6px;
}

/* Limits Grid */
.limits-display {
  display: flex;
  gap: 12px;
}

.limit-item {
  flex: 1;
  padding: 12px;
  background: #f8f6f4;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #4a3f3a;
  font-size: 0.9rem;
}

.limit-item.highlight {
  background: #fef3e2;
  border: 2px solid #d4af37;
  font-weight: 600;
  color: #5c4033;
}

.limit-icon {
  font-size: 1.2rem;
}

/* Reason Box */
.request-reason-box {
  padding: 14px;
  background: #fffbf0;
  border: 1px solid #d4af37;
  border-radius: 10px;
}

.reason-text {
  font-size: 0.9rem;
  color: #5c4033;
  margin: 0;
  line-height: 1.4;
}

/* Date Row */
.request-meta {
  border-top: 1px solid #f1f5f9;
  padding-top: 10px;
  font-size: 0.85rem;
  color: #6b5d57;
  display: flex;
  align-items: center;
  gap: 6px;
}

.meta-label {
  color: #8a7b75;
  font-weight: 600;
}

.meta-value {
  font-weight: 600;
}

/* Approve/Reject Buttons */
.request-card-actions {
  display: flex;
  gap: 12px;
  padding: 16px 20px;
  background: #f8f6f4;
  border-top: 2px solid #e5e1dc;
}

.action-btn {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.25s ease;
}

.action-btn.approve {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
}

.action-btn.approve:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
}

.action-btn.reject {
  background: #fee2e2;
  color: #991b1b;
}

.action-btn.reject:hover:not(:disabled) {
  background: #fecaca;
  transform: translateY(-2px);
}

.action-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Approved/Rejected Info */
.request-processed-info {
  padding: 18px;
  background: #f8f6f4;
  border-top: 2px solid #e5e1dc;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  color: #6b5d57;
  font-weight: 600;
}

.processed-icon {
  font-size: 1.3rem;
}

/* Empty State */
.requests-empty-state {
  text-align: center;
  padding: 80px 20px;
}

.requests-empty-state .empty-icon {
  font-size: 5rem;
  opacity: 0.5;
  margin-bottom: 14px;
}

.requests-empty-state h3 {
  font-size: 1.3rem;
  font-weight: 700;
  color: #2d1f1a;
}

.requests-empty-state p {
  color: #6b5d57;
  font-size: 0.95rem;
}

/* Responsive */
@media (max-width: 1024px) {
  .requests-grid {
    grid-template-columns: repeat(auto-fill, minmax(330px, 1fr));
  }
}

@media (max-width: 768px) {
  .requests-grid {
    grid-template-columns: 1fr;
  }

  .filter-tabs {
    width: 100%;
  }

  .filter-tab {
    flex: 1;
    text-align: center;
  }
}
</style>
