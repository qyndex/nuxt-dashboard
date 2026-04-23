<template>
  <div>
    <div class="page-header">
      <h1>Analytics Overview</h1>
    </div>

    <div v-if="pending" class="loading" role="status">Loading dashboard...</div>
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
          <h2>Monthly Revenue</h2>
          <div class="chart-table" aria-label="Revenue history">
            <div
              v-for="item in data.revenueHistory"
              :key="item.period"
              class="chart-bar-row"
            >
              <span class="bar-label">{{ item.period }}</span>
              <div class="bar-track">
                <div
                  class="bar-fill revenue"
                  :style="{ width: barWidth(item.value, maxRevenue) }"
                  :aria-label="`$${item.value.toLocaleString()}`"
                />
              </div>
              <span class="bar-value">${{ item.value.toLocaleString() }}</span>
            </div>
          </div>
        </div>
        <div class="chart-card">
          <h2>Active Users</h2>
          <div class="chart-table" aria-label="User history">
            <div
              v-for="item in data.userHistory"
              :key="item.period"
              class="chart-bar-row"
            >
              <span class="bar-label">{{ item.period }}</span>
              <div class="bar-track">
                <div
                  class="bar-fill users"
                  :style="{ width: barWidth(item.value, maxUsers) }"
                  :aria-label="`${item.value.toLocaleString()} users`"
                />
              </div>
              <span class="bar-value">{{ item.value.toLocaleString() }}</span>
            </div>
          </div>
        </div>
      </div>
    </template>
    <div v-else-if="error" class="error" role="alert">{{ error }}</div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: "auth" });
useHead({ title: "Analytics \u2014 DataKit" });

const { data, pending, error, refresh } = useDashboard();

onMounted(() => {
  refresh();
});

const maxRevenue = computed(() => {
  if (!data.value?.revenueHistory?.length) return 1;
  return Math.max(...data.value.revenueHistory.map((r) => r.value));
});

const maxUsers = computed(() => {
  if (!data.value?.userHistory?.length) return 1;
  return Math.max(...data.value.userHistory.map((u) => u.value));
});

function barWidth(value: number, max: number): string {
  return `${Math.round((value / max) * 100)}%`;
}
</script>

<style scoped>
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
h1 { font-size: 1.5rem; font-weight: 700; }
.kpi-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr)); gap: 1rem; margin-bottom: 1.5rem; }
.charts-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem; }
.chart-card { background: white; border-radius: 0.75rem; padding: 1.25rem 1.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
h2 { font-size: 1rem; font-weight: 600; margin-bottom: 1rem; }

.chart-table { display: flex; flex-direction: column; gap: 0.5rem; }
.chart-bar-row { display: grid; grid-template-columns: 4rem 1fr 5rem; align-items: center; gap: 0.5rem; }
.bar-label { font-size: 0.75rem; color: #64748b; }
.bar-track { height: 1.25rem; background: #f1f5f9; border-radius: 0.25rem; overflow: hidden; }
.bar-fill { height: 100%; border-radius: 0.25rem; transition: width 0.3s ease; }
.bar-fill.revenue { background: #1e40af; }
.bar-fill.users { background: #7c3aed; }
.bar-value { font-size: 0.75rem; font-weight: 600; color: #1e293b; text-align: right; }

.loading, .error { text-align: center; padding: 4rem; color: #94a3b8; }
.error { color: #dc2626; }

@media (max-width: 768px) {
  .charts-row { grid-template-columns: 1fr; }
}
</style>
