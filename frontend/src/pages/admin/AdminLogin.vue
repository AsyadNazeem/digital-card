<template>
  <div class="login-wrapper">
    <div class="login-container">
      <!-- Logo/Brand Section -->
      <div class="login-header">
        <div class="logo-circle">
          <span class="logo-icon">🔐</span>
        </div>
        <h1 class="login-title">Admin Portal</h1>
        <p class="login-subtitle">Sign in to access your dashboard</p>
      </div>

      <!-- Login Form -->
      <form @submit.prevent="login" class="login-form">
        <div class="form-group">
          <label for="username" class="form-label">
            <span class="label-icon">👤</span>
            Username or Email
          </label>
          <input
              id="username"
              v-model="usernameOrEmail"
              type="text"
              class="form-input"
              placeholder="Enter your username or email"
              required
              autocomplete="username"
          />
        </div>

        <div class="form-group">
          <label for="password" class="form-label">
            <span class="label-icon">🔑</span>
            Password
          </label>
          <input
              id="password"
              v-model="password"
              type="password"
              class="form-input"
              placeholder="Enter your password"
              required
              autocomplete="current-password"
          />
        </div>

        <button type="submit" class="login-btn" :disabled="isLoading">
          <span v-if="!isLoading">Sign In</span>
          <span v-else class="loading-spinner">
            <span class="spinner"></span>
            Signing in...
          </span>
        </button>
      </form>

      <!-- Message Display -->
      <div v-if="message" class="message-box" :class="messageType">
        <span class="message-icon">{{ messageType === 'error' ? '❌' : '✅' }}</span>
        <span>{{ message }}</span>
      </div>

      <!-- Footer -->
      <div class="login-footer">
        <p class="footer-text">© 2024 Admin Dashboard. All rights reserved.</p>
      </div>
    </div>

    <!-- Background Decoration -->
    <div class="bg-decoration">
      <div class="shape shape-1"></div>
      <div class="shape shape-2"></div>
      <div class="shape shape-3"></div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import adminApi from "../../services/adminApi.js";

const router = useRouter();
const usernameOrEmail = ref("");
const password = ref("");
const message = ref("");
const messageType = ref("error");
const isLoading = ref(false);

async function login() {
  try {
    isLoading.value = true;
    message.value = "";
    console.log("🔹 Attempting admin login...");

    const res = await adminApi.post("/auth/login", {
      usernameOrEmail: usernameOrEmail.value.trim(),
      password: password.value.trim(),
    });

    console.log("✅ Login success:", res.data);

    // Store token
    localStorage.setItem("adminToken", res.data.token);
    localStorage.setItem("adminUser", JSON.stringify(res.data.admin));

    // Show success message
    messageType.value = "success";
    message.value = "Login successful! Redirecting...";

    // Navigate to dashboard
    setTimeout(() => {
      router.push("/admin/dashboard");
    }, 1000);

  } catch (err) {
    console.error("❌ Login error:", err.response?.data || err);
    messageType.value = "error";
    message.value = err.response?.data?.message || "Login failed. Please check your credentials.";
  } finally {
    isLoading.value = false;
  }
}
</script>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.login-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  position: relative;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

/* Background Decoration */
.bg-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  z-index: 0;
}

.shape {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(60px);
}

.shape-1 {
  width: 400px;
  height: 400px;
  top: -100px;
  left: -100px;
  animation: float 20s ease-in-out infinite;
}

.shape-2 {
  width: 300px;
  height: 300px;
  bottom: -80px;
  right: -80px;
  animation: float 15s ease-in-out infinite reverse;
}

.shape-3 {
  width: 200px;
  height: 200px;
  top: 50%;
  right: 10%;
  animation: float 25s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(30px, -30px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
}

/* Login Container */
.login-container {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 48px 40px;
  width: 100%;
  max-width: 440px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  position: relative;
  z-index: 1;
  animation: slideUp 0.6s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Header */
.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.logo-circle {
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 12px 32px rgba(102, 126, 234, 0.4);
  }
}

.logo-icon {
  font-size: 2.5rem;
}

.login-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 8px;
}

.login-subtitle {
  font-size: 0.95rem;
  color: #718096;
}

/* Form */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  color: #2d3748;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.label-icon {
  font-size: 1rem;
}

.form-input {
  width: 100%;
  padding: 14px 16px;
  font-size: 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  background: white;
  color: #2d3748;
  transition: all 0.3s ease;
  font-family: inherit;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
}

.form-input::placeholder {
  color: #a0aec0;
}

/* Login Button */
.login-btn {
  width: 100%;
  padding: 16px;
  font-size: 1rem;
  font-weight: 600;
  color: white;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
  font-family: inherit;
  margin-top: 8px;
}

.login-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 24px rgba(102, 126, 234, 0.4);
}

.login-btn:active:not(:disabled) {
  transform: translateY(0);
}

.login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.loading-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Message Box */
.message-box {
  margin-top: 20px;
  padding: 14px 16px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.9rem;
  font-weight: 500;
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message-box.error {
  background: #fee;
  color: #c53030;
  border: 1px solid #fc8181;
}

.message-box.success {
  background: #f0fdf4;
  color: #166534;
  border: 1px solid #86efac;
}

.message-icon {
  font-size: 1.2rem;
}

/* Footer */
.login-footer {
  margin-top: 32px;
  text-align: center;
}

.footer-text {
  font-size: 0.8rem;
  color: #a0aec0;
}

/* Responsive */
@media (max-width: 640px) {
  .login-container {
    padding: 32px 24px;
  }

  .login-title {
    font-size: 1.75rem;
  }

  .logo-circle {
    width: 70px;
    height: 70px;
  }

  .logo-icon {
    font-size: 2rem;
  }

  .form-input {
    padding: 12px 14px;
  }

  .login-btn {
    padding: 14px;
  }
}
</style>
