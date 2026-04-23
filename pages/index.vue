<template>
  <div>
    <div class="page-header">
      <h1>Analytics Overview</h1>
      <select v-model="period" aria-label="Select time period" class="period-select">
        <option value="7d">Last 7 days</option>
        <option value="30d">Last 30 days</option>
        <option value="90d">Last 90 days</option>
      </select>
    </div>

    <div v-if="pending" class="loading" role="status">Loading dashboard…</div>
    <template v-else-if="data">
      <div class="kpi-grid">
        <KpiCard
          v-for="kpi in data.kpis"
          :key="kpi.label"
          :kpi="kpi"
        />
      </div>

      <div class="charts-row">
        <div class="chart-card">
          <h2>Daily Active Users</h2>
          <DauChart :chart-data="data.dauSeries" />
        </div>
        <div class="chart-card">
          <h2>Traffic Sources</h2>
          <SourcesPie :chart-data="data.trafficSources" />
        </div>
      </div>

      <EventsTable :events="data.recentEvents" />
    </template>
    <div v-else-if="error" class="error" role="alert">Failed to load dashboard data.</div>
  </div>
</template>

<script setup lang="ts">
import type { DashboardData } from "~/server/api/dashboard.get";

useHead({ title: "Analytics — Dashboard" });

const period = ref<"7d" | "30d" | "90d">("30d");

const { data, pending, error } = useLazyFetch<DashboardData>(
  () => `/api/dashboard?period=${period.value}`,
  { watch: [period] }
);
</script>

<style scoped>
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
h1 { font-size: 1.5rem; font-weight: 700; }
.period-select { padding: 0.5rem 0.75rem; border: 1px solid #e2e8f0; border-radius: 0.5rem; font-size: 0.875rem; background: white; }
.kpi-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr)); gap: 1rem; margin-bottom: 1.5rem; }
.charts-row { display: grid; grid-template-columns: 1fr 340px; gap: 1rem; margin-bottom: 1.5rem; }
.chart-card { background: white; border-radius: 0.75rem; padding: 1.25rem 1.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
h2 { font-size: 1rem; font-weight: 600; margin-bottom: 1rem; }
.loading, .error { text-align: center; padding: 4rem; color: #94a3b8; }
.error { color: #dc2626; }
</style>
