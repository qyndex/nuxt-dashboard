import type { NotificationListResponse } from "~/types/database";

/**
 * GET /api/notifications
 * List notifications for the authenticated user.
 */
export default defineEventHandler(async (event) => {
  const { user, client } = await requireAuth(event);

  const { data, error } = await client
    .from("notifications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch notifications",
    });
  }

  const notifications = data ?? [];
  const unreadCount = notifications.filter((n) => !n.read).length;

  const result: NotificationListResponse = {
    notifications,
    unread_count: unreadCount,
  };
  return result;
});
