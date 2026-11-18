<!-- Transition needs ONE root element in each component, or it can't animate it. -->
<template>
  <div class="panel blue">
    <h2>Info</h2>
    <p>First panel. Switch tabs and watch it slide out while the next one slides in.</p>
  </div>
</template>

<style scoped>
.panel {
  padding: 32px;
  border-radius: 12px;
  color: #0c2a4d;
  background: #bfdbfe;
  text-align: left;
}
h2 {
  color: inherit;
}
</style>
