/**
 * DELETE /api/tasks/:id
 * Delete a task.
 */
export default defineEventHandler(async (event) => {
  const { user, client } = await requireAuth(event);

  const id = getRouterParam(event, "id");
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Task ID is required",
    });
  }

  const { error } = await client
    .from("tasks")
    .delete()
    .eq("id", id);

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to delete task",
    });
  }

  setResponseStatus(event, 204);
  return null;
});
