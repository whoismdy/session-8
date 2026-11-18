import { reactive, computed } from "vue";

// Demo-only user list. In a real app, credentials are checked by a backend API.
const USERS = {
  admin: { password: "admin", role: "admin" },
  user: { password: "user", role: "user" },
};

const KEY = "auth-user";

function load() {
  // try/catch: localStorage can throw (private mode) and JSON can be corrupted.
  try {
    return JSON.parse(localStorage.getItem(KEY));
  } catch {
    return null;
  }
}

// Module-level state = a tiny shared store (same instance for router and components).
// Loading from localStorage keeps the user logged in after a page refresh, which
// matters because the guard runs on the very first navigation.
const state = reactive({ user: load() });

export function useAuth() {
  const isLoggedIn = computed(() => state.user !== null);
  const role = computed(() => state.user?.role ?? null);

  function login(username, password) {
    const found = USERS[username];
    if (!found || found.password !== password) return false;
    state.user = { username, role: found.role };
    localStorage.setItem(KEY, JSON.stringify(state.user));
    return true;
  }

  function logout() {
    state.user = null;
    localStorage.removeItem(KEY);
  }

  return { state, isLoggedIn, role, login, logout };
}
