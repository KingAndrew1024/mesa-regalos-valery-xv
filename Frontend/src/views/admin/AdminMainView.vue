<template>
  <div class="main-wrapper">
    <!-- <div class="users" @click="navigateTo('/admin/users')">USUARIOS</div>
    <div class="gifts" @click="navigateTo('/admin/gifts')">REGALOS</div> -->
    <Login></Login>
  </div>
</template>

<script setup lang="ts">
import router from '@/router'
import Login from '@/components/Login.vue'

/* function navigateTo(path: string) {
  router.push(path)
} */
</script>

<style scoped>
.main-wrapper {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 100%;
  overflow: auto;
}
.users,
.gifts {
  border: 2px solid white;
  width: 45%;
  max-width: 400px;
  height: 50vh;
}
</style>
