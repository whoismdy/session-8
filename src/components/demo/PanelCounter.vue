<script setup>
import { ref } from "vue";
const count = ref(0);
</script>

<template>
  <div class="panel green">
    <h2>Counter</h2>
    <p>Because of &lt;KeepAlive&gt;, this count survives switching tabs.</p>
    <button type="button" @click="count++">Clicked {{ count }} times</button>
  </div>
</template>

<style scoped>
.panel {
  padding: 32px;
  border-radius: 12px;
  color: #0b3d20;
  background: #bbf7d0;
  text-align: left;
}
h2 {
  color: inherit;
}
button {
  margin-top: 12px;
  padding: 8px 14px;
  font: inherit;
  border: 2px solid #0b3d20;
  border-radius: 8px;
  background: transparent;
  color: inherit;
  cursor: pointer;
}
</style>
