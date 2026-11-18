<script setup>
import ToggleProvider from "../components/ToggleProvider.vue";
</script>

<template>
  <main class="page">
    <h1>Scoped slots</h1>
    <p class="lead">
      <code>ToggleProvider</code> only knows the on/off logic. Each example below renders it
      with a completely different UI.
    </p>

    <!-- Example 1: a switch. `v-slot="{ on, toggle }"` destructures the slot props. -->
    <section class="box">
      <h2>As a switch</h2>
      <ToggleProvider v-slot="{ on, toggle }">
        <button
          type="button"
          class="switch"
          :class="{ on }"
          role="switch"
          :aria-checked="on"
          @click="toggle"
        >
          <span class="knob"></span>
        </button>
        <span class="state">Notifications are {{ on ? "ON" : "OFF" }}</span>
      </ToggleProvider>
    </section>

    <!-- Example 2: SAME logic, now a show/hide panel (initial open via prop). -->
    <section class="box">
      <h2>As a show / hide panel</h2>
      <ToggleProvider :initial="true" v-slot="{ on, toggle }">
        <button type="button" class="link" @click="toggle">
          {{ on ? "Hide" : "Show" }} details
        </button>
        <p v-if="on" class="details">
          Same component, different markup. The logic is written once and reused.
        </p>
      </ToggleProvider>
    </section>
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
.box {
  max-width: 420px;
  padding: 20px;
  margin-bottom: 20px;
  border: 1px solid var(--border);
  border-radius: 12px;
  box-shadow: var(--shadow);
}
.box > :deep(*) {
  vertical-align: middle;
}
.switch {
  position: relative;
  width: 48px;
  height: 26px;
  padding: 0;
  border: none;
  border-radius: 999px;
  background: var(--border);
  cursor: pointer;
  transition: background 0.2s;
}
.switch.on {
  background: var(--accent);
}
.knob {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #fff;
  transition: transform 0.2s;
}
.switch.on .knob {
  transform: translateX(22px);
}
.switch:focus-visible,
.link:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
.state {
  margin-left: 12px;
  color: var(--text-h);
}
.link {
  padding: 8px 14px;
  font: inherit;
  color: var(--accent);
  background: var(--accent-bg);
  border: 2px solid transparent;
  border-radius: 8px;
  cursor: pointer;
}
.link:hover {
  border-color: var(--accent-border);
}
.details {
  margin-top: 12px;
}
@media (max-width: 600px) {
  .page {
    padding: 0 16px 32px;
  }
}
</style>
