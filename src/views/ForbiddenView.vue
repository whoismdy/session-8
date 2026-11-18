<template>
  <main class="page">
    <h1>403 - Access denied</h1>
    <p>You don't have permission to view this page.</p>
    <RouterLink :to="{ name: 'home' }">Back to home</RouterLink>
  </main>
</template>

<style scoped>
.page {
  padding: 0 32px 48px;
  text-align: left;
  flex-grow: 1;
}
</style>
