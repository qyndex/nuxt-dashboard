import type { Notification } from "~/types/database";

/**
 * PATCH /api/notifications/:id
 * Mark a notification as read.
 */
export default defineEventHandler(async (event) => {
  const { user, client } = await requireAuth(event);

  const id = getRouterParam(event, "id");
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Notification ID is required",
    });
  }

  const { data, error } = await client
    .from("notifications")
    .update({ read: true })
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to update notification",
    });
  }

  if (!data) {
    throw createError({
      statusCode: 404,
      statusMessage: "Notification not found",
    });
  }

  return data as Notification;
});
