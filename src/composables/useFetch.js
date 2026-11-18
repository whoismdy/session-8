// composables/useFetch.js
import { ref, watchEffect, toValue } from 'vue'

export function useFetch(url) {
  // NOTE 1: Three pieces of state describe any async request:
  // the result, the error, and whether it is still loading.
  const data = ref(null)
  const error = ref(null)
  const loading = ref(false)

  let controller = null

  async function execute() {
    // NOTE 2: Cancel the previous request if a new one starts
    // (prevents race conditions and out-of-order responses).
    controller?.abort()
    controller = new AbortController()

    loading.value = true
    error.value = null

    try {
      // NOTE 3: `toValue` accepts a plain string, a ref, or a getter function,
      // so the caller can pass `'/api/users'`, `urlRef`, or `() => `/api/users/${id.value}``.
      const res = await fetch(toValue(url), { signal: controller.signal })

      // NOTE 4: fetch() does NOT throw on HTTP errors (404, 500...),
      // so we must check `res.ok` ourselves.
      if (!res.ok) throw new Error(`HTTP ${res.status}`)

      data.value = await res.json()
    } catch (e) {
      // NOTE 5: Aborting is intentional, not a real error — ignore it.
      if (e.name !== 'AbortError') error.value = e
    } finally {
      loading.value = false
    }
  }

  // NOTE 6: `watchEffect` runs immediately and re-runs whenever a reactive
  // value read inside it changes (here: the url ref/getter).
  // So changing the url automatically refetches.
  watchEffect(() => {
    toValue(url) // read it so the effect tracks it as a dependency
    execute()
  })

  // NOTE 7: Return state AND a function (`refetch`) so the component can
  // trigger a manual reload, e.g. from a "Retry" button.
  return { data, error, loading, refetch: execute }
}
