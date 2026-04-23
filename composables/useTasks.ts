import type { TaskListResponse, TaskPayload, Task } from "~/types/database";

/**
 * Composable for task management with Supabase-backed CRUD.
 */
export function useTasks() {
  const { authFetch } = useAuth();

  const tasks = useState<TaskListResponse | null>("tasks-data", () => null);
  const loading = useState<boolean>("tasks-loading", () => false);
  const error = useState<string | null>("tasks-error", () => null);

  /** Fetch all tasks with optional filters */
  async function fetchTasks(filters?: { status?: string; priority?: string; search?: string }) {
    loading.value = true;
    error.value = null;
    try {
      const params = new URLSearchParams();
      if (filters?.status) params.set("status", filters.status);
      if (filters?.priority) params.set("priority", filters.priority);
      if (filters?.search) params.set("search", filters.search);

      const qs = params.toString();
      const url = `/api/tasks${qs ? `?${qs}` : ""}`;
      const data = await authFetch<TaskListResponse>(url);
      tasks.value = data;
    } catch (e) {
      error.value = e instanceof Error ? e.message : "Failed to fetch tasks";
    } finally {
      loading.value = false;
    }
  }

  /** Create a new task */
  async function createTask(payload: TaskPayload): Promise<Task | null> {
    error.value = null;
    try {
      const task = await authFetch<Task>("/api/tasks", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      await fetchTasks();
      return task;
    } catch (e) {
      error.value = e instanceof Error ? e.message : "Failed to create task";
      return null;
    }
  }

  /** Update an existing task */
  async function updateTask(id: string, payload: Partial<TaskPayload>): Promise<Task | null> {
    error.value = null;
    try {
      const task = await authFetch<Task>(`/api/tasks/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      await fetchTasks();
      return task;
    } catch (e) {
      error.value = e instanceof Error ? e.message : "Failed to update task";
      return null;
    }
  }

  /** Delete a task */
  async function deleteTask(id: string): Promise<boolean> {
    error.value = null;
    try {
      await authFetch(`/api/tasks/${id}`, { method: "DELETE" });
      await fetchTasks();
      return true;
    } catch (e) {
      error.value = e instanceof Error ? e.message : "Failed to delete task";
      return false;
    }
  }

  /** Update just the status of a task */
  async function updateTaskStatus(id: string, status: string): Promise<Task | null> {
    return updateTask(id, { status });
  }

  return {
    tasks: readonly(tasks),
    loading: readonly(loading),
    error: readonly(error),
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
  };
}
