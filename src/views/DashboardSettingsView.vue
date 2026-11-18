<script setup>
import { reactive } from "vue";

const form = reactive({
  name: "Jane Doe",
  email: "jane@example.com",
  notifications: true,
});

function save() {
  // Hook up to a real API later.
  console.log("Saved", { ...form });
}
</script>

<template>
  <!-- .prevent stops the native page reload on submit. -->
  <form class="settings" @submit.prevent="save">
    <h2>Settings</h2>

    <!-- Labels with for/id so clicking the label focuses the input (accessibility). -->
    <label for="name">Name</label>
    <input id="name" v-model="form.name" type="text" autocomplete="name" />

    <label for="email">Email</label>
    <input id="email" v-model="form.email" type="email" autocomplete="email" />

    <label class="check">
      <input v-model="form.notifications" type="checkbox" />
      Email notifications
    </label>

    <button type="submit">Save changes</button>
  </form>
</template>

<style scoped>
.settings {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 420px;
}
h2 {
  margin-bottom: 8px;
}
label {
  color: var(--text-h);
  font-size: 15px;
}
input[type="text"],
input[type="email"] {
  padding: 10px 12px;
  font: inherit;
  color: var(--text-h);
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  margin-bottom: 8px;
}
input:focus-visible,
button:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
.check {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}
button {
  align-self: flex-start;
  padding: 10px 18px;
  font: inherit;
  color: var(--accent);
  background: var(--accent-bg);
  border: 2px solid transparent;
  border-radius: 8px;
  cursor: pointer;
  transition: border-color 0.3s;
}
button:hover {
  border-color: var(--accent-border);
}
</style>
