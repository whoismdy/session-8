// composables/useDebounce.js
import { ref, watch, readonly, toValue, onScopeDispose } from 'vue'

// Takes a REACTIVE input (ref, computed, or getter) and returns a read-only ref
// that updates only after the source has stopped changing for `delay` ms.
// Typical use: search boxes, so we don't hit the API on every keystroke.
export function useDebounce(source, delay = 300) {
  // NOTE 1: `source` can be a plain value, a ref, or a getter function.
  // `toValue` normalizes all of them, so the caller can pass whatever they have.
  const debounced = ref(toValue(source))
  let timer = null

  // NOTE 2: We must watch a GETTER `() => toValue(source)`, not `source` itself.
  // Watching `source` directly would fail for getters and plain values
  // (e.g. `() => props.query`), and Vue would warn about an invalid watch source.
  watch(
    () => toValue(source),
    (newValue) => {
      // NOTE 3: Always clear the previous timer first, otherwise every change
      // would still fire its own update (that's throttling-by-accident, not debounce).
      clearTimeout(timer)
      timer = setTimeout(() => {
        debounced.value = newValue
      }, toValue(delay)) // NOTE 4: `delay` can be reactive too — read it fresh each time.
    }
  )

  // NOTE 5: Cleanup. If the component unmounts while a timer is pending,
  // the callback would still run and touch a dead component (memory leak / stale update).
  // `onScopeDispose` works inside components AND inside standalone effect scopes.
  onScopeDispose(() => clearTimeout(timer))

  // NOTE 6: Return `readonly` so consumers can't accidentally write to it.
  // The only legit way to change it is by changing the source.
  return readonly(debounced)
}
