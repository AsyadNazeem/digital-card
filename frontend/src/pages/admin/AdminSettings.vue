<template>
  <div class="settings-page">

    <!-- Profile Section -->
    <section class="settings-section">
      <h2 class="section-title">Profile Settings</h2>
      <p class="section-description">Update your basic information.</p>

      <div class="settings-form">
        <div class="form-group">
          <label class="form-label">Admin Name</label>
          <input v-model="adminName" type="text" class="form-input" placeholder="Enter your name" />
        </div>

        <div class="form-group">
          <label class="form-label">Email Address</label>
          <input v-model="email" type="email" class="form-input" placeholder="Enter your email" />
        </div>
      </div>
    </section>

    <!-- Password Section -->
    <section class="settings-section">
      <h2 class="section-title">Security</h2>
      <p class="section-description">Change your password.</p>

      <div class="settings-form">
        <div class="form-group">
          <label class="form-label">Current Password</label>
          <input type="password" v-model="currentPassword" class="form-input" placeholder="Enter current password" />
        </div>

        <div class="form-group">
          <label class="form-label">New Password</label>
          <input type="password" v-model="newPassword" class="form-input" placeholder="Enter new password" />
        </div>

        <div class="form-group">
          <label class="form-label">Confirm New Password</label>
          <input type="password" v-model="confirmPassword" class="form-input" placeholder="Confirm new password" />
        </div>
      </div>
    </section>

    <!-- Preferences Section -->
    <section class="settings-section">
      <h2 class="section-title">Preferences</h2>
      <p class="section-description">System-level admin preferences.</p>

      <div class="settings-form">
        <div class="switch-wrapper">
          <span class="switch-label">Enable Email Notifications</span>
          <div class="toggle" :class="{ active: emailNotif }" @click="emailNotif = !emailNotif">
            <div class="toggle-circle"></div>
          </div>
        </div>

        <div class="switch-wrapper">
          <span class="switch-label">Enable Push Alerts</span>
          <div class="toggle" :class="{ active: pushNotif }" @click="pushNotif = !pushNotif">
            <div class="toggle-circle"></div>
          </div>
        </div>

        <div class="switch-wrapper">
          <span class="switch-label">Enable Daily Summary Emails</span>
          <div class="toggle" :class="{ active: dailySummary }" @click="dailySummary = !dailySummary">
            <div class="toggle-circle"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Save Button -->
    <button class="save-btn" @click="saveSettings">
      Save Settings
    </button>
  </div>
</template>

<script setup>
import { ref } from "vue";

// Dummy data (replace later with backend)
const adminName = ref("Admin User");
const email = ref("admin@example.com");

const currentPassword = ref("");
const newPassword = ref("");
const confirmPassword = ref("");

const emailNotif = ref(true);
const pushNotif = ref(false);
const dailySummary = ref(true);

function saveSettings() {
  alert("Settings saved successfully! (Dummy UI)");
}
</script>

<style scoped>
/* Root Layout */
.settings-page {
  background: #f8f9fa;
  padding: 32px;
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto;
}

/* Heading */
.settings-header {
  margin-bottom: 32px;
}

.settings-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #1a202c;
}

.settings-subtitle {
  color: #718096;
  font-size: 0.95rem;
}

/* Section Container */
.settings-section {
  background: white;
  padding: 28px;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  margin-bottom: 28px;
}

.section-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 12px;
}

.section-description {
  color: #718096;
  font-size: 0.9rem;
  margin-bottom: 20px;
}

/* Form Layout */
.settings-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Input Group */
.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #475569;
}

.form-input {
  padding: 14px;
  font-size: 1rem;
  background: #fff;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  transition: border 0.25s ease, box-shadow 0.25s ease;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
}

/* Toggle Switch */
.switch-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.switch-label {
  font-size: 0.9rem;
  color: #475569;
  font-weight: 600;
}

/* Modern Toggle Button */
.toggle {
  position: relative;
  width: 52px;
  height: 28px;
  background: #cbd5e1;
  border-radius: 20px;
  cursor: pointer;
  transition: background 0.25s ease;
}

.toggle.active {
  background: #667eea;
}

.toggle-circle {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 22px;
  height: 22px;
  background: white;
  border-radius: 50%;
  transition: transform 0.25s ease;
}

.toggle.active .toggle-circle {
  transform: translateX(24px);
}

/* Save Button */
.save-btn {
  margin-top: 10px;
  padding: 14px 20px;
  font-size: 1rem;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.25s ease;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.save-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 18px rgba(102, 126, 234, 0.35);
}

.save-btn:active {
  transform: translateY(0);
}

/* Responsive */
@media (max-width: 768px) {
  .settings-page {
    padding: 20px;
  }

  .settings-section {
    padding: 20px;
  }

  .save-btn {
    width: 100%;
  }
}
</style>
