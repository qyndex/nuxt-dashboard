<template>
  <div class="notifications-panel" v-if="open" aria-label="Notifications panel">
    <div class="panel-header">
      <h3>Notifications</h3>
      <button
        v-if="unreadCount > 0"
        class="mark-all-btn"
        aria-label="Mark all notifications as read"
        @click="handleMarkAllRead"
      >
        Mark all read
      </button>
    </div>

    <div v-if="loading" class="panel-loading" role="status">Loading...</div>
    <div v-else-if="notifications?.notifications?.length" class="panel-list">
      <div
        v-for="n in notifications.notifications"
        :key="n.id"
        class="notification-item"
        :class="{ unread: !n.read }"
        role="button"
        :tabindex="0"
        :aria-label="`${n.read ? '' : 'Unread: '}${n.title}`"
        @click="handleRead(n.id, n.read)"
        @keydown.enter="handleRead(n.id, n.read)"
      >
        <div class="notif-dot" v-if="!n.read" aria-hidden="true" />
        <div class="notif-content">
          <p class="notif-title">{{ n.title }}</p>
          <p v-if="n.message" class="notif-message">{{ n.message }}</p>
          <p class="notif-time">{{ formatTime(n.created_at) }}</p>
        </div>
      </div>
    </div>
    <div v-else class="panel-empty">No notifications</div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ open: boolean }>();

const { notifications, loading, unreadCount, fetchNotifications, markAsRead, markAllAsRead } = useNotifications();

// Fetch when panel opens
watch(() => props.open, (val) => {
  if (val) fetchNotifications();
});

function formatTime(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return d.toLocaleDateString();
}

async function handleRead(id: string, alreadyRead: boolean) {
  if (!alreadyRead) {
    await markAsRead(id);
  }
}

async function handleMarkAllRead() {
  await markAllAsRead();
}
</script>

<style scoped>
.notifications-panel {
  position: absolute;
  top: 3.5rem;
  right: 1rem;
  width: 22rem;
  max-height: 28rem;
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.12);
  border: 1px solid #e2e8f0;
  z-index: 50;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #f1f5f9;
}
.panel-header h3 { font-size: 0.9375rem; font-weight: 600; }
.mark-all-btn {
  background: none;
  border: none;
  color: #1e40af;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
}
.mark-all-btn:hover { text-decoration: underline; }

.panel-list { overflow-y: auto; flex: 1; }
.notification-item {
  display: flex;
  gap: 0.625rem;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: background 0.1s;
  border-bottom: 1px solid #f8fafc;
}
.notification-item:hover { background: #f8fafc; }
.notification-item.unread { background: #eff6ff; }
.notif-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 9999px;
  background: #3b82f6;
  margin-top: 0.375rem;
  flex-shrink: 0;
}
.notif-content { flex: 1; min-width: 0; }
.notif-title { font-size: 0.8125rem; font-weight: 600; color: #1e293b; }
.notif-message { font-size: 0.75rem; color: #64748b; margin-top: 0.125rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.notif-time { font-size: 0.6875rem; color: #94a3b8; margin-top: 0.25rem; }

.panel-loading, .panel-empty { text-align: center; padding: 2rem 1rem; color: #94a3b8; font-size: 0.875rem; }
</style>
