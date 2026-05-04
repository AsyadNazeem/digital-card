<template>
  <!-- ANALYTICS TAB -->
  <div v-if="activeTab === 'analytics'" :class="['analytics-tab', { 'dark-mode': isDarkMode }]">

    <!-- ══════════════════════════════════ HEADER ══════════════════════════════════ -->
    <div class="list-view">
      <div class="list-header">
        <div class="list-header-left">
          <h2 class="page-title">Analytics</h2>
          <span class="count-pill">{{ analyticsDateRange }}d window</span>
        </div>
        <div class="analytics-filter-row">
          <!-- Contact Filter -->
          <div class="filter-wrap">
            <label class="filter-label-tag">Contact</label>
            <select v-model="selectedContactId" class="filter-select">
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
          <div class="filter-wrap">
            <label class="filter-label-tag">Range</label>
            <select v-model="analyticsDateRange" class="filter-select">
              <option value="7">Last 7 Days</option>
              <option value="30">Last 30 Days</option>
              <option value="90">Last 90 Days</option>
              <option value="365">Last Year</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Active filter badge -->
      <div v-if="selectedContactId !== 'all'" class="active-filter-strip">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
        </svg>
        <span class="strip-label">Filtered:</span>
        <span class="strip-value">{{ userContactsList.find(c => c.id == selectedContactId)?.name }}</span>
        <button @click="selectedContactId = 'all'" class="strip-clear">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
          Clear
        </button>
      </div>

      <!-- ══════════════════════════════════ LOADING ══════════════════════════════════ -->
      <div v-if="analyticsLoading" class="empty-state">
        <div class="empty-icon-wrap spin-wrap">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin-icon">
            <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
          </svg>
        </div>
        <p class="empty-title">Loading analytics…</p>
        <p class="empty-sub">Fetching your performance data</p>
      </div>

      <!-- ══════════════════════════════════ CONTENT ══════════════════════════════════ -->
      <div v-else class="analytics-content-wrapper">
        <div class="analytics-content" :class="{ blurred: !hasAnalyticsAccess }">

          <!-- ── STATS GRID ── -->
          <div class="stats-grid">

            <div class="stat-card stat-views">
              <div class="stat-icon-wrap">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                </svg>
              </div>
              <div class="stat-body">
                <p class="stat-label">Total Views</p>
                <p class="stat-value">{{ analyticsData.totalViews.toLocaleString() }}</p>
              </div>
            </div>

            <div class="stat-card stat-clicks">
              <div class="stat-icon-wrap">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                </svg>
              </div>
              <div class="stat-body">
                <p class="stat-label">Total Clicks</p>
                <p class="stat-value">{{ analyticsData.totalClicks.toLocaleString() }}</p>
              </div>
            </div>

            <div class="stat-card stat-visitors">
              <div class="stat-icon-wrap">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <div class="stat-body">
                <p class="stat-label">Unique Visitors</p>
                <p class="stat-value">{{ analyticsData.uniqueVisitors.toLocaleString() }}</p>
              </div>
            </div>

            <div class="stat-card stat-engagement">
              <div class="stat-icon-wrap">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                </svg>
              </div>
              <div class="stat-body">
                <p class="stat-label">Engagement Rate</p>
                <p class="stat-value">
                  {{ analyticsData.totalViews > 0
                    ? ((analyticsData.totalClicks / analyticsData.totalViews) * 100).toFixed(1)
                    : 0 }}%
                </p>
              </div>
            </div>

            <div class="stat-card stat-downloads">
              <div class="stat-icon-wrap">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
              </div>
              <div class="stat-body">
                <p class="stat-label">Contact Downloads</p>
                <p class="stat-value">{{ analyticsData.vcfDownloads.toLocaleString() }}</p>
                <p class="stat-sub">
                  {{ analyticsData.totalViews > 0
                    ? ((analyticsData.vcfDownloads / analyticsData.totalViews) * 100).toFixed(1)
                    : 0 }}% conversion
                </p>
              </div>
            </div>

            <div class="stat-card stat-saverate">
              <div class="stat-icon-wrap">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
              </div>
              <div class="stat-body">
                <p class="stat-label">Save Rate</p>
                <p class="stat-value">
                  {{ analyticsData.totalClicks > 0
                    ? ((analyticsData.vcfDownloads / analyticsData.totalClicks) * 100).toFixed(1)
                    : 0 }}%
                </p>
                <p class="stat-sub">of clicks save contact</p>
              </div>
            </div>

          </div><!-- /stats-grid -->

          <!-- ── CHARTS (access-gated) ── -->
          <div v-if="hasAnalyticsAccess" class="charts-section">

            <!-- Timeline Chart — Full Width -->
            <div class="chart-card chart-full">
              <div class="chart-card-header">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 17 9 11 13 15 21 7"/><polyline points="14 7 21 7 21 14"/>
                </svg>
                <span>Views Over Time</span>
              </div>
              <div class="chart-canvas-wrap">
                <canvas ref="timelineChart"></canvas>
              </div>
            </div>

            <!-- Click Distribution + Peak Hours — Side by Side -->
            <div class="chart-card">
              <div class="chart-card-header">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
                </svg>
                <span>Click Distribution</span>
              </div>
              <div class="chart-canvas-wrap">
                <canvas ref="clicksChart"></canvas>
              </div>
            </div>

            <div class="chart-card">
              <div class="chart-card-header">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
                <span>Peak Activity Hours</span>
              </div>
              <div class="chart-canvas-wrap">
                <canvas ref="peakHoursChart"></canvas>
              </div>
            </div>

            <!-- Detailed Click Analysis — Full Width -->
            <div class="chart-card chart-full">
              <div class="chart-card-header">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
                </svg>
                <span>Detailed Click Analysis</span>
              </div>

              <!-- Summary Pills -->
              <div class="click-summary-row">
                <div class="click-pill">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 11.9a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                  <span class="pill-label">Communication</span>
                  <span class="pill-value">{{ analyticsData.clickSummary?.communication || 0 }}</span>
                </div>
                <div class="click-pill">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15 15 0 0 1 0 20"/>
                  </svg>
                  <span class="pill-label">Social</span>
                  <span class="pill-value">{{ analyticsData.clickSummary?.social || 0 }}</span>
                </div>
                <div class="click-pill">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="16" y2="10"/>
                  </svg>
                  <span class="pill-label">Content</span>
                  <span class="pill-value">{{ analyticsData.clickSummary?.content || 0 }}</span>
                </div>
                <div class="click-pill">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2C8 6 4 8 4 12a8 8 0 0 0 16 0c0-4-4-6-8-10z"/><circle cx="12" cy="12" r="2"/>
                  </svg>
                  <span class="pill-label">Navigation</span>
                  <span class="pill-value">{{ analyticsData.clickSummary?.navigation || 0 }}</span>
                </div>
                <div class="click-pill click-pill-accent">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="2" y="6" width="20" height="12" rx="2"/><path d="M16 12h4"/><circle cx="16" cy="12" r="1"/>
                  </svg>
                  <span class="pill-label">Conversions</span>
                  <span class="pill-value">{{ analyticsData.clickSummary?.conversion || 0 }}</span>
                </div>
              </div>

              <!-- Table -->
              <div class="table-wrap">
                <table class="analytics-table">
                  <thead>
                  <tr>
                    <th>Link Type</th>
                    <th>Clicks</th>
                    <th>Share</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="click in analyticsData.clickBreakdown" :key="click.clickType">
                    <td>
                        <span class="type-badge" :class="{ 'type-badge-accent': click.clickType === 'save_contact' }">
                          {{ click.label }}
                        </span>
                    </td>
                    <td class="click-num">{{ click.count }}</td>
                    <td>
                      <div class="bar-row">
                        <div class="bar-track">
                          <div
                              class="bar-fill"
                              :class="{ 'bar-fill-accent': click.clickType === 'save_contact' }"
                              :style="{ width: `${(click.count / analyticsData.totalClicks) * 100}%` }"
                          ></div>
                        </div>
                        <span class="bar-pct">{{ ((click.count / analyticsData.totalClicks) * 100).toFixed(1) }}%</span>
                      </div>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Device + Browser — Side by Side -->
            <div class="chart-card">
              <div class="chart-card-header">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="7" y="2" width="10" height="20" rx="2"/><line x1="11" y1="18" x2="13" y2="18"/>
                </svg>
                <span>Views by Device</span>
              </div>
              <div class="chart-canvas-wrap">
                <canvas ref="deviceChart"></canvas>
              </div>
            </div>

            <div class="chart-card">
              <div class="chart-card-header">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
                  <path d="M12 2a15 15 0 0 1 0 20"/><path d="M12 2a15 15 0 0 0 0 20"/>
                </svg>
                <span>Browser Distribution</span>
              </div>
              <div class="chart-canvas-wrap">
                <canvas ref="browserChart"></canvas>
              </div>
            </div>

            <!-- Geographic Distribution — Full Width -->
            <div class="chart-card chart-full">
              <div class="chart-card-header">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/><path d="M2 12h20"/>
                  <path d="M12 2c3 3 3 17 0 20"/><path d="M12 2c-3 3-3 17 0 20"/>
                </svg>
                <span>Views by Country</span>
              </div>

              <div v-if="analyticsData.geoDistribution.length > 0" class="geo-list">
                <div
                    v-for="(country, index) in analyticsData.geoDistribution"
                    :key="country.countryCode"
                    class="geo-item"
                >
                  <span class="geo-rank">{{ index + 1 }}</span>
                  <span class="geo-flag">{{ country.countryCode }}</span>
                  <div class="geo-info">
                    <span class="geo-name">{{ country.country }}</span>
                    <div class="geo-bar-track">
                      <div
                          class="geo-bar-fill"
                          :style="{ width: `${(country.count / analyticsData.geoDistribution[0].count) * 100}%` }"
                      ></div>
                    </div>
                  </div>
                  <span class="geo-count">{{ country.count }}</span>
                </div>
              </div>
              <div v-else class="empty-state-inline">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <circle cx="12" cy="12" r="10"/><path d="M2 12h20"/>
                </svg>
                <p>No geographic data available yet</p>
              </div>
            </div>

            <!-- Top Referrers — Full Width (conditional) -->
            <div
                v-if="analyticsData.topReferrers && analyticsData.topReferrers.length > 0"
                class="chart-card chart-full"
            >
              <div class="chart-card-header">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M10 13a5 5 0 0 1 0-7l2-2a5 5 0 1 1 7 7l-1.5 1.5"/>
                  <path d="M14 11a5 5 0 0 1 0 7l-2 2a5 5 0 1 1-7-7L6.5 12.5"/>
                </svg>
                <span>Top Referrers</span>
              </div>
              <div class="geo-list">
                <div
                    v-for="(referrer, index) in analyticsData.topReferrers"
                    :key="index"
                    class="geo-item"
                >
                  <span class="geo-rank">{{ index + 1 }}</span>
                  <div class="geo-info" style="grid-column: span 2;">
                    <span class="geo-name referrer-url">{{ referrer.referrer }}</span>
                    <div class="geo-bar-track">
                      <div
                          class="geo-bar-fill"
                          :style="{ width: `${(referrer.count / analyticsData.topReferrers[0].count) * 100}%` }"
                      ></div>
                    </div>
                  </div>
                  <span class="geo-count">{{ referrer.count }} views</span>
                </div>
              </div>
            </div>

          </div><!-- /charts-section -->

        </div><!-- /analytics-content -->

        <!-- ── UPGRADE OVERLAY ── -->
        <div v-if="!hasAnalyticsAccess" class="upgrade-overlay">
          <div class="upgrade-card">
            <div class="empty-icon-wrap" style="margin: 0 auto 18px;">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <h3 class="upgrade-title">Analytics Locked</h3>
            <p class="upgrade-sub">Upgrade your plan to unlock full analytics insights and performance tracking.</p>
            <button class="upgrade-cta" @click="$emit('open-upgrade')">View Plans</button>
          </div>
        </div>

      </div><!-- /analytics-content-wrapper -->
    </div><!-- /list-view -->

  </div>
</template>

<script setup>
import { computed, inject, nextTick, ref, watch } from 'vue';
import api from '@/services/api.js';
import Chart from 'chart.js/auto';

const isDarkMode = inject('isDarkMode', ref(false));

const props = defineProps({
  activeTab: { type: String, required: true },
  contacts: { type: Array, default: () => [] },
  userPlan: String
});

defineEmits(['open-upgrade']);

// ── State ──
const analyticsData = ref({
  totalViews: 0, totalClicks: 0, uniqueVisitors: 0, vcfDownloads: 0,
  geoDistribution: [], clickBreakdown: [], clickSummary: {},
  deviceBreakdown: [], browserBreakdown: [], topReferrers: [],
  peakHours: [], timeline: []
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

let timelineChartInstance = null;
let clicksChartInstance = null;
let deviceChartInstance = null;
let browserChartInstance = null;
let peakHoursChartInstance = null;

// ── Computed ──
const hasAnalyticsAccess = computed(() => ['plus', 'pro'].includes(props.userPlan));

// ── Data Loading ──
async function loadAnalytics() {
  if (!hasAnalyticsAccess.value) { analyticsLoading.value = false; return; }
  try {
    analyticsLoading.value = true;
    const token = localStorage.getItem('token');
    if (!token) { alert('Please log in again'); return; }

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(analyticsDateRange.value));
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    const params = { startDate: startDate.toISOString(), endDate: endDate.toISOString() };
    if (selectedContactId.value !== 'all') params.contactId = selectedContactId.value;

    const res = await api.get('/analytics/dashboard', { params, headers: { Authorization: `Bearer ${token}` } });
    analyticsData.value = res.data;
    await nextTick();
    setTimeout(() => renderCharts(), 100);
  } catch (error) {
    alert(`Failed to load analytics: ${error.response?.data?.message || error.message}`);
  } finally {
    analyticsLoading.value = false;
  }
}

// ── Chart colours (match contact accent palette) ──
const CHART_COLORS = ['#7c5c4e', '#a07060', '#c19a6b', '#d4af37', '#5e443a', '#deb887'];
const CHART_TOOLTIP = { backgroundColor: 'rgba(28,20,16,0.92)', padding: 12, titleColor: '#fff', bodyColor: '#f0e8e4', borderColor: '#7c5c4e', borderWidth: 1 };

function renderCharts() {
  renderTimelineChart();
  renderClicksChart();
  renderDeviceChart();
  renderBrowserChart();
  renderPeakHoursChart();
}

function renderTimelineChart() {
  if (!timelineChart.value) return;
  if (timelineChartInstance) { timelineChartInstance.destroy(); timelineChartInstance = null; }
  const timeline = analyticsData.value.timeline || [];
  if (!timeline.length) return;
  const ctx = timelineChart.value.getContext('2d');
  timelineChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: timeline.map(d => new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
      datasets: [{ label: 'Views', data: timeline.map(d => parseInt(d.views) || 0), borderColor: '#7c5c4e', backgroundColor: 'rgba(124,92,78,0.10)', tension: 0.4, fill: true, pointRadius: 4, pointHoverRadius: 7, pointBackgroundColor: '#7c5c4e', pointBorderColor: '#fff', pointBorderWidth: 2 }]
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: CHART_TOOLTIP }, scales: { y: { beginAtZero: true, ticks: { precision: 0, color: '#7c5c4e' }, grid: { color: 'rgba(124,92,78,0.10)' } }, x: { ticks: { color: '#7c5c4e' }, grid: { display: false } } } }
  });
}

function renderClicksChart() {
  if (!clicksChart.value) return;
  if (clicksChartInstance) { clicksChartInstance.destroy(); clicksChartInstance = null; }
  const data = analyticsData.value.clickBreakdown || [];
  if (!data.length) return;
  const ctx = clicksChart.value.getContext('2d');
  clicksChartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: { labels: data.map(c => c.label || c.clickType), datasets: [{ data: data.map(c => parseInt(c.count) || 0), backgroundColor: CHART_COLORS, borderWidth: 3, borderColor: '#fff' }] },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { padding: 14, font: { size: 11 }, color: '#7c5c4e' } }, tooltip: CHART_TOOLTIP } }
  });
}

function renderDeviceChart() {
  if (!deviceChart.value) return;
  if (deviceChartInstance) { deviceChartInstance.destroy(); deviceChartInstance = null; }
  const data = analyticsData.value.deviceBreakdown || [];
  if (!data.length) return;
  const ctx = deviceChart.value.getContext('2d');
  deviceChartInstance = new Chart(ctx, {
    type: 'bar',
    data: { labels: data.map(d => { const t = d.deviceType || 'Unknown'; return t.charAt(0).toUpperCase() + t.slice(1); }), datasets: [{ label: 'Views', data: data.map(d => parseInt(d.count) || 0), backgroundColor: '#7c5c4e', borderRadius: 8, borderSkipped: false }] },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: CHART_TOOLTIP }, scales: { y: { beginAtZero: true, ticks: { precision: 0, color: '#7c5c4e' }, grid: { color: 'rgba(124,92,78,0.10)' } }, x: { ticks: { color: '#7c5c4e' }, grid: { display: false } } } }
  });
}

function renderBrowserChart() {
  if (!browserChart.value) return;
  if (browserChartInstance) { browserChartInstance.destroy(); browserChartInstance = null; }
  const data = analyticsData.value.browserBreakdown || [];
  if (!data.length) return;
  const ctx = browserChart.value.getContext('2d');
  browserChartInstance = new Chart(ctx, {
    type: 'pie',
    data: { labels: data.map(b => b.browser || 'Unknown'), datasets: [{ data: data.map(b => parseInt(b.count) || 0), backgroundColor: CHART_COLORS, borderWidth: 3, borderColor: '#fff' }] },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { padding: 10, font: { size: 11 }, color: '#7c5c4e' } }, tooltip: CHART_TOOLTIP } }
  });
}

function renderPeakHoursChart() {
  if (!peakHoursChart.value) return;
  if (peakHoursChartInstance) { peakHoursChartInstance.destroy(); peakHoursChartInstance = null; }
  const peakHours = analyticsData.value.peakHours || [];
  if (!peakHours.length) return;
  const ctx = peakHoursChart.value.getContext('2d');
  const allHours = Array.from({ length: 24 }, (_, i) => ({ hour: i, count: 0 }));
  peakHours.forEach(item => { allHours[item.hour] = { hour: item.hour, count: parseInt(item.count) || 0 }; });
  peakHoursChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: allHours.map(h => { const ampm = h.hour >= 12 ? 'PM' : 'AM'; const d = h.hour === 0 ? 12 : h.hour > 12 ? h.hour - 12 : h.hour; return `${d}${ampm}`; }),
      datasets: [{ label: 'Views', data: allHours.map(h => h.count), backgroundColor: '#7c5c4e', borderRadius: 6, borderSkipped: false }]
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: CHART_TOOLTIP }, scales: { y: { beginAtZero: true, ticks: { precision: 0, color: '#7c5c4e' }, grid: { color: 'rgba(124,92,78,0.10)' } }, x: { ticks: { font: { size: 9 }, color: '#7c5c4e' }, grid: { display: false } } } }
  });
}

// ── Watchers ──
watch(() => props.contacts, (newContacts) => {
  if (newContacts?.length) {
    userContactsList.value = newContacts.map(c => ({
      id: c.id,
      name: `${c.firstName || ''} ${c.lastName || ''}`.trim() || 'Unnamed Contact',
      mobile: c.mobile || 'No phone'
    }));
  }
}, { immediate: true });

watch(selectedContactId, () => { if (props.activeTab === 'analytics') loadAnalytics(); });
watch(analyticsDateRange, () => { if (props.activeTab === 'analytics') loadAnalytics(); });
watch(() => props.activeTab, (newTab) => { if (newTab === 'analytics') loadAnalytics(); }, { immediate: true });
watch(() => props.userPlan, (val) => { if (val === 'plus' || val === 'pro') loadAnalytics(); });
</script>

<style scoped>
/* ══════════════════════════════════════
   CSS CUSTOM PROPERTIES — matches Contact tab exactly
══════════════════════════════════════ */
.analytics-tab {
  --c-bg: #ffffff;
  --c-surface: #ffffff;
  --c-surface-2: #faf9f7;
  --c-border: #e8e3dc;
  --c-border-focus: #7c5c4e;
  --c-text-primary: #1c1410;
  --c-text-secondary: #5a4f46;
  --c-text-muted: #9e8e84;
  --c-accent: #7c5c4e;
  --c-accent-2: #a07060;
  --c-accent-hover: #5e443a;
  --c-accent-light: #f0e8e4;
  --c-accent-subtle: #f8f3f0;
  --c-danger: #b83232;
  --c-danger-light: #fdf0f0;
  --c-success: #2d6a50;
  --c-success-light: #ecf7f2;
  --c-warning: #a06010;
  --c-warning-light: #fef6ec;
  --c-info: #1a5a9e;
  --c-info-light: #eaf2fc;
  --c-shadow-xs: 0 1px 2px rgba(28,20,16,0.06);
  --c-shadow-sm: 0 2px 6px rgba(28,20,16,0.08), 0 1px 2px rgba(28,20,16,0.04);
  --c-shadow-md: 0 6px 20px rgba(28,20,16,0.10), 0 2px 6px rgba(28,20,16,0.06);
  --c-radius: 14px;
  --c-radius-sm: 8px;
  --c-radius-xs: 5px;
  --c-radius-pill: 100px;
  font-family: 'Segoe UI', 'SF Pro Display', system-ui, -apple-system, sans-serif;
  font-size: 14px;
  color: var(--c-text-primary);
  background: var(--c-bg);
  line-height: 1.5;
}

.analytics-tab.dark-mode {
  --c-bg: #131118;
  --c-surface: #1e1b27;
  --c-surface-2: #1e1b26;
  --c-border: #2c2838;
  --c-border-focus: #c4906e;
  --c-text-primary: #f2ede8;
  --c-text-secondary: #a89490;
  --c-text-muted: #6a5e5a;
  --c-accent: #c4906e;
  --c-accent-2: #d4a880;
  --c-accent-hover: #d4a070;
  --c-accent-light: #281e18;
  --c-accent-subtle: #1e1612;
  --c-danger: #e06060;
  --c-danger-light: #281414;
  --c-success: #60b88a;
  --c-success-light: #102418;
  --c-warning: #e8a840;
  --c-warning-light: #281c08;
  --c-info: #60a8e8;
  --c-info-light: #101c2e;
  --c-shadow-xs: 0 1px 2px rgba(0,0,0,0.2);
  --c-shadow-sm: 0 2px 6px rgba(0,0,0,0.3);
  --c-shadow-md: 0 6px 20px rgba(0,0,0,0.4);
}

*, *::before, *::after { box-sizing: border-box; }
button { font-family: inherit; cursor: pointer; }
input, select { font-family: inherit; }

/* ══════════════════════════════════════
   LIST VIEW SHELL — same as Contact
══════════════════════════════════════ */
.list-view {
  padding: 24px;
  max-width: 1800px;
  margin: 0 auto;
  border-radius: 0.5rem;
}

/* ── Header ── */
.list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.list-header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.page-title {
  font-size: 24px;
  font-weight: 750;
  letter-spacing: -0.6px;
  color: var(--c-text-primary);
  margin: 0;
}

.count-pill {
  background: var(--c-accent-light);
  color: var(--c-accent);
  font-size: 12px;
  font-weight: 700;
  padding: 4px 11px;
  border-radius: var(--c-radius-pill);
  letter-spacing: 0.02em;
}

/* ── Filter Row ── */
.analytics-filter-row {
  display: flex;
  gap: 10px;
  align-items: flex-end;
  flex-wrap: wrap;
}

.filter-wrap {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.filter-label-tag {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--c-text-muted);
}

.filter-select {
  padding: 9px 34px 9px 12px;
  background: var(--c-surface);
  border: 1.5px solid var(--c-border);
  border-radius: var(--c-radius-sm);
  font-size: 13px;
  color: var(--c-text-primary);
  transition: border-color 0.15s, box-shadow 0.15s;
  box-shadow: var(--c-shadow-xs);
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239e8e84' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  cursor: pointer;
  min-width: 160px;
}

.filter-select:focus {
  outline: none;
  border-color: var(--c-border-focus);
  box-shadow: 0 0 0 3px rgba(124,92,78,0.12);
}

/* ── Active Filter Strip ── */
.active-filter-strip {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: var(--c-accent-subtle);
  border: 1.5px solid var(--c-accent-light);
  border-radius: var(--c-radius-sm);
  margin-bottom: 20px;
  flex-wrap: wrap;
  font-size: 13px;
  color: var(--c-text-secondary);
}

.active-filter-strip svg { color: var(--c-accent); flex-shrink: 0; }
.strip-label { color: var(--c-text-muted); }
.strip-value { font-weight: 700; color: var(--c-accent); }

.strip-clear {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  margin-left: auto;
  padding: 5px 12px;
  background: var(--c-surface);
  border: 1.5px solid var(--c-border);
  border-radius: var(--c-radius-pill);
  font-size: 12px;
  font-weight: 600;
  color: var(--c-text-secondary);
  transition: all 0.15s;
}

.strip-clear:hover { border-color: var(--c-danger); color: var(--c-danger); background: var(--c-danger-light); }

/* ── Empty / Loading ── */
.empty-state {
  text-align: center;
  padding: 64px 24px;
  background: var(--c-surface);
  border: 2px dashed var(--c-border);
  border-radius: var(--c-radius);
}

.empty-icon-wrap {
  width: 76px;
  height: 76px;
  border-radius: 50%;
  background: var(--c-accent-light);
  color: var(--c-accent);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
}

.spin-wrap { background: var(--c-accent-light); }
.empty-title { font-size: 17px; font-weight: 700; color: var(--c-text-primary); margin: 0 0 8px; letter-spacing: -0.2px; }
.empty-sub { font-size: 13px; color: var(--c-text-muted); margin: 0; }

/* Spin animation */
.spin-icon { animation: spin 0.9s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

/* ══════════════════════════════════════
   ANALYTICS CONTENT WRAPPER
══════════════════════════════════════ */
.analytics-content-wrapper { position: relative; }

.analytics-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.blurred { filter: blur(6px); pointer-events: none; user-select: none; }

/* ══════════════════════════════════════
   STATS GRID — mimics contact-card style
══════════════════════════════════════ */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
}

.stat-card {
  background: var(--c-surface);
  border: 1.5px solid var(--c-border);
  border-radius: var(--c-radius);
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: box-shadow 0.22s, border-color 0.22s, transform 0.18s;
  box-shadow: var(--c-shadow-sm);
}

.stat-card:hover {
  box-shadow: var(--c-shadow-md);
  border-color: var(--c-accent-2);
  transform: translateY(-2px);
}

.stat-icon-wrap {
  width: 48px;
  height: 48px;
  border-radius: var(--c-radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: #fff;
}

.stat-views    .stat-icon-wrap { background: linear-gradient(135deg, #7c5c4e, #a07060); }
.stat-clicks   .stat-icon-wrap { background: linear-gradient(135deg, #a07060, #c19a6b); }
.stat-visitors .stat-icon-wrap { background: linear-gradient(135deg, #c19a6b, #d4af37); }
.stat-engagement .stat-icon-wrap { background: linear-gradient(135deg, #d4af37, #deb887); }
.stat-downloads .stat-icon-wrap { background: linear-gradient(135deg, #5e443a, #7c5c4e); }
.stat-saverate  .stat-icon-wrap { background: linear-gradient(135deg, #7c5c4e, #d4af37); }

.dark-mode .stat-views    .stat-icon-wrap { background: linear-gradient(135deg, #c4906e, #d4a880); }
.dark-mode .stat-clicks   .stat-icon-wrap { background: linear-gradient(135deg, #b47860, #c4906e); }
.dark-mode .stat-visitors .stat-icon-wrap { background: linear-gradient(135deg, #d4a880, #e8c880); }
.dark-mode .stat-engagement .stat-icon-wrap { background: linear-gradient(135deg, #a47050, #c4906e); }
.dark-mode .stat-downloads .stat-icon-wrap { background: linear-gradient(135deg, #8a5840, #c4906e); }
.dark-mode .stat-saverate  .stat-icon-wrap { background: linear-gradient(135deg, #c4906e, #e8c880); }

.stat-body { flex: 1; min-width: 0; }

.stat-label {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--c-text-muted);
  margin: 0 0 4px;
}

.stat-value {
  font-size: 26px;
  font-weight: 750;
  color: var(--c-text-primary);
  letter-spacing: -0.8px;
  margin: 0;
  line-height: 1.1;
}

.stat-sub {
  font-size: 11px;
  color: var(--c-text-muted);
  margin: 4px 0 0;
}

/* ══════════════════════════════════════
   CHARTS SECTION
══════════════════════════════════════ */
.charts-section {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.chart-card {
  background: var(--c-surface);
  border: 1.5px solid var(--c-border);
  border-radius: var(--c-radius);
  padding: 20px;
  box-shadow: var(--c-shadow-sm);
  transition: box-shadow 0.2s, border-color 0.2s;
}

.chart-card:hover {
  box-shadow: var(--c-shadow-md);
  border-color: var(--c-accent-2);
}

.chart-card.chart-full { grid-column: 1 / -1; }

.chart-card-header {
  display: flex;
  align-items: center;
  gap: 9px;
  margin-bottom: 18px;
  font-size: 14px;
  font-weight: 750;
  color: var(--c-text-primary);
  letter-spacing: -0.2px;
}

.chart-card-header svg { color: var(--c-accent); flex-shrink: 0; }

.chart-canvas-wrap {
  position: relative;
  height: 260px;
}

.chart-canvas-wrap canvas { max-height: 260px; }

/* ── Click Summary Pills ── */
.click-summary-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 18px;
}

.click-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 13px;
  background: var(--c-surface-2);
  border: 1.5px solid var(--c-border);
  border-radius: var(--c-radius-pill);
  font-size: 12px;
  font-weight: 650;
  color: var(--c-text-secondary);
  flex: 1;
  min-width: 120px;
  transition: border-color 0.15s, background 0.15s;
}

.click-pill svg { color: var(--c-accent); flex-shrink: 0; }

.click-pill-accent {
  background: linear-gradient(135deg, var(--c-accent), var(--c-accent-2));
  border-color: transparent;
  color: #fff;
}

.click-pill-accent svg { color: rgba(255,255,255,0.85); }

.pill-label { flex: 1; }

.pill-value {
  font-size: 14px;
  font-weight: 800;
  color: var(--c-accent);
  letter-spacing: -0.3px;
}

.click-pill-accent .pill-value { color: #fff; }

/* ── Analytics Table ── */
.table-wrap {
  overflow-x: auto;
  border-radius: var(--c-radius-sm);
  border: 1.5px solid var(--c-border);
}

.analytics-table {
  width: 100%;
  border-collapse: collapse;
}

.analytics-table thead tr {
  background: var(--c-surface-2);
}

.analytics-table th {
  padding: 11px 16px;
  text-align: left;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--c-accent);
  border-bottom: 1.5px solid var(--c-border);
  white-space: nowrap;
}

.analytics-table tbody tr {
  border-bottom: 1px solid var(--c-border);
  transition: background 0.12s;
}

.analytics-table tbody tr:last-child { border-bottom: none; }

.analytics-table tbody tr:hover { background: var(--c-accent-subtle); }

.analytics-table td {
  padding: 11px 16px;
  font-size: 13px;
  color: var(--c-text-primary);
}

.type-badge {
  display: inline-block;
  padding: 4px 11px;
  background: var(--c-surface-2);
  border: 1.5px solid var(--c-border);
  border-radius: var(--c-radius-pill);
  font-size: 12px;
  font-weight: 600;
  color: var(--c-text-secondary);
}

.type-badge-accent {
  background: linear-gradient(135deg, var(--c-accent), var(--c-accent-2));
  border-color: transparent;
  color: #fff;
}

.click-num {
  font-weight: 700;
  font-size: 15px;
  color: var(--c-text-primary);
}

.bar-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.bar-track {
  flex: 1;
  height: 7px;
  background: var(--c-border);
  border-radius: var(--c-radius-pill);
  overflow: hidden;
  position: relative;
}

.bar-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--c-accent-2), var(--c-accent));
  border-radius: var(--c-radius-pill);
  transition: width 0.4s ease;
}

.bar-fill-accent {
  background: linear-gradient(90deg, var(--c-accent), #d4af37);
}

.bar-pct {
  font-size: 12px;
  font-weight: 700;
  color: var(--c-text-muted);
  min-width: 42px;
  text-align: right;
}

/* ══════════════════════════════════════
   GEO / REFERRERS LIST
══════════════════════════════════════ */
.geo-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.geo-item {
  display: grid;
  grid-template-columns: 36px 52px 1fr 72px;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: var(--c-surface-2);
  border: 1.5px solid var(--c-border);
  border-radius: var(--c-radius-sm);
  transition: all 0.18s;
}

.geo-item:hover {
  background: var(--c-accent-subtle);
  border-color: var(--c-accent-2);
  transform: translateX(3px);
  box-shadow: var(--c-shadow-sm);
}

.geo-rank {
  font-size: 13px;
  font-weight: 800;
  color: var(--c-accent);
  text-align: center;
}

.geo-flag {
  font-size: 22px;
  text-align: center;
}

.geo-info { display: flex; flex-direction: column; gap: 6px; min-width: 0; }

.geo-name {
  font-size: 13px;
  font-weight: 700;
  color: var(--c-text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.referrer-url { color: var(--c-accent); font-weight: 600; }

.geo-bar-track {
  width: 100%;
  height: 6px;
  background: var(--c-border);
  border-radius: var(--c-radius-pill);
  overflow: hidden;
}

.geo-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--c-accent), #d4af37);
  border-radius: var(--c-radius-pill);
  transition: width 0.4s ease;
}

.geo-count {
  font-size: 14px;
  font-weight: 800;
  color: var(--c-text-primary);
  text-align: right;
  white-space: nowrap;
}

.empty-state-inline {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 40px 24px;
  color: var(--c-text-muted);
  font-size: 13px;
  border: 2px dashed var(--c-border);
  border-radius: var(--c-radius-sm);
}

/* ══════════════════════════════════════
   UPGRADE OVERLAY
══════════════════════════════════════ */
.upgrade-overlay {
  position: absolute;
  inset: 0;
  background: rgba(250,249,247,0.88);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  border-radius: var(--c-radius);
}

.dark-mode .upgrade-overlay { background: rgba(16,14,20,0.88); }

.upgrade-card {
  background: var(--c-surface);
  border: 1.5px solid var(--c-border);
  border-radius: var(--c-radius);
  padding: 36px 32px;
  text-align: center;
  max-width: 380px;
  width: 100%;
  box-shadow: var(--c-shadow-md);
}

.upgrade-title {
  font-size: 20px;
  font-weight: 750;
  color: var(--c-text-primary);
  letter-spacing: -0.4px;
  margin: 0 0 10px;
}

.upgrade-sub {
  font-size: 13px;
  color: var(--c-text-muted);
  margin: 0 0 24px;
  line-height: 1.6;
}

.upgrade-cta {
  display: inline-flex;
  align-items: center;
  padding: 11px 28px;
  background: var(--c-accent);
  color: #fff;
  border: none;
  border-radius: var(--c-radius-sm);
  font-size: 14px;
  font-weight: 750;
  transition: background 0.15s, transform 0.12s, box-shadow 0.15s;
  box-shadow: 0 2px 8px rgba(124,92,78,0.3);
  letter-spacing: 0.01em;
}

.upgrade-cta:hover {
  background: var(--c-accent-hover);
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(124,92,78,0.4);
}

/* ══════════════════════════════════════
   RESPONSIVE — TABLET (≤ 900px)
══════════════════════════════════════ */
@media (max-width: 900px) {
  .list-view { padding: 20px; }
  .charts-section { grid-template-columns: 1fr; }
  .chart-card.chart-full { grid-column: 1; }
  .stats-grid { grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); }
}

/* ══════════════════════════════════════
   RESPONSIVE — MOBILE (≤ 640px)
══════════════════════════════════════ */
@media (max-width: 640px) {
  .list-view { padding: 14px; }
  .page-title { font-size: 20px; }
  .list-header { margin-bottom: 16px; }

  .analytics-filter-row { width: 100%; flex-direction: column; gap: 8px; }
  .filter-wrap { width: 100%; }
  .filter-select { min-width: 0; width: 100%; }

  .stats-grid { grid-template-columns: 1fr; gap: 12px; }
  .stat-card { padding: 16px; gap: 14px; }
  .stat-value { font-size: 22px; }

  .charts-section { grid-template-columns: 1fr; gap: 12px; }
  .chart-card { padding: 16px; }
  .chart-canvas-wrap { height: 220px; }
  .chart-canvas-wrap canvas { max-height: 220px; }

  .click-summary-row { flex-direction: column; gap: 6px; }
  .click-pill { min-width: 0; }

  .geo-item {
    grid-template-columns: 30px 40px 1fr 60px;
    gap: 8px;
    padding: 10px 12px;
  }

  .geo-flag { font-size: 18px; }
  .geo-count { font-size: 13px; }

  .bar-row { flex-wrap: wrap; gap: 6px; }
  .bar-pct { min-width: 0; }

  .analytics-table th,
  .analytics-table td { padding: 9px 12px; font-size: 12px; }

  .upgrade-card { padding: 24px 18px; }
}

/* ══════════════════════════════════════
   TOUCH TARGETS
══════════════════════════════════════ */
@media (hover: none) and (pointer: coarse) {
  .filter-select, .strip-clear, .upgrade-cta { min-height: 44px; }
  select { font-size: 16px !important; }
}

/* ══════════════════════════════════════
   ACCESSIBILITY
══════════════════════════════════════ */
@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; transition-duration: 0.01ms !important; }
}
</style>
