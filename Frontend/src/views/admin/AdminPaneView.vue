<template>
  <main class="admin">
    <div class="action-bar" v-if="isAuthenticated">
      <!-- <router-link to="/admin/users">USUARIOS</router-link> -->
      <!-- <router-link to="/admin/gifts">REGALOS</router-link> -->
      <a href="javascript:void()" @click="logout" id="logout">SALIR</a>
    </div>
    <router-view></router-view>
  </main>
</template>

<script setup lang="ts">
import { STORE } from '@/main'
import router from '@/router'
import { computed } from 'vue'

function logout() {
  STORE.isAuthenticated = false
  router.push('/')
}

const isAuthenticated = computed(() => {
  return STORE.isAuthenticated
})
</script>

<style scoped>
main {
  background: url(../../assets/bg2.jpg) no-repeat;
  background-size: cover;
  overflow: auto;
  
  color: white;
  overflow: auto;
  padding-bottom: 12px;
}

.action-bar {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 4px 8px;
  background-color: lightskyblue;
  box-shadow: 0 1px 6px 0 black;
  margin-bottom: 8px;
}

.action-bar a,
.action-bar a:visited {
  color: black;
}
.action-bar a:not(:first-child) {
  margin-left: 16px;
}
.action-bar #logout {
  margin-left: auto;
  color: red;
  font-weight: bold;
}

a,
a:visited {
  color: whitesmoke;
}
</style>
