<script setup>
import { useRouter } from "vue-router";
import { useAuth } from "./stores/auth";

const router = useRouter();
const { state, isLoggedIn, role, logout } = useAuth();

function onLogout() {
  logout();
  // Leave the (possibly protected) page right away.
  router.push({ name: "home" });
}
</script>

<template>
  <header class="header">
    <RouterLink :to="{ name: 'home' }" class="brand">session-8</RouterLink>
    <!-- aria-label lets screen readers identify this landmark. -->
    <nav class="nav" aria-label="Main">
      <!-- RouterLink adds .router-link-active (and -exact-active) automatically; we style those. -->
      <RouterLink :to="{ name: 'home' }">Home</RouterLink>
      <RouterLink :to="{ name: 'about' }">About</RouterLink>
      <RouterLink :to="{ name: 'posts' }">Posts</RouterLink>
      <RouterLink :to="{ name: 'dashboard-profile' }">Dashboard</RouterLink>
      <!-- UI hiding is only convenience; the real protection is the router guard. -->
      <RouterLink v-if="role === 'admin'" :to="{ name: 'admin' }">Admin</RouterLink>
      <RouterLink v-if="!isLoggedIn" :to="{ name: 'login' }">Login</RouterLink>
      <button v-else type="button" class="logout" @click="onLogout">
        Logout ({{ state.user.username }})
      </button>
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
.logout {
  font: inherit;
  padding: 6px 14px;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: none;
  color: var(--text);
  cursor: pointer;
}
.logout:hover {
  color: var(--text-h);
}
@media (max-width: 600px) {
  .header {
    padding: 12px 16px;
  }
}
</style>
