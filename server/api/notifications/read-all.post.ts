/**
 * POST /api/notifications/read-all
 * Mark all notifications as read for the authenticated user.
 */
export default defineEventHandler(async (event) => {
  const { user, client } = await requireAuth(event);

  const { error } = await client
    .from("notifications")
    .update({ read: true })
    .eq("user_id", user.id)
    .eq("read", false);

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to mark notifications as read",
    });
  }

  return { success: true };
});
