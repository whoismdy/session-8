<!-- AsyncBoundary.vue -->
<!-- A reusable component that handles the loading / error / empty / success
     states of a request. The PARENT decides how each state looks (via slots),
     the CHILD owns the logic (fetching) and passes data back to the parent. -->
<script setup>
import { computed } from 'vue'
import { useFetch } from '../composables/useFetch'

const props = defineProps({
  url: { type: String, required: true },
})

// NOTE 1: Pass a getter so the request re-runs when the `url` prop changes
// (a raw `props.url` would be a plain string and lose reactivity).
const { data, error, loading, refetch } = useFetch(() => props.url)

const isEmpty = computed(() => Array.isArray(data.value) && data.value.length === 0)
</script>

<template>
  <!-- NOTE 2: NAMED slot with fallback content.
       The parent can override it with <template #loading>, otherwise the
       default text below is shown. No data is passed, so it is a "pure" named slot. -->
  <div v-if="loading">
    <slot name="loading">Loading...</slot>
  </div>

  <!-- NOTE 3: NAMED + SCOPED slot.
       The child passes `error` and `retry` UP to the parent through slot props.
       The parent decides the UI, but the retry LOGIC stays inside the child. -->
  <div v-else-if="error">
    <slot name="error" :error="error" :retry="refetch">
      Something went wrong: {{ error.message }}
    </slot>
  </div>

  <!-- NOTE 4: Another named slot, shown when the request succeeded but returned []. -->
  <div v-else-if="isEmpty">
    <slot name="empty">Nothing to show.</slot>
  </div>

  <!-- NOTE 5: The DEFAULT slot is scoped too: it receives `data`.
       The child knows the data, the parent knows how to render it. -->
  <div v-else>
    <slot :data="data" />
  </div>
</template>
