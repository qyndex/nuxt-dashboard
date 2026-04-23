<template>
  <header class="topbar">
    <div class="breadcrumbs" aria-label="Breadcrumb">
      <span>Dashboard</span>
    </div>
    <div class="actions">
      <button class="icon-btn" aria-label="Notifications">
        <span aria-hidden="true">🔔</span>
      </button>
      <div class="avatar" aria-label="User menu" role="button" tabindex="0">AK</div>
    </div>
  </header>
</template>

<style scoped>
.topbar { background: white; border-bottom: 1px solid #f1f5f9; padding: 0 1.5rem; height: 3.5rem; display: flex; align-items: center; justify-content: space-between; }
.breadcrumbs { font-size: 0.9375rem; font-weight: 500; color: #475569; }
.actions { display: flex; align-items: center; gap: 0.75rem; }
.icon-btn { background: none; border: none; cursor: pointer; font-size: 1.125rem; width: 2rem; height: 2rem; border-radius: 0.375rem; display: flex; align-items: center; justify-content: center; }
.icon-btn:hover { background: #f1f5f9; }
.avatar { width: 2rem; height: 2rem; border-radius: 9999px; background: #1e40af; color: white; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700; cursor: pointer; }
</style>
