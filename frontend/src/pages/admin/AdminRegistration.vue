<template>
  <div class="admin-create-page">

    <div class="form-card">
      <div class="form-grid">

        <!-- Full Name -->
        <div class="field-group">
          <label class="field-label" for="name">Full name</label>
          <div class="field-wrap">
            <span class="field-icon">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </span>
            <input id="name" type="text" v-model="form.name" class="field-input has-icon" placeholder="Jane Smith"
                   required/>
          </div>
        </div>

        <!-- Username -->
        <div class="field-group">
          <label class="field-label" for="username">Username</label>
          <div class="field-wrap">
            <span class="field-icon">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <circle cx="12" cy="8" r="4"/>
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
              </svg>
            </span>
            <input id="username" type="text" v-model="form.username" class="field-input has-icon"
                   placeholder="jane.smith" required/>
          </div>
        </div>

        <!-- Email -->
        <div class="field-group full">
          <label class="field-label" for="email">Email address</label>
          <div class="field-wrap">
            <span class="field-icon">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            </span>
            <input id="email" type="email" v-model="form.email" class="field-input has-icon"
                   placeholder="jane.smith@company.com" required/>
          </div>
        </div>

        <!-- Password -->
        <div class="field-group full">
          <label class="field-label" for="password">Password</label>
          <div class="field-wrap">
            <span class="field-icon">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <rect x="3" y="11" width="18" height="11" rx="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </span>
            <input
                id="password"
                :type="showPassword ? 'text' : 'password'"
                v-model="form.password"
                class="field-input has-icon has-right"
                placeholder="Min. 8 characters"
                required
            />
            <button type="button" class="toggle-btn" @click="showPassword = !showPassword">
              <svg v-if="!showPassword" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                   stroke-width="1.8">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
              <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                   stroke-width="1.8">
                <path
                    d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
            </button>
          </div>
          <div class="strength-bar" v-if="form.password">
            <div
                v-for="i in 4" :key="i"
                class="strength-seg"
                :style="{ background: i <= passwordStrength.score ? passwordStrength.color : '' }"
            />
          </div>
          <span class="strength-label" v-if="form.password" :style="{ color: passwordStrength.color }">
            {{ passwordStrength.label }}
          </span>
        </div>

        <!-- Role -->
        <div class="field-group full">
          <span class="field-label">Role</span>
          <div class="role-grid">
            <label
                v-for="opt in roleOptions"
                :key="opt.value"
                class="role-card"
                :class="{ selected: form.role === opt.value }"
            >
              <input type="radio" :value="opt.value" v-model="form.role" hidden/>
              <div class="role-dot">
                <div class="role-dot-inner"/>
              </div>
              <div>
                <div class="role-name">{{ opt.label }}</div>
                <div class="role-desc">{{ opt.desc }}</div>
              </div>
            </label>
          </div>
        </div>

        <!-- Status -->
        <div class="field-group full">
          <span class="field-label">Status</span>
          <div
              class="status-toggle"
              @click="form.status = form.status === 'active' ? 'inactive' : 'active'"
          >
            <div class="toggle-track" :class="{ on: form.status === 'active' }">
              <div class="toggle-thumb"/>
            </div>
            <span class="toggle-text">
              {{ form.status === 'active' ? 'Account active' : 'Account inactive' }}
            </span>
            <span class="status-badge" :class="form.status === 'active' ? 'badge-active' : 'badge-inactive'">
              {{ form.status === 'active' ? 'Active' : 'Inactive' }}
            </span>
          </div>
        </div>

        <!-- Footer -->
        <div class="form-footer">
          <span class="footer-hint">All fields are required</span>
          <div class="footer-actions">
            <button type="button" class="btn-cancel" @click="resetForm">Cancel</button>
            <button type="button" class="btn-create" :disabled="loading" @click="submitForm">
              <svg v-if="loading" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                   stroke-width="2" class="spinner">
                <line x1="12" y1="2" x2="12" y2="6"/>
                <line x1="12" y1="18" x2="12" y2="22"/>
                <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/>
                <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/>
              </svg>
              <svg v-else width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                   stroke-width="2.5">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              {{ loading ? 'Creating...' : 'Create admin' }}
            </button>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
import {computed, ref} from 'vue'
import {useAdminStore} from '@/store/adminStore'

const adminStore = useAdminStore()
const loading = ref(false)
const showPassword = ref(false)

const roleOptions = [
  {value: 'admin', label: 'Admin', desc: 'Standard access'},
  {value: 'super_admin', label: 'Super admin', desc: 'Full system access'},
]

const form = ref({
  name: '',
  username: '',
  email: '',
  password: '',
  role: 'admin',
  status: 'active',
})

const passwordStrength = computed(() => {
  const v = form.value.password
  let score = 0
  if (v.length >= 8) score++
  if (/[A-Z]/.test(v)) score++
  if (/[0-9]/.test(v)) score++
  if (/[^A-Za-z0-9]/.test(v)) score++
  const levels = [
    {label: 'Weak', color: '#e53935'},
    {label: 'Fair', color: '#fb8c00'},
    {label: 'Good', color: '#7cb342'},
    {label: 'Strong', color: '#2e7d32'},
  ]
  return {score, ...(levels[score - 1] || {label: '', color: ''})}
})

const resetForm = () => {
  Object.assign(form.value, {
    name: '', username: '', email: '', password: '',
    role: 'admin', status: 'active',
  })
}

const submitForm = async () => {
  if (loading.value) return
  loading.value = true
  try {
    const result = await adminStore.createAdmin(form.value)
    if (result.success) {
      alert('Admin account created successfully!')
      resetForm()
    } else {
      alert('Error: ' + result.error)
    }
  } catch (err) {
    alert('Unexpected error: ' + err.message)
  }
  loading.value = false
}
</script>

<style scoped>
.admin-create-page {
  padding-bottom: 40px;
}

/* ── Card ────────────────────────────────────────── */
.form-card {
  background: #ffffff;
  border-radius: 14px;
  border: 1px solid #e8e2dc;
  padding: 36px 40px;
}

/* ── Grid ────────────────────────────────────────── */
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 22px 24px;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.field-group.full {
  grid-column: 1 / -1;
}

/* ── Labels ──────────────────────────────────────── */
.field-label {
  font-size: 11px;
  font-weight: 700;
  color: #3d2b20;
  text-transform: uppercase;
  letter-spacing: 0.07em;
}

/* ── Inputs ──────────────────────────────────────── */
.field-wrap {
  position: relative;
}

.field-icon {
  position: absolute;
  left: 13px;
  top: 50%;
  transform: translateY(-50%);
  color: #b09080;
  display: flex;
  align-items: center;
  pointer-events: none;
}

.field-input {
  width: 95%;
  height: 44px;
  padding: 0 14px;
  border: 1.5px solid #e0d8d0;
  border-radius: 9px;
  font-size: 14px;
  color: #1a1008;
  background: #fdfcfb;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
  font-family: inherit;
}

.field-input.has-icon {
  padding-left: 40px;
}

.field-input.has-right {
  padding-right: 44px;
}

.field-input::placeholder {
  color: #c0b0a8;
}

.field-input:focus {
  border-color: #3d2b20;
  box-shadow: 0 0 0 3px rgba(61, 43, 32, 0.1);
}

/* ── Password toggle ─────────────────────────────── */
.toggle-btn {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #b09080;
  display: flex;
  align-items: center;
  padding: 4px;
  transition: color 0.15s;
}

.toggle-btn:hover {
  color: #3d2b20;
}

/* ── Password strength ───────────────────────────── */
.strength-bar {
  display: flex;
  gap: 5px;
  margin-top: 5px;
}

.strength-seg {
  height: 3px;
  flex: 1;
  border-radius: 2px;
  background: #ede6df;
  transition: background 0.25s;
}

.strength-label {
  font-size: 11px;
  font-weight: 600;
  margin-top: 4px;
}

/* ── Role cards ──────────────────────────────────── */
.role-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.role-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 13px 16px;
  border: 1.5px solid #e0d8d0;
  border-radius: 10px;
  cursor: pointer;
  background: #fdfcfb;
  transition: all 0.15s;
  user-select: none;
}

.role-card:hover {
  border-color: #8a6050;
  background: #faf7f4;
}

.role-card.selected {
  border-color: #3d2b20;
  background: #f7f2ee;
}

.role-dot {
  width: 17px;
  height: 17px;
  border-radius: 50%;
  border: 1.5px solid #ccc0b8;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.15s;
}

.role-card.selected .role-dot {
  border-color: #3d2b20;
  background: #3d2b20;
}

.role-dot-inner {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #fff;
  opacity: 0;
  transition: opacity 0.15s;
}

.role-card.selected .role-dot-inner {
  opacity: 1;
}

.role-name {
  font-size: 13px;
  font-weight: 600;
  color: #1a1008;
  margin-bottom: 1px;
}

.role-desc {
  font-size: 11px;
  color: #8a7a70;
}

/* ── Status toggle ───────────────────────────────── */
.status-toggle {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border: 1.5px solid #e0d8d0;
  border-radius: 10px;
  cursor: pointer;
  background: #fdfcfb;
  user-select: none;
  transition: border-color 0.15s;
}

.status-toggle:hover {
  border-color: #8a6050;
}

.toggle-track {
  width: 38px;
  height: 22px;
  border-radius: 11px;
  background: #d4ccc4;
  position: relative;
  transition: background 0.2s;
  flex-shrink: 0;
}

.toggle-track.on {
  background: #3d2b20;
}

.toggle-thumb {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #fff;
  transition: transform 0.2s;
}

.toggle-track.on .toggle-thumb {
  transform: translateX(16px);
}

.toggle-text {
  font-size: 13px;
  font-weight: 500;
  color: #3d2b20;
}

.status-badge {
  font-size: 11px;
  padding: 3px 9px;
  border-radius: 20px;
  font-weight: 600;
}

.badge-active {
  background: #e8f5e9;
  color: #1b5e20;
}

.badge-inactive {
  background: #f0ece8;
  color: #7a6a60;
}

/* ── Footer ──────────────────────────────────────── */
.form-footer {
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 24px;
  border-top: 1px solid #ede6df;
  margin-top: 4px;
}

.footer-hint {
  font-size: 12px;
  color: #a08878;
}

.footer-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.btn-cancel {
  height: 40px;
  padding: 0 20px;
  border-radius: 9px;
  border: 1.5px solid #e0d8d0;
  background: transparent;
  color: #7a6a60;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.15s;
}

.btn-cancel:hover {
  background: #f5f0ed;
  color: #3d2b20;
  border-color: #c0b0a8;
}

.btn-create {
  height: 40px;
  padding: 0 24px;
  border-radius: 9px;
  border: none;
  background: #2d1f1a;
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: inherit;
  transition: background 0.15s;
}

.btn-create:hover {
  background: #1a1008;
}

.btn-create:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* ── Responsive ──────────────────────────────────── */
@media (max-width: 640px) {
  .form-card {
    padding: 24px 20px;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .role-grid {
    grid-template-columns: 1fr;
  }

  .form-footer {
    flex-direction: column;
    align-items: flex-end;
    gap: 12px;
  }
}
</style>
