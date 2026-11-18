<template>
  <section class="profile">
    <div class="avatar" aria-hidden="true">JD</div>
    <div>
      <h2>Jane Doe</h2>
      <p>Frontend developer</p>
      <dl>
        <dt>Email</dt>
        <dd>jane@example.com</dd>
        <dt>Location</dt>
        <dd>Berlin, Germany</dd>
        <dt>Member since</dt>
        <dd>January 2024</dd>
      </dl>
    </div>
  </section>
</template>

<style scoped>
.profile {
  display: flex;
  gap: 24px;
  align-items: flex-start;
}
.avatar {
  flex: none;
  display: grid;
  place-items: center;
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: var(--accent-bg);
  border: 2px solid var(--accent-border);
  color: var(--accent);
  font-size: 24px;
  font-weight: 600;
}
dl {
  display: grid;
  grid-template-columns: max-content 1fr;
  gap: 8px 24px;
  margin: 16px 0 0;
}
dt {
  color: var(--text);
}
dd {
  margin: 0;
  color: var(--text-h);
}
@media (max-width: 600px) {
  .profile {
    flex-direction: column;
  }
}
</style>
