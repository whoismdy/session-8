// composables/useFilteredList.js
import { computed, toValue } from 'vue'

// Takes TWO reactive inputs (a list and a query) and returns a computed result.
export function useFilteredList(list, query, keys = ['name']) {
  // NOTE 1: Use `computed` (not watch + ref) for derived data.
  // It is cached, lazy, and automatically tracks every reactive value read inside it.
  return computed(() => {
    // NOTE 2: Read `.value` / call `toValue` INSIDE the computed callback.
    // If you read it outside (once, at setup time), you capture a snapshot
    // and the result will never update again.
    const items = toValue(list) ?? []
    const q = toValue(query)?.trim().toLowerCase()

    // NOTE 3: Handle empty / null states. Inputs often start as null
    // (e.g. data from useFetch before the response arrives).
    if (!q) return items

    return items.filter((item) =>
      keys.some((k) => String(item[k] ?? '').toLowerCase().includes(q))
    )
  })
}

// NOTE 4: Never mutate the input inside a composable.
// `items.sort()` or `items.push()` would change the caller's original array.
// Copy first if you need to sort: `[...items].sort(...)`.
