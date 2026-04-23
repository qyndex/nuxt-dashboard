import type { TaskPayload, Task } from "~/types/database";

/**
 * POST /api/tasks
 * Create a new task.
 */
export default defineEventHandler(async (event) => {
  const { user, client } = await requireAuth(event);

  const body = await readBody<TaskPayload>(event);

  if (!body.title?.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: "Title is required",
    });
  }

  const { data, error } = await client
    .from("tasks")
    .insert({
      title: body.title.trim(),
      description: body.description?.trim() || null,
      status: body.status || "pending",
      priority: body.priority || "medium",
      assigned_to: body.assigned_to || null,
      due_date: body.due_date || null,
    })
    .select()
    .single();

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to create task",
    });
  }

  setResponseStatus(event, 201);
  return data as Task;
});
