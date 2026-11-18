// composables/useLocalStorage.js
import { ref, watch } from 'vue'

export function useLocalStorage(key, defaultValue) {
  // NOTE 1: Reading from storage can fail (invalid JSON, blocked storage,
  // SSR where `window` does not exist). Always wrap it in try/catch.
  function read() {
    try {
      const raw = localStorage.getItem(key)
      return raw !== null ? JSON.parse(raw) : defaultValue
    } catch {
      return defaultValue
    }
  }

  // NOTE 2: Initialize the ref from storage so state survives page reloads.
  const data = ref(read())

  // NOTE 3: `watch` keeps storage in sync automatically.
  // The component just does `data.value = ...` and never touches localStorage.
  // `deep: true` is needed to detect changes inside objects/arrays.
  watch(
    data,
    (newValue) => {
      try {
        if (newValue === null || newValue === undefined) {
          localStorage.removeItem(key)
        } else {
          // NOTE 4: localStorage only stores strings, so we serialize to JSON.
          localStorage.setItem(key, JSON.stringify(newValue))
        }
      } catch (e) {
        console.error(`useLocalStorage: failed to save "${key}"`, e)
      }
    },
    { deep: true }
  )

  // NOTE 5: Returning the ref itself means it works like a normal ref
  // in the component: `const theme = useLocalStorage('theme', 'light')`.
  return data
}
