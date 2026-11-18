<template>
  <header class="header">
    <RouterLink :to="{ name: 'home' }" class="brand">session-8</RouterLink>
    <!-- aria-label lets screen readers identify this landmark. -->
    <nav class="nav" aria-label="Main">
      <!-- RouterLink adds .router-link-active (and -exact-active) automatically; we style those. -->
      <RouterLink :to="{ name: 'home' }">Home</RouterLink>
      <RouterLink :to="{ name: 'about' }">About</RouterLink>
      <RouterLink :to="{ name: 'dashboard-profile' }">Dashboard</RouterLink>
    </nav>
  </header>
  <RouterView />
</template>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 32px;
  border-bottom: 1px solid var(--border);
  margin-bottom: 40px;
}
.brand {
  font-weight: 600;
  color: var(--text-h);
  text-decoration: none;
}
.nav {
  display: flex;
  gap: 8px;
}
.nav a {
  padding: 6px 14px;
  border-radius: 999px;
  color: var(--text);
  text-decoration: none;
  transition:
    background 0.2s,
    color 0.2s;
}
.nav a:hover {
  background: var(--code-bg);
  color: var(--text-h);
}
/* Active parent link stays highlighted on child routes (/dashboard/settings too). */
.nav a.router-link-active {
  background: var(--accent-bg);
  color: var(--accent);
}
.nav a:focus-visible,
.brand:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
@media (max-width: 600px) {
  .header {
    padding: 12px 16px;
  }
}
</style>
