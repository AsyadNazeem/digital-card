<template>
  <section class="table-section">
    <div class="section-header">
      <button @click="loadUsers" class="refresh-btn">
        🔄 Refresh
      </button>
    </div>

    <div class="table-container">
      <table class="data-table">
        <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Phone</th>
          <th>Email</th>
          <th>Provider</th>
          <th>Contact Card</th>
          <th>Actions</th>
        </tr>
        </thead>

        <tbody>
        <tr v-for="u in users" :key="u.id">
          <td>{{ u.id }}</td>
          <td>{{ u.name }}</td>
          <td>{{ u.phone }}</td>
          <td>{{ u.email }}</td>
          <td>{{ u.provider }}</td>

          <td>
            <a :href="`http://localhost:5173/card/${u.phone}`"
               target="_blank"
               class="link-btn">
              🔗 View Card
            </a>
          </td>

          <td>
            <button @click="deleteUser(u)" class="action-btn delete">🗑️</button>
          </td>
        </tr>
        </tbody>
      </table>

      <div v-if="users.length === 0" class="empty-state">
        <div class="empty-icon">📭</div>
        <p>No users found</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onActivated } from "vue";
import adminApi from "../../services/adminApi";

const users = ref([]);

async function loadUsers() {
  try {
    const res = await adminApi.get("/users");
    users.value = res.data.users;
  } catch (err) {
    console.error("Failed to load users:", err);
  }
}

async function deleteUser(u) {
  if (!confirm(`Delete user "${u.name}"?`)) return;

  try {
    await adminApi.delete(`/user/${u.id}`);
    loadUsers();
  } catch (err) {
    alert("Failed to delete user");
  }
}

// Fixes your issue
onMounted(loadUsers);
onActivated(loadUsers);
</script>

<style scoped>
.table-section {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 4px;
}

.section-subtitle {
  font-size: 0.875rem;
  color: #718096;
}

.refresh-btn {
  padding: 10px 20px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-weight: 600;
}

.table-container {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th {
  padding: 14px 16px;
  background: #f8f9fa;
  font-weight: 600;
  text-align: left;
}

.data-table td {
  padding: 16px;
  border-bottom: 1px solid #e2e8f0;
}

.link-btn {
  color: #4f46e5;
  text-decoration: none;
  font-weight: 600;
}

.link-btn:hover {
  text-decoration: underline;
}

.action-btn.delete {
  background: #fee2e2;
  color: #b91c1c;
  padding: 6px 12px;
  border-radius: 8px;
  cursor: pointer;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: #718096;
}
.empty-icon {
  font-size: 3rem;
}
</style>
