<script setup>
import AsyncBoundary from '../components/AsyncBoundary.vue'
</script>

<template>
  <main class="page">
  <h1>AsyncBoundary + slots</h1>
  <!-- Example 1: users rendered as cards -->
  <AsyncBoundary url="https://jsonplaceholder.typicode.com/users">
    <!-- Scoped default slot: `data` comes from the child.
         NOTE: `#default="{ data }"` is shorthand for `v-slot:default="{ data }"`. -->
    <template #default="{ data }">
      <div v-for="user in data" :key="user.id" class="card">
        <b>{{ user.name }}</b>
        <small>{{ user.email }}</small>
      </div>
    </template>

    <!-- Named slot (no data): custom loading UI -->
    <template #loading>
      <p>Fetching users, please wait...</p>
    </template>

    <!-- Named + scoped slot: destructure `retry` to wire up a button.
         The parent never needs to know HOW refetching works. -->
    <template #error="{ error, retry }">
      <p>Failed: {{ error.message }}</p>
      <button @click="retry">Try again</button>
    </template>
  </AsyncBoundary>

  <hr />

  <!-- Example 2: SAME component, completely different rendering for posts.
       This is the whole point of slots: logic is reused, UI is customized. -->
  <AsyncBoundary url="https://jsonplaceholder.typicode.com/posts?_limit=5">
    <template #default="{ data: posts }"> <!-- NOTE: rename `data` to `posts` while destructuring -->
      <ol>
        <li v-for="post in posts" :key="post.id">{{ post.title }}</li>
      </ol>
    </template>
  </AsyncBoundary>
  </main>
</template>

<style scoped>
.page {
  padding: 0 32px 48px;
  text-align: left;
  flex-grow: 1;
}
/* The parent styles the slot content; the child (AsyncBoundary) only owns the logic. */
.card {
  display: flex;
  flex-direction: column;
  padding: 12px 16px;
  margin-bottom: 8px;
  max-width: 420px;
  border: 1px solid var(--border);
  border-radius: 10px;
}
.card b {
  color: var(--text-h);
}
hr {
  margin: 32px 0;
  border: none;
  border-top: 1px solid var(--border);
}
ol {
  max-width: 60ch;
  padding-left: 20px;
}
li {
  margin-bottom: 6px;
}
button {
  padding: 8px 14px;
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
button:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
@media (max-width: 600px) {
  .page {
    padding: 0 16px 32px;
  }
}
</style>
