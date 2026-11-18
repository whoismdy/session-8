<script setup>
import { ref, computed, markRaw } from "vue";
import PanelInfo from "../components/demo/PanelInfo.vue";
import PanelCounter from "../components/demo/PanelCounter.vue";
import PanelAbout from "../components/demo/PanelAbout.vue";

// markRaw: component definitions must not be made reactive (Vue warns and wastes work).
const tabs = [
  { key: "info", label: "Info", component: markRaw(PanelInfo) },
  { key: "counter", label: "Counter", component: markRaw(PanelCounter) },
  { key: "about", label: "About", component: markRaw(PanelAbout) },
];

const activeIndex = ref(0);
// Direction of the slide: going to a higher tab slides left, to a lower tab slides right.
const direction = ref("next");

const current = computed(() => tabs[activeIndex.value].component);

function select(index) {
  if (index === activeIndex.value) return;
  // Must be set BEFORE changing the tab so the transition uses the right class.
  direction.value = index > activeIndex.value ? "next" : "prev";
  activeIndex.value = index;
}
</script>

<template>
  <main class="page">
    <h1>Dynamic component + Transition</h1>
    <p class="lead">
      One <code>&lt;component :is&gt;</code> swaps between three components.
      <code>&lt;Transition&gt;</code> animates the swap.
    </p>

    <div class="tabs" role="tablist">
      <button
        v-for="(tab, i) in tabs"
        :key="tab.key"
        type="button"
        role="tab"
        :aria-selected="i === activeIndex"
        :class="{ active: i === activeIndex }"
        @click="select(i)"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- The stage clips the sliding panels so they don't overflow the page. -->
    <div class="stage">
      <!--
        name: prefix for the CSS classes (slide-next-enter-active, ...).
        mode="out-in": old panel leaves first, then the new one enters (no overlap/jump).
      -->
      <Transition :name="`slide-${direction}`" mode="out-in">
        <!-- KeepAlive caches the inactive component, so its state (the counter) is kept. -->
        <KeepAlive>
          <component :is="current" />
        </KeepAlive>
      </Transition>
    </div>
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
.tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}
.tabs button {
  padding: 8px 18px;
  font: inherit;
  color: var(--text);
  background: none;
  border: 1px solid var(--border);
  border-radius: 999px;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.tabs button.active {
  color: var(--accent);
  background: var(--accent-bg);
  border-color: var(--accent-border);
}
.tabs button:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
.stage {
  max-width: 520px;
  overflow: hidden; /* hides the panel while it is outside the box */
}

/* ---- Transition classes ----
   enter-from -> enter-active -> enter-to   (element appearing)
   leave-from -> leave-active -> leave-to   (element disappearing)
   *-active holds the transition property + duration (slow on purpose: 0.5s, so it is obvious). */

.slide-next-enter-active,
.slide-next-leave-active,
.slide-prev-enter-active,
.slide-prev-leave-active {
  transition: transform 0.5s ease, opacity 0.5s ease;
}

/* next: old goes left, new comes from the right */
.slide-next-enter-from {
  transform: translateX(100%);
  opacity: 0;
}
.slide-next-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

/* prev: old goes right, new comes from the left */
.slide-prev-enter-from {
  transform: translateX(-100%);
  opacity: 0;
}
.slide-prev-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

/* Respect users who turned off animations in their OS. */
@media (prefers-reduced-motion: reduce) {
  .slide-next-enter-active,
  .slide-next-leave-active,
  .slide-prev-enter-active,
  .slide-prev-leave-active {
    transition: none;
  }
}

@media (max-width: 600px) {
  .page {
    padding: 0 16px 32px;
  }
}
</style>
