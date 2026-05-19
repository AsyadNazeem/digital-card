<template>
  <div class="admin-messages">
    <div class="messages-header">
      <h1>Messages</h1>
      <div class="header-actions">
        <div class="filter-buttons">
          <button
              @click="filterType = null"
              :class="['filter-btn', { active: filterType === null }]"
          >
            All ({{ totalMessages }})
          </button>
          <button
              @click="filterType = 'contact'"
              :class="['filter-btn', { active: filterType === 'contact' }]"
          >
            Contact
          </button>
          <button
              @click="filterType = 'plan_upgrade'"
              :class="['filter-btn', { active: filterType === 'plan_upgrade' }]"
          >
            Upgrades
          </button>
          <button
              @click="filterType = 'plan_downgrade'"
              :class="['filter-btn', { active: filterType === 'plan_downgrade' }]"
          >
            Downgrades
          </button>
          <button
              @click="filterType = 'plan_custom'"
              :class="['filter-btn', { active: filterType === 'plan_custom' }]"
          >
            Custom Plans
          </button>
        </div>
        <button @click="markAllAsRead" class="btn-action" v-if="unreadCount > 0">
          Mark all as read ({{ unreadCount }})
        </button>
        <input
            v-model="searchQuery"
            type="text"
            placeholder="Search messages..."
            class="search-input"
            @keyup.enter="performSearch"
        />
      </div>
    </div>

    <div class="messages-container">
      <div v-if="filteredMessages.length === 0" class="empty-state">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
        <p>{{ searchQuery ? 'No messages found' : 'No messages' }}</p>
      </div>

      <div v-else class="messages-list">
        <div
            v-for="message in filteredMessages"
            :key="message.id"
            :class="['message-item', { unread: !message.isRead }]"
            @click="selectMessage(message)"
        >
          <div class="message-avatar">
            {{ message.senderName.charAt(0).toUpperCase() }}
          </div>
          <div class="message-content">
            <div class="message-header-row">
              <span class="sender-name">{{ message.senderName }}</span>
              <span class="message-time">{{ formatTime(message.createdAt) }}</span>
            </div>
            <div class="message-subject">{{ message.subject || 'No subject' }}</div>
            <div class="message-preview">{{ message.body.substring(0, 100) }}...</div>
            <div class="message-meta" v-if="message.messageType !== 'contact'">
              <span class="badge" :class="`badge-${message.messageType}`">
                {{ formatMessageType(message.messageType) }}
              </span>
            </div>
          </div>
          <div v-if="!message.isRead" class="unread-indicator"></div>
        </div>
      </div>
    </div>

    <!-- Message Detail Modal -->
    <transition name="fade">
      <div v-if="selectedMessage" class="message-modal-overlay" @click="selectedMessage = null">
        <div class="message-modal" @click.stop>
          <div class="modal-header">
            <div>
              <h2>{{ selectedMessage.subject || 'No subject' }}</h2>
              <p class="modal-meta">
                From: <strong>{{ selectedMessage.senderName }}</strong>
                ({{ selectedMessage.senderEmail }})
              </p>
            </div>
            <button @click="selectedMessage = null" class="close-btn">×</button>
          </div>
          <div class="modal-body">
            <div class="message-meta-full">
              <p><strong>Date:</strong> {{ formatDate(selectedMessage.createdAt) }}</p>
              <p><strong>Type:</strong> <span class="badge" :class="`badge-${selectedMessage.messageType}`">{{ formatMessageType(selectedMessage.messageType) }}</span></p>
              <div v-if="selectedMessage.planRequest" class="plan-info">
                <p><strong>Plan Change:</strong> {{ selectedMessage.planRequest.from }} → {{ selectedMessage.planRequest.to }}</p>
              </div>
            </div>
            <div class="message-body">
              {{ selectedMessage.body }}
            </div>
          </div>
          <div class="modal-actions">
            <div class="reply-section">
              <textarea
                  v-model="replyText"
                  placeholder="Type your reply here..."
                  class="reply-textarea"
                  v-if="showReplyForm"
              ></textarea>
              <div class="reply-buttons" v-if="showReplyForm">
                <button @click="showReplyForm = false" class="btn-cancel">Cancel</button>
                <button @click="sendReply" class="btn-send" :disabled="!replyText.trim() || replySending">
                  {{ replySending ? 'Sending...' : 'Send Reply' }}
                </button>
              </div>
              <button v-else @click="showReplyForm = true" class="btn-reply">
                Reply
              </button>
            </div>
            <button @click="deleteMessage(selectedMessage.id)" class="btn-delete">
              Delete
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useAdminStore } from '@/store/adminStore.js'

const adminStore = useAdminStore()

const messages = ref([])
const selectedMessage = ref(null)
const searchQuery = ref('')
const filterType = ref(null)
const loading = ref(false)
const showReplyForm = ref(false)
const replyText = ref('')
const replySending = ref(false)

const unreadCount = computed(() => {
  return messages.value.filter(m => !m.isRead).length
})

const totalMessages = computed(() => {
  return messages.value.length
})

const filteredMessages = computed(() => {
  let filtered = messages.value

  // Apply type filter
  if (filterType.value) {
    filtered = filtered.filter(m => m.messageType === filterType.value)
  }

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(m =>
        m.senderName.toLowerCase().includes(query) ||
        m.senderEmail.toLowerCase().includes(query) ||
        m.subject.toLowerCase().includes(query) ||
        m.body.toLowerCase().includes(query)
    )
  }

  return filtered
})

// ── Load messages ──────────────────────────────────
const loadMessages = async () => {
  try {
    loading.value = true
    const result = await adminStore.loadMessages()
    if (result.success) {
      messages.value = adminStore.messages
    }
  } catch (error) {
    console.error('Failed to load messages:', error)
  } finally {
    loading.value = false
  }
}

// ── Load unread count ──────────────────────────────
const loadUnreadCount = async () => {
  try {
    await adminStore.loadUnreadMessages()
  } catch (error) {
    console.error('Failed to load unread count:', error)
  }
}

// ── Select message ────────────────────────────────
const selectMessage = async (message) => {
  selectedMessage.value = message
  showReplyForm.value = false
  replyText.value = ''

  // Mark as read
  if (!message.isRead) {
    try {
      await adminStore.markMessageAsRead(message.id)
      message.isRead = true
    } catch (error) {
      console.error('Failed to mark message as read:', error)
    }
  }
}

// ── Mark all as read ──────────────────────────────
const markAllAsRead = async () => {
  try {
    const result = await adminStore.markAllMessagesAsRead()
    if (result.success) {
      messages.value.forEach(m => m.isRead = true)
    }
  } catch (error) {
    console.error('Failed to mark all as read:', error)
  }
}

// ── Delete message ────────────────────────────────
const deleteMessage = async (messageId) => {
  if (confirm('Are you sure you want to delete this message?')) {
    try {
      const result = await adminStore.deleteMessage(messageId)
      if (result.success) {
        messages.value = messages.value.filter(m => m.id !== messageId)
        selectedMessage.value = null
      }
    } catch (error) {
      console.error('Failed to delete message:', error)
    }
  }
}

// ── Send reply ────────────────────────────────────
const sendReply = async () => {
  if (!replyText.value.trim() || !selectedMessage.value) return

  try {
    replySending.value = true
    const result = await adminStore.sendReply(selectedMessage.value.id, replyText.value)
    if (result.success) {
      replyText.value = ''
      showReplyForm.value = false
      alert('Reply sent successfully!')
    }
  } catch (error) {
    console.error('Failed to send reply:', error)
    alert('Failed to send reply')
  } finally {
    replySending.value = false
  }
}

// ── Perform search ────────────────────────────────
const performSearch = async () => {
  if (!searchQuery.value.trim()) {
    await loadMessages()
    return
  }

  try {
    loading.value = true
    const result = await adminStore.searchMessages(searchQuery.value)
    if (result.success) {
      messages.value = result.messages
    }
  } catch (error) {
    console.error('Search failed:', error)
  } finally {
    loading.value = false
  }
}

// ── Watch filter type ─────────────────────────────
watch(filterType, async (newType) => {
  if (newType) {
    try {
      loading.value = true
      const result = await adminStore.filterMessagesByType(newType)
      if (result.success) {
        messages.value = result.messages
      }
    } catch (error) {
      console.error('Filter failed:', error)
    } finally {
      loading.value = false
    }
  } else {
    await loadMessages()
  }
})

// ── Format helpers ────────────────────────────────
const formatTime = (date) => {
  const d = new Date(date)
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

const formatDate = (date) => {
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatMessageType = (type) => {
  const typeMap = {
    'contact': '💬 Contact',
    'plan_upgrade': '⬆️ Upgrade Request',
    'plan_downgrade': '⬇️ Downgrade Request',
    'plan_custom':    '✨ Custom Plan Inquiry',  // ← add this
    'support': '🆘 Support'
  }
  return typeMap[type] || type
}

// ── Lifecycle ─────────────────────────────────────
onMounted(() => {
  loadMessages()
  loadUnreadCount()

  // Poll for new messages every 30 seconds
  setInterval(() => {
    loadUnreadCount()
  }, 30000)
})
</script>

<style scoped>
.admin-messages {
  display: flex;
  flex-direction: column;
  gap: 24px;
  height: 100%;
}

.messages-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
}

.messages-header h1 {
  font-size: 28px;
  font-weight: 700;
  color: #2d1f1a;
  margin: 0;
}

.header-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

.filter-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 8px 12px;
  background: #f5f0eb;
  border: 1px solid #e5e1dc;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #6b5d57;
}

.filter-btn:hover {
  border-color: #5c4033;
  color: #5c4033;
}

.filter-btn.active {
  background: linear-gradient(135deg, #5c4033 0%, #3e2a23 100%);
  color: white;
  border-color: #5c4033;
}

.btn-action {
  padding: 10px 20px;
  background: linear-gradient(135deg, #5c4033 0%, #3e2a23 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 13px;
}

.btn-action:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(92, 64, 51, 0.3);
}

.search-input {
  padding: 10px 16px;
  border: 1px solid #e5e1dc;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: #5c4033;
  box-shadow: 0 0 0 3px rgba(92, 64, 51, 0.1);
}

.messages-container {
  flex: 1;
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e1dc;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: #6b5d57;
}

.empty-state svg {
  width: 64px;
  height: 64px;
  opacity: 0.5;
}

.empty-state p {
  font-size: 16px;
  margin: 0;
}

.messages-list {
  overflow-y: auto;
  max-height: 600px;
}

.message-item {
  display: flex;
  gap: 16px;
  padding: 16px 20px;
  border-bottom: 1px solid #e5e1dc;
  cursor: pointer;
  transition: background 0.2s ease;
  align-items: flex-start;
}

.message-item:hover {
  background: #fafaf8;
}

.message-item.unread {
  background: #f9f7f4;
}

.message-avatar {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #5c4033 0%, #3e2a23 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  flex-shrink: 0;
}

.message-content {
  flex: 1;
  min-width: 0;
}

.message-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.sender-name {
  font-weight: 600;
  color: #2d1f1a;
}

.message-time {
  font-size: 12px;
  color: #9a8b83;
}

.message-subject {
  font-weight: 500;
  color: #2d1f1a;
  margin-bottom: 4px;
}

.message-preview {
  font-size: 14px;
  color: #6b5d57;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 4px;
}

.message-meta {
  margin-top: 4px;
}

.badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
}

.badge-contact {
  background: #e0f2fe;
  color: #0369a1;
}

.badge-plan_upgrade {
  background: #dcfce7;
  color: #166534;
}

.badge-plan_downgrade {
  background: #fee2e2;
  color: #991b1b;
}

.badge-support {
  background: #fef3c7;
  color: #92400e;
}

.unread-indicator {
  width: 8px;
  height: 8px;
  background: #d4af37;
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 4px;
}

/* Message Modal */
.message-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 500;
  padding: 20px;
}

.message-modal {
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 700px;
  max-height: 85vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 24px;
  border-bottom: 1px solid #e5e1dc;
}

.modal-header h2 {
  margin: 0 0 4px 0;
  color: #2d1f1a;
  font-size: 20px;
}

.modal-meta {
  margin: 0;
  color: #6b5d57;
  font-size: 13px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 28px;
  color: #6b5d57;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-body {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}

.message-meta-full {
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e5e1dc;
}

.message-meta-full p {
  margin: 8px 0;
  color: #6b5d57;
  font-size: 13px;
}

.plan-info {
  margin-top: 12px;
  padding: 12px;
  background: #f0e8e4;
  border-radius: 6px;
  border-left: 3px solid #5c4033;
}

.badge-plan_custom {
  background: #f0e8e4;
  color: #5c4033;
}

.message-body {
  color: #2d1f1a;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
  font-size: 14px;
}

.modal-actions {
  padding: 16px 24px;
  border-top: 1px solid #e5e1dc;
  display: flex;
  gap: 12px;
  justify-content: space-between;
  align-items: flex-end;
}

.reply-section {
  flex: 1;
}

.reply-textarea {
  width: 100%;
  min-height: 80px;
  padding: 12px;
  border: 1px solid #e5e1dc;
  border-radius: 6px;
  font-family: inherit;
  font-size: 13px;
  resize: vertical;
  margin-bottom: 8px;
}

.reply-buttons {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.btn-reply {
  padding: 10px 16px;
  background: linear-gradient(135deg, #5c4033 0%, #3e2a23 100%);
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 12px;
}

.btn-reply:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(92, 64, 51, 0.3);
}

.btn-cancel {
  padding: 8px 14px;
  background: #f5f0eb;
  border: 1px solid #e5e1dc;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  font-size: 12px;
  color: #6b5d57;
  transition: all 0.2s ease;
}

.btn-cancel:hover {
  border-color: #5c4033;
  color: #5c4033;
}

.btn-send {
  padding: 8px 14px;
  background: linear-gradient(135deg, #5c4033 0%, #3e2a23 100%);
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s ease;
}

.btn-send:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(92, 64, 51, 0.3);
}

.btn-send:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-delete {
  padding: 10px 20px;
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-delete:hover {
  background: rgba(239, 68, 68, 0.2);
  transform: translateY(-2px);
}

/* Animations */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .messages-header {
    flex-direction: column;
    align-items: stretch;
  }

  .header-actions {
    width: 100%;
  }

  .filter-buttons {
    justify-content: space-between;
  }

  .message-modal {
    max-width: 100%;
    max-height: 90vh;
  }

  .modal-actions {
    flex-direction: column;
    gap: 8px;
  }

  .reply-buttons {
    width: 100%;
  }

  .btn-delete {
    width: 100%;
  }
}
</style>
