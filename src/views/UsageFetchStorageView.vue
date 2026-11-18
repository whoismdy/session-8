<script setup>
import { useFetch } from "../composables/useFetch";
import { useLocalStorage } from "../composables/useLocalStorage";

// useLocalStorage: these survive a page refresh. Just assign .value, no manual storage code.
const userId = useLocalStorage("demo-user-id", 1);
const note = useLocalStorage("demo-note", "");

// useFetch: pass a GETTER so the url is reactive. When userId changes, it refetches
// automatically (and aborts the previous request).
const { data: user, loading, error, refetch } = useFetch(
  () => `https://jsonplaceholder.typicode.com/users/${userId.value}`,
);

function next() {
  userId.value = userId.value >= 10 ? 1 : userId.value + 1;
}
function prev() {
  userId.value = userId.value <= 1 ? 10 : userId.value - 1;
}
</script>

<template>
  <main class="page">
    <h1>Fetch &amp; local storage</h1>
    <p class="lead">
      The selected user id and your note are saved in the browser (useLocalStorage).
      User data is loaded with useFetch.
    </p>

    <section class="panel">
      <div class="toolbar">
        <button type="button" @click="prev">&larr; Prev</button>
        <span class="id">User #{{ userId }}</span>
        <button type="button" @click="next">Next &rarr;</button>
        <button type="button" class="ghost" @click="refetch">Reload</button>
      </div>

      <p v-if="loading">Loading...</p>
      <div v-else-if="error" class="error" role="alert">
        <p>Failed: {{ error.message }}</p>
        <button type="button" @click="refetch">Retry</button>
      </div>
      <dl v-else-if="user" class="info">
        <dt>Name</dt>
        <dd>{{ user.name }}</dd>
        <dt>Email</dt>
        <dd>{{ user.email }}</dd>
        <dt>City</dt>
        <dd>{{ user.address.city }}</dd>
        <dt>Company</dt>
        <dd>{{ user.company.name }}</dd>
      </dl>
    </section>

    <section class="panel">
      <label for="note">Your note (autosaved)</label>
      <textarea id="note" v-model="note" rows="4" placeholder="Write something and refresh the page..."></textarea>
      <button type="button" class="ghost" @click="note = ''">Clear</button>
    </section>
  </main>
</template>

<style scoped>
.page {
  padding: 0 32px 48px;
  text-align: left;
  flex-grow: 1;
}
.lead {
  margin-bottom: 24px;
  max-width: 60ch;
}
.panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 480px;
  padding: 20px;
  margin-bottom: 24px;
  border: 1px solid var(--border);
  border-radius: 12px;
  box-shadow: var(--shadow);
}
.toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.id {
  color: var(--text-h);
  font-weight: 600;
  min-width: 80px;
  text-align: center;
}
button {
  padding: 8px 14px;
  font: inherit;
  color: var(--accent);
  background: var(--accent-bg);
  border: 2px solid transparent;
  border-radius: 8px;
  cursor: pointer;
  transition: border-color 0.3s;
}
button:hover {
  border-color: var(--accent-border);
}
button.ghost {
  color: var(--text);
  background: none;
  border-color: var(--border);
}
button:focus-visible,
textarea:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
.info {
  display: grid;
  grid-template-columns: max-content 1fr;
  gap: 8px 20px;
  margin: 0;
}
dd {
  margin: 0;
  color: var(--text-h);
}
.error {
  color: #dc2626;
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-start;
}
label {
  color: var(--text-h);
  font-size: 15px;
}
textarea {
  font: inherit;
  padding: 10px 12px;
  color: var(--text-h);
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  resize: vertical;
}
.panel button.ghost:last-child {
  align-self: flex-start;
}
@media (max-width: 600px) {
  .page {
    padding: 0 16px 32px;
  }
}
</style>
