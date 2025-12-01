<template>
  <main>
    <div class="user-info">
      <p>
        Bienvenido <span class="name">{{ user.name }}</span>
      </p>
      <a href="javascript:void(0)" @click="exit()">Salir</a>
    </div>
    <div class="main-wrapper">
      <!-- <p>Aqui la lista</p> -->
      <div class="loading" v-if="isLoading">Cargando...</div>
      <div class="loading" v-if="errorMsg">ERROR: {{ errorMsg }}</div>

      <div class="item-list" v-if="!isLoading && !errorMsg">
        <ListItem v-for="item in items" :item="item"></ListItem>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import router from '@/router'
import { onMounted, ref } from 'vue'
import ListItem from '@/components/ListItem.vue'
import { HOST, STORE, type User } from '@/main'

export interface Item {
  id: number
  title: string
  image: string
  description: string
  links: string
  status: number
  username: string
  email: string
}

const items = ref<Item[]>([])
const isLoading = ref<boolean>(false)
const errorMsg = ref<string | undefined>(undefined)
let user = ref<User>({ id: undefined, name: undefined, type: undefined })

onMounted(async () => {
  user.value = STORE.user

  isLoading.value = true

  fetch(HOST + '/gifts')
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      // Parse the response body as JSON
      return response.json()
    })
    .then((result) => {
      items.value = result
    })
    .catch((e) => {
      errorMsg.value = JSON.stringify(e)
    })
    .finally(() => {
      isLoading.value = false
    })
})

function exit() {
  router.push('/')
}
</script>

<style scoped>
main {
  background: url(../assets/gifts2.avif) no-repeat;
  background: url(../assets/gifts.jpg) no-repeat;
  background-size: cover;
}

.main-wrapper {
  margin-left: auto;
  overflow: auto;
  margin-top: 6px;
  margin-bottom: 0px;
  width: 50%;
  height: 100%;
  color: white;
}

.user-info {
  display: flex;
  justify-content: space-between;
  text-align: center;
  margin: 8px 0 0;
  padding: 0 16px;
  /* color: white; */
}
.user-info .name {
  font-weight: bold;
  text-transform: uppercase;
}

.user-info a {
  color: white;
  font-weight: bolder;
  text-decoration: none;
  background-color: red;
  padding: 2px 6px;
  border-radius: 9px;
}

.item-list {
  display: flex;
  flex-direction: column;
  /* padding-right: 8px; */
  color: black;
}
@media screen and (min-width: 540px) {
  .user-info {
    max-width: 75%;
    margin-left: 25%;
  }
}
@media screen and (max-width: 760px) {
  .main-wrapper {
    max-width: unset;
    width: initial;
  }
}
@media screen and (min-width: 761px) {
  .main-wrapper {
    width: 75%;
  }
  .item-list {
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: space-around;
  }
}
</style>
