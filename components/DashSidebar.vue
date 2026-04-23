<template>
  <aside class="sidebar" aria-label="Navigation sidebar">
    <div class="brand">
      <span class="logo" aria-hidden="true">◈</span>
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
  </aside>
</template>

<script setup lang="ts">
const route = useRoute();
const nav = [
  { href: "/", icon: "⊞", label: "Overview" },
  { href: "/users", icon: "👥", label: "Users" },
  { href: "/reports", icon: "📊", label: "Reports" },
  { href: "/settings", icon: "⚙️", label: "Settings" },
];
</script>

<style scoped>
.sidebar { background: #1e293b; color: white; display: flex; flex-direction: column; }
.brand { display: flex; align-items: center; gap: 0.75rem; padding: 1.25rem 1rem; border-bottom: 1px solid rgba(255,255,255,0.1); }
.logo { font-size: 1.5rem; }
.brand-name { font-weight: 700; font-size: 1.125rem; }
nav { padding: 1rem 0.5rem; }
ul { list-style: none; padding: 0; margin: 0; display: grid; gap: 0.25rem; }
.nav-link { display: flex; align-items: center; gap: 0.75rem; padding: 0.625rem 0.75rem; border-radius: 0.5rem; color: #94a3b8; text-decoration: none; font-size: 0.875rem; transition: background 0.15s; }
.nav-link:hover, .nav-link.active { background: rgba(255,255,255,0.1); color: white; }
.icon { font-size: 1.125rem; width: 1.25rem; flex-shrink: 0; }
</style>
