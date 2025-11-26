<template>
  <div class="loading-wrapper">
    <div class="backdrop"></div>
    <div class="message">Guardando...</div>
  </div>
</template>
<style scoped>
.loading-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.backdrop {
  position: absolute;
  top: 0;
  width: 0;
  left: 0;
  background-color: black;
  opacity: 0.8;
  width: 100%;
  height: 100%;
}

.message {
  z-index: 2;
  color: white;
}
</style>
