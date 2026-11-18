<!-- ToggleProvider.vue
     Owns ONE piece of logic: an on/off state. It renders NO markup of its own,
     the parent decides the UI through a scoped slot. -->
<script setup>
import { ref } from "vue";

const props = defineProps({
  initial: { type: Boolean, default: false },
});

const on = ref(props.initial);
const toggle = () => (on.value = !on.value);
</script>

<template>
  <!-- Scoped slot: pass state AND the function that changes it up to the parent.
       Slot props are one-way (child -> parent); the parent can only call `toggle`. -->
  <slot :on="on" :toggle="toggle" />
</template>
