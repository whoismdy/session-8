<script setup>
// Static stats for the demo; replace with real data later.
const stats = [
  { label: "Visitors", value: "12,480" },
  { label: "Projects", value: "8" },
  { label: "Tasks done", value: "94%" },
];
</script>

<template>
  <main class="dashboard">
    <h1>Dashboard</h1>

    <ul class="stats">
      <li v-for="s in stats" :key="s.label" class="card">
        <span class="value">{{ s.value }}</span>
        <span class="label">{{ s.label }}</span>
      </li>
    </ul>

    <nav class="tabs" aria-label="Dashboard sections">
      <RouterLink :to="{ name: 'dashboard-profile' }">Profile</RouterLink>
      <RouterLink :to="{ name: 'dashboard-settings' }">Settings</RouterLink>
    </nav>

    <!-- Child routes render here, inside the parent layout. -->
    <div class="panel"><RouterView /></div>
  </main>
</template>

<style scoped>
.dashboard {
  padding: 0 32px 48px;
  text-align: left;
  flex-grow: 1;
}
h1 {
  margin: 24px 0;
  font-size: 36px;
}
.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 16px;
  list-style: none;
  padding: 0;
  margin: 0 0 32px;
}
.card {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 20px;
  border: 1px solid var(--border);
  border-radius: 12px;
  box-shadow: var(--shadow);
}
.value {
  font-size: 28px;
  font-weight: 600;
  color: var(--text-h);
}
.tabs {
  display: flex;
  gap: 4px;
  border-bottom: 1px solid var(--border);
}
.tabs a {
  padding: 10px 16px;
  color: var(--text);
  text-decoration: none;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
}
.tabs a:hover {
  color: var(--text-h);
}
/* Exact-active: only the current child tab is highlighted. */
.tabs a.router-link-exact-active {
  color: var(--accent);
  border-bottom-color: var(--accent);
}
.tabs a:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
.panel {
  padding-top: 24px;
}
@media (max-width: 600px) {
  .dashboard {
    padding: 0 16px 32px;
  }
  h1 {
    font-size: 28px;
  }
}
</style>
