<template>
  <header class="topbar">
    <div class="breadcrumbs" aria-label="Breadcrumb">
      <span>Dashboard</span>
    </div>
    <div class="actions">
      <div class="notif-wrapper">
        <button
          class="icon-btn"
          aria-label="Notifications"
          @click="showNotifications = !showNotifications"
        >
          <span aria-hidden="true">&#128276;</span>
          <span v-if="unreadCount > 0" class="notif-badge" aria-label="Unread notifications count">
            {{ unreadCount > 9 ? '9+' : unreadCount }}
          </span>
        </button>
        <NotificationsPanel :open="showNotifications" />
      </div>
      <div
        class="avatar"
        aria-label="User menu"
        role="button"
        tabindex="0"
      >
        {{ initials }}
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const { user } = useAuth();
const { unreadCount, fetchNotifications } = useNotifications();

const showNotifications = ref(false);

const initials = computed(() => {
  const name = user.value?.user_metadata?.full_name || user.value?.email || "U";
  if (name.includes("@")) return name[0].toUpperCase();
  return name.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2);
});

// Fetch notifications on mount
onMounted(() => {
  if (user.value) fetchNotifications();
});

// Close panel when clicking outside
onMounted(() => {
  const handler = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest(".notif-wrapper")) {
      showNotifications.value = false;
    }
  };
  document.addEventListener("click", handler);
  onUnmounted(() => document.removeEventListener("click", handler));
});
</script>

<style scoped>
.topbar { background: white; border-bottom: 1px solid #f1f5f9; padding: 0 1.5rem; height: 3.5rem; display: flex; align-items: center; justify-content: space-between; position: relative; }
.breadcrumbs { font-size: 0.9375rem; font-weight: 500; color: #475569; }
.actions { display: flex; align-items: center; gap: 0.75rem; }
.notif-wrapper { position: relative; }
.icon-btn { background: none; border: none; cursor: pointer; font-size: 1.125rem; width: 2rem; height: 2rem; border-radius: 0.375rem; display: flex; align-items: center; justify-content: center; position: relative; }
.icon-btn:hover { background: #f1f5f9; }
.notif-badge { position: absolute; top: -2px; right: -4px; background: #dc2626; color: white; font-size: 0.625rem; font-weight: 700; width: 1rem; height: 1rem; border-radius: 9999px; display: flex; align-items: center; justify-content: center; }
.avatar { width: 2rem; height: 2rem; border-radius: 9999px; background: #1e40af; color: white; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700; cursor: pointer; }
</style>
