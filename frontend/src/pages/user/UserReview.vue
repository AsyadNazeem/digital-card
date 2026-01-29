<template>
  <div v-if="activeTab === 'review'" class="content-card">
    <div v-if="!showReviewForm">
      <div class="card-header">
        <h2 class="card-title">Reviews / Branch Links</h2>
        <button
            class="btn-primary"
            @click="openReviewForm"
            v-if="reviewCount < userLimits.reviewLimit"
        >
          + Add Review
        </button>
      </div>

      <div v-if="reviewItems.length > 0" class="table-container">
        <table class="data-table">
          <thead>
          <tr>
            <th>#</th>
            <th>Company</th>
            <th>Branch Name</th>
            <th>Location</th>
            <th>Google Review</th>
            <th>Tripadvisor</th>
            <th>Actions</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(r, idx) in reviewItems" :key="r._tempId || r.id">
            <td>{{ idx + 1 }}</td>
            <td>{{ companyNameById(r.companyId) || '-' }}</td>
            <td>{{ r.branchName }}</td>
            <td>{{ r.location }}</td>
            <td>
              <a v-if="r.googleLink" :href="r.googleLink" target="_blank" class="link">{{
                  shortLink(r.googleLink)
                }}</a>
              <span v-else>-</span>
            </td>
            <td>
              <a v-if="r.tripadvisorLink" :href="r.tripadvisorLink" target="_blank"
                 class="link">{{ shortLink(r.tripadvisorLink) }}</a>
              <span v-else>-</span>
            </td>
            <td class="action-buttons">
              <button class="btn-action view" @click="openReviewShareModal(r)">View</button>
              <button class="btn-action edit" @click="editReview(idx)">✏️ Edit</button>
              <button class="btn-action delete" @click="removeReview(idx)">🗑️ Delete</button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <div v-else class="empty-state">
        <svg class="empty-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             stroke-width="2">
          <path d="M3 7h18M3 12h18M3 17h18"></path>
        </svg>
        <p class="empty-text">No review entries found</p>
<!--        <button @click="openReviewForm" class="link-button">Add your first review</button>-->
      </div>
    </div>

    <!-- REVIEW FORM -->
    <div v-else>
      <div class="card-header">
        <h2 class="card-title">Add / Edit Reviews</h2>
        <button @click="closeReviewForm" class="btn-close">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <div class="form-container">
        <!-- inside the v-for="(item, index) in reviewFormRows" -->
        <div v-for="(item, index) in reviewFormRows" :key="item._tempId" class="review-row">
          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">Company <span class="required">*</span></label>
              <select v-model="item.companyId" class="form-input">
                <option disabled value="">Select a company</option>
                <option v-for="c in userCompanies" :key="c.id" :value="c.id">{{ c.companyName }}</option>
              </select>
              <p v-if="item._errors?.companyId" class="field-error">{{ item._errors.companyId }}</p>
            </div>

            <div class="form-group">
              <label class="form-label">Branch Name <span class="required">*</span></label>
              <input v-model="item.branchName" type="text" class="form-input" placeholder="e.g. Colombo Branch"/>
              <p v-if="item._errors?.branchName" class="field-error">{{ item._errors.branchName }}</p>
            </div>

            <div class="form-group">
              <label class="form-label">Branch Location</label>
              <input v-model="item.location" type="text" class="form-input" placeholder="City, Area, Address"/>
            </div>

            <div class="form-group">
              <label class="form-label">Google Review Link</label>
              <input v-model="item.googleLink" type="url" class="form-input" placeholder="https://..."/>
              <p v-if="item._errors?.googleLink" class="field-error">{{ item._errors.googleLink }}</p>
            </div>

            <div class="form-group">
              <label class="form-label">Tripadvisor Link</label>
              <input v-model="item.tripadvisorLink" type="url" class="form-input" placeholder="https://..."/>
              <p v-if="item._errors?.tripadvisorLink" class="field-error">{{ item._errors.tripadvisorLink }}</p>
            </div>
          </div>

          <!-- New row actions: Add More (validates current row) + Remove -->
          <div class="form-actions" style="margin-bottom: 1rem;">
            <button class="btn-outline" @click="addMore(index)" type="button">
              + Add More
            </button>

            <button
                class="btn-danger"
                @click="removeRow(index)"
                type="button"
            >
              Remove
            </button>
          </div>

          <hr/>
        </div>


        <!-- Add more + final actions -->
        <div class="form-actions" style="margin-top: 8px;">
          <button class="btn-primary" @click="saveAllReviews" :disabled="savingReviews">
            <span v-if="!savingReviews">Save All</span>
            <span v-else>Saving...</span>
          </button>
          <button class="btn-secondary" @click="closeReviewForm">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import api from '@/services/api.js';

const props = defineProps({
  activeTab: {
    type: String,
    required: true
  },
  reviewCount: {
    type: Number,
    required: true
  },
  userLimits: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['review-added', 'review-deleted', 'review-updated']);

// State
const reviewItems = ref([]);
const userCompanies = ref([]);
const showReviewForm = ref(false);
const reviewFormRows = ref([]);
const savingReviews = ref(false);

const token = localStorage.getItem('token');

// Helper: create an empty row
function makeEmptyReviewRow(overrides = {}) {
  return {
    _tempId: 'tmp_' + Math.random().toString(36).substr(2, 9),
    id: overrides.id || null,
    companyId: overrides.companyId || '',
    branchName: overrides.branchName || '',
    location: overrides.location || '',
    googleLink: overrides.googleLink || '',
    tripadvisorLink: overrides.tripadvisorLink || '',
    _errors: {}
  };
}

// Validate row function
function validateRow(row) {
  row._errors = row._errors || {};

  // Clear previous errors
  row._errors.companyId = undefined;
  row._errors.branchName = undefined;
  row._errors.googleLink = undefined;
  row._errors.tripadvisorLink = undefined;

  // Mandatory checks
  if (!row.companyId) {
    row._errors.companyId = 'Please select a company.';
  }

  if (!row.branchName || !row.branchName.trim()) {
    row._errors.branchName = 'Branch name is required.';
  }

  // Optional URL validation if provided
  if (row.googleLink && row.googleLink.trim()) {
    try {
      new URL(row.googleLink);
    } catch {
      row._errors.googleLink = 'Invalid URL';
    }
  }

  if (row.tripadvisorLink && row.tripadvisorLink.trim()) {
    try {
      new URL(row.tripadvisorLink);
    } catch {
      row._errors.tripadvisorLink = 'Invalid URL';
    }
  }

  // Remove any keys that are undefined
  Object.keys(row._errors).forEach(k => {
    if (row._errors[k] === undefined) delete row._errors[k];
  });

  return Object.keys(row._errors).length === 0;
}

// Load user companies
async function loadUserCompanies() {
  try {
    const res = await api.get('/dashboard/data', {
      headers: { Authorization: `Bearer ${token}` }
    });
    userCompanies.value = res.data.companies || [];
  } catch (err) {
    console.error('❌ Failed to load companies:', err);
    userCompanies.value = [];
  }
}

// Load reviews from server
async function loadReviews() {
  try {
    const res = await api.get('/dashboard/reviews', {
      headers: { Authorization: `Bearer ${token}` }
    });
    reviewItems.value = res.data.reviews || [];
    emit('review-added', reviewItems.value.length);
  } catch (err) {
    console.error('❌ Error loading reviews:', err);
    reviewItems.value = [];
    emit('review-added', 0);
  }
}

// Open review form
function openReviewForm() {
  if (props.reviewCount >= props.userLimits.reviewLimit) {
    alert(`⚠️ You've reached your review limit (${props.userLimits.reviewLimit}). Please request more from admin.`);
    return;
  }

  showReviewForm.value = true;
  if (reviewFormRows.value.length === 0) {
    reviewFormRows.value.push(makeEmptyReviewRow());
  }
}

// Close review form
function closeReviewForm() {
  showReviewForm.value = false;
  reviewFormRows.value = [];
}

// Add more rows
function addMore(index) {
  const row = reviewFormRows.value[index];
  if (!row) {
    reviewFormRows.value.push(makeEmptyReviewRow());
    return;
  }

  const ok = validateRow(row);

  if (!ok) {
    alert('Please fill all mandatory fields before adding a new row.');
    return;
  }

  // Check if adding would exceed limit
  const newItemsCount = reviewFormRows.value.filter(r => !r.id).length + 1;
  const existingCount = props.reviewCount;

  if (existingCount + newItemsCount > props.userLimits.reviewLimit) {
    alert(`⚠️ Adding another row would exceed your limit (${props.userLimits.reviewLimit}). Please request more from admin.`);
    return;
  }

  reviewFormRows.value.splice(index + 1, 0, makeEmptyReviewRow());
}

// Remove row
function removeRow(index) {
  // If only one row left, just clear fields instead of removing entirely
  if (reviewFormRows.value.length === 1) {
    reviewFormRows.value[0] = makeEmptyReviewRow();
    return;
  }
  reviewFormRows.value.splice(index, 1);
}

// Bulk save all rows (upsert)
async function saveAllReviews() {
  let ok = true;
  for (const r of reviewFormRows.value) {
    if (!validateRow(r)) ok = false;
  }

  if (!ok) {
    alert('Fix validation errors before saving all rows.');
    return;
  }

  savingReviews.value = true;

  try {
    const payload = reviewFormRows.value.map(r => ({
      id: r.id || null,
      companyId: r.companyId,
      branchName: r.branchName,
      location: r.location,
      googleLink: r.googleLink,
      tripadvisorLink: r.tripadvisorLink
    }));

    const res = await api.post('/dashboard/reviews/bulk-save',
        { items: payload },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
    );

    if (res.data.reviews) {
      reviewItems.value = res.data.reviews;
    } else {
      await loadReviews();
    }

    emit('review-added', reviewItems.value.length);
    reviewFormRows.value = [];
    showReviewForm.value = false;
    alert('✅ All review entries saved.');
  } catch (err) {
    console.error('❌ Bulk save error:', err);

    if (err.response?.data?.limitReached) {
      alert(err.response.data.message);
    } else {
      alert('❌ Failed to save reviews: ' + (err.response?.data?.message || err.message));
    }
  } finally {
    savingReviews.value = false;
  }
}

// Edit existing review
function editReview(index) {
  const item = reviewItems.value[index];
  const row = makeEmptyReviewRow({
    id: item.id,
    companyId: item.companyId,
    branchName: item.branchName,
    location: item.location,
    googleLink: item.googleLink,
    tripadvisorLink: item.tripadvisorLink
  });
  reviewFormRows.value = [row];
  showReviewForm.value = true;
}

// Remove existing saved item
async function removeReview(index) {
  const item = reviewItems.value[index];
  if (!confirm('❌ Delete this review entry?')) return;

  try {
    if (item.id) {
      await api.delete(`/dashboard/reviews/${item.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
    }
    reviewItems.value.splice(index, 1);
    emit('review-deleted', reviewItems.value.length);
    alert('✅ Entry deleted.');
  } catch (err) {
    console.error('❌ Delete review error:', err);
    alert('❌ Failed to delete entry.');
  }
}

// Open review share modal
async function openReviewShareModal(review) {
  try {
    const res = await api.post(
        `/dashboard/reviews/${review.id}/generate-share`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
    );

    // Open the new URL format in a new tab
    window.open(res.data.shareUrl, '_blank');

  } catch (err) {
    console.error('❌ openReviewShareModal error:', err);
    alert('❌ Failed to open review page: ' + (err.response?.data?.message || err.message));
  }
}

// Helper functions
function shortLink(url) {
  try {
    const u = new URL(url);
    return u.hostname + (u.pathname && u.pathname !== '/' ? u.pathname.slice(0, 18) + '…' : '');
  } catch {
    return url;
  }
}

function companyNameById(id) {
  const c = userCompanies.value.find(x => x.id === id);
  return c ? c.companyName : null;
}

// Watch for tab changes
watch(() => props.activeTab, (newTab) => {
  if (newTab === 'review' && reviewItems.value.length === 0) {
    loadReviews();
    loadUserCompanies();
  }
});

// Load data when component mounts
onMounted(() => {
  if (props.activeTab === 'review') {
    loadReviews();
    loadUserCompanies();
  }
});
</script>

<style scoped>
.content-card {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  padding: 1.5rem;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.card-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #0f172a;
  margin: 0;
}

/* Buttons */
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #5c4033;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-primary:hover:not(:disabled) {
  background: #5c4033;
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  padding: 0.5rem 1.5rem;
  background: #f1f5f9;
  color: #475569;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-secondary:hover {
  background: #e2e8f0;
}

.btn-outline {
  padding: 0.5rem 1rem;
  background: white;
  color: #5c4033;
  border: 1px solid #5c4033;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-outline:hover {
  background: #eef2ff;
}

.btn-danger {
  padding: 0.5rem 1rem;
  background: #fee2e2;
  color: #991b1b;
  border: 1px solid #fecaca;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-danger:hover {
  background: #fecaca;
}

.btn-close {
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 0.25rem;
  transition: color 0.2s;
}

.btn-close:hover {
  color: #64748b;
}

.link-button {
  background: none;
  border: none;
  color: #5c4033;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.2s;
}

.link-button:hover {
  color: #5c4033;
}

/* Table */
.table-container {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table thead tr {
  border-bottom: 1px solid #e2e8f0;
  background: #f8fafc;
}

.data-table th {
  padding: 0.75rem 1rem;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 500;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.data-table tbody tr {
  border-bottom: 1px solid #f1f5f9;
  transition: background 0.2s;
}

.data-table tbody tr:hover {
  background: #f8fafc;
}

.data-table td {
  padding: 1rem;
  font-size: 0.875rem;
  color: #0f172a;
}

.link {
  color: #5c4033;
  text-decoration: none;
  word-break: break-all;
}

.link:hover {
  text-decoration: underline;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.btn-action {
  padding: 0.375rem 0.75rem;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.btn-action.view {
  background: #dbeafe;
  color: #5c4033;
}

.btn-action.view:hover {
  background: #bfdbfe;
}

.btn-action.edit {
  background: #fef3c7;
  color: #92400e;
}

.btn-action.edit:hover {
  background: #fde68a;
}

.btn-action.delete {
  background: #fee2e2;
  color: #991b1b;
}

.btn-action.delete:hover {
  background: #fecaca;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 3rem 1rem;
}

.empty-icon {
  margin: 0 auto 1rem;
  color: #cbd5e1;
}

.empty-text {
  color: #64748b;
  margin-bottom: 1rem;
}

/* Form */
.form-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.review-row {
  padding: 1rem;
  background: #f8fafc;
  border-radius: 0.5rem;
  border: 1px solid #e2e8f0;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.25rem;
  margin-bottom: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #475569;
  margin-bottom: 0.5rem;
  text-align: left;
}

.required {
  color: #ef4444;
}

.form-input {
  padding: 0.625rem 0.875rem;
  background: white;
  border: 1px solid #cbd5e1;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: all 0.2s;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.form-input:focus {
  outline: none;
  border-color: #5c4033;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.field-error {
  color: #ef4444;
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

.form-actions {
  display: flex;
  gap: 0.75rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
}

hr {
  margin: 1rem 0;
  border: none;
  border-top: 1px solid #e2e8f0;
}

/* Small tablets (768px and below) */
@media (max-width: 768px) {

  /* Content Cards */
  .content-card {
    padding: 1rem;
    border-radius: 0.75rem;
  }

  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .btn-primary,
  .btn-secondary {
    width: 100%;
    justify-content: center;
  }

  /* Forms */
  .form-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .custom-social-item {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }

  .custom-social-item .checkbox-input {
    grid-column: 1 / -1;
  }

  /* Form Actions */
  .form-actions {
    flex-direction: column;
    gap: 0.75rem;
  }

  .form-actions button {
    width: 100%;
  }

  /* Upload Areas */
  .upload-label {
    padding: 1.5rem 1rem;
  }

  .image-preview {
    width: 120px;
    height: 120px;
  }

  /* Table Controls */
  .table-controls {
    margin-bottom: 1rem;
  }

  .search-input {
    width: 100%;
    max-width: none;
  }

  /* ============================================
     MOBILE TABLE CARDS - COMPANY TABLE
     ============================================ */
  /* Hide table headers on mobile */
  .data-table thead {
    display: none;
  }

  /* Reset table display */
  .data-table,
  .data-table tbody,
  .data-table tr,
  .data-table td {
    display: block;
    width: 100%;
  }

  .data-table {
    border: 0;
    font-size: 0.875rem;
  }

  /* Table body - card container */
  .data-table tbody {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  /* Individual card row */
  .data-table tr {
    background: #ffffff;
    border: 1px solid #e5e1dc;
    border-radius: 12px;
    padding: 0;
    margin-bottom: 0;
    box-shadow: 0 2px 8px rgba(92, 64, 51, 0.08);
    transition: all 0.3s ease;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .data-table tr:hover {
    box-shadow: 0 4px 16px rgba(92, 64, 51, 0.12);
    transform: translateY(-2px);
  }

  /* Card header (first cell - Company #) */
  .data-table td:first-child {
    background: linear-gradient(135deg, #5c4033 0%, #7d5a4f 100%);
    color: white;
    padding: 0.75rem 1.25rem;
    font-weight: 700;
    font-size: 0.875rem;
    border: none;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    grid-template-columns: 1fr;
    gap: 0;
    text-align: left;
    min-height: auto;
  }

  .data-table td:first-child:before {
    color: rgba(255, 255, 255, 0.9);
    font-size: 0.7rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-right: 0.5rem;
  }

  /* Regular data cells */
  .data-table td {
    border: none;
    padding: 1rem 1.25rem;
    text-align: left;
    position: relative;
    display: grid;
    grid-template-columns: 120px 1fr;
    gap: 1rem;
    align-items: center;
    min-height: 50px;
    border-bottom: 1px solid #f5f3f0;
  }

  .data-table td:last-child {
    border-bottom: none;
  }

  /* Data labels */
  .data-table td:before {
    content: attr(data-label);
    font-weight: 600;
    font-size: 0.8rem;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    grid-column: 1;
  }

  /* Data values */
  .data-table td > * {
    grid-column: 2;
  }

  /* Logo thumbnail */
  .logo-thumb {
    width: 60px;
    height: 60px;
    border-radius: 8px;
    object-fit: contain;
    background: #f8f6f4;
    padding: 6px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    justify-self: start;
  }

  /* Links */
  .data-table td .link {
    color: #5c4033;
    text-decoration: none;
    font-weight: 500;
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    transition: color 0.2s;
    word-break: break-all;
  }

  .data-table td .link:hover {
    color: #7d5a4f;
    text-decoration: underline;
  }

  /* Status badges */
  .status-badge {
    display: inline-flex;
    padding: 0.375rem 0.875rem;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 600;
    justify-self: start;
  }

  .status-badge.active {
    background: #dcfce7;
    color: #166534;
  }

  .status-badge.inactive {
    background: #fee2e2;
    color: #991b1b;
  }

  /* Action buttons section */
  .data-table td.action-buttons {
    grid-template-columns: 1fr;
    gap: 0.75rem;
    padding: 1.25rem;
    background: #f8f6f4;
    margin-top: 0;
    display: flex;
    flex-direction: column;
  }

  .data-table td.action-buttons:before {
    content: 'Actions';
    grid-column: 1 / -1;
    color: #5c4033;
    font-weight: 700;
    font-size: 0.85rem;
    margin-bottom: 0.5rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid #e5e1dc;
    display: block;
  }

  .data-table td.action-buttons > * {
    grid-column: auto;
  }

  .data-table td.action-buttons .btn-action {
    width: 60%;
    padding: 0.75rem 1rem;
    font-size: 0.875rem;
    border-radius: 8px;
    border: none;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }

  .btn-action.edit {
    background: #f39c12;
    color: white;
  }

  .btn-action.edit:hover {
    background: #e67e22;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(243, 156, 18, 0.3);
  }

  .btn-action.delete {
    background: #e74c3c;
    color: white;
  }

  .btn-action.delete:hover {
    background: #c0392b;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(231, 76, 60, 0.3);
  }

  /* Table container adjustments */
  .table-container {
    overflow-x: visible;
    margin: 0;
    padding: 0;
    border-radius: 0;
  }

  /* Pagination */
  .pagination {
    flex-wrap: wrap;
    gap: 0.5rem;
    justify-content: center;
    margin-top: 1.5rem;
  }

  .page-btn {
    padding: 0.5rem 0.875rem;
    font-size: 0.875rem;
    min-width: 40px;
  }

  /* Empty State */
  .empty-state {
    padding: 3rem 1.5rem;
    text-align: center;
  }

  .empty-icon {
    width: 48px;
    height: 48px;
    margin-bottom: 1rem;
    color: #94a3b8;
  }

  .empty-text {
    font-size: 1rem;
    color: #64748b;
    margin-bottom: 1rem;
  }

  .link-button {
    color: #5c4033;
    font-weight: 600;
    text-decoration: none;
    border-bottom: 2px solid #5c4033;
    transition: all 0.2s;
  }

  .link-button:hover {
    color: #7d5a4f;
  }

  /* Social Media Section */
  .social-links-grid {
    grid-template-columns: 1fr;
  }

  .btn-add-more {
    width: 100%;
  }
}

/* Mobile phones (480px and below) */
@media (max-width: 480px) {

  /* Cards */
  .content-card {
    padding: 0.875rem;
  }

  .card-title {
    font-size: 1rem;
  }

  /* Enhanced Mobile Card Styling */
  .data-table tbody {
    gap: 1rem;
  }

  .data-table tr {
    border-radius: 10px;
  }

  .data-table td {
    padding: 0.875rem 1rem;
    grid-template-columns: 100px 1fr;
    gap: 0.75rem;
    font-size: 0.85rem;
  }

  .data-table td:first-child {
    padding: 0.875rem 1rem;
    font-size: 0.8rem;
  }

  .data-table td:first-child:before {
    font-size: 0.65rem;
  }

  .data-table td:before {
    font-size: 0.75rem;
  }

  .logo-thumb {
    width: 50px;
    height: 50px;
  }

  .data-table td.action-buttons {
    padding: 1rem;
    gap: 0.625rem;
  }

  .data-table td.action-buttons .btn-action {
    padding: 0.625rem 0.875rem;
    font-size: 0.8rem;
  }

  /* Forms */
  .form-label {
    font-size: 0.8rem;
  }

  /* Buttons */
  .btn-primary,
  .btn-secondary,
  .btn-add-more {
    padding: 0.625rem 1rem;
    font-size: 0.875rem;
  }

  /* Upload Areas */
  .upload-label {
    padding: 1.25rem 0.75rem;
    font-size: 0.875rem;
  }

  .image-preview {
    width: 100px;
    height: 100px;
  }

  /* Status Badges */
  .status-badge {
    font-size: 0.7rem;
    padding: 0.3rem 0.625rem;
  }
}

/* Extra small devices (360px and below) */
@media (max-width: 360px) {
  .btn-primary,
  .btn-secondary {
    padding: 0.5rem 0.875rem;
    font-size: 0.8rem;
  }

  .data-table td {
    grid-template-columns: 90px 1fr;
    padding: 0.75rem 0.875rem;
    font-size: 0.8rem;
  }

  .data-table td:before {
    font-size: 0.7rem;
  }
}

/* Touch-friendly improvements */
@media (hover: none) and (pointer: coarse) {
  /* Increase tap targets */
  .btn-action,
  .btn-close,
  .btn-remove,
  .remove-image {
    min-width: 44px;
    min-height: 44px;
  }

  /* Improve scroll behavior */
  .table-container {
    -webkit-overflow-scrolling: touch;
  }

  /* Prevent zoom on input focus */
  input,
  select,
  textarea {
    font-size: 16px !important;
  }
}

/* Accessibility improvements for mobile */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Print styles */
@media print {
  .data-table thead {
    display: table-header-group;
  }

  .data-table,
  .data-table tbody,
  .data-table tr,
  .data-table td {
    display: table;
  }

  .data-table tr {
    display: table-row;
  }

  .data-table td {
    display: table-cell;
  }

  .btn-action,
  .pagination {
    display: none;
  }
}
</style>
