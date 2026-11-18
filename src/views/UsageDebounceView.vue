<script setup>
import { ref } from 'vue'
import { useDebounce } from '../composables/useDebounce'
import { useFilteredList } from '../composables/useFilteredList'

const props = defineProps({ initialQuery: { type: String, default: '' } })

const users = ref([
  { id: 1, name: 'Ali', city: 'Tehran' },
  { id: 2, name: 'Sara', city: 'Shiraz' },
  { id: 3, name: 'Reza', city: 'Tabriz' },
])
const query = ref(props.initialQuery)

// CORRECT: pass the ref itself -> reactivity is preserved
const debouncedQuery = useDebounce(query, 400)
const results = useFilteredList(users, debouncedQuery, ['name', 'city'])

// ---- COMMON MISTAKES (do NOT do these) ----

// WRONG 1: passing `.value` -> a plain string snapshot, never updates
// const debouncedQuery = useDebounce(query.value, 400)

// WRONG 2: destructuring a reactive object -> primitive copies, reactivity lost
// const state = reactive({ q: '' })
// const { q } = state
// useDebounce(q)            // broken
// useDebounce(() => state.q) // CORRECT: wrap the property in a getter

// WRONG 3: props are reactive, but a raw prop value is not
// useDebounce(props.initialQuery)        // broken: plain string
// useDebounce(() => props.initialQuery)  // CORRECT: getter
</script>

<template>
  <main class="page">
    <h1>Debounced search</h1>
    <p class="lead">
      The list filters only after you stop typing for 400ms (useDebounce + useFilteredList).
    </p>

    <input v-model="query" class="search" placeholder="Search name or city..." aria-label="Search" />
    <p class="status">
      Typing: <code>{{ query }}</code> &middot; Applied: <code>{{ debouncedQuery }}</code>
    </p>

    <ul class="list">
      <li v-for="u in results" :key="u.id" class="card">
        <span class="avatar" aria-hidden="true">{{ u.name[0] }}</span>
        <span class="name">{{ u.name }}</span>
        <span class="city">{{ u.city }}</span>
      </li>
      <li v-if="!results.length" class="empty">No results</li>
    </ul>
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
}
.search {
  width: 100%;
  max-width: 420px;
  box-sizing: border-box;
  padding: 10px 14px;
  font: inherit;
  color: var(--text-h);
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 8px;
}
.search:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
.status {
  margin: 12px 0 24px;
  font-size: 14px;
}
.list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 8px;
  max-width: 420px;
}
.card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border: 1px solid var(--border);
  border-radius: 10px;
}
.avatar {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--accent-bg);
  color: var(--accent);
  font-weight: 600;
}
.name {
  color: var(--text-h);
  font-weight: 500;
}
.city {
  margin-left: auto;
  font-size: 14px;
}
.empty {
  padding: 12px 0;
}
@media (max-width: 600px) {
  .page {
    padding: 0 16px 32px;
  }
}
</style>
