<template>
  <div class="admin-users-page">
    <div class="page-header">
      <button
          v-if="can(PERMISSIONS.CREATE_USER)"
          @click="$router.push('/admin/users/create')"
          class="btn-create"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        Create User
      </button>
    </div>

    <div class="users-table-card">
      <div class="admin-role-banner">
        <div v-if="isSuperAdmin" class="role-indicator super">
          🌟 Super Admin Access
        </div>
        <div v-else class="role-indicator normal">
          👤 Standard Admin
        </div>
      </div>
      <div class="table-controls">
        <div class="search-box">
          <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               stroke-width="2">
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
        <select v-model="sortOrder" class="filter-select">
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>

      </div>

      <div class="table-wrapper">
        <!-- Loading State -->
        <div v-if="adminStore.loading" class="loading-state">
          <svg class="spinner" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               stroke-width="2">
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

        <!-- Desktop Table View -->
        <table v-else-if="!isMobile" class="users-table desktop-table-view">
          <thead>
          <tr>
            <th>#</th>
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
          <tr v-for="(user, index) in paginatedUsers" :key="user.id" @click="openUserDetails(user)"
              class="clickable-row">
            <td>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
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
          {{ getRegistrationTypeLabel(user.registrationType) }}
        </span>
            </td>
            <td class="text-center">{{ user.companyLimit }}</td>
            <td class="text-center">{{ user.contactLimit }}</td>
            <td class="text-muted">{{ formatDate(user.createdAt) }}</td>
            <td class="actions" @click.stop>
              <button
                  v-if="can(PERMISSIONS.DELETE_USER)"
                  @click="deleteUser(user.id)"
                  class="btn-delete"
                  title="Delete User"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
              <span v-else class="no-permission-badge">View Only</span>
            </td>
          </tr>
          </tbody>
        </table>

        <!-- Mobile Card View -->
        <div v-else-if="isMobile && !adminStore.loading" class="mobile-card-view">
          <div v-if="paginatedUsers.length === 0" class="empty-state">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <p>No users found</p>
          </div>

          <div v-else class="mobile-user-cards">
            <div
                v-for="(user, index) in paginatedUsers"
                :key="user.id"
                class="mobile-user-card"
                @click="openUserDetails(user)"
            >
              <!-- Card Header -->
              <div class="card-header">
                <div class="user-avatar-mobile">
                  {{ user.name?.charAt(0).toUpperCase() }}
                </div>
                <div class="card-header-info">
                  <div class="user-name">{{ user.name }}</div>
                  <div class="user-email">{{ user.email }}</div>
                </div>
                <span class="provider-badge-mobile" :class="user.provider">
            {{ user.provider === 'google' ? '🔗' : '📧' }}
          </span>
              </div>

              <!-- Card Body -->
              <div class="card-body">
                <div class="detail-row">
                  <div class="detail-item">
                    <span class="detail-label">📞 Phone</span>
                    <span class="detail-value">{{ user.phone || 'N/A' }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">📋 Type</span>
                    <span class="badge-small" :class="user.registrationType">
                {{
                        getRegistrationTypeLabel(user.registrationType).replace('👤 ', '').replace('⚡ ', '').replace('🔗 ', '')
                      }}
              </span>
                  </div>
                </div>

                <div class="detail-row">
                  <div class="detail-item">
                    <span class="detail-label">🏢 Companies</span>
                    <span class="limit-badge">{{ user.companyLimit }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">👥 Contacts</span>
                    <span class="limit-badge">{{ user.contactLimit }}</span>
                  </div>
                </div>
              </div>

              <!-- Card Footer -->
              <div class="card-footer">
                <div class="joined-date">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  <span>{{ formatDate(user.createdAt) }}</span>
                </div>
                <button
                    v-if="can(PERMISSIONS.DELETE_USER)"
                    @click.stop="deleteUser(user.id)"
                    class="btn-delete-mobile"
                    title="Delete User"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div class="pagination-controls" v-if="totalPages > 1 && !adminStore.loading">
          <button
              class="page-btn"
              :disabled="currentPage === 1"
              @click="currentPage--"
          >
            ← Prev
          </button>

          <span class="page-info">
      Page {{ currentPage }} of {{ totalPages }}
    </span>

          <button
              class="page-btn"
              :disabled="currentPage === totalPages"
              @click="currentPage++"
          >
            Next →
          </button>
        </div>

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
    <Teleport to="body">
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
                    <button @click="updateLimit('company', -1)" class="btn-limit"
                            :disabled="updatedLimits.companyLimit <= 1">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                           stroke-width="2">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                      </svg>
                    </button>
                    <button @click="updateLimit('company', 1)" class="btn-limit">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                           stroke-width="2">
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
                    <button @click="updateLimit('contact', -1)" class="btn-limit"
                            :disabled="updatedLimits.contactLimit <= 1">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                           stroke-width="2">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                      </svg>
                    </button>
                    <button @click="updateLimit('contact', 1)" class="btn-limit">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                           stroke-width="2">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <button
                  v-if="limitsChanged && can(PERMISSIONS.EDIT_USER_LIMITS)"
                  @click="saveLimits"
                  class="btn-save-limits"
                  :disabled="savingLimits"
              >
                <svg v-if="savingLimits" class="spinner-small" width="16" height="16" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="2">
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

              <button
                  @click="activeTab = 'review'"
                  class="tab-button"
                  :class="{ active: activeTab === 'review' }"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                Review ({{ review.length }})
              </button>
            </div>

            <!-- Tab Content -->
            <div class="tab-content">
              <!-- Loading State -->
              <div v-if="loadingData" class="loading-state-small">
                <svg class="spinner" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                     stroke-width="2">
                  <line x1="12" y1="2" x2="12" y2="6"></line>
                  <line x1="12" y1="18" x2="12" y2="22"></line>
                </svg>
                <p>Loading data...</p>
              </div>

              <!-- Companies Tab -->
              <div v-else-if="activeTab === 'companies'">

                <!-- Add Company Button -->
                <div v-if="canCreateCompany" style="margin-bottom: 20px;">
                  <button @click="createCompany" class="btn-primary"
                          style="display: flex; align-items: center; gap: 8px;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    Add Company
                  </button>
                </div>
                <div v-else
                     style="margin-bottom: 20px; padding: 12px; background: #fff3cd; border-radius: 8px; color: #856404;">
                  <strong>Company limit reached:</strong> {{ companies.length }} / {{ selectedUser?.companyLimit }}
                </div>

                <!-- Empty State -->
                <div v-if="companies.length === 0" class="empty-state">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  </svg>
                  <p>No companies registered</p>
                </div>

                <div v-else class="desktop-data-view">
                  <div class="table-container">
                    <table class="data-table">
                      <thead>
                      <tr>
                        <th>#</th>
                        <th>Company Name</th>
                        <th>Website</th>
                        <th>Email</th>
                        <th>Created Date</th>
                        <th>Status</th>
                        <th>Actions</th> <!-- ADD THIS -->
                      </tr>
                      </thead>
                      <tbody>
                      <tr v-for="(company, index) in companies" :key="company.id">
                        <td>{{ index + 1 }}</td>
                        <td class="td-name">
                          <div class="name-cell">
                            <span class="cell-icon">🏢</span>
                            <span>{{ company.companyName || 'Unnamed Company' }}</span>
                          </div>
                        </td>
                        <td class="td-website">
                          <a v-if="company.website" :href="company.website" target="_blank" class="link-external">
                            {{ company.displayUrl || company.website }}
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                 stroke-width="2">
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
                        <td class="td-actions">
                          <button
                              v-if="can(PERMISSIONS.EDIT_COMPANY)"
                              @click="editCompany(company)"
                              class="btn-view-card"
                              title="Edit Company"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                 stroke-width="2">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                            Edit
                          </button>
                          <span v-else class="view-only-text">View Only</span>
                        </td>
                      </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div class="mobile-data-view">
                  <div v-for="(company, index) in companies" :key="company.id" class="data-card">
                    <div class="data-card-header">
                      <div class="data-card-title">
                        <span class="data-card-icon">🏢</span>
                        <span class="data-card-name">{{ company.companyName || 'Unnamed Company' }}</span>
                      </div>
                      <span class="status-badge" :class="company.status || 'active'">
        {{ (company.status || 'active').toUpperCase() }}
      </span>
                    </div>
                    <div class="data-card-body">
                      <div class="data-card-row">
                        <span class="data-card-label">🌐 Website</span>
                        <a v-if="company.website" :href="company.website" target="_blank" class="data-card-value link">
                          {{ company.displayUrl || 'View' }}
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                               stroke-width="2">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                            <polyline points="15 3 21 3 21 9"></polyline>
                            <line x1="10" y1="14" x2="21" y2="3"></line>
                          </svg>
                        </a>
                        <span v-else class="data-card-value" style="color: #8a7b75;">No website</span>
                      </div>
                      <div class="data-card-row">
                        <span class="data-card-label">📧 Email</span>
                        <span class="data-card-value">{{ company.email || '-' }}</span>
                      </div>
                    </div>
                    <div class="data-card-footer">
                      <div class="data-card-date">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                             stroke-width="2">
                          <circle cx="12" cy="12" r="10"></circle>
                          <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        <span>{{ formatDate(company.createdAt) }}</span>
                      </div>
                      <div class="data-card-actions">
                        <button v-if="can(PERMISSIONS.EDIT_COMPANY)" @click="editCompany(company)"
                                class="btn-card-action">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                               stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- Contacts Tab -->
              <div v-else-if="activeTab === 'contacts'">

                <div v-if="canCreateContact" style="margin-bottom: 20px;">
                  <button @click="createContact" class="btn-primary"
                          style="display: flex; align-items: center; gap: 8px;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    Add Contact
                  </button>
                </div>
                <div v-else
                     style="margin-bottom: 20px; padding: 12px; background: #fff3cd; border-radius: 8px; color: #856404;">
                  <strong>Contact limit reached:</strong> {{ filteredContacts.length }} / {{
                    selectedUser?.contactLimit
                  }}
                </div>

                <!-- Company Filter Dropdown (only show if 2+ companies) -->
                <div v-if="companies.length >= 2" class="company-filter-section">
                  <label for="company-filter" class="filter-label">Filter by Company:</label>
                  <select id="company-filter" v-model="selectedCompanyFilter" class="company-filter-select">
                    <option value="all">All Companies</option>
                    <option v-for="company in companies" :key="company.id" :value="company.id">
                      {{ company.companyName || 'Unnamed Company' }}
                    </option>
                  </select>
                </div>


                <div v-if="contacts.length === 0" class="empty-state">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                  </svg>
                  <p>No contacts registered</p>
                </div>

                <div v-else class="desktop-data-view">
                  <div class="table-container">
                    <table class="data-table">
                      <thead>
                      <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Mobile</th>
                        <th>Company</th>
                        <th>Designation</th>
                        <th>Created Date</th>
                        <th>Actions</th>
                      </tr>
                      </thead>
                      <tbody>
                      <tr v-for="(contact, index) in filteredContacts" :key="contact.id">
                        <td>{{ index + 1 }}</td>
                        <td class="td-name">
                          <div class="name-cell">
                            <span class="cell-icon">👤</span>
                            <span>{{ contact.firstName }} {{ contact.lastName }}</span>
                          </div>
                        </td>
                        <td class="td-email">{{ contact.email || '-' }}</td>
                        <td class="td-phone">{{ contact.mobile || contact.telephone || '-' }}</td>
                        <td class="td-designation">{{ contact.designation || '-' }}</td>
                        <td class="td-company">{{ getCompanyName(contact.companyId) }}</td>
                        <td class="td-date">{{ formatDate(contact.createdAt) }}</td>
                        <td class="td-actions">
                          <div style="display: flex; align-items: center; justify-content: center; gap: 5px">
                            <button
                                @click="editContact(contact)"
                                class="btn-view-card"
                                title="Edit Contact"
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                   stroke-width="2">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                              </svg>
                              Edit
                            </button>
                            <a
                                :href="getContactCardUrl(contact.mobile)"
                                target="_blank"
                                class="btn-view-card"
                                title="View Contact Card"
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                   stroke-width="2">
                                <rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect>
                                <polyline points="22 7 13 13 2 7"></polyline>
                              </svg>
                              View Card
                            </a>
                            <button
                                @click="openQrPopup1(contact)"
                                class="btn-view-card"
                                title="View Contact QR Code"
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                   stroke-width="2">
                                <rect x="3" y="3" width="7" height="7"></rect>
                                <rect x="14" y="3" width="7" height="7"></rect>
                                <rect x="14" y="14" width="7" height="7"></rect>
                                <rect x="3" y="14" width="7" height="7"></rect>
                              </svg>
                              View QR
                            </button>
                          </div>
                        </td>
                      </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div v-if="contacts.length > 0" class="mobile-data-view">
                  <div v-for="(contact, index) in filteredContacts" :key="contact.id" class="data-card">
                    <div class="data-card-header">
                      <div class="data-card-title">
                        <span class="data-card-icon">👤</span>
                        <span class="data-card-name">{{ contact.firstName }} {{ contact.lastName }}</span>
                      </div>
                    </div>
                    <div class="data-card-body">
                      <div class="data-card-row">
                        <span class="data-card-label">📧 Email</span>
                        <span class="data-card-value">{{ contact.email || '-' }}</span>
                      </div>
                      <div class="data-card-row">
                        <span class="data-card-label">📞 Mobile</span>
                        <span class="data-card-value">{{ contact.mobile || '-' }}</span>
                      </div>
                      <div class="data-card-row">
                        <span class="data-card-label">🏢 Company</span>
                        <span class="data-card-value">{{ getCompanyName(contact.companyId) }}</span>
                      </div>
                      <div class="data-card-row">
                        <span class="data-card-label">💼 Designation</span>
                        <span class="data-card-value">{{ contact.designation || '-' }}</span>
                      </div>
                    </div>
                    <div class="data-card-footer">
                      <div class="data-card-date">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                             stroke-width="2">
                          <circle cx="12" cy="12" r="10"></circle>
                          <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        <span>{{ formatDate(contact.createdAt) }}</span>
                      </div>
                      <div class="data-card-actions">
                        <button @click="editContact(contact)" class="btn-card-action">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                               stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                          Edit
                        </button>
                        <a :href="getContactCardUrl(contact.mobile)" target="_blank" class="btn-card-action">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                               stroke-width="2">
                            <rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect>
                            <polyline points="22 7 13 13 2 7"></polyline>
                          </svg>
                          Card
                        </a>
                        <button @click="openQrPopup1(contact)" class="btn-card-action">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                               stroke-width="2">
                            <rect x="3" y="3" width="7" height="7"></rect>
                            <rect x="14" y="3" width="7" height="7"></rect>
                            <rect x="14" y="14" width="7" height="7"></rect>
                            <rect x="3" y="14" width="7" height="7"></rect>
                          </svg>
                          QR
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- Review Tab -->
              <div v-else-if="activeTab === 'review'">

                <div v-if="canCreateReview" style="margin-bottom: 20px;">
                  <button @click="createReview" class="btn-primary"
                          style="display: flex; align-items: center; gap: 8px;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    Add Review
                  </button>
                </div>
                <div v-else
                     style="margin-bottom: 20px; padding: 12px; background: #fff3cd; border-radius: 8px; color: #856404;">
                  <strong>Review limit reached:</strong> {{ review.length }} / {{ selectedUser?.reviewLimit }}
                </div>

                <div v-if="review.length === 0" class="empty-state">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                  <p>No reviews registered</p>
                </div>


                <div v-else class="desktop-data-view">
                  <div class="table-container">
                    <table class="data-table">
                      <thead>
                      <tr>
                        <th>#</th>
                        <th>Company</th>
                        <th>Branch Name</th>
                        <th>Location</th>
                        <th>Google Review</th>
                        <th>Tripadvisor</th>
                        <th>Created Date</th>
                        <th>Actions</th>
                      </tr>
                      </thead>
                      <tbody>
                      <tr v-for="(item, index) in review" :key="item.id">
                        <td>{{ index + 1 }}</td>
                        <td class="td-company">{{ item.Company?.companyName || '-' }}</td>
                        <td class="td-name">
                          <div class="name-cell">
                            <span class="cell-icon">🏢</span>
                            <span>{{ item.branchName }}</span>
                          </div>
                        </td>
                        <td class="td-designation">{{ item.location || '-' }}</td>
                        <td class="td-website">
                          <a v-if="item.googleLink" :href="item.googleLink" target="_blank" class="link-external">
                            View Link
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                 stroke-width="2">
                              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                              <polyline points="15 3 21 3 21 9"></polyline>
                              <line x1="10" y1="14" x2="21" y2="3"></line>
                            </svg>
                          </a>
                          <span v-else class="text-muted">-</span>
                        </td>
                        <td class="td-website">
                          <a v-if="item.tripadvisorLink" :href="item.tripadvisorLink" target="_blank"
                             class="link-external">
                            View Link
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                 stroke-width="2">
                              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                              <polyline points="15 3 21 3 21 9"></polyline>
                              <line x1="10" y1="14" x2="21" y2="3"></line>
                            </svg>
                          </a>
                          <span v-else class="text-muted">-</span>
                        </td>
                        <td class="td-date">{{ formatDate(item.createdAt) }}</td>
                        <td class="td-actions">
                          <div style="display: flex; align-items: center; justify-content: center; gap: 5px">
                            <button @click="editReview(item)" class="btn-view-card" title="Edit Review">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                   stroke-width="2">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                              </svg>
                              Edit
                            </button>
                            <button @click="openReviewShareModal(item)" class="btn-view-card" title="View Share Page">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                   stroke-width="2">
                                <circle cx="18" cy="5" r="3"></circle>
                                <circle cx="6" cy="12" r="3"></circle>
                                <circle cx="18" cy="19" r="3"></circle>
                                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                              </svg>
                              Share
                            </button>
                            <button @click="deleteReview(item)" class="btn-delete" title="Delete Review">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                   stroke-width="2">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path
                                    d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                              </svg>
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <!-- Mobile Card View -->
                <div v-if="review.length > 0" class="mobile-data-view">
                  <div v-for="(item, index) in review" :key="item.id" class="data-card">
                    <div class="data-card-header">
                      <div class="data-card-title">
                        <span class="data-card-icon">⭐</span>
                        <span class="data-card-name">{{ item.branchName }}</span>
                      </div>
                    </div>
                    <div class="data-card-body">
                      <div class="data-card-row">
                        <span class="data-card-label">🏢 Company</span>
                        <span class="data-card-value">{{ item.Company?.companyName || '-' }}</span>
                      </div>
                      <div class="data-card-row">
                        <span class="data-card-label">📍 Location</span>
                        <span class="data-card-value">{{ item.location || '-' }}</span>
                      </div>
                      <div class="data-card-row">
                        <span class="data-card-label">Google</span>
                        <a v-if="item.googleLink" :href="item.googleLink" target="_blank"
                           class="data-card-value link">
                          View Link
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                               stroke-width="2">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                            <polyline points="15 3 21 3 21 9"></polyline>
                            <line x1="10" y1="14" x2="21" y2="3"></line>
                          </svg>
                        </a>
                        <span v-else class="data-card-value" style="color: #8a7b75;">-</span>
                      </div>
                      <div class="data-card-row">
                        <span class="data-card-label">Tripadvisor</span>
                        <a v-if="item.tripadvisorLink" :href="item.tripadvisorLink" target="_blank"
                           class="data-card-value link">
                          View Link
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                               stroke-width="2">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                            <polyline points="15 3 21 3 21 9"></polyline>
                            <line x1="10" y1="14" x2="21" y2="3"></line>
                          </svg>
                        </a>
                        <span v-else class="data-card-value" style="color: #8a7b75;">-</span>
                      </div>
                    </div>
                    <div class="data-card-footer">
                      <div class="data-card-date">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                             stroke-width="2">
                          <circle cx="12" cy="12" r="10"></circle>
                          <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        <span>{{ formatDate(item.createdAt) }}</span>
                      </div>
                      <div class="data-card-actions">
                        <button @click="editReview(item)" class="btn-card-action">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                               stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                          Edit
                        </button>
                        <button @click="openReviewShareModal(item)" class="btn-card-action">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                               stroke-width="2">
                            <circle cx="18" cy="5" r="3"></circle>
                            <circle cx="6" cy="12" r="3"></circle>
                            <circle cx="18" cy="19" r="3"></circle>
                            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                          </svg>
                          Share
                        </button>
                        <button @click="deleteReview(item)" class="btn-card-action delete">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                               stroke-width="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path
                                d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          </svg>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>

    <!-- QR CODE POPUP -->
    <Teleport to="body">
      <transition name="modal">
        <div v-if="showQrPopup" class="qr-popup-overlay">
          <div class="qr-popup">
            <button class="close-btn" @click="showQrPopup = false">×</button>

            <h3>QR Code – {{ qrName }}</h3>

            <div class="qr-container">
              <canvas ref="qrCanvas"></canvas>
            </div>

            <div class="qr-actions">
              <button class="btn-download" @click="downloadQr">⬇️ Download</button>
              <button class="btn-share" @click="sharePoster">📤 Share Poster</button>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>

    <!-- Edit Company Modal -->
    <Teleport to="body">
      <DashboardEditCompany
          :show="showEditCompanyModal"
          :company="selectedCompany"
          @close="showEditCompanyModal = false"
          @saved="handleCompanySaved"
      />
    </Teleport>

    <!-- Edit Contact Modal -->
    <Teleport to="body">
      <DashboardEditContact
          :show="showEditContactModal"
          :contact="selectedContact"
          :userId="selectedUser?.id"
          @close="showEditContactModal = false"
          @saved="handleContactSaved"
      />
    </Teleport>

    <Teleport to="body">
      <DashboardEditReview
          :show="showEditReviewModal"
          :review="selectedReview"
          :userId="selectedUser?.id"
          :companies="companies"
          @close="showEditReviewModal = false"
          @saved="handleReviewSaved"
      />
    </Teleport>
  </div>
</template>

<script setup>
import {useRouter} from 'vue-router'
import {computed, nextTick, onMounted, onUnmounted, ref} from 'vue'
import {useAdminStore} from '@/store/adminStore.js'
import {usePermissions} from '@/composables/usePermissions.js' // ADD THIS
import {PERMISSIONS} from '@/config/adminPermissions.js' // ADD THIS
import adminApi from '../../services/adminApi'
import {VITE_FRONTEND_URL} from "@/config.js";
import QRCode from "qrcode";
import DashboardEditCompany from '../../components/admin/DashboardCompany.vue'
import DashboardEditContact from '../../components/admin/DashboardContact.vue'
import DashboardEditReview from '../../components/admin/DashboardReview.vue'
import {useModalScrollLock} from '@/composables/useModalScrollLock' // ADD THIS LINE

const moreMenuOpen = ref(false)

const {can, isSuperAdmin, role} = usePermissions()
const router = useRouter()

const showEditReviewModal = ref(false)
const selectedReview = ref(null)

const showQrPopup = ref(false);
const qrCanvas = ref(null);
const qrUrl = ref("");
const qrName = ref("");

const isMobile = ref(false)

// ADD THESE NEW REFS
const showEditCompanyModal = ref(false)
const showEditContactModal = ref(false)
const selectedCompany = ref(null)
const selectedContact = ref(null)

const adminStore = useAdminStore()
const searchQuery = ref('')
const filterProvider = ref('all')
const showModal = ref(false)
const selectedUser = ref(null)
const activeTab = ref('companies')
const companies = ref([])
const contacts = ref([])
const loadingData = ref(false)
const updatedLimits = ref({companyLimit: 0, contactLimit: 0})
const originalLimits = ref({companyLimit: 0, contactLimit: 0})
const savingLimits = ref(false)

const selectedCompanyFilter = ref('all')

// Pagination
const currentPage = ref(1);
const itemsPerPage = 10; // you can change this

// Sorting
const sortOrder = ref("newest"); // "newest" or "oldest"

// Add these new refs for create mode
const isCreatingCompany = ref(false)
const isCreatingContact = ref(false)

const review = ref([])
const canCreateReview = computed(() => {
  if (!selectedUser.value) return false
  const reviewCount = review.value.length
  return reviewCount < selectedUser.value.reviewLimit
})

// Add these computed properties
const canCreateCompany = computed(() => {
  if (!selectedUser.value) return false
  const companyCount = companies.value.length
  return companyCount < selectedUser.value.companyLimit
})

const canCreateContact = computed(() => {
  if (!selectedUser.value) return false
  const contactCount = contacts.value.length
  return contactCount < selectedUser.value.contactLimit
})

const createCompany = () => {
  if (!can(PERMISSIONS.EDIT_COMPANY)) {
    alert('You do not have permission to create companies')
    return
  }

  selectedCompany.value = {
    userId: selectedUser.value.id,
    // No id means it's a new company
  }
  showEditCompanyModal.value = true
}

const createContact = () => {
  if (!can(PERMISSIONS.EDIT_CONTACT)) {
    alert('You do not have permission to create contacts')
    return
  }

  selectedContact.value = {
    userId: selectedUser.value.id,
    // No id means it's a new contact
  }
  showEditContactModal.value = true
}


const sortedUsers = computed(() => {
  const users = [...filteredUsers.value];

  return users.sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);

    return sortOrder.value === "newest"
        ? dateB - dateA   // New → Old
        : dateA - dateB;  // Old → New
  });
});


const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return sortedUsers.value.slice(start, start + itemsPerPage);
});

const totalPages = computed(() =>
    Math.ceil(sortedUsers.value.length / itemsPerPage)
);


onMounted(() => {
  console.log("🔍 Current role:", role.value)
  console.log("🔍 Is Super Admin:", isSuperAdmin.value)
  console.log("🔍 Admin store role:", adminStore.role)
  console.log("🔍 Admin store admin:", adminStore.admin)
  console.log("🔍 Can edit company:", can(PERMISSIONS.EDIT_COMPANY))

  adminStore.fetchUsers()
})


// Replace the existing filteredContacts computed property with:
const filteredContacts = computed(() => {
  if (selectedCompanyFilter.value === 'all') {
    return contacts.value
  }
  return contacts.value.filter(contact => contact.companyId === Number(selectedCompanyFilter.value))
})

// Add this new computed property to get company name for each contact:
const getCompanyName = (companyId) => {
  const company = companies.value.find(c => c.id === companyId)
  return company?.companyName || '-'
}

const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768
}

useModalScrollLock(showModal)
useModalScrollLock(showQrPopup)
useModalScrollLock(showEditCompanyModal)
useModalScrollLock(showEditContactModal)
useModalScrollLock(showEditReviewModal)
useModalScrollLock(moreMenuOpen)


// Update editCompany function
function editCompany(company) {
  if (!can(PERMISSIONS.EDIT_COMPANY)) {
    alert('You do not have permission to edit companies')
    return
  }

  selectedCompany.value = {
    ...company,
    userId: selectedUser.value.id
  }
  showEditCompanyModal.value = true
}

function editContact(contact) {
  if (!can(PERMISSIONS.EDIT_CONTACT)) {
    alert('You do not have permission to edit contacts')
    return
  }

  selectedContact.value = contact
  showEditContactModal.value = true
}

async function handleCompanySaved() {
  showEditCompanyModal.value = false
  selectedCompany.value = null
  if (selectedUser.value) {
    await fetchUserData(selectedUser.value.id)
  }
}

async function handleContactSaved() {
  showEditContactModal.value = false
  selectedContact.value = null
  if (selectedUser.value) {
    await fetchUserData(selectedUser.value.id)
  }
}

async function openQrPopup1(contact) {
  const phone = contact.mobile.replace(/\D/g, "");
  qrUrl.value = `${VITE_FRONTEND_URL}/${phone}`;
  qrName.value = `${contact.firstName} ${contact.lastName}`;
  showQrPopup.value = true;
  await nextTick();
  await generatePlainQr();
}


async function generatePlainQr() {
  const canvas = qrCanvas.value;
  if (!canvas) return;

  await QRCode.toCanvas(canvas, qrUrl.value, {
    width: 280,
    margin: 2,
    color: {
      dark: "#000000",
      light: "#ffffff"
    }
  });
}


async function downloadQr() {
  const qr = qrCanvas.value;
  if (!qr) return;

  const poster = document.createElement("canvas");
  poster.width = 600;
  poster.height = 900;

  const ctx = poster.getContext("2d");

  // Background
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, poster.width, poster.height);

  // Draw QR
  const qrSize = 350;
  const qrY = 120;

  ctx.drawImage(
      qr,
      poster.width / 2 - qrSize / 2,
      qrY,
      qrSize,
      qrSize
  );

  // Bottom Text
  ctx.fillStyle = "#000";
  ctx.font = "bold 32px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Scan to view my", poster.width / 2, 540);
  ctx.fillText("Digital Business Card", poster.width / 2, 590);

  // Download
  const link = document.createElement("a");
  link.download = `${qrName.value}-QR.png`;
  link.href = poster.toDataURL("image/png");
  link.click();
}


async function sharePoster() {
  const qr = qrCanvas.value;
  if (!qr) return;

  const poster = document.createElement("canvas");
  poster.width = 600;
  poster.height = 900;
  const ctx = poster.getContext("2d");

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, poster.width, poster.height);

  // Draw QR
  const qrSize = 350;
  const qrY = 120;

  ctx.drawImage(
      qr,
      poster.width / 2 - qrSize / 2,
      qrY,
      qrSize,
      qrSize
  );

  // Text
  ctx.fillStyle = "#000";
  ctx.font = "bold 32px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Scan to view my", poster.width / 2, 540);
  ctx.fillText("Digital Business Card", poster.width / 2, 590);

  // Convert to Blob
  poster.toBlob(async (blob) => {
    const file = new File([blob], `${qrName.value}-digital-card.png`, {type: "image/png"});

    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Digital Business Card",
          text: "Scan this QR to view my Digital Card!",
          files: [file],
        });
      } catch (err) {
        console.log("Share canceled or failed:", err);
      }
    } else {
      alert("Sharing not supported on this device.");
    }
  });
}


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
  const cleanNumber = mobile.replace(/[\s\-+]/g, '')
  return `/${cleanNumber}`
}

async function openUserDetails(user) {
  selectedUser.value = user
  showModal.value = true
  activeTab.value = 'companies'
  selectedCompanyFilter.value = 'all'

  // Mobile scroll lock (only on screens <= 768px)
  if (window.innerWidth <= 768) {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop
    document.body.style.overflow = 'hidden'
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollPosition}px`
    document.body.style.left = '0'
    document.body.style.right = '0'
    document.body.style.width = '100%'
    document.body.style.touchAction = 'none'
    document.body.setAttribute('data-scroll-pos', scrollPosition)
  }

  updatedLimits.value = {
    companyLimit: user.companyLimit || 1,
    contactLimit: user.contactLimit || 1
  }
  originalLimits.value = {...updatedLimits.value}

  await fetchUserData(user.id)
}

onMounted(() => {
  console.log("🔍 Current role:", role.value)
  console.log("🔍 Is Super Admin:", isSuperAdmin.value)
  console.log("🔍 Admin store role:", adminStore.role)
  console.log("🔍 Admin store admin:", adminStore.admin)
  console.log("🔍 Can edit company:", can(PERMISSIONS.EDIT_COMPANY))

  adminStore.fetchUsers()

  // ADD THESE TWO LINES:
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

// ADD THIS NEW onUnmounted HOOK (if you don't have one already)
onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)

  if (showModal.value && window.innerWidth <= 768) {
    const scrollPos = document.body.getAttribute('data-scroll-pos') || '0'
    document.body.style.overflow = ''
    document.body.style.position = ''
    document.body.style.top = ''
    document.body.style.left = ''
    document.body.style.right = ''
    document.body.style.width = ''
    document.body.style.touchAction = ''
    document.body.removeAttribute('data-scroll-pos')
    window.scrollTo(0, parseInt(scrollPos))
  }
})

async function fetchUserData(userId) {
  loadingData.value = true
  try {
    const companiesRes = await adminApi.get(`/user/${userId}/companies`)
    companies.value = companiesRes.data.companies || []

    const contactsRes = await adminApi.get(`/user/${userId}/contacts`)
    contacts.value = contactsRes.data.contacts || []

    // ADD THIS:
    const reviewsRes = await adminApi.get(`/user/${userId}/reviews`)
    review.value = reviewsRes.data.reviews || []

  } catch (err) {
    console.error('Error fetching user data:', err)
    companies.value = []
    contacts.value = []
    review.value = []
  } finally {
    loadingData.value = false
  }
}

const createReview = () => {
  if (!can(PERMISSIONS.EDIT_REVIEW)) {
    alert('You do not have permission to create reviews')
    return
  }

  selectedReview.value = {
    userId: selectedUser.value.id,
    // No id means it's a new review
  }
  showEditReviewModal.value = true
}
const editReview = (reviewItem) => {
  if (!can(PERMISSIONS.EDIT_REVIEW)) {
    alert('You do not have permission to edit reviews')
    return
  }

  selectedReview.value = reviewItem
  showEditReviewModal.value = true
}

async function handleReviewSaved() {
  showEditReviewModal.value = false
  selectedReview.value = null
  if (selectedUser.value) {
    await fetchUserData(selectedUser.value.id)
  }
}


const deleteReview = async (reviewItem) => {
  if (!can(PERMISSIONS.DELETE_REVIEW)) {
    alert('You do not have permission to delete reviews')
    return
  }

  if (!confirm(`Are you sure you want to delete the review for ${reviewItem.branchName}?`)) return

  try {
    await adminApi.delete(`/user/${selectedUser.value.id}/review/${reviewItem.id}`)
    alert('✅ Review deleted successfully')
    await fetchUserData(selectedUser.value.id)
  } catch (err) {
    console.error('Error deleting review:', err)
    alert(err.response?.data?.message || 'Failed to delete review')
  }
}

async function openReviewShareModal(reviewItem) {
  try {
    const res = await adminApi.post(`/dashboard/reviews/${reviewItem.id}/generate-share`, {}, {
      headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}
    });
    window.open(res.data.shareUrl, '_blank');
  } catch (err) {
    console.error("❌ openReviewShareModal error:", err);
    alert("Failed to open review page: " + (err.response?.data?.message || err.message));
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
  if (!can(PERMISSIONS.EDIT_USER_LIMITS)) {
    alert('You do not have permission to edit user limits')
    return
  }

  if (!selectedUser.value || savingLimits.value) return

  savingLimits.value = true
  try {
    await adminApi.patch(`/user/${selectedUser.value.id}/limits`, {
      companyLimit: updatedLimits.value.companyLimit,
      contactLimit: updatedLimits.value.contactLimit
    })

    originalLimits.value = {...updatedLimits.value}
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
  // Unlock scroll on mobile before closing
  if (window.innerWidth <= 768) {
    const scrollPos = document.body.getAttribute('data-scroll-pos') || '0'
    document.body.style.overflow = ''
    document.body.style.position = ''
    document.body.style.top = ''
    document.body.style.left = ''
    document.body.style.right = ''
    document.body.style.width = ''
    document.body.style.touchAction = ''
    document.body.removeAttribute('data-scroll-pos')
    window.scrollTo(0, parseInt(scrollPos))
  }

  showModal.value = false
  selectedUser.value = null
  companies.value = []
  contacts.value = []
  review.value = []
}

async function deleteUser(userId) {
  if (!can(PERMISSIONS.DELETE_USER)) {
    alert('You do not have permission to delete users')
    return
  }

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

.desktop-data-view {
  display: block;
}

.mobile-data-view {
  display: none;
}

.admin-role-banner{
  width: 20%;
  display: flex;
}

/* Mobile Card Styles for Companies/Contacts/Reviews */
.data-card {
  background: white;
  border: 1px solid #e5e1dc;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
}

.data-card:active {
  background: #f8f6f4;
  transform: scale(0.98);
}

.data-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e5e1dc;
}

.data-card-title {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 0;
}

.data-card-icon {
  font-size: 1.25rem;
  flex-shrink: 0;
}

.data-card-name {
  font-size: 1rem;
  font-weight: 700;
  color: #2d1f1a;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.data-card-status {
  flex-shrink: 0;
}

.data-card-body {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 12px;
}

.data-card-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.data-card-label {
  font-size: 0.75rem;
  color: #8a7b75;
  font-weight: 500;
  flex-shrink: 0;
}

.data-card-value {
  font-size: 0.875rem;
  font-weight: 600;
  color: #2d1f1a;
  text-align: right;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}

.data-card-value.link {
  color: #5c4033;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.data-card-value.link:active {
  color: #3e2a23;
}

.data-card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid #e5e1dc;
  gap: 8px;
}

.data-card-date {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  color: #8a7b75;
}

.data-card-actions {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.btn-card-action {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 10px;
  background: linear-gradient(135deg, #f8f6f4 0%, #f0ede8 100%);
  color: #5c4033;
  border-radius: 6px;
  text-decoration: none;
  font-size: 0.75rem;
  font-weight: 600;
  transition: all 0.2s;
  white-space: nowrap;
  border: 1px solid #e5e1dc;
  cursor: pointer;
}

.btn-card-action:active {
  background: linear-gradient(135deg, #5c4033 0%, #3e2a23 100%);
  color: white;
  transform: scale(0.95);
}

.btn-card-action.delete {
  background: #fee2e2;
  color: #dc2626;
  border-color: #fecaca;
}

.btn-card-action.delete:active {
  background: #fecaca;
}

.btn-card-action svg {
  width: 12px;
  height: 12px;
}

/* Mobile: Show cards, hide tables */
@media (max-width: 768px) {
  .desktop-data-view {
    display: none !important;
  }

  .mobile-data-view {
    display: block;
  }

  /* Override the table container on mobile */
  .table-container {
    border: none;
    overflow: visible;
  }

  /* Adjust company filter for mobile */
  .company-filter-section {
    position: sticky;
    top: 0;
    z-index: 10;
    background: white;
    margin: -16px -16px 16px -16px;
    padding: 12px 16px;
    border-bottom: 1px solid #e5e1dc;
  }

  /* Make action buttons stack better on very small screens */
  @media (max-width: 380px) {
    .data-card-actions {
      width: 100%;
    }

    .btn-card-action {
      flex: 1;
      justify-content: center;
      min-width: 0;
    }
  }
}

/* Tablet: Keep desktop view but make it more compact */
@media (min-width: 769px) and (max-width: 1024px) {
  .data-table th,
  .data-table td {
    padding: 10px;
    font-size: 0.85rem;
  }

  .btn-view-card {
    padding: 5px 10px;
    font-size: 0.75rem;
  }
}

/* Handle landscape mobile specially */
@media (max-width: 768px) and (orientation: landscape) {
  .data-card {
    padding: 12px;
  }

  .data-card-body {
    gap: 8px;
  }

  .data-card-footer {
    padding-top: 10px;
  }
}


.admin-main {
  flex: 1;
  margin-left: 260px;
  display: flex;
  flex-direction: column;
  transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-width: 0;
  will-change: margin-left;
  /* ADD: Prepare for scroll lock */
  height: 100vh;
  overflow: hidden; /* Changed from auto */
}

.admin-content {
  flex: 1;
  padding: 32px;
  overflow-y: auto; /* Changed from overflow-x: auto */
  overflow-x: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Mobile with bottom navigation */
.admin-main.has-bottom-nav {
  margin-left: 0;
  padding-bottom: calc(70px + env(safe-area-inset-bottom));
}

/* ————————————————————————
   TABLE CONTROLS WRAPPER
———————————————————————— */
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: linear-gradient(135deg, #f8f6f4 0%, #f0ede8 100%);
  color: #5c4033;
  border-radius: 6px;
  text-decoration: none;
  font-size: 0.8rem;
  font-weight: 600;
  transition: all 0.2s;
  white-space: nowrap;
  border: 1px solid #e5e1dc;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #5c4033 0%, #3e2a23 100%);
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(92, 64, 51, 0.25);
  border-color: #5c4033;
}


.table-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e1dc;
  background: #faf9f7;
}

/* ————————————————————————
   SEARCH BOX
———————————————————————— */
.search-box {
  position: relative;
  flex: 1; /* takes full-width on left */
  min-width: 200px;
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #8a7b75;
  pointer-events: none;
}

.search-input {
  width: 93%;
  padding: 12px 16px 12px 48px;
  border: 1px solid #e5e1dc;
  border-radius: 12px;
  font-size: 0.95rem;
  background: white;
  transition: border-color 0.2s, box-shadow 0.2s;
  color: #2d1f1a;
}

.search-input:focus {
  outline: none;
  border-color: #5c4033;
  box-shadow: 0 0 0 3px rgba(92, 64, 51, 0.1);
}

/* ————————————————————————
   FILTER SELECT BOXES
———————————————————————— */
.filter-select {
  padding: 12px 16px;
  border: 1px solid #e5e1dc;
  border-radius: 12px;
  font-size: 0.95rem;
  background: white;
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s;
  min-width: 160px;
  height: 48px;
  font-weight: 500;
  color: #2d1f1a;
}

.filter-select:focus {
  outline: none;
  border-color: #5c4033;
  box-shadow: 0 0 0 3px rgba(92, 64, 51, 0.1);
}

/* Group filters to the right */
.table-controls select {
  margin-left: auto;
}

/* ————————————————————————
   PAGINATION STYLING
———————————————————————— */
.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin: 24px 0;
}

.page-btn {
  background: #1a472a;
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.page-btn:hover:not(:disabled) {
  background: #153a22;
}

.page-btn:disabled {
  background: #cfcfcf;
  cursor: not-allowed;
}

.page-info {
  font-weight: 600;
  font-size: 0.95rem;
  color: #2d1f1a;
}

/* ————————————————————————
   RESPONSIVE
———————————————————————— */
@media (max-width: 768px) {
  .table-controls {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-select {
    width: 100%;
  }
}


.no-permission-badge {
  padding: 6px 12px;
  background: #fee2e2;
  color: #991b1b;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
}

.view-only-text {
  color: #8a7b75;
  font-size: 0.8rem;
  font-style: italic;
}

.role-indicator {
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  text-align: center;
  margin: 12px 32px;
}

.role-indicator.super {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  color: #78350f;
  border: 1px solid #fcd34d;
}

.role-indicator.normal {
  background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%);
  color: #3730a3;
  border: 1px solid #a5b4fc;
}

.company-filter-section {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  padding: 16px;
  background: linear-gradient(135deg, #f8f6f4 0%, #f1ede8 100%);
  border-radius: 12px;
  border: 1px solid #e5e1dc;
}

.filter-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #4a3f3a;
  white-space: nowrap;
}

.company-filter-select {
  flex: 1;
  padding: 10px 14px;
  border: 1px solid #e5e1dc;
  border-radius: 8px;
  font-size: 0.9rem;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
  color: #2d1f1a;
  font-weight: 500;
}

.company-filter-select:focus {
  outline: none;
  border-color: #5c4033;
  box-shadow: 0 0 0 3px rgba(92, 64, 51, 0.1);
}

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

.btn-edit {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  color: #1e40af;
  border-radius: 6px;
  border: 1px solid #93c5fd;
  font-size: 0.8rem;
  font-weight: 600;
  transition: all 0.2s;
  white-space: nowrap;
  cursor: pointer;
}

.btn-edit:hover {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}

.btn-create {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #5c4033 0%, #3e2a23 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(92, 64, 51, 0.3);
}

.btn-create:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(92, 64, 51, 0.4);
}

.users-table-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(45, 31, 26, 0.08);
  overflow: hidden;
  transition: all 0.2s;
  border: 2px solid #e5e1dc;
}

.users-table-card:hover {
  box-shadow: 0 4px 16px rgba(45, 31, 26, 0.12);
}

.table-wrapper {
  overflow-x: auto;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
}

.users-table thead {
  background: #f8f6f4;
}

.users-table th {
  padding: 16px;
  text-align: left;
  font-weight: 600;
  color: #4a3f3a;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid #e5e1dc;
}

.users-table td {
  padding: 16px;
  border-bottom: 1px solid #e5e1dc;
  font-size: 0.95rem;
  color: #2d1f1a;
}

.users-table tbody tr {
  transition: all 0.15s;
}

.clickable-row {
  cursor: pointer;
}

.clickable-row:hover {
  background: #f8f6f4;
  transform: scale(1.002);
}

.user-name {
  font-weight: 600;
  color: #2d1f1a;
}

.user-email {
  color: #6b5d57;
  font-size: 0.9rem;
}

.text-center {
  text-align: center;
  font-weight: 600;
}

.text-muted {
  color: #8a7b75;
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
  background: linear-gradient(135deg, #fef3e2 0%, #fde8c5 100%);
  color: #5c4033;
}

.badge.local {
  background: linear-gradient(135deg, #f0ede8 0%, #e5e1dc 100%);
  color: #3e2a23;
}

.badge.self {
  background: linear-gradient(135deg, #e8e3dd 0%, #d4cfc8 100%);
  color: #2d1f1a;
}

.badge.admin {
  background: linear-gradient(135deg, #fef3e2 0%, #f5e6c8 100%);
  color: #5c4033;
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
  color: #8a7b75;
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
  color: #5c4033;
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
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  background: rgba(45, 31, 26, 0.8);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99999;
  padding: 20px;
  margin: 0;
  transform: none;
  touch-action: none; /* Prevent touch scrolling on overlay */
}

.modal-container {
  background: white;
  border-radius: 20px;
  width: 100%;
  max-width: 1200px;
  max-height: 85vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.3);
  border: 2px solid #e5e1dc;
  position: relative;
  margin: 0;
  animation: modalSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overscroll-behavior: contain; /* ADD THIS */
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px;
  border-bottom: 1px solid #e5e1dc;
  background: linear-gradient(135deg, #f8f6f4 0%, #f1ede8 100%);
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
  background: linear-gradient(135deg, #5c4033 0%, #3e2a23 100%);
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
  color: #2d1f1a;
}

.modal-subtitle {
  margin: 0;
  color: #6b5d57;
  font-size: 0.95rem;
}

.btn-close {
  padding: 8px;
  background: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  color: #6b5d57;
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
  border-bottom: 1px solid #e5e1dc;
  display: flex;
  gap: 16px;
  align-items: center;
}

.limit-card {
  flex: 1;
  padding: 16px;
  background: linear-gradient(135deg, #f8f6f4 0%, #f1ede8 100%);
  border-radius: 12px;
  border: 1px solid #e5e1dc;
}

.limit-header {
  display: block;
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
  color: #6b5d57;
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
  color: #2d1f1a;
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
  color: #5c4033;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(45, 31, 26, 0.1);
}

.btn-limit:hover:not(:disabled) {
  background: #5c4033;
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
  border-bottom: 2px solid #e5e1dc;
}

.tab-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 24px;
  background: transparent;
  border: none;
  border-bottom: 3px solid transparent;
  color: #6b5d57;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.95rem;
  margin-bottom: -2px;
}

.tab-button:hover {
  color: #5c4033;
  background: #f8f6f4;
}

.tab-button.active {
  color: #5c4033;
  border-bottom-color: #5c4033;
}

/* Tab Content */
.tab-content {
  flex: 1;
  min-height: 0; /* Important for flex scrolling */
  overflow-y: auto;
  overflow-x: hidden;
  padding: 24px 32px;
  background: white;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
}

.loading-state-small {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  color: #5c4033;
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
  color: #8a7b75;
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

/* Data Tables */
.table-container {
  overflow-x: auto;
  border-radius: 8px;
  border: 1px solid #e5e1dc;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.data-table thead {
  background: linear-gradient(135deg, #f8f6f4 0%, #f1ede8 100%);
}

.data-table th {
  padding: 12px 16px;
  text-align: left;
  font-weight: 600;
  color: #4a3f3a;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 2px solid #e5e1dc;
  white-space: nowrap;
}

.data-table tbody tr {
  transition: all 0.15s;
  border-bottom: 1px solid #f1ede8;
}

.data-table tbody tr:hover {
  background: #f8f6f4;
}

.data-table td {
  padding: 12px 16px;
  color: #2d1f1a;
  vertical-align: middle;
}

.td-id {
  color: #8a7b75;
  font-weight: 600;
  font-size: 0.85rem;
}

.td-name {
  font-weight: 600;
  color: #2d1f1a;
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
  color: #6b5d57;
  font-size: 0.85rem;
}

.td-designation {
  color: #6b5d57;
  font-size: 0.85rem;
  font-style: italic;
}

.td-date {
  color: #8a7b75;
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
  color: #5c4033;
  text-decoration: none;
  transition: all 0.2s;
}

.link-external:hover {
  color: #3e2a23;
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
  background: linear-gradient(135deg, #f8f6f4 0%, #f0ede8 100%);
  color: #5c4033;
  border-radius: 6px;
  text-decoration: none;
  font-size: 0.8rem;
  font-weight: 600;
  transition: all 0.2s;
  white-space: nowrap;
  border: 1px solid #e5e1dc;
}

.btn-view-card:hover {
  background: linear-gradient(135deg, #5c4033 0%, #3e2a23 100%);
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(92, 64, 51, 0.3);
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

.qr-popup-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99999;
}

.qr-popup {
  background: white;
  padding: 25px;
  border-radius: 12px;
  width: 330px;
  text-align: center;
  position: relative;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.qr-container {
  margin: 20px 0;
}

.close-btn {
  position: absolute;
  top: 8px;
  right: 10px;
  border: none;
  background: none;
  font-size: 22px;
  cursor: pointer;
}

.qr-actions button {
  padding: 10px 15px;
  margin: 5px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
}

.btn-download {
  background: #3b82f6;
  color: white;
}

.btn-share {
  background: #10b981;
  color: white;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes modalSlideUp {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes modalSlideDown {
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(100%);
    opacity: 0;
  }
}

/* ========================================
   MOBILE CARD VIEW STYLES
======================================== */

.mobile-card-view {
  display: none;
}

.mobile-user-cards {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.mobile-user-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  border: 1px solid #e5e1dc;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
  cursor: pointer;
}

.mobile-user-card:active {
  background: #f8f6f4;
  transform: scale(0.98);
}

/* Card Header */
.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e5e1dc;
}

.user-avatar-mobile {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #5c4033 0%, #3e2a23 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  font-weight: 700;
  flex-shrink: 0;
}

.card-header-info {
  flex: 1;
  min-width: 0;
}

.card-header-info .user-name {
  font-size: 1rem;
  font-weight: 700;
  color: #2d1f1a;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-header-info .user-email {
  font-size: 0.8rem;
  color: #6b5d57;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.provider-badge-mobile {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  flex-shrink: 0;
}

.provider-badge-mobile.google {
  background: linear-gradient(135deg, #fef3e2 0%, #fde8c5 100%);
}

.provider-badge-mobile.local {
  background: linear-gradient(135deg, #f0ede8 0%, #e5e1dc 100%);
}

/* Card Body */
.card-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 12px;
}

.detail-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-label {
  font-size: 0.75rem;
  color: #8a7b75;
  font-weight: 500;
}

.detail-value {
  font-size: 0.875rem;
  font-weight: 600;
  color: #2d1f1a;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.badge-small {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 700;
  white-space: nowrap;
  text-align: center;
}

.badge-small.self {
  background: linear-gradient(135deg, #e8e3dd 0%, #d4cfc8 100%);
  color: #2d1f1a;
}

.badge-small.admin {
  background: linear-gradient(135deg, #fef3e2 0%, #f5e6c8 100%);
  color: #5c4033;
}

.badge-small.google {
  background: linear-gradient(135deg, #fef3e2 0%, #fde8c5 100%);
  color: #5c4033;
}

.limit-badge {
  font-size: 1.25rem;
  font-weight: 700;
  color: #5c4033;
  line-height: 1;
}

/* Card Footer */
.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid #e5e1dc;
}

.joined-date {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  color: #8a7b75;
}

.joined-date svg {
  flex-shrink: 0;
}

.btn-delete-mobile {
  width: 32px;
  height: 32px;
  padding: 0;
  background: #fee2e2;
  color: #dc2626;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.btn-delete-mobile:active {
  background: #fecaca;
  transform: scale(0.95);
}

/* ========================================
TABLET RESPONSIVE (769px - 1024px)
======================================== */
@media (min-width: 769px) and (max-width: 1024px) {
  .users-table th,
  .users-table td {
    padding: 12px;
    font-size: 0.875rem;
  }

  .modal-container {
    max-width: 95%;
  }

  .limits-section {
    gap: 12px;
  }

  .limit-value {
    font-size: 1.5rem;
  }

  .data-table th,
  .data-table td {
    padding: 10px 12px;
    font-size: 0.85rem;
  }
}

/* ========================================
MOBILE RESPONSIVE (≤ 768px)
======================================== */
@media (max-width: 768px) {
  .admin-role-banner{
    width: 200px;
  }

  .admin-users-page {
    gap: 20px;
  }

  .page-header {
    flex-direction: column;
    align-items: stretch;
  }

  .btn-create {
    width: 100%;
    justify-content: center;
  }

  .role-indicator {
    margin: 8px 16px;
    font-size: 0.8rem;
  }

  .table-controls {
    flex-direction: column;
    padding: 16px;
    gap: 12px;
  }

  .search-box,
  .search-input {
    width: 91.8%;
  }

  .filter-select {
    width: 100%;
    margin-left: 0;
  }

  .users-table,
  .desktop-table-view {
    display: none !important;
  }

  .mobile-card-view {
    display: block;
  }

  .table-wrapper {
    padding: 12px;
  }

  .pagination-controls {
    flex-wrap: wrap;
    gap: 8px;
    margin: 16px 0;
  }

  .page-btn {
    padding: 6px 12px;
    font-size: 0.85rem;
  }

  .page-info {
    font-size: 0.85rem;
    width: 100%;
    text-align: center;
  }

  /* Modal - Mobile */
  /* Modal - Mobile FULLSCREEN */
  .modal-overlay {
    padding: 0;
    align-items: stretch;
    justify-content: stretch;
    backdrop-filter: blur(4px);
  }

  .modal-container {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100vh;
    height: 100dvh; /* Dynamic viewport height */
    max-width: 100%;
    max-height: 100vh;
    border-radius: 0; /* No rounded corners on mobile */
    margin: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    overscroll-behavior: contain;
  }

  /* Slide up animation for mobile */
  .modal-fade-enter-active .modal-container {
    animation: modalSlideUp 0.3s ease-out !important;
  }

  .modal-fade-leave-active .modal-container {
    animation: modalSlideDown 0.25s ease-in !important;
  }

  .modal-header {
    padding: 16px 20px;
    flex-shrink: 0; /* Prevent header from shrinking */
  }
  .user-info {
    gap: 12px;
  }

  .user-avatar {
    width: 48px;
    height: 48px;
    font-size: 1.25rem;
  }

  .modal-title {
    font-size: 1.125rem;
  }

  .modal-subtitle {
    font-size: 0.85rem;
  }

  .limits-section {
    flex-direction: column;
    padding: 16px 20px;
    gap: 12px;
    flex-shrink: 0; /* Prevent limits section from shrinking */
  }

  .limit-card {
    width: 100%;
  }

  .limit-value {
    font-size: 1.5rem;
  }

  .btn-save-limits {
    width: 100%;
    justify-content: center;
  }

  .tabs-container {
    padding: 0 16px;
    overflow-x: auto;
    gap: 4px;
    flex-shrink: 0; /* Prevent tabs from shrinking */
  }

  .tab-button {
    padding: 12px 16px;
    font-size: 0.85rem;
    white-space: nowrap;
  }

  .tab-button svg {
    width: 16px;
    height: 16px;
  }

  .tab-content {
    flex: 1;
    min-height: 0; /* Critical for flex scrolling */
    max-height: none; /* Remove max-height restriction */
    padding: 16px;
    overflow-y: auto;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
    overscroll-behavior: contain;
  }

  .table-container {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .data-table {
    min-width: 700px;
    font-size: 0.85rem;
  }

  .data-table th,
  .data-table td {
    padding: 10px 12px;
    font-size: 0.8rem;
  }

  .btn-view-card {
    padding: 5px 10px;
    font-size: 0.75rem;
  }

  .company-filter-section {
    flex-direction: column;
    align-items: stretch;
    padding: 12px;
    gap: 8px;
  }

  .filter-label {
    font-size: 0.85rem;
  }

  .company-filter-select {
    width: 100%;
  }

  .empty-state,
  .loading-state,
  .loading-state-small {
    padding: 32px 16px;
  }

  .empty-state svg {
    width: 40px;
    height: 40px;
  }

  .empty-state p {
    font-size: 0.9rem;
  }

  .qr-popup {
    width: 90%;
    max-width: 320px;
    padding: 20px;
  }

  .qr-container canvas {
    max-width: 100%;
    height: auto;
  }

  .qr-actions {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .qr-actions button {
    width: 100%;
    margin: 0;
  }

  .btn-primary {
    width: 100%;
    justify-content: center;
  }
}

/* ========================================
SMALL MOBILE (≤ 480px)
======================================== */
@media (max-width: 480px) {
  .admin-users-page {
    gap: 16px;
  }

  .users-table-card {
    border-radius: 12px;
  }

  .table-controls {
    padding: 12px;
  }

  .search-input {
    font-size: 0.875rem;
    padding: 10px 12px 10px 42px;
  }

  .filter-select {
    font-size: 0.875rem;
    padding: 10px 12px;
    height: 42px;
  }

  .btn-create {
    padding: 10px 20px;
    font-size: 0.875rem;
  }

  .modal-header {
    padding: 12px 16px;
  }

  .modal-title {
    font-size: 1rem;
  }

  .limits-section {
    padding: 12px 16px;
  }

  .limit-card {
    padding: 12px;
  }

  .limit-header {
    margin-bottom: 8px;
  }

  .limit-icon {
    font-size: 1.1rem;
  }

  .limit-label {
    font-size: 0.75rem;
  }

  .limit-value {
    font-size: 1.25rem;
  }

  .btn-limit {
    width: 28px;
    height: 28px;
  }

  .tabs-container {
    padding: 0 12px;
  }

  .tab-button {
    padding: 10px 12px;
    font-size: 0.8rem;
    gap: 6px;
  }

  .tab-content {
    padding: 12px;
  }

  .data-table {
    min-width: 650px;
  }

  .page-btn {
    padding: 6px 10px;
    font-size: 0.8rem;
  }

  .mobile-user-card {
    padding: 14px;
  }

  .card-header {
    gap: 10px;
  }

  .user-avatar-mobile {
    width: 44px;
    height: 44px;
    font-size: 1.125rem;
  }

  .card-header-info .user-name {
    font-size: 0.9375rem;
  }

  .card-header-info .user-email {
    font-size: 0.75rem;
  }

  .provider-badge-mobile {
    width: 28px;
    height: 28px;
    font-size: 1rem;
  }

  .detail-row {
    gap: 10px;
  }

  .limit-badge {
    font-size: 1.125rem;
  }

  .joined-date {
    font-size: 0.7rem;
  }

  .btn-delete-mobile {
    width: 28px;
    height: 28px;
  }

  .btn-delete-mobile svg {
    width: 12px;
    height: 12px;
  }
}

/* ========================================
EXTRA SMALL MOBILE (≤ 360px)
======================================== */
@media (max-width: 360px) {
  .detail-row {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .detail-item {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}

/* ========================================
LANDSCAPE MOBILE
======================================== */
@media (max-width: 768px) and (orientation: landscape) {
  .modal-container {
    max-height: 85vh;
  }

  .tab-content {
    max-height: calc(85vh - 250px);
  }
}

/* ========================================
DESKTOP TABLE VISIBILITY
======================================== */
@media (min-width: 769px) {
  .mobile-card-view {
    display: none;
  }

  .desktop-table-view {
    display: block;
  }
}

</style>
