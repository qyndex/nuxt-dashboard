import type { NotificationListResponse, Notification } from "~/types/database";

/**
 * Composable for notification management.
 */
export function useNotifications() {
  const { authFetch } = useAuth();

  const notifications = useState<NotificationListResponse | null>("notifications-data", () => null);
  const loading = useState<boolean>("notifications-loading", () => false);
  const error = useState<string | null>("notifications-error", () => null);

  /** Fetch all notifications for the current user */
  async function fetchNotifications() {
    loading.value = true;
    error.value = null;
    try {
      const data = await authFetch<NotificationListResponse>("/api/notifications");
      notifications.value = data;
    } catch (e) {
      error.value = e instanceof Error ? e.message : "Failed to fetch notifications";
    } finally {
      loading.value = false;
    }
  }

  /** Mark a single notification as read */
  async function markAsRead(id: string): Promise<Notification | null> {
    error.value = null;
    try {
      const result = await authFetch<Notification>(`/api/notifications/${id}`, {
        method: "PATCH",
      });
      await fetchNotifications();
      return result;
    } catch (e) {
      error.value = e instanceof Error ? e.message : "Failed to mark notification as read";
      return null;
    }
  }

  /** Mark all notifications as read */
  async function markAllAsRead(): Promise<boolean> {
    error.value = null;
    try {
      await authFetch("/api/notifications/read-all", { method: "POST" });
      await fetchNotifications();
      return true;
    } catch (e) {
      error.value = e instanceof Error ? e.message : "Failed to mark all as read";
      return false;
    }
  }

  /** Computed unread count */
  const unreadCount = computed(() => notifications.value?.unread_count ?? 0);

  return {
    notifications: readonly(notifications),
    loading: readonly(loading),
    error: readonly(error),
    unreadCount,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
  };
}
