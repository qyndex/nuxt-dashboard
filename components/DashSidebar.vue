<template>
  <aside class="sidebar" aria-label="Navigation sidebar">
    <div class="brand">
      <span class="logo" aria-hidden="true">&#9670;</span>
      <span class="brand-name">DataKit</span>
    </div>
    <nav>
      <ul>
        <li v-for="item in nav" :key="item.href">
          <NuxtLink
            :href="item.href"
            :aria-current="route.path === item.href ? 'page' : undefined"
            class="nav-link"
            :class="{ active: route.path === item.href }"
          >
            <span class="icon" aria-hidden="true">{{ item.icon }}</span>
            <span>{{ item.label }}</span>
          </NuxtLink>
        </li>
      </ul>
    </nav>
    <div class="sidebar-footer" v-if="user">
      <button class="logout-btn" aria-label="Sign out" @click="handleLogout">Sign Out</button>
    </div>
  </aside>
</template>

<script setup lang="ts">
const route = useRoute();
const { user, logout } = useAuth();

const nav = [
  { href: "/", icon: "\u229E", label: "Overview" },
  { href: "/tasks", icon: "\u2611", label: "Tasks" },
  { href: "/settings", icon: "\u2699", label: "Settings" },
];

async function handleLogout() {
  await logout();
}
</script>

<style scoped>
.sidebar { background: #1e293b; color: white; display: flex; flex-direction: column; }
.brand { display: flex; align-items: center; gap: 0.75rem; padding: 1.25rem 1rem; border-bottom: 1px solid rgba(255,255,255,0.1); }
.logo { font-size: 1.5rem; }
.brand-name { font-weight: 700; font-size: 1.125rem; }
nav { padding: 1rem 0.5rem; flex: 1; }
ul { list-style: none; padding: 0; margin: 0; display: grid; gap: 0.25rem; }
.nav-link { display: flex; align-items: center; gap: 0.75rem; padding: 0.625rem 0.75rem; border-radius: 0.5rem; color: #94a3b8; text-decoration: none; font-size: 0.875rem; transition: background 0.15s; }
.nav-link:hover, .nav-link.active { background: rgba(255,255,255,0.1); color: white; }
.icon { font-size: 1.125rem; width: 1.25rem; flex-shrink: 0; }
.sidebar-footer { padding: 1rem; border-top: 1px solid rgba(255,255,255,0.1); }
.logout-btn { width: 100%; background: rgba(255,255,255,0.08); color: #94a3b8; border: none; padding: 0.5rem; border-radius: 0.375rem; font-size: 0.8125rem; cursor: pointer; }
.logout-btn:hover { background: rgba(255,255,255,0.15); color: white; }
</style>
