<script setup>
import { ref, onMounted } from "vue";

const posts = ref([]);
const loading = ref(true);
const error = ref(null);

onMounted(async () => {
  try {
    const res = await fetch(
      "https://jsonplaceholder.typicode.com/posts?_limit=20",
    );
    // fetch doesn't reject on HTTP errors (404, 500), so check res.ok manually.
    if (!res.ok) throw new Error(`Request failed (${res.status})`);
    posts.value = await res.json();
  } catch (e) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <main class="posts">
    <h1>Posts</h1>
    <p v-if="loading">Loading...</p>
    <p v-else-if="error" class="error">{{ error }}</p>
    <ul v-else>
      <li v-for="post in posts" :key="post.id">
        <!-- Link by route name + params; the id fills the :id segment. -->
        <RouterLink
          :to="{
            name: 'post-detail',
            params: { id: post.id },
            // query: { tab: details },
          }"
        >
          <span class="num">#{{ post.id }}</span>
          {{ post.title }}
        </RouterLink>
      </li>
    </ul>
  </main>
</template>

<style scoped>
.posts {
  padding: 0 32px 48px;
  text-align: left;
  flex-grow: 1;
}
ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 8px;
}
a {
  display: block;
  padding: 14px 16px;
  border: 1px solid var(--border);
  border-radius: 10px;
  color: var(--text-h);
  text-decoration: none;
  transition: border-color 0.2s;
}
a:hover {
  border-color: var(--accent-border);
}
a:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
.num {
  color: var(--accent);
  margin-right: 8px;
}
.error {
  color: #dc2626;
}
@media (max-width: 600px) {
  .posts {
    padding: 0 16px 32px;
  }
}
</style>
