<script setup>
import { ref, watch } from "vue";

// Filled by the router because of `props: true` (route param :id -> prop).
// Route params are always strings.
const props = defineProps({
  id: { type: String, required: true },
});

const post = ref(null);
const loading = ref(true);
const error = ref(null);

// watch (immediate) instead of onMounted: when navigating /posts/1 -> /posts/2
// 
// Question: Why use watch instead of onMounted ?? Vue reuses this component instance.
watch(
  () => props.id,
  async (id, _old, onCleanup) => {
    // Abort the previous request if the id changes quickly (avoids stale data).
    const controller = new AbortController();
    onCleanup(() => controller.abort());

    loading.value = true;
    error.value = null;
    post.value = null;
    try {
      const res = await fetch(
        `https://jsonplaceholder.typicode.com/posts/${id}`,
        { signal: controller.signal },
      );
      if (res.status === 404) throw new Error("Post not found");
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      post.value = await res.json();
    } catch (e) {
      if (e.name === "AbortError") return; // superseded, ignore
      error.value = e.message;
    }
    loading.value = false;
  },
  { immediate: true },
);
</script>

<template>
  <main class="post">
    <RouterLink :to="{ name: 'posts' }" class="back"
      >&larr; All posts</RouterLink
    >
    <p v-if="loading">Loading...</p>
    <p v-else-if="error" class="error">{{ error }}</p>
    <article v-else>
      <h1>{{ post.title }}</h1>
      <p class="body">{{ post.body }}</p>
      <p class="meta">Post #{{ post.id }} &middot; User {{ post.userId }}</p>
    </article>
  </main>
</template>

<style scoped>
.post {
  padding: 0 32px 48px;
  text-align: left;
  flex-grow: 1;
}
.back {
  display: inline-block;
  margin: 24px 0 0;
  color: var(--accent);
  text-decoration: none;
}
h1 {
  font-size: 36px;
  text-transform: capitalize;
  line-height: 36px;
  @media (max-width: 600px) {
    font-size: 26px;
  }
}
.body {
  max-width: 65ch;
  white-space: pre-line;
  color: var(--text-h);
}
.meta {
  margin-top: 24px;
  font-size: 14px;
}
.error {
  color: #dc2626;
}
@media (max-width: 600px) {
  .post {
    padding: 0 16px 32px;
  }
}
</style>
