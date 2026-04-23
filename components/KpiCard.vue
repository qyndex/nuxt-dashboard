<template>
  <div class="kpi-card" :aria-label="kpi.label">
    <p class="label">{{ kpi.label }}</p>
    <p class="value">{{ kpi.value }}</p>
    <p class="change" :class="kpi.trend">
      {{ kpi.trend === 'up' ? '\u2191' : '\u2193' }} {{ kpi.change }}
    </p>
  </div>
</template>

<script setup lang="ts">
import type { KpiSummary } from "~/types/database";
defineProps<{ kpi: KpiSummary }>();
</script>

<style scoped>
.kpi-card { background: white; border-radius: 0.75rem; padding: 1.25rem 1.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
.label { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: #94a3b8; margin-bottom: 0.5rem; }
.value { font-size: 1.75rem; font-weight: 700; margin-bottom: 0.25rem; }
.change { font-size: 0.875rem; font-weight: 500; }
.up { color: #16a34a; }
.down { color: #dc2626; }
</style>
