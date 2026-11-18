<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuth } from "../stores/auth";

const route = useRoute();
const router = useRouter();
const { login } = useAuth();

const username = ref("");
const password = ref("");
const error = ref("");

function submit() {
  if (!login(username.value, password.value)) {
    error.value = "Invalid username or password";
    return;
  }
  // Go back to the page the guard interrupted (?redirect=...), else the dashboard.
  // Only accept internal paths ("/x" but not "//evil.com"): prevents open-redirect attacks.
  const target = String(route.query.redirect ?? "");
  const safe = target.startsWith("/") && !target.startsWith("//");
  router.push(safe ? target : { name: "dashboard-profile" });
}
</script>

<template>
  <main class="login">
    <h1>Login</h1>
    <p v-if="route.query.redirect" class="hint">Please log in to continue.</p>
    <form @submit.prevent="submit">
      <label for="u">Username</label>
      <input id="u" v-model="username" autocomplete="username" />
      <label for="p">Password</label>
      <input id="p" v-model="password" type="password" autocomplete="current-password" />
      <p v-if="error" class="error" role="alert">{{ error }}</p>
      <button type="submit">Login</button>
    </form>
    <p class="hint">Demo: <code>admin / admin</code> or <code>user / user</code></p>
  </main>
</template>

<style scoped>
.login {
  padding: 0 32px 48px;
  text-align: left;
  flex-grow: 1;
  max-width: 420px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
}
form {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}
label {
  color: var(--text-h);
  font-size: 15px;
}
input {
  padding: 10px 12px;
  font: inherit;
  color: var(--text-h);
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  margin-bottom: 8px;
}
input:focus-visible,
button:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
button {
  align-self: flex-start;
  padding: 10px 18px;
  font: inherit;
  color: var(--accent);
  background: var(--accent-bg);
  border: 2px solid transparent;
  border-radius: 8px;
  cursor: pointer;
}
button:hover {
  border-color: var(--accent-border);
}
.error {
  color: #dc2626;
}
.hint {
  font-size: 14px;
}
</style>
