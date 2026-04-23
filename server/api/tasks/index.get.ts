import type { TaskListResponse } from "~/types/database";

/**
 * GET /api/tasks
 * List tasks with optional filtering.
 *
 * Query params:
 *   ?status=<string>    -- filter by status (pending, in_progress, completed)
 *   ?priority=<string>  -- filter by priority (low, medium, high)
 *   ?search=<string>    -- search title/description
 */
export default defineEventHandler(async (event) => {
  const { user, client } = await requireAuth(event);

  const query = getQuery(event);
  const status = (query.status as string) || null;
  const priority = (query.priority as string) || null;
  const search = (query.search as string) || null;

  let dbQuery = client
    .from("tasks")
    .select("*, profiles(*)", { count: "exact" })
    .order("created_at", { ascending: false });

  if (status) {
    dbQuery = dbQuery.eq("status", status);
  }

  if (priority) {
    dbQuery = dbQuery.eq("priority", priority);
  }

  if (search) {
    dbQuery = dbQuery.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
  }

  const { data, count, error } = await dbQuery;

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch tasks",
    });
  }

  const result: TaskListResponse = {
    tasks: data ?? [],
    total: count ?? 0,
  };
  return result;
});
