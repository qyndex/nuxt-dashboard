import type { TaskPayload, Task } from "~/types/database";

/**
 * PUT /api/tasks/:id
 * Update an existing task.
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

  const body = await readBody<Partial<TaskPayload>>(event);

  const updates: Record<string, unknown> = {};
  if (body.title !== undefined) updates.title = body.title.trim();
  if (body.description !== undefined) updates.description = body.description?.trim() || null;
  if (body.status !== undefined) updates.status = body.status;
  if (body.priority !== undefined) updates.priority = body.priority;
  if (body.assigned_to !== undefined) updates.assigned_to = body.assigned_to || null;
  if (body.due_date !== undefined) updates.due_date = body.due_date || null;

  if (Object.keys(updates).length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: "No fields to update",
    });
  }

  const { data, error } = await client
    .from("tasks")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to update task",
    });
  }

  if (!data) {
    throw createError({
      statusCode: 404,
      statusMessage: "Task not found",
    });
  }

  return data as Task;
});
