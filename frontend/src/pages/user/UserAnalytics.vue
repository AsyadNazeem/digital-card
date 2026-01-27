<template>
  <!-- ANALYTICS TAB -->
  <div v-if="activeTab === 'analytics'" class="content-card analytics-tab">
    <!-- Header -->
    <div class="analytics-header">
      <div class="header-left">
        <h2 class="card-title">📊 Analytics Dashboard</h2>
        <p class="analytics-subtitle">Track your contact card performance</p>
      </div>

      <div class="analytics-filters">
        <!-- Contact Filter -->
        <div class="filter-group">
          <label>Contact:</label>
          <select v-model="selectedContactId" class="form-input">
            <option value="all">All Contacts</option>
            <option
                v-for="contact in userContactsList"
                :key="contact.id"
                :value="contact.id"
            >
              {{ contact.name }} ({{ contact.mobile }})
            </option>
          </select>
        </div>

        <!-- Date Range Filter -->
        <div class="filter-group">
          <label>Date Range:</label>
          <select v-model="analyticsDateRange" class="form-input">
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Last 90 Days</option>
            <option value="365">Last Year</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Current Filter Display -->
    <div v-if="selectedContactId !== 'all'" class="active-filter-badge">
      <span class="filter-label">Showing analytics for:</span>
      <span class="filter-value">
        {{ userContactsList.find(c => c.id == selectedContactId)?.name }}
      </span>
      <button @click="selectedContactId = 'all'" class="clear-filter-btn">
        ✕ Clear
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="analyticsLoading" class="analytics-loading">
      <div class="spinner"></div>
      <p>Loading analytics...</p>
    </div>

    <!-- Analytics Content -->
    <div v-else class="analytics-content-wrapper">
      <div
          class="analytics-content"
          :class="{ blurred: !hasAnalyticsAccess }"
      >
        <!-- ALL your analytics content stays here -->

        <!-- Stats Cards - Enhanced Grid -->
        <div class="analytics-stats-grid">
          <div class="stat-card views">
            <div class="stat-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </div>
            <div class="stat-content">
              <p class="stat-label">Total Views</p>
              <p class="stat-value">{{ analyticsData.totalViews.toLocaleString() }}</p>
            </div>
          </div>

          <div class="stat-card clicks">
            <div class="stat-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 11l3 3L22 4"></path>
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
              </svg>
            </div>
            <div class="stat-content">
              <p class="stat-label">Total Clicks</p>
              <p class="stat-value">{{ analyticsData.totalClicks.toLocaleString() }}</p>
            </div>
          </div>

          <div class="stat-card visitors">
            <div class="stat-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              </svg>
            </div>
            <div class="stat-content">
              <p class="stat-label">Unique Visitors</p>
              <p class="stat-value">{{ analyticsData.uniqueVisitors.toLocaleString() }}</p>
            </div>
          </div>

          <div class="stat-card engagement">
            <div class="stat-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
              </svg>
            </div>
            <div class="stat-content">
              <p class="stat-label">Engagement Rate</p>
              <p class="stat-value">
                {{
                  analyticsData.totalViews > 0
                      ? ((analyticsData.totalClicks / analyticsData.totalViews) * 100).toFixed(1)
                      : 0
                }}%
              </p>
            </div>
          </div>

          <div class="stat-card conversions">
            <div class="stat-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
            </div>
            <div class="stat-content">
              <p class="stat-label">Contact Downloads</p>
              <p class="stat-value">{{ analyticsData.vcfDownloads.toLocaleString() }}</p>
              <p class="stat-sublabel">
                {{
                  analyticsData.totalViews > 0
                      ? ((analyticsData.vcfDownloads / analyticsData.totalViews) * 100).toFixed(1)
                      : 0
                }}% conversion
              </p>
            </div>
          </div>

          <div class="stat-card conversion-rate">
            <div class="stat-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 6L9 17l-5-5"></path>
              </svg>
            </div>
            <div class="stat-content">
              <p class="stat-label">Save Rate</p>
              <p class="stat-value">
                {{
                  analyticsData.totalClicks > 0
                      ? ((analyticsData.vcfDownloads / analyticsData.totalClicks) * 100).toFixed(1)
                      : 0
                }}%
              </p>
              <p class="stat-sublabel">of clicks save contact</p>
            </div>
          </div>
        </div>

        <!-- Charts Section -->
        <div v-if="hasAnalyticsAccess" class="analytics-charts">
          <!-- Timeline Chart -->
          <div class="chart-container timeline-chart full-width">
            <h3>📈 Views Over Time</h3>
            <div class="chart-wrapper">
              <canvas ref="timelineChart"></canvas>
            </div>
          </div>

          <!-- Click Distribution -->
          <div class="chart-container clicks-chart">
            <h3>🎯 Click Distribution</h3>
            <div class="chart-wrapper">
              <canvas ref="clicksChart"></canvas>
            </div>
          </div>

          <!-- Peak Hours Chart -->
          <div class="chart-container peak-hours-chart">
            <h3>⏰ Peak Activity Hours</h3>
            <div class="chart-wrapper">
              <canvas ref="peakHoursChart"></canvas>
            </div>
          </div>

          <!-- Detailed Clicks Breakdown Table -->
          <div class="chart-container clicks-table full-width">
            <h3>📊 Detailed Click Analysis</h3>

            <!-- Summary Cards -->
            <div class="click-summary-grid">
              <div class="summary-card">
                <span class="summary-icon">📞</span>
                <span class="summary-label">Communication</span>
                <span class="summary-value">{{ analyticsData.clickSummary?.communication || 0 }}</span>
              </div>
              <div class="summary-card">
                <span class="summary-icon">📱</span>
                <span class="summary-label">Social Media</span>
                <span class="summary-value">{{ analyticsData.clickSummary?.social || 0 }}</span>
              </div>
              <div class="summary-card">
                <span class="summary-icon">📄</span>
                <span class="summary-label">Content</span>
                <span class="summary-value">{{ analyticsData.clickSummary?.content || 0 }}</span>
              </div>
              <div class="summary-card">
                <span class="summary-icon">🧭</span>
                <span class="summary-label">Navigation</span>
                <span class="summary-value">{{ analyticsData.clickSummary?.navigation || 0 }}</span>
              </div>
              <div class="summary-card conversion-highlight">
                <span class="summary-icon">💾</span>
                <span class="summary-label">Conversions</span>
                <span class="summary-value">{{ analyticsData.clickSummary?.conversion || 0 }}</span>
              </div>
            </div>

            <!-- Detailed Table -->
            <div class="clicks-table-wrapper">
              <table class="analytics-table">
                <thead>
                <tr>
                  <th>Link Type</th>
                  <th>Clicks</th>
                  <th>Percentage</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="click in analyticsData.clickBreakdown" :key="click.clickType">
                  <td>
                  <span class="click-type-badge" :class="{'vcf-badge': click.clickType === 'save_contact'}">
                    {{ click.label }}
                  </span>
                  </td>
                  <td class="click-count">{{ click.count }}</td>
                  <td>
                    <div class="progress-bar-wrapper">
                      <div
                          class="progress-bar"
                          :class="{'vcf-progress': click.clickType === 'save_contact'}"
                          :style="{ width: `${(click.count / analyticsData.totalClicks) * 100}%` }"
                      ></div>
                      <span class="progress-text">
                      {{ ((click.count / analyticsData.totalClicks) * 100).toFixed(1) }}%
                    </span>
                    </div>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Device Breakdown -->
          <div class="chart-container device-chart">
            <h3>📱 Views by Device</h3>
            <div class="chart-wrapper">
              <canvas ref="deviceChart"></canvas>
            </div>
          </div>

          <!-- Browser Breakdown -->
          <div class="chart-container browser-chart">
            <h3>🌐 Browser Distribution</h3>
            <div class="chart-wrapper">
              <canvas ref="browserChart"></canvas>
            </div>
          </div>

          <!-- Geographic Distribution -->
          <div class="chart-container geo-chart full-width">
            <h3>🌍 Views by Country</h3>
            <div v-if="analyticsData.geoDistribution.length > 0" class="country-list">
              <div
                  v-for="(country, index) in analyticsData.geoDistribution"
                  :key="country.countryCode"
                  class="country-item"
              >
                <div class="country-rank">{{ index + 1 }}</div>
                <div class="country-flag">{{ country.countryCode }}</div>
                <div class="country-info">
                  <span class="country-name">{{ country.country }}</span>
                  <div class="country-bar-wrapper">
                    <div
                        class="country-bar"
                        :style="{
                        width: `${(country.count / analyticsData.geoDistribution[0].count) * 100}%`
                      }"
                    ></div>
                  </div>
                </div>
                <span class="country-count">{{ country.count }}</span>
              </div>
            </div>
            <div v-else class="empty-chart">
              <p>No geographic data available yet</p>
            </div>
          </div>

          <!-- Top Referrers -->
          <div v-if="analyticsData.topReferrers && analyticsData.topReferrers.length > 0"
               class="chart-container referrers-chart full-width">
            <h3>🔗 Top Referrers</h3>
            <div class="referrers-list">
              <div
                  v-for="(referrer, index) in analyticsData.topReferrers"
                  :key="index"
                  class="referrer-item"
              >
                <div class="referrer-rank">{{ index + 1 }}</div>
                <div class="referrer-info">
                  <span class="referrer-url">{{ referrer.referrer }}</span>
                  <div class="referrer-bar-wrapper">
                    <div
                        class="referrer-bar"
                        :style="{
                        width: `${(referrer.count / analyticsData.topReferrers[0].count) * 100}%`
                      }"
                    ></div>
                  </div>
                </div>
                <span class="referrer-count">{{ referrer.count }} views</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="!hasAnalyticsAccess" class="upgrade-overlay-analytics">
        <div class="upgrade-box">
          <h3>🔒 Analytics Locked</h3>
          <p>Upgrade your plan to unlock full analytics insights and performance tracking.</p>
          <button class="upgrade-btn" @click="$emit('open-upgrade')">
            View Plans
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed, nextTick, onMounted, ref, watch} from 'vue';
import api from '@/services/api.js';
import Chart from 'chart.js/auto';

const props = defineProps({
  activeTab: {
    type: String,
    required: true
  },
  contacts: {
    type: Array,
    default: () => []
  },
  userPlan: String
});

// State
const analyticsData = ref({
  totalViews: 0,
  totalClicks: 0,
  uniqueVisitors: 0,
  vcfDownloads: 0,
  geoDistribution: [],
  clickBreakdown: [],
  clickSummary: {},
  deviceBreakdown: [],
  browserBreakdown: [],
  topReferrers: [],
  peakHours: [],
  timeline: []
});

const analyticsDateRange = ref('30');
const analyticsLoading = ref(false);
const selectedContactId = ref('all');
const userContactsList = ref([]);

// Chart refs
const timelineChart = ref(null);
const clicksChart = ref(null);
const deviceChart = ref(null);
const browserChart = ref(null);
const peakHoursChart = ref(null);

// Chart instances
let timelineChartInstance = null;
let clicksChartInstance = null;
let deviceChartInstance = null;
let browserChartInstance = null;
let peakHoursChartInstance = null;

// Load analytics data
async function loadAnalytics() {
  if (!hasAnalyticsAccess.value) {
    analyticsLoading.value = false
    return
  }

  try {
    analyticsLoading.value = true;

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No authentication token found');
      alert('Please log in again');
      return;
    }

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(analyticsDateRange.value));

    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    const params = {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    };

    if (selectedContactId.value !== 'all') {
      params.contactId = selectedContactId.value;
    }

    const res = await api.get('/analytics/dashboard', {
      params,
      headers: {Authorization: `Bearer ${token}`}
    });

    analyticsData.value = res.data;

    await nextTick();

    setTimeout(() => {
      renderCharts();
    }, 100);

  } catch (error) {
    console.error('❌ Failed to load analytics:', error);
    alert(`Failed to load analytics: ${error.response?.data?.message || error.message}`);
  } finally {
    analyticsLoading.value = false;
  }
}

// Render all charts
function renderCharts() {
  renderTimelineChart();
  renderClicksChart();
  renderDeviceChart();
  renderBrowserChart();
  renderPeakHoursChart();
}

// Chart rendering functions (keeping your existing logic)
function renderTimelineChart() {
  if (!timelineChart.value) return;
  if (timelineChartInstance) {
    timelineChartInstance.destroy();
    timelineChartInstance = null;
  }

  const timeline = analyticsData.value.timeline || [];
  if (timeline.length === 0) return;

  const ctx = timelineChart.value.getContext('2d');
  const labels = timeline.map(d => new Date(d.date).toLocaleDateString('en-US', {month: 'short', day: 'numeric'}));
  const data = timeline.map(d => parseInt(d.views) || 0);

  timelineChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Views',
        data,
        borderColor: '#6B4423',
        backgroundColor: 'rgba(107, 68, 35, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: '#6B4423',
        pointBorderColor: '#fff',
        pointBorderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {display: false},
        tooltip: {
          backgroundColor: 'rgba(107, 68, 35, 0.95)',
          padding: 12,
          titleColor: '#fff',
          bodyColor: '#fff',
          borderColor: '#8B5A3C',
          borderWidth: 1
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {precision: 0, color: '#6B4423'},
          grid: {color: 'rgba(107, 68, 35, 0.1)'}
        },
        x: {
          ticks: {color: '#6B4423'},
          grid: {display: false}
        }
      }
    }
  });
}

function renderClicksChart() {
  if (!clicksChart.value) return;
  if (clicksChartInstance) {
    clicksChartInstance.destroy();
    clicksChartInstance = null;
  }

  const clickBreakdown = analyticsData.value.clickBreakdown || [];
  if (clickBreakdown.length === 0) return;

  const ctx = clicksChart.value.getContext('2d');
  const labels = clickBreakdown.map(c => c.label || c.clickType);
  const data = clickBreakdown.map(c => parseInt(c.count) || 0);

  const colors = ['#6B4423', '#8B5A3C', '#A67C52', '#C19A6B', '#D4AF37', '#DEB887'];

  clicksChartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: colors,
        borderWidth: 3,
        borderColor: '#fff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {padding: 15, font: {size: 11}, color: '#6B4423'}
        },
        tooltip: {
          backgroundColor: 'rgba(107, 68, 35, 0.95)',
          borderColor: '#8B5A3C',
          borderWidth: 1
        }
      }
    }
  });
}

function renderDeviceChart() {
  if (!deviceChart.value) return;
  if (deviceChartInstance) {
    deviceChartInstance.destroy();
    deviceChartInstance = null;
  }

  const deviceBreakdown = analyticsData.value.deviceBreakdown || [];
  if (deviceBreakdown.length === 0) return;

  const ctx = deviceChart.value.getContext('2d');
  const labels = deviceBreakdown.map(d => {
    const type = d.deviceType || 'Unknown';
    return type.charAt(0).toUpperCase() + type.slice(1);
  });
  const data = deviceBreakdown.map(d => parseInt(d.count) || 0);

  deviceChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Views by Device',
        data,
        backgroundColor: '#6B4423',
        borderRadius: 8,
        borderSkipped: false
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {display: false},
        tooltip: {
          backgroundColor: 'rgba(107, 68, 35, 0.95)',
          borderColor: '#8B5A3C',
          borderWidth: 1
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {precision: 0, color: '#6B4423'},
          grid: {color: 'rgba(107, 68, 35, 0.1)'}
        },
        x: {
          ticks: {color: '#6B4423'},
          grid: {display: false}
        }
      }
    }
  });
}

function renderBrowserChart() {
  if (!browserChart.value) return;
  if (browserChartInstance) {
    browserChartInstance.destroy();
    browserChartInstance = null;
  }

  const browserBreakdown = analyticsData.value.browserBreakdown || [];
  if (browserBreakdown.length === 0) return;

  const ctx = browserChart.value.getContext('2d');
  const labels = browserBreakdown.map(b => b.browser || 'Unknown');
  const data = browserBreakdown.map(b => parseInt(b.count) || 0);

  const colors = ['#6B4423', '#8B5A3C', '#A67C52', '#C19A6B', '#D4AF37'];

  browserChartInstance = new Chart(ctx, {
    type: 'pie',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: colors,
        borderWidth: 3,
        borderColor: '#fff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {padding: 10, font: {size: 11}, color: '#6B4423'}
        },
        tooltip: {
          backgroundColor: 'rgba(107, 68, 35, 0.95)',
          borderColor: '#8B5A3C',
          borderWidth: 1
        }
      }
    }
  });
}

function renderPeakHoursChart() {
  if (!peakHoursChart.value) return;
  if (peakHoursChartInstance) {
    peakHoursChartInstance.destroy();
    peakHoursChartInstance = null;
  }

  const peakHours = analyticsData.value.peakHours || [];
  if (peakHours.length === 0) return;

  const ctx = peakHoursChart.value.getContext('2d');

  const allHours = Array.from({length: 24}, (_, i) => ({hour: i, count: 0}));
  peakHours.forEach(item => {
    allHours[item.hour] = {hour: item.hour, count: parseInt(item.count) || 0};
  });

  const labels = allHours.map(h => {
    const hour = h.hour;
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}${ampm}`;
  });

  const data = allHours.map(h => h.count);

  peakHoursChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Views',
        data,
        backgroundColor: '#6B4423',
        borderRadius: 6,
        borderSkipped: false
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {display: false},
        tooltip: {
          backgroundColor: 'rgba(107, 68, 35, 0.95)',
          borderColor: '#8B5A3C',
          borderWidth: 1
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {precision: 0, color: '#6B4423'},
          grid: {color: 'rgba(107, 68, 35, 0.1)'}
        },
        x: {
          ticks: {font: {size: 9}, color: '#6B4423'},
          grid: {display: false}
        }
      }
    }
  });
}

const hasAnalyticsAccess = computed(() => {
  return ['plus', 'pro'].includes(props.userPlan)
})


// Watchers
watch(() => props.contacts, (newContacts) => {
  if (newContacts && newContacts.length > 0) {
    userContactsList.value = newContacts.map(contact => ({
      id: contact.id,
      name: `${contact.firstName || ''} ${contact.lastName || ''}`.trim() || 'Unnamed Contact',
      mobile: contact.mobile || 'No phone'
    }));
  }
}, {immediate: true});

watch(selectedContactId, () => {
  if (props.activeTab === 'analytics') {
    loadAnalytics();
  }
});

watch(analyticsDateRange, () => {
  if (props.activeTab === 'analytics') {
    loadAnalytics();
  }
});

watch(
    () => props.activeTab,
    (newTab) => {
      if (newTab === 'analytics') {
        loadAnalytics()
      }
    },
    { immediate: true }
)

watch(() => props.userPlan, (val) => {
  if (!val) return

  console.log('PLAN UPDATED:', val)

  if (val === 'plus' || val === 'pro') {
    loadAnalytics()
  }
})





</script>

<style scoped>
.analytics-tab {
  background: transparent;
  padding: 0;
}

.analytics-header {
  background: #ffffff;
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.header-left {
  flex: 1;
  min-width: 250px;
}

.card-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
  letter-spacing: -0.02em;
}

.analytics-subtitle {
  color: #6b7280;
  font-size: 0.9375rem;
  margin: 0;
}

.analytics-filters {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-group label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #6B4423;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.form-input {
  padding: 0.75rem 1rem;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  font-size: 0.875rem;
  min-width: 180px;
  color: #1f2937;
  transition: all 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #8B5A3C;
  box-shadow: 0 0 0 3px rgba(139, 90, 60, 0.1);
}

.active-filter-badge {
  background: #FDF8F3;
  border: 1px solid #F5E6D3;
  border-radius: 10px;
  padding: 1rem 1.5rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  box-shadow: 0 2px 4px rgba(107, 68, 35, 0.05);
}

.filter-label {
  font-size: 0.875rem;
  color: #6b7280;
}

.filter-value {
  font-weight: 600;
  color: #6B4423;
}

.clear-filter-btn {
  margin-left: auto;
  padding: 0.375rem 0.875rem;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  color: #6b7280;
  font-size: 0.8125rem;
  cursor: pointer;
  transition: all 0.2s;
}

.clear-filter-btn:hover {
  background: #fef2f2;
  color: #dc2626;
  border-color: #fecaca;
}

.analytics-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  gap: 1rem;
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
}

.spinner {
  width: 3rem;
  height: 3rem;
  border: 4px solid #f3f4f6;
  border-top-color: #6B4423;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.analytics-loading p {
  color: #6b7280;
  font-size: 0.9375rem;
}

.analytics-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Stats Grid */
.analytics-stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.25rem;
}

.stat-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 1.75rem;
  display: flex;
  align-items: center;
  gap: 1.25rem;
  border: 1px solid #e5e7eb;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(107, 68, 35, 0.12);
  border-color: #FDF8F3;
}

.stat-icon {
  width: 4rem;
  height: 4rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(107, 68, 35, 0.15);
}

.stat-card.views .stat-icon {
  background: linear-gradient(135deg, #6B4423 0%, #8B5A3C 100%);
  color: white;
}

.stat-card.clicks .stat-icon {
  background: linear-gradient(135deg, #8B5A3C 0%, #A67C52 100%);
  color: white;
}

.stat-card.visitors .stat-icon {
  background: linear-gradient(135deg, #A67C52 0%, #C19A6B 100%);
  color: white;
}

.stat-card.engagement .stat-icon {
  background: linear-gradient(135deg, #C19A6B 0%, #D4AF37 100%);
  color: white;
}

.stat-card.conversions .stat-icon {
  background: linear-gradient(135deg, #D4AF37 0%, #DEB887 100%);
  color: white;
}

.stat-card.conversion-rate .stat-icon {
  background: linear-gradient(135deg, #6B4423 0%, #D4AF37 100%);
  color: white;
}

.stat-content {
  flex: 1;
}

.stat-label {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0 0 0.5rem 0;
  font-weight: 500;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
  line-height: 1;
}

.stat-sublabel {
  font-size: 0.75rem;
  color: #9ca3af;
  margin-top: 0.375rem;
  display: block;
}

/* Charts Section */
.analytics-charts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
  gap: 1.5rem;
}

.chart-container {
  background: #ffffff;
  border-radius: 12px;
  padding: 1.75rem;
  border: 1px solid #e5e7eb;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.2s;
}

.chart-container:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.chart-container.full-width {
  grid-column: 1 / -1;
}

.chart-container h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 1.5rem 0;
  letter-spacing: -0.01em;
}

.chart-wrapper {
  position: relative;
  height: 300px;
}

.chart-wrapper canvas {
  max-height: 300px;
}

/* Click Summary Grid */
.click-summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.summary-card {
  background: #FDF8F3;
  border: 1px solid #F5E6D3;
  border-radius: 10px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  text-align: center;
  transition: all 0.2s;
}

.summary-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(107, 68, 35, 0.1);
}

.summary-card.conversion-highlight {
  background: linear-gradient(135deg, #6B4423 0%, #8B5A3C 100%);
  color: white;
  border: none;
}

.summary-icon {
  font-size: 1.75rem;
}

.summary-label {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 500;
}

.summary-card.conversion-highlight .summary-label {
  color: rgba(255, 255, 255, 0.9);
}

.summary-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1f2937;
}

.summary-card.conversion-highlight .summary-value {
  color: white;
}

/* Analytics Table */
.clicks-table-wrapper {
  overflow-x: auto;
  border-radius: 8px;
}

.analytics-table {
  width: 100%;
  border-collapse: collapse;
}

.analytics-table thead tr {
  background: #FDF8F3;
  border-bottom: 2px solid #F5E6D3;
}

.analytics-table th {
  padding: 1rem 1.25rem;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 600;
  color: #6B4423;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.analytics-table tbody tr {
  border-bottom: 1px solid #f3f4f6;
  transition: background 0.15s;
}

.analytics-table tbody tr:hover {
  background: #FDF8F3;
}

.analytics-table td {
  padding: 1rem 1.25rem;
  font-size: 0.875rem;
  color: #1f2937;
}

.click-type-badge {
  display: inline-block;
  padding: 0.375rem 0.875rem;
  background: #f3f4f6;
  border-radius: 8px;
  font-size: 0.8125rem;
  font-weight: 500;
  color: #4b5563;
}

.click-type-badge.vcf-badge {
  background: linear-gradient(135deg, #6B4423 0%, #8B5A3C 100%);
  color: white;
}

.click-count {
  font-weight: 600;
  font-size: 1rem;
  color: #1f2937;
}

.progress-bar-wrapper {
  display: flex;
  align-items: center;
  gap: 1rem;
  max-width: 300px;
}

.progress-bar {
  flex: 1;
  height: 0.5rem;
  background: #e5e7eb;
  border-radius: 9999px;
  transition: width 0.3s ease;
  position: relative;
  overflow: hidden;
}

.progress-bar::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #A67C52 0%, #C19A6B 100%);
  width: 100%;
}

.progress-bar.vcf-progress::after {
  background: linear-gradient(135deg, #6B4423 0%, #D4AF37 100%);
}

.progress-text {
  font-size: 0.875rem;
  font-weight: 600;
  color: #6b7280;
  min-width: 3.5rem;
  text-align: right;
}

/* Country List */
.country-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.country-item {
  display: grid;
  grid-template-columns: 50px 70px 1fr 90px;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #FDF8F3;
  border-radius: 10px;
  transition: all 0.2s;
  border: 1px solid #F5E6D3;
}

.country-item:hover {
  background: #F5E6D3;
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(107, 68, 35, 0.1);
}

.country-rank {
  font-weight: 700;
  color: #6B4423;
  text-align: center;
  font-size: 1.125rem;
}

.country-flag {
  font-size: 2rem;
  text-align: center;
}

.country-info {
  flex: 1;
}

.country-name {
  font-weight: 600;
  color: #1f2937;
  display: block;
  margin-bottom: 0.625rem;
  font-size: 0.9375rem;
}

.country-bar-wrapper {
  width: 100%;
  height: 0.5rem;
  background: #e5e7eb;
  border-radius: 9999px;
  overflow: hidden;
}

.country-bar {
  height: 100%;
  background: linear-gradient(90deg, #6B4423 0%, #D4AF37 100%);
  border-radius: 9999px;
  transition: width 0.3s ease;
}

.country-count {
  font-weight: 700;
  color: #1f2937;
  text-align: right;
  font-size: 1.125rem;
}

/* Referrers List */
.referrers-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.referrer-item {
  display: grid;
  grid-template-columns: 50px 1fr 130px;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #FDF8F3;
  border-radius: 10px;
  border: 1px solid #F5E6D3;
  transition: all 0.2s;
}

.referrer-item:hover {
  background: #F5E6D3;
  transform: translateX(4px);
}

.referrer-rank {
  font-weight: 700;
  color: #6B4423;
  text-align: center;
  font-size: 1.125rem;
}

.referrer-info {
  flex: 1;
}

.referrer-url {
  font-weight: 600;
  color: #8B5A3C;
  display: block;
  margin-bottom: 0.625rem;
  word-break: break-all;
  font-size: 0.875rem;
}

.referrer-bar-wrapper {
  width: 100%;
  height: 0.5rem;
  background: #e5e7eb;
  border-radius: 9999px;
  overflow: hidden;
}

.referrer-bar {
  height: 100%;
  background: linear-gradient(90deg, #A67C52 0%, #D4AF37 100%);
  border-radius: 9999px;
}

.referrer-count {
  font-weight: 600;
  color: #6b7280;
  text-align: right;
  font-size: 0.9375rem;
}

.empty-chart {
  text-align: center;
  padding: 4rem 2rem;
  color: #9ca3af;
  font-size: 0.9375rem;
}

.analytics-content-wrapper {
  position: relative;
}

.blurred {
  filter: blur(6px);
  pointer-events: none;
  user-select: none;
}

/* Overlay */
.upgrade-overlay-analytics {
  position: absolute;
  inset: 0;
  background: rgba(253, 248, 243, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  border-radius: 12px;
}

.upgrade-box {
  background: #ffffff;
  padding: 2.5rem;
  border-radius: 16px;
  text-align: center;
  max-width: 400px;
  box-shadow: 0 10px 30px rgba(107, 68, 35, 0.25);
  border: 1px solid #F5E6D3;
}

.upgrade-box h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #6B4423;
  margin-bottom: 0.75rem;
}

.upgrade-box p {
  font-size: 0.95rem;
  color: #6b7280;
  margin-bottom: 1.5rem;
}

.upgrade-btn {
  padding: 0.75rem 1.75rem;
  background: linear-gradient(135deg, #6B4423 0%, #8B5A3C 100%);
  border: none;
  border-radius: 9999px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.upgrade-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(107, 68, 35, 0.3);
}


/* Mobile Responsive */
@media (max-width: 1200px) {
  .analytics-charts {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .analytics-header {
    flex-direction: column;
    padding: 1.5rem;
  }

  .card-title {
    font-size: 1.5rem;
  }

  .analytics-filters {
    width: 100%;
    flex-direction: column;
  }

  .filter-group {
    width: 100%;
  }

  .form-input {
    min-width: 0;
    width: 100%;
  }

  .analytics-stats-grid {
    grid-template-columns: 1fr;
  }

  .stat-card {
    padding: 1.25rem;
  }

  .stat-icon {
    width: 3.5rem;
    height: 3.5rem;
  }

  .stat-value {
    font-size: 1.75rem;
  }

  .analytics-charts {
    grid-template-columns: 1fr;
  }

  .chart-container {
    padding: 1.25rem;
  }

  .chart-wrapper {
    height: 250px;
  }

  .click-summary-grid {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 0.75rem;
  }

  .summary-card {
    padding: 0.875rem;
  }

  .summary-icon {
    font-size: 1.5rem;
  }

  .summary-value {
    font-size: 1.5rem;
  }

  .country-item {
    grid-template-columns: 35px 50px 1fr 70px;
    gap: 0.75rem;
    padding: 0.875rem;
  }

  .country-flag {
    font-size: 1.5rem;
  }

  .country-rank,
  .country-count {
    font-size: 1rem;
  }

  .referrer-item {
    grid-template-columns: 35px 1fr 110px;
    gap: 0.75rem;
    padding: 0.875rem;
  }

  .analytics-table {
    font-size: 0.8125rem;
  }

  .analytics-table th,
  .analytics-table td {
    padding: 0.75rem;
  }

  .progress-bar-wrapper {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .progress-text {
    min-width: 0;
  }
}

@media (max-width: 480px) {
  .analytics-header {
    padding: 1rem;
  }

  .card-title {
    font-size: 1.25rem;
  }

  .stat-card {
    flex-direction: column;
    text-align: center;
    padding: 1rem;
  }

  .stat-icon {
    width: 3rem;
    height: 3rem;
  }

  .stat-value {
    font-size: 1.5rem;
  }

  .chart-container {
    padding: 1rem;
  }

  .chart-container h3 {
    font-size: 1rem;
  }

  .country-item {
    grid-template-columns: 30px 40px 1fr;
    gap: 0.5rem;
  }

  .country-count {
    grid-column: 3;
    text-align: right;
    margin-top: 0.5rem;
  }

  .referrer-item {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }

  .referrer-rank {
    display: none;
  }

  .referrer-count {
    text-align: left;
  }
}

</style>
