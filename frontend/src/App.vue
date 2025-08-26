<template>
  <div class="main">
    <AppContador />
  </div>
</template>

<script setup lang="ts">
import AppContador from './contador/AppContador.vue'
</script>

<style>
body {
  padding: 0;
  margin: 0;
  font-family:
    'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana,
    sans-serif;
}
.main {
  width: 100%;
  height: 100vh;
  background-color: black;
  color: white;
  padding: 0;
  margin: 0;
  display: flex;
}
</style>
