<template>
  <div>
    <div class="page-header">
      <h1>Tasks</h1>
      <button class="add-btn" aria-label="Add new task" @click="showAddForm = true">
        + New Task
      </button>
    </div>

    <!-- Add Task Form -->
    <div v-if="showAddForm" class="task-form-card">
      <h2>Create Task</h2>
      <form @submit.prevent="handleCreate" class="task-form">
        <div class="field">
          <label for="new-title">Title</label>
          <input id="new-title" v-model="newTask.title" type="text" required aria-label="Task title" />
        </div>
        <div class="field">
          <label for="new-desc">Description</label>
          <textarea id="new-desc" v-model="newTask.description" rows="3" aria-label="Task description" />
        </div>
        <div class="field-row">
          <div class="field">
            <label for="new-priority">Priority</label>
            <select id="new-priority" v-model="newTask.priority" aria-label="Task priority">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div class="field">
            <label for="new-due">Due Date</label>
            <input id="new-due" v-model="newTask.due_date" type="date" aria-label="Due date" />
          </div>
        </div>
        <div class="form-actions">
          <button type="button" class="cancel-btn" aria-label="Cancel" @click="showAddForm = false">Cancel</button>
          <button type="submit" class="submit-btn" aria-label="Create task">Create</button>
        </div>
      </form>
    </div>

    <!-- Filters -->
    <div class="filters">
      <select v-model="statusFilter" aria-label="Filter by status" class="filter-select">
        <option value="">All statuses</option>
        <option value="pending">Pending</option>
        <option value="in_progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>
      <select v-model="priorityFilter" aria-label="Filter by priority" class="filter-select">
        <option value="">All priorities</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
    </div>

    <!-- Loading / Error -->
    <div v-if="loading" class="loading" role="status">Loading tasks...</div>
    <div v-else-if="error" class="error" role="alert">{{ error }}</div>

    <!-- Task List -->
    <div v-else-if="tasks?.tasks?.length" class="task-list">
      <div
        v-for="task in tasks.tasks"
        :key="task.id"
        class="task-card"
        :class="`priority-${task.priority}`"
      >
        <div class="task-header">
          <h3 class="task-title">{{ task.title }}</h3>
          <div class="task-actions">
            <select
              :value="task.status"
              class="status-select"
              :aria-label="`Change status for ${task.title}`"
              @change="handleStatusChange(task.id, ($event.target as HTMLSelectElement).value)"
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <button
              class="delete-btn"
              :aria-label="`Delete task ${task.title}`"
              @click="handleDelete(task.id)"
            >
              Delete
            </button>
          </div>
        </div>
        <p v-if="task.description" class="task-desc">{{ task.description }}</p>
        <div class="task-meta">
          <span class="badge" :class="`badge-${task.priority}`">{{ task.priority }}</span>
          <span v-if="task.due_date" class="due-date">Due: {{ task.due_date }}</span>
          <span v-if="task.profiles" class="assignee">{{ task.profiles.full_name }}</span>
        </div>
      </div>
    </div>

    <div v-else class="empty-state">
      <p>No tasks found. Create one to get started.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TaskPayload } from "~/types/database";

definePageMeta({ middleware: "auth" });
useHead({ title: "Tasks — DataKit" });

const { tasks, loading, error, fetchTasks, createTask, updateTaskStatus, deleteTask } = useTasks();

const showAddForm = ref(false);
const statusFilter = ref("");
const priorityFilter = ref("");

const newTask = reactive<TaskPayload>({
  title: "",
  description: "",
  priority: "medium",
  due_date: "",
});

// Fetch on mount and when filters change
watch([statusFilter, priorityFilter], () => {
  fetchTasks({
    status: statusFilter.value || undefined,
    priority: priorityFilter.value || undefined,
  });
}, { immediate: true });

async function handleCreate() {
  const result = await createTask({
    ...newTask,
    due_date: newTask.due_date || undefined,
  });
  if (result) {
    showAddForm.value = false;
    newTask.title = "";
    newTask.description = "";
    newTask.priority = "medium";
    newTask.due_date = "";
  }
}

async function handleStatusChange(id: string, status: string) {
  await updateTaskStatus(id, status);
}

async function handleDelete(id: string) {
  if (confirm("Are you sure you want to delete this task?")) {
    await deleteTask(id);
  }
}
</script>

<style scoped>
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
h1 { font-size: 1.5rem; font-weight: 700; }
.add-btn { background: #1e40af; color: white; border: none; padding: 0.5rem 1rem; border-radius: 0.5rem; font-size: 0.875rem; font-weight: 600; cursor: pointer; }
.add-btn:hover { background: #1e3a8a; }

.task-form-card { background: white; border-radius: 0.75rem; padding: 1.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.06); margin-bottom: 1.5rem; }
.task-form-card h2 { font-size: 1.125rem; font-weight: 600; margin-bottom: 1rem; }
.task-form { display: flex; flex-direction: column; gap: 0.75rem; }
.field { display: flex; flex-direction: column; gap: 0.25rem; }
.field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
label { font-size: 0.8125rem; font-weight: 600; color: #374151; }
input, textarea, select { padding: 0.5rem 0.75rem; border: 1px solid #e2e8f0; border-radius: 0.375rem; font-size: 0.875rem; }
input:focus, textarea:focus, select:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }
.form-actions { display: flex; gap: 0.5rem; justify-content: flex-end; margin-top: 0.5rem; }
.cancel-btn { background: #f1f5f9; border: none; padding: 0.5rem 1rem; border-radius: 0.375rem; font-size: 0.875rem; cursor: pointer; }
.submit-btn { background: #1e40af; color: white; border: none; padding: 0.5rem 1rem; border-radius: 0.375rem; font-size: 0.875rem; font-weight: 600; cursor: pointer; }

.filters { display: flex; gap: 0.75rem; margin-bottom: 1.5rem; }
.filter-select { padding: 0.5rem 0.75rem; border: 1px solid #e2e8f0; border-radius: 0.5rem; font-size: 0.875rem; background: white; }

.task-list { display: flex; flex-direction: column; gap: 0.75rem; }
.task-card { background: white; border-radius: 0.75rem; padding: 1.25rem 1.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.06); border-left: 4px solid #e2e8f0; }
.task-card.priority-high { border-left-color: #dc2626; }
.task-card.priority-medium { border-left-color: #f59e0b; }
.task-card.priority-low { border-left-color: #10b981; }

.task-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; }
.task-title { font-size: 1rem; font-weight: 600; }
.task-actions { display: flex; gap: 0.5rem; align-items: center; flex-shrink: 0; }
.status-select { padding: 0.25rem 0.5rem; border: 1px solid #e2e8f0; border-radius: 0.25rem; font-size: 0.75rem; }
.delete-btn { background: none; border: 1px solid #fecaca; color: #dc2626; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem; cursor: pointer; }
.delete-btn:hover { background: #fef2f2; }

.task-desc { color: #64748b; font-size: 0.875rem; margin-top: 0.5rem; }
.task-meta { display: flex; gap: 0.75rem; align-items: center; margin-top: 0.75rem; font-size: 0.75rem; }
.badge { padding: 0.125rem 0.5rem; border-radius: 9999px; font-weight: 600; text-transform: capitalize; }
.badge-high { background: #fef2f2; color: #dc2626; }
.badge-medium { background: #fffbeb; color: #d97706; }
.badge-low { background: #f0fdf4; color: #16a34a; }
.due-date { color: #64748b; }
.assignee { color: #475569; font-weight: 500; }

.loading, .error, .empty-state { text-align: center; padding: 4rem; color: #94a3b8; }
.error { color: #dc2626; }
</style>
