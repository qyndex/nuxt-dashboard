<template>
  <div class="shell">
    <DashSidebar />
    <div class="main">
      <DashTopbar />
      <main class="content">
        <NuxtPage />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({ htmlAttrs: { lang: "en" } });
</script>

<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { font-family: system-ui, -apple-system, sans-serif; color: #1e293b; }
.shell { display: grid; grid-template-columns: 240px 1fr; min-height: 100vh; }
.main { display: flex; flex-direction: column; min-width: 0; background: #f8fafc; }
.content { flex: 1; padding: 1.5rem; overflow-y: auto; }
</style>
